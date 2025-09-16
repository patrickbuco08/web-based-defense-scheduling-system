<?php

namespace Bocum\Http\Controllers\Coordinator;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\Defense;
use Bocum\Models\Room;
use Bocum\Models\Term;
use Illuminate\Http\Request;

class DefenseController extends Controller
{
    public function index()
    {
        $defenses = Defense::with('room','term')->latest('start_at')->paginate(15);
        return view('coordinator.defenses.index', compact('defenses'));
    }

    public function create()
    {
        return view('coordinator.defenses.create', [
            'rooms' => Room::where('is_active', true)->orderBy('name')->get(),
            'terms' => Term::orderByDesc('is_current')->orderByDesc('id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'     => ['required','string','max:255'],
            'room_id'   => ['required','exists:rooms,id'],
            'term_id'   => ['nullable','exists:terms,id'],
            'start_at'  => ['required','date'],
            'end_at'    => ['required','date','after:start_at'],
            'status'    => ['nullable','in:approved,pending'],
        ]);

        // Simple conflict check: overlapping times in the same room
        $overlap = Defense::where('room_id', $data['room_id'])
            ->where(function ($q) use ($data) {
                $q->whereBetween('start_at', [$data['start_at'], $data['end_at']])
                  ->orWhereBetween('end_at',   [$data['start_at'], $data['end_at']])
                  ->orWhere(function ($q2) use ($data) {
                      $q2->where('start_at', '<=', $data['start_at'])
                         ->where('end_at',   '>=', $data['end_at']);
                  });
            })->exists();

        if ($overlap) {
            return back()->withErrors(['start_at' => 'Conflict: room already booked in this time range.'])->withInput();
        }

        Defense::create([
            'title'    => $data['title'],
            'room_id'  => $data['room_id'],
            'term_id'  => $data['term_id'] ?? null,
            'start_at' => $data['start_at'],
            'end_at'   => $data['end_at'],
            'status'   => $data['status'] ?? 'approved',
        ]);

        return redirect()->route('coordinator.defenses.index')->with('status','Defense scheduled.');
    }

    public function edit(Defense $defense)
    {
        return view('coordinator.defenses.edit', [
            'defense' => $defense,
            'rooms'   => Room::where('is_active', true)->orderBy('name')->get(),
            'terms'   => Term::orderByDesc('is_current')->orderByDesc('id')->get(),
        ]);
    }

    public function update(Request $request, Defense $defense)
    {
        $data = $request->validate([
            'title'     => ['required','string','max:255'],
            'room_id'   => ['required','exists:rooms,id'],
            'term_id'   => ['nullable','exists:terms,id'],
            'start_at'  => ['required','date'],
            'end_at'    => ['required','date','after:start_at'],
            'status'    => ['nullable','in:approved,pending'],
        ]);

        $overlap = Defense::where('room_id', $data['room_id'])
            ->where('id', '!=', $defense->id)
            ->where(function ($q) use ($data) {
                $q->whereBetween('start_at', [$data['start_at'], $data['end_at']])
                  ->orWhereBetween('end_at',   [$data['start_at'], $data['end_at']])
                  ->orWhere(function ($q2) use ($data) {
                      $q2->where('start_at', '<=', $data['start_at'])
                         ->where('end_at',   '>=', $data['end_at']);
                  });
            })->exists();

        if ($overlap) {
            return back()->withErrors(['start_at' => 'Conflict: room already booked in this time range.'])->withInput();
        }

        $defense->update($data);

        return redirect()->route('coordinator.defenses.index')->with('status','Defense updated.');
    }

    public function destroy(Defense $defense)
    {
        $defense->delete();
        return back()->with('status','Defense deleted.');
    }
}