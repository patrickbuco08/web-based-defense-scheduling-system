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
     * @param \Bocum\Models\Defense $defense
     * @return JsonResponse
     */
    public function checkConflicts(Defense $defense): JsonResponse
    {
        $roomConflicts = $this->conflictService->checkRoomConflict($defense->id);
        $panelistConflicts = $this->conflictService->checkPanelistConflict($defense->id);

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
