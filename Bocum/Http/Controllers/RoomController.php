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
        $rooms = Room::with('departments')->latest()->get()->map(function (Room $room) {
            return array_merge($room->toArray(), [
                'department_ids' => $room->departments->pluck('id')->values()->all(),
            ]);
        });

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
            'department_ids' => 'required|array|min:1',
            'department_ids.*' => 'exists:departments,id',
        ]);
        
        $room = Room::create([
            'room_number' => $validated['room_number'],
            'building' => $validated['building'],
            'is_active' => $validated['is_active'] ?? false,
        ]);

        $room->departments()->sync($validated['department_ids']);
        $room->load('departments');

        activity('admin')
            ->causedBy(Auth::user())
            ->performedOn($room)
            ->withProperties(['room_number' => $room->room_number, 'building' => $room->building])
            ->log('room.created');
        
        return response()->json([
            'status' => 'success',
            'message' => 'Room created successfully',
            'data' => array_merge($room->toArray(), [
                'department_ids' => $room->departments->pluck('id')->values()->all(),
            ])
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
            'department_ids' => 'required|array|min:1',
            'department_ids.*' => 'exists:departments,id',
        ]);
        
        $room->update([
            'room_number' => $validated['room_number'],
            'building' => $validated['building'],
            'is_active' => $validated['is_active'] ?? false,
        ]);

        $room->departments()->sync($validated['department_ids']);
        $room->load('departments');

        activity('admin')
            ->causedBy(Auth::user())
            ->performedOn($room)
            ->withProperties(['room_number' => $room->room_number, 'building' => $room->building])
            ->log('room.updated');
        
        return response()->json([
            'status' => 'success',
            'message' => 'Room updated successfully',
            'data' => array_merge($room->toArray(), [
                'department_ids' => $room->departments->pluck('id')->values()->all(),
            ])
        ]);
    }

    /**
     * Toggle the active status of the specified room.
     */
    public function toggleStatus(Room $room)
    {
        $this->authorize('toggleStatus', $room);

        $room->load('departments');
        
        $room->update([
            'is_active' => !$room->is_active
        ]);
        
        $status = $room->is_active ? 'activated' : 'deactivated';

        activity('admin')
            ->causedBy(Auth::user())
            ->performedOn($room)
            ->withProperties(['room_number' => $room->room_number, 'is_active' => $room->is_active])
            ->log('room.toggled');
        
        return response()->json([
            'status' => 'success',
            'message' => "Room {$status} successfully",
            'data' => array_merge($room->toArray(), [
                'department_ids' => $room->departments->pluck('id')->values()->all(),
            ])
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
        
        activity('admin')
            ->causedBy(Auth::user())
            ->withProperties(['room_number' => $room->room_number, 'building' => $room->building])
            ->log('room.deleted');

        $room->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Room deleted successfully',
        ]);
    }
}
