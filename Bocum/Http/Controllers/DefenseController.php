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

class DefenseController extends Controller
{
    public function index()
    {
        // Get defenses where the authenticated user is the adviser
        $defenses = Defense::whereHas('group', function ($query) {
            $query->where('adviser_id', Auth::id())
                ->orWhere('critic_id', Auth::id());
        })->with([
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
                'message' => 'An error occurred while submitting the defense proposal. Please try again.',
            ]);
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
                return back()
                    ->with('error', 'Only pending defenses can be deleted.');
            }

            $defense->delete();

            return redirect()
                ->route('adviser.defenses.index')
                ->with('success', 'Defense has been deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting defense: ' . $e->getMessage(), [
                'defense_id' => $defense->id,
                'user_id' => Auth::id()
            ]);

            return back()
                ->with('error', 'An error occurred while deleting the defense. Please try again.');
        }
    }
}
