<?php

namespace Bocum\Http\Controllers;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoomController extends Controller
{
    /**
     * Display a listing of the rooms.
     */
    public function index()
    {
        $rooms = Room::latest()->get();

        return response()->json($rooms);
        // return view('admin.rooms.index', compact('rooms'));
    }

    /**
     * Store a newly created room in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Room::class);
        
        $validated = $request->validate([
            'room_number' => 'required|string|max:50|unique:rooms,room_number',
            'building' => 'required|string|max:100',
            'is_active' => 'boolean',
        ]);
        
        $room = Room::create($validated);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Room created successfully',
            'data' => $room
        ], 201);
    }

    /**
     * Update the specified room in storage.
     */
    public function update(Request $request, Room $room)
    {
        $this->authorize('update', $room);
        
        $validated = $request->validate([
            'room_number' => 'required|string|max:50|unique:rooms,room_number,' . $room->id,
            'building' => 'required|string|max:100',
            'is_active' => 'boolean',
        ]);
        
        $room->update($validated);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Room updated successfully',
            'data' => $room
        ]);
    }

    /**
     * Toggle the active status of the specified room.
     */
    public function toggleStatus(Room $room)
    {
        $this->authorize('toggleStatus', $room);
        
        $room->update([
            'is_active' => !$room->is_active
        ]);
        
        $status = $room->is_active ? 'activated' : 'deactivated';
        
        return response()->json([
            'status' => 'success',
            'message' => "Room {$status} successfully",
            'data' => $room
        ]);
    }

    /**
     * Remove the specified room from storage.
     */
    public function destroy(Room $room)
    {
        $this->authorize('delete', $room);
        
        // Check if the room has any scheduled defenses
        if ($room->defenses()->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete room with scheduled defenses.',
            ], 422);
        }
        
        $room->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Room deleted successfully',
        ]);
    }
}
