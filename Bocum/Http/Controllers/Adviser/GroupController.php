<?php

namespace Bocum\Http\Controllers\Adviser;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\Group;
use Bocum\Models\GroupMember;
use Bocum\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GroupController extends Controller
{
    /**
     * Show the form for creating a new group.
     */
    public function create()
    {
        $currentTerm = Term::where('is_current', true)->firstOrFail();
        return view('adviser.groups.create', compact('currentTerm'));
    }

    /**
     * Store a newly created group in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'group_code' => 'required|string|max:50|unique:groups,group_code',
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string|max:255',
            'term_id' => 'required|exists:terms,id',
            'department_id' => 'required|exists:departments,id',
            'critic_id' => 'nullable|exists:users,id',
        ]);

        // Create the group
        $group = Group::create([
            'group_code' => $validated['group_code'],
            'term_id' => $validated['term_id'],
            'department_id' => $validated['department_id'],
            'critic_id' => $validated['critic_id'] ?? null,
            'adviser_id' => Auth::id(),
            'code' => $validated['group_code'],
        ]);

        // Add group members
        foreach ($validated['members'] as $memberData) {
            $group->members()->create([
                'student_name' => $memberData['name'],
            ]);
        }

        return response()->json([
            'message' => 'Group created successfully!',
            'group' => $group->load('members')
        ]);
    }

    /**
     * Show the form for editing the specified group.
     */
    public function edit(Group $group)
    {
        // Ensure the authenticated user is the owner of the group
        if ($group->adviser_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $group->load('members');
        return view('adviser.groups.edit', compact('group'));
    }

    /**
     * Update the specified group in storage.
     */
    public function update(Request $request, Group $group)
    {
        // Ensure the authenticated user is the owner of the group
        if ($group->adviser_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'group_code' => 'required|string|max:50|unique:groups,group_code,' . $group->id,
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string|max:255',
            'term_id' => 'required|exists:terms,id',
            'critic_id' => 'nullable|exists:users,id',
        ]);

        // Update the group
        $group->update([
            'group_code' => $validated['group_code'],
            'term_id' => $validated['term_id'],
            'critic_id' => $validated['critic_id'] ?? null,
        ]);

        // Delete existing members
        $group->members()->delete();

        // Add updated members
        foreach ($validated['members'] as $memberData) {
            $group->members()->create([
                'student_name' => $memberData['name'],
            ]);
        }

        return response()->json([
            'message' => 'Group updated successfully!',
            'group' => $group->load('members')
        ]);
    }

    /**
     * Display a listing of the groups for the current adviser.
     */
    public function index()
    {
        $groups = Group::with(['term', 'members', 'department', 'adviser', 'critic'])
            ->where('adviser_id', Auth::id())
            ->latest()
            ->get();

        // If request expects JSON (for API calls)
        if (request()->expectsJson()) {
            return response()->json($groups);
        }

        return view('adviser.groups.index', compact('groups'));
    }

    public function destroy(Group $group)
    {
        // Ensure the authenticated user is the owner of the group
        if ($group->adviser_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $group->delete();

        return response()->json([
            'message' => 'Group deleted successfully!',
            'group' => $group
        ]);
    }
}
