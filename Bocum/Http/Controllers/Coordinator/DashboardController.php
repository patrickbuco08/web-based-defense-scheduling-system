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
        });

        $allDefenses = $defensesQuery->get();

        $stats = [
            'total' => $allDefenses->count(),
            'pending' => $allDefenses->where('status', 'pending')->count(),
            'approved' => $allDefenses->where('status', 'approved')->count(),
            'rejected' => $allDefenses->where('status', 'rejected')->count(),
            'cancelled' => $allDefenses->where('status', 'cancelled')->count(),
            'panelists_assigned' => $allDefenses->filter(function ($defense) {
                return $defense->panelists->count() > 0;
            })->count(),
        ];

        $recentDefenses = Defense::whereHas('group.departments', function ($query) use ($userDepartmentIds) {
            $query->whereIn('departments.id', $userDepartmentIds);
        })
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
