<?php

namespace Bocum\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Activitylog\Models\Activity;
use Bocum\Models\Defense;
use Bocum\Models\User;
use Maatwebsite\Excel\Facades\Excel;
use Bocum\Exports\ActivityLogExport;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class LogsController extends Controller
{
    /**
     * Get activity logs with filters
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $this->validateFilters($request);
        $data = $this->getFilteredLogs($request);

        return response()->json([
            'data' => $data,
            'meta' => [
                'total' => $data->count(),
                'filters' => $request->only(['date_start', 'date_end', 'action', 'department', 'search'])
            ]
        ]);
    }

    /**
     * Validate filter parameters
     *
     * @param Request $request
     * @return void
     */
    private function validateFilters(Request $request): void
    {
        $request->validate([
            'date_start' => 'nullable|date',
            'date_end' => 'nullable|date|after_or_equal:date_start',
            'action' => 'nullable|string',
            'department' => 'nullable|string',
            'search' => 'nullable|string|max:255',
        ]);
    }

    /**
     * Get filtered activity logs from database
     *
     * @param Request $request
     * @return \Illuminate\Support\Collection
     */
    private function getFilteredLogs(Request $request)
    {
        // Build the query for defense and admin activities
        $query = Activity::whereIn('log_name', ['defense', 'admin'])
            ->with([
                'causer' => function ($query) {
                    $query->with('department');
                },
                'subject' => function ($query) {
                    $query->with('group');
                }
            ]);

        // Filter by date range
        if ($request->filled('date_start')) {
            $query->whereDate('created_at', '>=', $request->date_start);
        }

        if ($request->filled('date_end')) {
            $query->whereDate('created_at', '<=', $request->date_end);
        }

        // Filter by action/description
        if ($request->filled('action') && $request->action !== 'all') {
            $query->where('description', $request->action);
        }

        // Filter by department (through causer relationship)
        if ($request->filled('department') && $request->department !== 'all') {
            $query->whereHas('causer.department', function ($q) use ($request) {
                $q->where('name', $request->department);
            });
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                // Search in causer name
                $q->whereHas('causer', function ($causerQuery) use ($search) {
                    $causerQuery->where('name', 'like', '%' . $search . '%');
                })
                // Search in subject (defense title or group code)
                ->orWhereHas('subject', function ($subjectQuery) use ($search) {
                    $subjectQuery->where('title', 'like', '%' . $search . '%')
                        ->orWhereHas('group', function ($groupQuery) use ($search) {
                            $groupQuery->where('group_code', 'like', '%' . $search . '%');
                        });
                })
                // Search in description
                ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // Get the results ordered by most recent first
        $activities = $query->orderBy('created_at', 'desc')->get();

        // Format the data
        return $activities->map(function ($activity) {
            $formattedData = [
                'id' => $activity->id,
                'log_name' => $activity->log_name,
                'description' => $activity->description,
                'subject_type' => $activity->subject_type,
                'subject_id' => $activity->subject_id,
                'causer_type' => $activity->causer_type,
                'causer_id' => $activity->causer_id,
                'properties' => $activity->properties ?? [],
                'created_at' => $activity->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $activity->updated_at->format('Y-m-d H:i:s'),
                'causer' => $activity->causer ? [
                    'id' => $activity->causer->id,
                    'name' => $activity->causer->name,
                    'email' => $activity->causer->email,
                    'department' => $activity->causer->department ? [
                        'id' => $activity->causer->department->id,
                        'name' => $activity->causer->department->name,
                    ] : null,
                ] : null,
                'subject' => $activity->subject ? [
                    'id' => $activity->subject->id,
                    'title' => $activity->subject->title ?? null,
                    'group' => (method_exists($activity->subject, 'group') && $activity->subject->group) ? [
                        'id' => $activity->subject->group->id,
                        'group_code' => $activity->subject->group->group_code,
                    ] : null,
                ] : null,
            ];

            // Add summary
            $formattedData['summary'] = $this->generateSummary($activity);

            return $formattedData;
        });
    }

    /**
     * Generate human-readable summary for activity log
     *
     * @param Activity $activity
     * @return string
     */
    private function generateSummary(Activity $activity): string
    {
        $props = $activity->properties ?? [];
        $causerName = $activity->causer->name ?? 'System';
        $title = $activity->subject->title ?? 'defense';

        switch ($activity->description) {
            case 'defense.proposed':
                $proposalTime = '';
                if (isset($props['start_at']) && isset($props['end_at'])) {
                    $startDate = \Carbon\Carbon::parse($props['start_at'])->format('M d, Y');
                    $startTime = \Carbon\Carbon::parse($props['start_at'])->format('H:i');
                    $endTime = \Carbon\Carbon::parse($props['end_at'])->format('H:i');
                    $proposalTime = " scheduled for {$startDate} from {$startTime} to {$endTime}";
                }
                return "{$causerName} proposed a defense for \"{$title}\"{$proposalTime}.";

            case 'defense.approved':
                $approvedTime = '';
                if (isset($props['start_at']) && isset($props['end_at'])) {
                    $startDate = \Carbon\Carbon::parse($props['start_at'])->format('M d');
                    $startTime = \Carbon\Carbon::parse($props['start_at'])->format('H:i');
                    $endTime = \Carbon\Carbon::parse($props['end_at'])->format('H:i');
                    $approvedTime = " on {$startDate} from {$startTime} to {$endTime}";
                }
                $panelists = '';
                if (isset($props['panelists']) && is_array($props['panelists']) && count($props['panelists']) > 0) {
                    $panelistsList = implode(', ', $props['panelists']);
                    $panelists = " Panel: {$panelistsList}.";
                }
                return "{$causerName} approved the defense \"{$title}\"{$approvedTime}.{$panelists}";

            case 'defense.rejected':
                $reason = isset($props['reason']) ? " Reason: {$props['reason']}" : '';
                return "{$causerName} rejected the defense proposal for \"{$title}\".{$reason}";

            case 'defense.cancelled':
                $wasStatus = isset($props['status_from']) ? " (was {$props['status_from']})" : '';
                return "{$causerName} cancelled the defense \"{$title}\"{$wasStatus}.";

            case 'defense.panelists_assigned':
                $assignedPanelists = 'panelists';
                if (isset($props['panelists']) && is_array($props['panelists']) && count($props['panelists']) > 0) {
                    $assignedPanelists = implode(', ', $props['panelists']);
                }
                return "{$causerName} assigned panelists to \"{$title}\": {$assignedPanelists}.";

            case 'defense.archived':
                return "{$causerName} archived the defense \"{$title}\".";

            case 'defense.unarchived':
                return "{$causerName} unarchived the defense \"{$title}\".";

            case 'defense.research_providers_assigned':
                $providers = '';
                if (isset($props['research_providers']) && is_array($props['research_providers'])) {
                    $providers = ' ' . implode(', ', $props['research_providers']);
                }
                return "{$causerName} assigned research providers to \"{$title}\":{$providers}.";

            case 'course.created':
                $code = isset($props['code']) ? $props['code'] : '';
                $name = isset($props['name']) ? $props['name'] : '';
                return "{$causerName} created course \"{$code} – {$name}\".";

            case 'course.updated':
                $code = isset($props['code']) ? $props['code'] : '';
                $name = isset($props['name']) ? $props['name'] : '';
                return "{$causerName} updated course \"{$code} – {$name}\".";

            case 'course.deleted':
                $code = isset($props['code']) ? $props['code'] : '';
                $name = isset($props['name']) ? $props['name'] : '';
                return "{$causerName} deleted course \"{$code} – {$name}\".";

            case 'account.created':
                $email = isset($props['email']) ? $props['email'] : '';
                $name = isset($props['name']) ? $props['name'] : '';
                $roles = isset($props['roles']) && is_array($props['roles']) ? implode(', ', $props['roles']) : '';
                return "{$causerName} created account for \"{$name}\" ({$email}) with role(s): {$roles}.";

            case 'account.updated':
                $email = isset($props['email']) ? $props['email'] : '';
                $name = isset($props['name']) ? $props['name'] : '';
                return "{$causerName} updated account for \"{$name}\" ({$email}).";

            case 'account.deleted':
                $email = isset($props['email']) ? $props['email'] : '';
                $name = isset($props['name']) ? $props['name'] : '';
                return "{$causerName} deleted account for \"{$name}\" ({$email}).";

            case 'room.created':
                $roomNumber = isset($props['room_number']) ? $props['room_number'] : '';
                $building = isset($props['building']) ? $props['building'] : '';
                return "{$causerName} created room \"{$roomNumber}\" in {$building}.";

            case 'room.updated':
                $roomNumber = isset($props['room_number']) ? $props['room_number'] : '';
                $building = isset($props['building']) ? $props['building'] : '';
                return "{$causerName} updated room \"{$roomNumber}\" in {$building}.";

            case 'room.deleted':
                $roomNumber = isset($props['room_number']) ? $props['room_number'] : '';
                $building = isset($props['building']) ? $props['building'] : '';
                return "{$causerName} deleted room \"{$roomNumber}\" in {$building}.";

            case 'room.toggled':
                $roomNumber = isset($props['room_number']) ? $props['room_number'] : '';
                $isActive = isset($props['is_active']) ? ($props['is_active'] ? 'activated' : 'deactivated') : 'toggled';
                return "{$causerName} {$isActive} room \"{$roomNumber}\".";

            case 'provider.created':
                $name = isset($props['name']) ? $props['name'] : '';
                $role = isset($props['role']) ? $props['role'] : '';
                return "{$causerName} added research service provider \"{$name}\" ({$role}).";

            case 'provider.updated':
                $name = isset($props['name']) ? $props['name'] : '';
                $role = isset($props['role']) ? $props['role'] : '';
                return "{$causerName} updated research service provider \"{$name}\" ({$role}).";

            case 'provider.deleted':
                $name = isset($props['name']) ? $props['name'] : '';
                $role = isset($props['role']) ? $props['role'] : '';
                return "{$causerName} deleted research service provider \"{$name}\" ({$role}).";

            case 'term.created':
                $sy = isset($props['school_year']) ? $props['school_year'] : '';
                $sem = isset($props['semester']) ? $props['semester'] : '';
                $isCurrent = !empty($props['is_current']) ? ' (set as current)' : '';
                return "{$causerName} created term \"{$sy} {$sem}\"{$isCurrent}.";

            case 'term.updated':
                $sy = isset($props['school_year']) ? $props['school_year'] : '';
                $sem = isset($props['semester']) ? $props['semester'] : '';
                $isCurrent = !empty($props['is_current']) ? ' (set as current)' : '';
                return "{$causerName} updated term \"{$sy} {$sem}\"{$isCurrent}.";

            case 'term.deleted':
                $sy = isset($props['school_year']) ? $props['school_year'] : '';
                $sem = isset($props['semester']) ? $props['semester'] : '';
                return "{$causerName} deleted term \"{$sy} {$sem}\".";

            default:
                return "{$causerName} performed action on \"{$title}\".";
        }
    }

    /**
     * Export activity logs to CSV
     *
     * @param Request $request
     * @return BinaryFileResponse
     */
    public function exportCsv(Request $request): BinaryFileResponse
    {
        $this->validateFilters($request);
        $data = $this->getFilteredLogs($request)->toArray();

        $fileName = 'activity-logs-' . now()->format('Y-m-d-His') . '.csv';

        return Excel::download(new ActivityLogExport($data), $fileName, \Maatwebsite\Excel\Excel::CSV);
    }

    /**
     * Export activity logs to XLSX
     *
     * @param Request $request
     * @return BinaryFileResponse
     */
    public function exportXlsx(Request $request): BinaryFileResponse
    {
        $this->validateFilters($request);
        $data = $this->getFilteredLogs($request)->toArray();

        $fileName = 'activity-logs-' . now()->format('Y-m-d-His') . '.xlsx';

        return Excel::download(new ActivityLogExport($data), $fileName);
    }
}
