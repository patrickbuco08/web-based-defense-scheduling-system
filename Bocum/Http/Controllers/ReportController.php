<?php

namespace Bocum\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use Bocum\Exports\DefenseReportExport;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Bocum\Models\Defense;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Get defense reports with filters
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $this->validateFilters($request);
        $data = $this->getFilteredReportData($request);

        return response()->json([
            'data' => $data,
            'meta' => [
                'total' => $data->count(),
                'filters' => $request->only(['term', 'department', 'status', 'room', 'date_start', 'date_end', 'search'])
            ]
        ]);
    }

    /**
     * Export defense reports to CSV
     *
     * @param Request $request
     * @return BinaryFileResponse
     */
    public function exportCsv(Request $request): BinaryFileResponse
    {
        $this->validateFilters($request);
        $data = $this->getFilteredReportData($request)->toArray();

        $fileName = 'defense-reports-' . now()->format('Y-m-d-His') . '.csv';

        return Excel::download(new DefenseReportExport($data), $fileName, \Maatwebsite\Excel\Excel::CSV);
    }

    /**
     * Export defense reports to XLSX
     *
     * @param Request $request
     * @return BinaryFileResponse
     */
    public function exportXlsx(Request $request): BinaryFileResponse
    {
        $this->validateFilters($request);
        $data = $this->getFilteredReportData($request)->toArray();

        $fileName = 'defense-reports-' . now()->format('Y-m-d-His') . '.xlsx';

        return Excel::download(new DefenseReportExport($data), $fileName);
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
            'term' => 'nullable|string',
            'department' => 'nullable|string',
            'status' => 'nullable|string|in:all,pending,approved,completed,reschedule',
            'room' => 'nullable|string',
            'date_start' => 'nullable|date',
            'date_end' => 'nullable|date|after_or_equal:date_start',
            'search' => 'nullable|string|max:255',
        ]);
    }

    /**
     * Get filtered report data from database
     *
     * @param Request $request
     * @return \Illuminate\Support\Collection
     */
    private function getFilteredReportData(Request $request)
    {
        // Build the query — exclude rejected and cancelled by default
        $query = Defense::with([
            'group.term',
            'group.department',
            'group.adviser',
            'group.critic',
            'room',
            'panelists'
        ])->whereNotIn('status', ['rejected', 'cancelled']);

        // Filter by term
        if ($request->filled('term')) {
            $query->whereHas('group.term', function ($q) use ($request) {
                $termParts = explode(' ', $request->term);
                // Assuming format: "1st Semester 2025-2026"
                $semester = $termParts[0] . ' ' . ($termParts[1] ?? '');
                $schoolYear = $termParts[2] ?? '';
                
                $q->where('semester', 'like', '%' . $semester . '%');
                if ($schoolYear) {
                    $q->where('school_year', $schoolYear);
                }
            });
        }

        // Filter by department
        if ($request->filled('department') && $request->department !== 'all') {
            $query->whereHas('group.department', function ($q) use ($request) {
                $q->where('name', $request->department);
            });
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'completed') {
                // Completed = approved or reschedule defenses whose end_at has passed
                $query->where(function ($q) {
                    $q->whereIn('status', ['approved', 'reschedule'])
                      ->where('end_at', '<', now());
                });
            } elseif ($request->status === 'approved') {
                // Approved = approved defenses that have NOT yet ended
                $query->where('status', 'approved')
                      ->where('end_at', '>=', now());
            } elseif ($request->status === 'reschedule') {
                // Rescheduled = reschedule defenses that have NOT yet ended
                $query->where('status', 'reschedule')
                      ->where('end_at', '>=', now());
            } else {
                $query->where('status', $request->status);
            }
        }

        // Filter by room
        if ($request->filled('room') && $request->room !== 'all') {
            $query->whereHas('room', function ($q) use ($request) {
                $q->where('room_number', $request->room);
            });
        }

        // Filter by date range
        if ($request->filled('date_start') || $request->filled('date_end')) {
            $query->where(function ($q) use ($request) {
                if ($request->filled('date_start')) {
                    $q->whereDate('start_at', '>=', $request->date_start);
                }
                if ($request->filled('date_end')) {
                    $q->whereDate('start_at', '<=', $request->date_end);
                }
            });
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                // Search in group code
                $q->whereHas('group', function ($groupQuery) use ($search) {
                    $groupQuery->where('group_code', 'like', '%' . $search . '%');
                })
                // Search in title
                ->orWhere('title', 'like', '%' . $search . '%')
                // Search in adviser name
                ->orWhereHas('group.adviser', function ($adviserQuery) use ($search) {
                    $adviserQuery->where('name', 'like', '%' . $search . '%');
                })
                // Search in critic name
                ->orWhereHas('group.critic', function ($criticQuery) use ($search) {
                    $criticQuery->where('name', 'like', '%' . $search . '%');
                })
                // Search in panelist names
                ->orWhereHas('panelists', function ($panelistQuery) use ($search) {
                    $panelistQuery->where('name', 'like', '%' . $search . '%');
                });
            });
        }

        // Get the results ordered by date
        $defenses = $query->orderBy('start_at', 'desc')->get();

        // Format the data
        return $defenses->map(function ($defense) {
            return [
                'id' => $defense->id,
                'group_code' => $defense->group->group_code ?? 'N/A',
                'title' => $defense->title,
                'adviser' => $defense->group->adviser->name ?? 'N/A',
                'critic' => $defense->group->critic->name ?? 'N/A',
                'panelists' => $defense->panelists->pluck('name')->toArray(),
                'room' => $defense->room->room_number ?? 'N/A',
                'start_date_time' => $defense->start_at->format('Y-m-d H:i:s'),
                'end_date_time' => $defense->end_at->format('Y-m-d H:i:s'),
                'status' => $defense->status,
                'department' => $defense->group->department->name ?? 'N/A',
                'term' => trim(($defense->group->term->semester ?? '') . ' ' . ($defense->group->term->school_year ?? '')),
            ];
        });
    }

    /**
     * Get mock report data (kept for reference, not used)
     *
     * @param Request $request
     * @return array
     */
    private function getMockReportData(Request $request): array
    {
        $mockData = [
            [
                'id' => 1,
                'group_code' => 'CS-2024-001',
                'title' => 'AI-Powered Student Performance Analysis System',
                'adviser' => 'Dr. Maria Santos',
                'critic' => 'Dr. Juan Dela Cruz',
                'panelists' => ['Dr. Juan Dela Cruz', 'Prof. Ana Reyes', 'Dr. Pedro Garcia'],
                'room' => 'CS-201',
                'start_date_time' => '2024-10-15 09:00:00',
                'end_date_time' => '2024-10-15 11:00:00',
                'status' => 'approved',
                'department' => 'Computer Science',
                'term' => '1st Semester 2025-2026',
            ],
            [
                'id' => 2,
                'group_code' => 'CS-2024-002',
                'title' => 'Blockchain-Based Document Verification System',
                'adviser' => 'Prof. Ana Reyes',
                'critic' => 'Dr. Pedro Garcia',
                'panelists' => ['Dr. Pedro Garcia', 'Dr. Maria Santos', 'Prof. Linda Cruz'],
                'room' => 'CS-202',
                'start_date_time' => '2024-10-15 13:00:00',
                'end_date_time' => '2024-10-15 15:00:00',
                'status' => 'pending',
                'department' => 'Computer Science',
                'term' => '1st Sem 2024-2025',
            ],
            [
                'id' => 3,
                'group_code' => 'IT-2024-001',
                'title' => 'Mobile Health Monitoring Application',
                'adviser' => 'Dr. Robert Lee',
                'critic' => 'Prof. Sarah Johnson',
                'panelists' => ['Prof. Sarah Johnson', 'Dr. Michael Wong', 'Prof. Grace Tan'],
                'room' => 'IT-101',
                'start_date_time' => '2024-10-16 10:00:00',
                'end_date_time' => '2024-10-16 12:00:00',
                'status' => 'approved',
                'department' => 'Information Technology',
                'term' => '1st Sem 2024-2025',
            ],
            [
                'id' => 4,
                'group_code' => 'CS-2024-003',
                'title' => 'IoT-Based Smart Home Security System',
                'adviser' => 'Dr. Maria Santos',
                'critic' => 'Dr. Juan Dela Cruz',
                'panelists' => ['Dr. Juan Dela Cruz', 'Prof. Ana Reyes', 'Dr. Pedro Garcia'],
                'room' => 'CS-201',
                'start_date_time' => '2024-10-17 14:00:00',
                'end_date_time' => '2024-10-17 16:00:00',
                'status' => 'rejected',
                'department' => 'Computer Science',
                'term' => '1st Sem 2024-2025',
            ],
            [
                'id' => 5,
                'group_code' => 'IT-2024-002',
                'title' => 'E-Commerce Platform with Recommendation Engine',
                'adviser' => 'Prof. Grace Tan',
                'critic' => 'Dr. Michael Wong',
                'panelists' => ['Dr. Michael Wong', 'Prof. Sarah Johnson', 'Dr. Robert Lee'],
                'room' => 'IT-102',
                'start_date_time' => '2024-10-18 09:00:00',
                'end_date_time' => '2024-10-18 11:00:00',
                'status' => 'cancelled',
                'department' => 'Information Technology',
                'term' => '1st Sem 2024-2025',
            ],
        ];

        // Apply simple filtering for demonstration
        $filtered = collect($mockData);

        if ($request->filled('term')) {
            $filtered = $filtered->where('term', $request->term);
        }

        if ($request->filled('department') && $request->department !== 'all') {
            $filtered = $filtered->where('department', $request->department);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $filtered = $filtered->where('status', $request->status);
        }

        if ($request->filled('room') && $request->room !== 'all') {
            $filtered = $filtered->where('room', $request->room);
        }

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $filtered = $filtered->filter(function ($item) use ($search) {
                return str_contains(strtolower($item['group_code']), $search) ||
                    str_contains(strtolower($item['title']), $search) ||
                    str_contains(strtolower($item['adviser']), $search) ||
                    str_contains(strtolower($item['critic']), $search);
            });
        }

        return $filtered->values()->all();
    }
}
