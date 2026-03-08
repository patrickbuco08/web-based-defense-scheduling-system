<?php

namespace Bocum\Http\Controllers\Adviser;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\Group;
use Bocum\Models\Term;
use Bocum\Services\GroupService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GroupController extends Controller
{
    protected GroupService $groupService;

    public function __construct(GroupService $groupService)
    {
        $this->groupService = $groupService;
    }

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
            'course_code' => 'nullable|string|max:50',
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string|max:255',
            'term_id' => 'required|exists:terms,id',
            'department_ids' => 'required|array|min:1',
            'department_ids.*' => 'required|exists:departments,id',
            'critic_id' => 'nullable|exists:users,id',
        ]);

        // Use first department for group code generation
        $groupCode = $this->groupService->generateGroupCode($validated['department_ids'][0]);

        // Create the group (keep department_id for backward compatibility with first department)
        $group = Group::create([
            'group_code' => $groupCode,
            'course_code' => $validated['course_code'] ?? null,
            'term_id' => $validated['term_id'],
            'department_id' => $validated['department_ids'][0],
            'critic_id' => $validated['critic_id'] ?? null,
            'adviser_id' => Auth::id(),
            'code' => $groupCode,
        ]);

        // Attach all departments to the group
        $group->departments()->attach($validated['department_ids']);

        // Add group members
        foreach ($validated['members'] as $memberData) {
            $group->members()->create([
                'student_name' => $memberData['name'],
            ]);
        }

        return response()->json([
            'message' => 'Group created successfully!',
            'group' => $group->load('members', 'departments')
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
            'course_code' => 'nullable|string|max:50',
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string|max:255',
            'term_id' => 'required|exists:terms,id',
            'department_ids' => 'required|array|min:1',
            'department_ids.*' => 'required|exists:departments,id',
            'critic_id' => 'nullable|exists:users,id',
        ]);

        // Update the group (keep department_id for backward compatibility with first department)
        $group->update([
            'group_code' => $validated['group_code'],
            'course_code' => $validated['course_code'] ?? null,
            'term_id' => $validated['term_id'],
            'department_id' => $validated['department_ids'][0],
            'critic_id' => $validated['critic_id'] ?? null,
        ]);

        // Sync departments
        $group->departments()->sync($validated['department_ids']);

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
            'group' => $group->load('members', 'departments')
        ]);
    }

    /**
     * Display a listing of the groups for the current adviser.
     */
    public function index()
    {
        $groups = Group::with(['term', 'members', 'department', 'departments', 'adviser', 'critic'])
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
