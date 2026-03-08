<?php

namespace Bocum\Http\Controllers;

use Bocum\Http\Controllers\Controller;
use Bocum\Http\Requests\DefenseRequest;
use Bocum\Models\Defense;
use Bocum\Models\Group;
use Bocum\Models\Room;
use Bocum\Models\Term;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Bocum\Services\DefenseConflictService;
use Bocum\Services\DefenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Bocum\Mail\DefenseProposalMail;
use Bocum\Mail\DefenseScheduleApproved;
use Bocum\Mail\DefenseScheduleCancelled;
use Bocum\Mail\DefenseScheduleRejected;
use Bocum\Models\User;
use Spatie\Activitylog\activity;

class DefenseController extends Controller
{
    public function __construct(
        protected DefenseConflictService $conflictService,
        protected DefenseService $defenseService
    ) {}

    public function index()
    {
        // Get defenses where the authenticated user is the adviser, critic, or a panelist
        $defenses = Defense::where('archived', false)
            ->where(function ($query) {
                $query
                    ->whereHas('group', function ($q) {
                        $q->where('adviser_id', Auth::id())->orWhere('critic_id', Auth::id());
                    })
                    ->orWhereHas('panelists', function ($q) {
                        $q->where('panelist_id', Auth::id());
                    });
            })
            ->with(['room', 'group', 'group.term', 'adviser', 'proposedBy', 'approvedBy', 'panelists', 'group.members'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($defenses);
    }

    public function departmentIndex()
    {
        $this->authorize('departmentIndex', Defense::class);

        $user = Auth::user();
        $userDepartmentIds = $user->departments->pluck('id');

        $defenses = Defense::where('archived', false)
            ->whereHas('group.departments', function ($query) use ($userDepartmentIds) {
                $query->whereIn('departments.id', $userDepartmentIds);
            })
            ->with(['room', 'group', 'group.departments', 'group.term', 'group.adviser', 'group.critic', 'adviser', 'proposedBy', 'approvedBy', 'panelists', 'group.members'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($defenses);
    }

    /**
     * Check for conflicts for a specific defense
     *
     * @param \Bocum\Models\Defense $defense
     * @return JsonResponse
     */
    public function checkConflicts(Request $request, Defense $defense): JsonResponse
    {
        $validated = $request->validate([
            'panelist_ids' => 'sometimes|array',
            'panelist_ids.*' => 'exists:users,id',
            'panelists' => 'sometimes|array',
            'panelists.*' => 'exists:users,id',
            'proposed_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room_id' => 'required|exists:rooms,id',
        ]);

        $panelistIds = $validated['panelist_ids'] ?? $validated['panelists'] ?? [];

        $roomConflicts = $this->conflictService->checkRoomConflict($defense, $validated['room_id'], $validated['proposed_date'], $validated['start_time'], $validated['end_time']);

        $panelistConflicts = $this->conflictService->checkPanelistConflict($defense->id, $panelistIds, $validated['proposed_date'], $validated['start_time'], $validated['end_time']);

        $occupiedSlots = $this->conflictService->getOccupiedTimeSlots($defense->id, $validated['room_id'], $validated['proposed_date']);

        return response()->json([
            'success' => true,
            'data' => [
                'room_conflicts' => $roomConflicts,
                'panelist_conflicts' => $panelistConflicts,
                'has_any_conflicts' => $roomConflicts['has_conflict'] || $panelistConflicts['has_conflict'],
                'occupied_slots' => $occupiedSlots,
            ],
        ]);
    }

    public function show(Defense $defense)
    {
        // Verify the authenticated user is the adviser for this defense's group
        if ($defense->group->adviser_id !== Auth::id()) {
            abort(403);
        }

        $defense->load(['group.members', 'room', 'term', 'panelists']);

        return view('adviser.defenses.show', compact('defense'));
    }

    /**
     * Show the form for creating a new defense proposal.
     */
    public function create()
    {
        $currentTerm = Term::where('is_current', true)->firstOrFail();
        $adviser = Auth::user();

        $datas = [
            'rooms' => Room::where('is_active', true)->orderBy('building')->orderBy('room_number')->get(),
            'groups' => Group::where('adviser_id', $adviser->id)->with('members')->orderBy('id')->get(),
            'panelists' => \Bocum\Models\User::role('panelist')->orderBy('name')->get(),
            'currentTerm' => $currentTerm,
            'minDate' => now()->format('Y-m-d'),
            'maxDate' => now()->addMonths(3)->format('Y-m-d'),
            'minTime' => '08:00',
            'maxTime' => '17:00',
        ];

        // return $datas;

        return view('adviser.defenses.create', $datas);
    }

    /**
     * Update the specified defense in storage.
     *
     * @param  \Bocum\Http\Requests\DefenseRequest  $request
     * @param  \Bocum\Models\Defense  $defense
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(DefenseRequest $request, Defense $defense)
    {
        try {
            // Check if status is being changed
            $newStatus = $request->status;

            // Authorize the update action using the policy, passing the new status
            $this->authorize('update', [$defense, $newStatus]);

            // Prepare the data for update
            $data = [
                'title' => $request->title,
                'presentation_type' => $request->presentation_type,
                'group_id' => $request->group_id,
                'room_id' => $request->room_id,
                'start_at' => Carbon::parse($request->date . ' ' . $request->start_time),
                'end_at' => Carbon::parse($request->date . ' ' . $request->end_time),
                'status' => $request->status,
                'notes' => $request->notes,
            ];

            // If status is being updated to approved, verify the user is a coordinator
            if ($request->status === 'approved' && Auth::user()->hasRole('coordinator')) {
                $data['approved_by_id'] = Auth::id();
            }

            if ($request->rejection_note) {
                $data['rejection_note'] = $request->rejection_note;
            }

            $oldStatus = $defense->status;

            // Update the defense
            $defense->update($data);

            // Sync panelists if provided
            if ($request->has('panelists')) {
                $defense->panelists()->sync($request->panelists);

                activity('defense')
                    ->causedBy(Auth::user())
                    ->performedOn($defense)
                    ->withProperties([
                        'action' => 'panelists.assigned',
                        'panelists' => $defense->panelists()->pluck('users.name')->all(),
                    ])
                    ->log('defense.panelists_assigned');
            }

            switch ($request->status) {
                case 'approved':
                    $recipients = $this->defenseService->getDefenseRecipients($defense);
                    if (!empty($recipients)) {
                        Mail::to($recipients)->queue(new DefenseScheduleApproved($defense));
                    }

                    activity('defense')
                        ->causedBy(Auth::user())
                        ->performedOn($defense)
                        ->withProperties([
                            'status_from' => 'pending',
                            'status_to'   => 'approved',
                            'room_id'     => $defense->room_id,
                            'start_at'    => $defense->start_at,
                            'end_at'      => $defense->end_at,
                            'panelists'   => $defense->panelists()->pluck('users.name')->all(),
                        ])->log('defense.approved');

                    break;

                case 'rejected':
                    $adviser = $defense->adviser;
                    if ($adviser && $adviser->email) {
                        Mail::to($adviser->email)->queue(new DefenseScheduleRejected($defense, $adviser));
                    }

                    activity('defense')
                        ->causedBy(Auth::user())
                        ->performedOn($defense)
                        ->withProperties([
                            'status_from' => $oldStatus,
                            'status_to'   => 'rejected',
                            'reason'      => $request->rejection_note,
                        ])->log('defense.rejected');

                    break;

                case 'cancelled':
                    $recipients = $this->defenseService->getDefenseRecipients($defense);
                    if (!empty($recipients)) {
                        Mail::to($recipients)->queue(new DefenseScheduleCancelled($defense));
                    }

                    activity('defense')
                        ->causedBy(Auth::user())
                        ->performedOn($defense)
                        ->withProperties([
                            'status_from' => $oldStatus,
                            'status_to'   => 'cancelled',
                        ])->log('defense.cancelled');

                    break;

                // Add more cases for other statuses if needed
                default:
                    // No action needed for other statuses
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => 'Defense updated successfully',
                'data' => $defense->fresh(['room', 'group', 'panelists']),
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage(),
                ],
                500,
            );
        }
    }

    /**
     * Store a newly created defense proposal in storage.
     *
     * @param  \Bocum\Http\Requests\DefenseRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function store(DefenseRequest $request)
    {
        try {
            DB::beginTransaction();

            // Verify the group belongs to the authenticated adviser
            $group = Group::where('id', $request->group_id)->where('adviser_id', Auth::id())->firstOrFail();

            // Combine date and time fields
            $startAt = Carbon::parse($request->date . ' ' . $request->start_time);
            $endAt = Carbon::parse($request->date . ' ' . $request->end_time);

            // Create the defense with the provided data
            $defense = Defense::create([
                'room_id' => $request->room_id,
                'group_id' => $group->id,
                'adviser_id' => Auth::id(),
                'proposed_by_id' => Auth::id(),
                'term_id' => $request->term_id,
                'title' => $request->title,
                'presentation_type' => $request->presentation_type,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'status' => 'pending',
                'notes' => $request->notes,
            ]);

            // Attach panelists
            if ($request->has('panelists')) {
                $defense->panelists()->attach($request->panelists);
            }

            $adviser = Auth::user();
            
            // Get all coordinators from the group's departments
            $groupDepartmentIds = $defense->group->departments->pluck('id');
            $coordinators = User::role('coordinator')
                ->whereHas('departments', function ($query) use ($groupDepartmentIds) {
                    $query->whereIn('departments.id', $groupDepartmentIds);
                })
                ->get();

            // Send email to all coordinators
            foreach ($coordinators as $coordinator) {
                Mail::to($coordinator->email)->queue(new DefenseProposalMail($defense, $adviser));
            }

            $defense->load('group', 'group.term');

            activity('defense')
                ->causedBy(Auth::user())
                ->performedOn($defense)
                ->withProperties([
                    'status_from' => null,
                    'status_to'   => 'pending',
                    'group_id'    => $defense->group->id,
                    'term_id'     => $defense->group->term->id,
                    'start_at'    => $defense->start_at,
                    'end_at'      => $defense->end_at,
                ])->log('defense.proposed');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Defense proposal submitted successfully. Waiting for coordinator approval.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the error
            Log::error('Error creating defense proposal: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->except(['_token', 'panelists']),
            ]);

            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage(),
                ],
                400,
            );
        }
    }

    /**
     * Get archived defenses for the authenticated user.
     */
    public function archivedIndex()
    {
        // Get archived defenses where the authenticated user is the adviser, critic, or a panelist
        $defenses = Defense::where('archived', true)
            ->where(function ($query) {
                $query
                    ->whereHas('group', function ($q) {
                        $q->where('adviser_id', Auth::id())->orWhere('critic_id', Auth::id());
                    })
                    ->orWhereHas('panelists', function ($q) {
                        $q->where('panelist_id', Auth::id());
                    });
            })
            ->with(['room', 'group', 'group.term', 'adviser', 'proposedBy', 'approvedBy', 'panelists', 'group.members'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($defenses);
    }

    /**
     * Get archived defenses for coordinator (department-specific).
     */
    public function archivedDepartmentIndex()
    {
        $this->authorize('departmentIndex', Defense::class);

        $user = Auth::user();
        $userDepartmentIds = $user->departments->pluck('id');

        $defenses = Defense::where('archived', true)
            ->whereHas('group.departments', function ($query) use ($userDepartmentIds) {
                $query->whereIn('departments.id', $userDepartmentIds);
            })
            ->with(['room', 'group', 'group.departments', 'group.term', 'group.adviser', 'group.critic', 'adviser', 'proposedBy', 'approvedBy', 'panelists', 'group.members'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($defenses);
    }

    /**x
     * Get all archived defenses for admin (all departments).
     */
    public function archivedAdminIndex()
    {
        // Check if user is admin
        if (!Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized action.');
        }

        $defenses = Defense::where('archived', true)
            ->with(['room', 'group', 'group.term', 'group.adviser', 'group.critic', 'adviser', 'proposedBy', 'approvedBy', 'panelists', 'group.members'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($defenses);
    }

    /**
     * Archive or unarchive a defense.
     *
     * @param  \Bocum\Models\Defense  $defense
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function archive(Defense $defense, Request $request)
    {
        try {
            // Verify the user can archive this defense
            $user = Auth::user();
            $isAdviser = $defense->adviser_id === $user->id;
            
            // Check if coordinator's departments intersect with group's departments
            $isCoordinator = $user->roles->contains('name', 'coordinator') && 
                            $user->departments->pluck('id')->intersect(
                                $defense->group->departments->pluck('id')
                            )->isNotEmpty();
            
            $isAdmin = $user->roles->contains('name', 'admin');

            if (!$isAdviser && !$isCoordinator && !$isAdmin) {
                abort(403, 'Unauthorized action.');
            }

            $validated = $request->validate([
                'archived' => 'required|boolean',
            ]);

            $defense->update([
                'archived' => $validated['archived'],
            ]);

            activity('defense')
                ->causedBy(Auth::user())
                ->performedOn($defense)
                ->withProperties([
                    'archived' => $validated['archived'],
                ])
                ->log($validated['archived'] ? 'defense.archived' : 'defense.unarchived');

            return response()->json([
                'success' => true,
                'message' => $validated['archived'] 
                    ? 'Defense has been archived successfully.' 
                    : 'Defense has been unarchived successfully.',
                'data' => $defense->fresh(['room', 'group', 'panelists']),
            ]);
        } catch (\Exception $e) {
            Log::error('Error archiving defense: ' . $e->getMessage(), [
                'defense_id' => $defense->id,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while archiving the defense. Please try again.' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified defense from storage.
     *
     * @param  \Bocum\Models\Defense  $defense
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Defense $defense)
    {
        try {
            // Verify the defense belongs to the authenticated adviser
            if ($defense->adviser_id !== Auth::id()) {
                abort(403, 'Unauthorized action.');
            }

            // Only allow deletion if defense is still pending
            if ($defense->status !== 'pending') {
                return response()->json(
                    [
                        'success' => false,
                        'message' => 'Only pending defenses can be deleted.',
                    ],
                    400,
                );
            }

            $defense->delete();

            return response()->json([
                'success' => true,
                'message' => 'Defense has been deleted successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting defense: ' . $e->getMessage(), [
                'defense_id' => $defense->id,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the defense. Please try again.',
            ]);
        }
    }
}
