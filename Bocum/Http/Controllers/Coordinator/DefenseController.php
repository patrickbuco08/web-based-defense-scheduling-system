<?php

namespace Bocum\Http\Controllers\Coordinator;

use Bocum\Http\Controllers\Controller;
use Bocum\Http\Requests\DefenseRequest;
use Bocum\Models\Defense;
use Bocum\Models\Room;
use Bocum\Models\Term;
use Bocum\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DefenseController extends Controller
{
    /**
     * Display a listing of the defenses.
     */
    public function index()
    {
        $defenses = Defense::with([
                'room', 
                'term',
                'group',
                'group.members',
                'group.adviser',
                'group.critic',
                'adviser'
            ])
            ->whereHas('term', function($query) {
                $query->where('is_current', true);
            })
            ->upcoming()
            ->orderBy('start_at')
            ->paginate(15);

            // return $defenses;

        return view('coordinator.defenses.index', compact('defenses'));
    }

    /**
     * Show the form for creating a new defense.
     */
    public function create()
    {
        $currentTerm = Term::where('is_current', true)->firstOrFail();
        
        return view('coordinator.defenses.create', [
            'rooms' => Room::where('is_active', true)
                ->orderBy('building')
                ->orderBy('room_number')
                ->get(),
            'advisers' => \Bocum\Models\User::role('adviser')
                ->orderBy('name')
                ->get(),
            'panelists' => \Bocum\Models\User::role('panelist')
                ->orderBy('name')
                ->get(),
            'currentTerm' => $currentTerm,
            'minDate' => now()->format('Y-m-d'),
            'maxDate' => now()->addMonths(3)->format('Y-m-d'),
            'minTime' => '08:00',
            'maxTime' => '17:00',
        ]);
    }

    /**
     * Store a newly created defense in storage.
     *
     * @param  \Bocum\Http\Requests\DefenseRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function store(DefenseRequest $request)
    {
        try {
            DB::beginTransaction();

            // Combine date and time fields
            $startAt = Carbon::parse($request->date . ' ' . $request->start_time);
            $endAt = Carbon::parse($request->date . ' ' . $request->end_time);

            // Create the defense with the provided data
            $defense = Defense::create([
                'title' => $request->title,
                'group_code' => $request->group_code,
                'room_id' => $request->room_id,
                'term_id' => $request->term_id,
                'adviser_id' => $request->adviser_id,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'description' => $request->description,
                'status' => 'pending',
            ]);

            // Attach panelists
            if ($request->has('panelists')) {
                $defense->panelists()->attach($request->panelists);
            }

            DB::commit();
            
            return redirect()
                ->route('coordinator.defenses.index')
                ->with('success', 'Defense scheduled successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the error
            Log::error('Error creating defense: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->except(['_token', 'panelists'])
            ]);
            
            return back()
                ->with('error', 'An error occurred while saving the defense. Please try again.')
                ->withInput();
        }
    }

    /**
     * Show the form for editing the specified defense.
     */
    public function edit(Defense $defense)
    {
        // Get current term
        $currentTerm = Term::currentTerm()->firstOrFail();
        
        // Get all active rooms
        $rooms = Room::where('is_active', true)
            ->orderBy('building')
            ->orderBy('room_number')
            ->get();
        
        // Get all advisers
        $advisers = User::role('adviser')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);
            
        // Get all panelists
        $panelists = User::role('panelist')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);
            
        // Get date range for the current term
        $minDate = now()->format('Y-m-d');
        $maxDate = now()->addMonths(3)->format('Y-m-d');

        return view('coordinator.defenses.edit', [
            'defense' => $defense->load(['room', 'term', 'adviser', 'panelists']),
            'currentTerm' => $currentTerm,
            'rooms' => $rooms,
            'advisers' => $advisers,
            'panelists' => $panelists,
            'minDate' => $minDate,
            'maxDate' => $maxDate,
            'minTime' => '08:00',
            'maxTime' => '17:00',
        ]);
    }

    /**
     * Update the specified defense in storage.
     */
    public function update(DefenseRequest $request, Defense $defense)
    {
        try {
            DB::beginTransaction();

            // Combine date and time fields
            $startAt = Carbon::parse($request->date . ' ' . $request->start_time);
            $endAt = Carbon::parse($request->date . ' ' . $request->end_time);

            // Validate end time is after start time
            if ($endAt <= $startAt) {
                return back()
                    ->withErrors(['end_time' => 'End time must be after start time'])
                    ->withInput();
            }

            // Update the defense
            $defense->update([
                'title' => $request->title,
                'group_code' => $request->group_code,
                'room_id' => $request->room_id,
                'adviser_id' => $request->adviser_id,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'description' => $request->description,
            ]);
            
            // Sync panelists
            if ($request->has('panelists')) {
                $defense->panelists()->sync($request->panelists);
            } else {
                $defense->panelists()->detach();
            }
            
            DB::commit();
            
            return redirect()
                ->route('coordinator.defenses.index')
                ->with('status', 'Defense updated successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($e->getMessage() === 'The selected time slot conflicts with an existing defense in this room.') {
                return back()
                    ->withErrors(['start_at' => $e->getMessage()])
                    ->withInput();
            }
            
            // Log other errors
            Log::error('Error updating defense: ' . $e->getMessage(), [
                'exception' => $e,
                'defense_id' => $defense->id,
                'request' => $request->except(['_token', '_method', 'panelists'])
            ]);
            
            return back()
                ->with('error', 'An error occurred while updating the defense. Please try again.')
                ->withInput();
        }
    }

    /**
     * Remove the specified defense from storage.
     */
    public function destroy(Defense $defense)
    {
        try {
            // Prevent deletion of past defenses
            if ($defense->end_at < now()) {
                return redirect()
                    ->route('coordinator.defenses.index')
                    ->with('error', 'Cannot delete past defenses.');
            }
            
            $defense->delete();
            
            return redirect()
                ->route('coordinator.defenses.index')
                ->with('status', 'Defense deleted successfully.');
                
        } catch (\Exception $e) {
            return redirect()
                ->route('coordinator.defenses.index')
                ->with('error', 'An error occurred while deleting the defense. Please try again.');
        }
    }
}