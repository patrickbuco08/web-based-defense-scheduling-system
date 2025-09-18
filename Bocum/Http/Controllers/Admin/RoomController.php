<?php

namespace Bocum\Http\Controllers\Admin;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the rooms.
     */
    public function index()
    {
        $rooms = Room::latest()->paginate(10);
        return view('admin.rooms.index', compact('rooms'));
    }

    /**
     * Show the form for creating a new resource.
     */
    /**
     * Show the form for creating a new room.
     */
    public function create()
    {
        return view('admin.rooms.create');
    }

    /**
     * Store a newly created room in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:50|unique:rooms,room_number',
            'building' => 'required|string|max:100',
            'is_active' => 'boolean',
        ]);

        Room::create($validated);

        return redirect()->route('admin.rooms.index')
            ->with('status', 'Room created successfully.');
    }

    /**
     * Show the form for editing the specified room.
     */
    public function edit(Room $room)
    {
        return view('admin.rooms.edit', compact('room'));
    }

    /**
     * Update the specified room in storage.
     */
    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:50|unique:rooms,room_number,' . $room->id,
            'building' => 'required|string|max:100',
            'is_active' => 'boolean',
        ]);

        $room->update($validated);

        return redirect()->route('admin.rooms.index')
            ->with('status', 'Room updated successfully.');
    }

    /**
     * Toggle the active status of the specified room.
     */
    public function toggleStatus(Room $room)
    {
        $room->update([
            'is_active' => !$room->is_active
        ]);

        $status = $room->is_active ? 'activated' : 'deactivated';
        return redirect()->route('admin.rooms.index')
            ->with('status', "Room {$status} successfully.");
    }

    /**
     * Remove the specified room from storage.
     */
    public function destroy(Room $room)
    {
        // Check if the room has any scheduled defenses
        if ($room->defenses()->exists()) {
            return redirect()->route('admin.rooms.index')
                ->with('error', 'Cannot delete room with scheduled defenses.');
        }

        $room->delete();

        return redirect()->route('admin.rooms.index')
            ->with('status', 'Room deleted successfully.');
    }
}
