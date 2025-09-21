<?php

namespace Bocum\Http\Controllers;

use Bocum\Models\Defense;
use Bocum\Services\DefenseConflictService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DefenseConflictController extends Controller
{
    /**
     * @var DefenseConflictService
     */
    protected $conflictService;

    /**
     * Create a new controller instance.
     *
     * @param DefenseConflictService $conflictService
     * @return void
     */
    public function __construct(DefenseConflictService $conflictService)
    {
        $this->conflictService = $conflictService;
    }

    /**
     * Check for conflicts for a specific defense
     *
     * @param Request $request
     * @param \Bocum\Models\Defense $defense
     * @return JsonResponse
     */
    public function checkConflicts(Request $request, Defense $defense): JsonResponse
    {
        $validated = $request->validate([
            'panelist_ids' => 'required|array',
            'panelist_ids.*' => 'exists:users,id',
            'proposed_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room_id' => 'required|exists:rooms,id',
        ]);

        $roomConflicts = $this->conflictService->checkRoomConflict(
            $defense,
            $validated['room_id'],
            $validated['proposed_date'],
            $validated['start_time'],
            $validated['end_time']
        );

        $panelistConflicts = $this->conflictService->checkPanelistConflict(
            $defense->id,
            $validated['panelist_ids'],
            $validated['proposed_date'],
            $validated['start_time'],
            $validated['end_time']
        );

        return response()->json([
            'success' => true,
            'data' => [
                'room_conflicts' => $roomConflicts,
                'panelist_conflicts' => $panelistConflicts,
                'has_any_conflicts' => $roomConflicts['has_conflict'] || $panelistConflicts['has_conflict']
            ]
        ]);
    }
}
