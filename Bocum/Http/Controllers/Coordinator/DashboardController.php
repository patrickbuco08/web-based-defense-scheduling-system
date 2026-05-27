<?php

namespace Bocum\Http\Controllers\Coordinator;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\Defense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get coordinator's department IDs
        $userDepartmentIds = $user->departments->pluck('id');

        // Get defenses from groups that belong to coordinator's departments
        $defensesQuery = Defense::whereHas('group.departments', function ($query) use ($userDepartmentIds) {
            $query->whereIn('departments.id', $userDepartmentIds);
        })->whereNotIn('status', ['rejected', 'cancelled']);

        $allDefenses = $defensesQuery->get();

        $now = now();

        $stats = [
            'total' => $allDefenses->count(),
            'pending' => $allDefenses->where('status', 'pending')->count(),
            'approved' => $allDefenses->filter(function ($defense) use ($now) {
                return $defense->status === 'approved' && $defense->end_at && $defense->end_at >= $now;
            })->count(),
            'completed' => $allDefenses->filter(function ($defense) use ($now) {
                return ($defense->status === 'approved' || $defense->status === 'reschedule')
                    && $defense->end_at && $defense->end_at < $now;
            })->count(),
            'rescheduled' => $allDefenses->filter(function ($defense) use ($now) {
                return $defense->status === 'reschedule' && $defense->end_at && $defense->end_at >= $now;
            })->count(),
        ];

        $recentDefenses = Defense::whereHas('group.departments', function ($query) use ($userDepartmentIds) {
            $query->whereIn('departments.id', $userDepartmentIds);
        })
            ->whereNotIn('status', ['rejected', 'cancelled'])
            ->with(['room', 'group'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_defenses' => $recentDefenses,
        ]);
    }
}
