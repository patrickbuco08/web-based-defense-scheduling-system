<?php

namespace Bocum\Services;

use Bocum\Models\Defense;
use Carbon\Carbon;

class DefenseConflictService
{
    /**
     * Check if there's a room-time conflict for the given defense proposal.
     * Conflicts are detected when another approved defense in the SAME department
     * and in the SAME ROOM overlaps the proposed time range.
     *
     * @param Defense $defense
     * @param int $roomId
     * @param string $proposedDate Y-m-d
     * @param string $startTime H:i
     * @param string $endTime H:i
     * @return array
     */
    public function checkRoomConflict(Defense $defense, int $roomId, string $proposedDate, string $startTime, string $endTime): array
    {
        // Create Carbon instances for the proposed time slot
        $proposedStart = Carbon::createFromFormat('Y-m-d H:i', $proposedDate . ' ' . $startTime);
        $proposedEnd = Carbon::createFromFormat('Y-m-d H:i', $proposedDate . ' ' . $endTime);

        // Guard invalid range (should be caught by validation but safe-guard here)
        if ($proposedEnd->lessThanOrEqualTo($proposedStart)) {
            return [
                'has_conflict' => false,
                'conflicts' => [],
                'message' => 'Invalid time range.'
            ];
        }

        $departmentId = optional($defense->group)->department_id;

        // Find conflicting defenses (approved, not this defense, overlap time) within the same department AND same room
        $conflictingDefenses = Defense::query()
            ->where('status', 'approved')
            ->where('archived', false)
            ->where('id', '!=', $defense->id)
            ->where('room_id', $roomId)
            ->when($departmentId, function ($q) use ($departmentId) {
                $q->whereHas('group', function ($g) use ($departmentId) {
                    $g->where('department_id', $departmentId);
                });
            })
            // Overlap condition: existing.start < proposedEnd AND existing.end > proposedStart
            ->where(function ($q) use ($proposedStart, $proposedEnd) {
                $q->where('start_at', '<', $proposedEnd)
                  ->where('end_at', '>', $proposedStart);
            })
            ->with(['room', 'group'])
            ->get();

        $conflicts = [];
        $messages = [];

        foreach ($conflictingDefenses as $c) {
            $start = $c->start_at instanceof \Carbon\Carbon ? $c->start_at : Carbon::parse($c->start_at);
            $end = $c->end_at instanceof \Carbon\Carbon ? $c->end_at : Carbon::parse($c->end_at);

            $conflicts[] = [
                'defense_id' => $c->id,
                'group_code' => optional($c->group)->group_code,
                'title' => $c->title,
                'room_name' => optional($c->room)->name,
                'start_time' => $start->format('M d, Y h:i A'),
                'end_time' => $end->format('M d, Y h:i A'),
            ];

            $roomName = optional($c->room)->name;
            $groupCode = optional($c->group)->group_code;
            $messages[] = "Room {$roomName} is not available because it's being used by {$groupCode} for '{$c->title}' from {$start->format('M d, Y h:i A')} to {$end->format('h:i A')}.";
        }

        return [
            'has_conflict' => count($conflicts) > 0,
            'conflicts' => $conflicts,
            'message' => count($messages) > 0 ? implode(' ', $messages) : 'No room conflicts found.'
        ];
    }

    /**
     * Get occupied time slots for a specific date and room
     * Returns time ranges that are already booked by approved defenses
     * 
     * @param int $defenseId Current defense being edited (to exclude from results)
     * @param int $roomId Room to check
     * @param string $proposedDate Date to check in Y-m-d format
     * @return array Array of occupied time slots with start_time and end_time in H:i format
     */
    public function getOccupiedTimeSlots(int $defenseId, int $roomId, string $proposedDate): array
    {
        $occupiedDefenses = Defense::query()
            ->whereDate('start_at', $proposedDate)
            ->where('room_id', $roomId)
            ->where('status', 'approved')
            ->where('archived', false)
            ->where('id', '!=', $defenseId)
            ->select('id', 'title', 'start_at', 'end_at')
            ->orderBy('start_at')
            ->get();

        return $occupiedDefenses->map(function ($defense) {
            return [
                'defense_id' => $defense->id,
                'title' => $defense->title,
                'start_time' => optional($defense->start_at)->format('H:i'),
                'end_time' => optional($defense->end_at)->format('H:i'),
            ];
        })->toArray();
    }

    /**
     * Check if there's a panelist conflict for the given defense
     * 
     * @param int $defenseId
     * @param array $panelistIds
     * @param string $proposedDate
     * @param string $startTime
     * @param string $endTime
     * @return array
     */
    public function checkPanelistConflict(int $defenseId, array $panelistIds, string $proposedDate, string $startTime, string $endTime): array
    {
        // Create Carbon instances for the proposed time slot
        $proposedStart = Carbon::createFromFormat('Y-m-d H:i', $proposedDate . ' ' . $startTime);
        $proposedEnd = Carbon::createFromFormat('Y-m-d H:i', $proposedDate . ' ' . $endTime);

        // Find defenses where any of the proposed research service providers are already assigned (only approved ones)
        $conflictingDefenses = Defense::where('id', '!=', $defenseId)
            ->where('status', 'approved')
            ->where('archived', false)
            ->whereHas('researchProviders', function ($query) use ($panelistIds) {
                $query->whereIn('research_service_provider_id', $panelistIds);
            })
            ->where(function ($query) use ($proposedStart, $proposedEnd) {
                // Check for time overlap
                $query->where(function ($q) use ($proposedStart, $proposedEnd) {
                    // Proposed start time is within existing defense time
                    $q->where('start_at', '<=', $proposedStart)
                      ->where('end_at', '>', $proposedStart);
                })->orWhere(function ($q) use ($proposedStart, $proposedEnd) {
                    // Proposed end time is within existing defense time
                    $q->where('start_at', '<', $proposedEnd)
                      ->where('end_at', '>=', $proposedEnd);
                })->orWhere(function ($q) use ($proposedStart, $proposedEnd) {
                    // Proposed time completely encompasses existing defense
                    $q->where('start_at', '>=', $proposedStart)
                      ->where('end_at', '<=', $proposedEnd);
                });
            })
            ->with(['group', 'researchProviders', 'room'])
            ->get();

        $conflicts = [];
        $messages = [];
        $conflictedPanelists = [];

        foreach ($conflictingDefenses as $defense) {
            // Get the specific research service providers that are conflicted
            $conflictedPanelistsInDefense = $defense->researchProviders->whereIn('id', $panelistIds);
            
            foreach ($conflictedPanelistsInDefense as $panelist) {
                if (!in_array($panelist->id, $conflictedPanelists)) {
                    $conflictedPanelists[] = $panelist->id;
                    
                    $conflicts[] = [
                        'panelist_id' => $panelist->id,
                        'panelist_name' => $panelist->name,
                        'conflicting_defense_id' => $defense->id,
                        'conflicting_group_code' => $defense->group->group_code,
                        'conflicting_title' => $defense->title,
                        'conflicting_room' => $defense->room->name,
                        'conflicting_start_time' => $defense->start_at->format('M d, Y h:i A'),
                        'conflicting_end_time' => $defense->end_at->format('M d, Y h:i A'),
                    ];

                    $messages[] = "{$panelist->name} won't be able to attend because they will be attending defense '{$defense->title}' by {$defense->group->group_code} at {$defense->room->name} from {$defense->start_at->format('M d, Y h:i A')} to {$defense->end_at->format('h:i A')}.";
                }
            }
        }

        return [
            'has_conflict' => count($conflicts) > 0,
            'conflicts' => $conflicts,
            'message' => count($messages) > 0 ? implode(' ', $messages) : 'No panelist conflicts found.'
        ];
    }
}
