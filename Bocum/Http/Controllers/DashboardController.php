<?php

namespace Bocum\Http\Controllers;

use Bocum\Models\Defense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $defensesQuery = Defense::where(function ($query) use ($user) {
            $query
                ->whereHas('group', function ($q) use ($user) {
                    $q->where('adviser_id', $user->id)->orWhere('critic_id', $user->id);
                })
                ->orWhereHas('panelists', function ($q) use ($user) {
                    $q->where('panelist_id', $user->id);
                });
        });

        $allDefenses = $defensesQuery->get();

        $stats = [
            'total' => $allDefenses->count(),
            'pending' => $allDefenses->where('status', 'pending')->count(),
            'approved' => $allDefenses->where('status', 'approved')->count(),
            'completed' => $allDefenses->filter(function ($defense) {
                if (($defense->status === 'approved' || $defense->status === 'reschedule') && $defense->end_at) {
                    return strtotime($defense->end_at) < time();
                }
                return false;
            })->count(),
            'rescheduled' => $allDefenses->where('status', 'reschedule')->count(),
        ];

        $recentDefenses = Defense::where(function ($query) use ($user) {
            $query
                ->whereHas('group', function ($q) use ($user) {
                    $q->where('adviser_id', $user->id)->orWhere('critic_id', $user->id);
                })
                ->orWhereHas('panelists', function ($q) use ($user) {
                    $q->where('panelist_id', $user->id);
                });
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
