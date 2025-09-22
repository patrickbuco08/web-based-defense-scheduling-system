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
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Bocum\Mail\DefenseProposalMail;
use Bocum\Models\User;

class DefenseController extends Controller
{

    public function __construct(protected DefenseConflictService $conflictService) {}

    public function index()
    {
        // Get defenses where the authenticated user is the adviser, critic, or a panelist
        $defenses = Defense::where(function ($query) {
            $query->whereHas('group', function ($q) {
                $q->where('adviser_id', Auth::id())
                    ->orWhere('critic_id', Auth::id());
            })->orWhereHas('panelists', function ($q) {
                $q->where('panelist_id', Auth::id());
            });
        })
            ->with([
                'room',
                'group',
                'group.term',
                'adviser',
                'proposedBy',
                'approvedBy',
                'panelists',
                'group.members',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($defenses);
    }

    public function departmentIndex()
    {
        $this->authorize('departmentIndex', Defense::class);

        $defenses = Defense::whereHas('group', function ($query) {
            $query->where('department_id', Auth::user()->department_id);
        })->with([
            'room',
            'group',
            'group.term',
            'group.adviser',
            'group.critic',
            'adviser',
            'proposedBy',
            'approvedBy',
            'panelists',
            'group.members',
        ])
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
            'rooms' => Room::where('is_active', true)
                ->orderBy('building')
                ->orderBy('room_number')
                ->get(),
            'groups' => Group::where('adviser_id', $adviser->id)
                ->with('members')
                ->orderBy('id')
                ->get(),
            'panelists' => \Bocum\Models\User::role('panelist')
                ->orderBy('name')
                ->get(),
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
                'group_id' => $request->group_id,
                'room_id' => $request->room_id,
                'start_at' => Carbon::parse($request->date . ' ' . $request->start_time),
                'end_at' => Carbon::parse($request->date . ' ' . $request->end_time),
                'status' => $request->status,
                'notes' => $request->notes,
                // approved_by_id and rejection_note would be handled by separate approval endpoints
            ];

            // If status is being updated to approved, verify the user is a coordinator
            if ($request->status === 'approved' && Auth::user()->hasRole('coordinator')) {
                $data['approved_by_id'] = Auth::id();
            }

            if ($request->rejection_note) {
                $data['rejection_note'] = $request->rejection_note;
            }

            // Update the defense
            $defense->update($data);

            // Sync panelists if provided
            if ($request->has('panelists')) {
                $defense->panelists()->sync($request->panelists);
            }

            return response()->json([
                'success' => true,
                'message' => 'Defense updated successfully',
                'data' => $defense->fresh(['room', 'group', 'panelists'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the defense. Please try again.' . $e->getMessage()
            ], 500);
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
            $group = Group::where('id', $request->group_id)
                ->where('adviser_id', Auth::id())
                ->firstOrFail();

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
            $coordinator = User::role('coordinator')
                ->where('department_id', $adviser->department_id)
                ->firstOrFail();

            Mail::to($coordinator->email)->send(new DefenseProposalMail($defense, $adviser));

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
                'request' => $request->except(['_token', 'panelists'])
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
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
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending defenses can be deleted.'
                ], 400);
            }

            $defense->delete();

            return response()->json([
                'success' => true,
                'message' => 'Defense has been deleted successfully.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting defense: ' . $e->getMessage(), [
                'defense_id' => $defense->id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the defense. Please try again.'
            ]);
        }
    }
}
