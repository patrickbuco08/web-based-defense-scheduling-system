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
            'title' => 'required|string|max:255',
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string|max:255',
            'members.*.student_no' => 'required|string|max:50',
            'term_id' => 'required|exists:terms,id',
        ]);

        // Create the group
        $group = Group::create([
            'title' => $validated['title'],
            'term_id' => $validated['term_id'],
            'adviser_id' => Auth::id(),
            'code' => 'GRP-' . strtoupper(Str::random(6)),
        ]);

        // Add group members
        foreach ($validated['members'] as $memberData) {
            $group->members()->create([
                'student_name' => $memberData['name'],
                'student_no' => $memberData['student_no'],
            ]);
        }

        return redirect()->route('adviser.groups.index')
            ->with('success', 'Group created successfully!');
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
            'title' => 'required|string|max:255',
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string|max:255',
            'members.*.student_no' => 'required|string|max:50',
            'term_id' => 'required|exists:terms,id',
        ]);

        // Update the group
        $group->update([
            'title' => $validated['title'],
            'term_id' => $validated['term_id'],
        ]);

        // Delete existing members
        $group->members()->delete();

        // Add updated members
        foreach ($validated['members'] as $memberData) {
            $group->members()->create([
                'student_name' => $memberData['name'],
                'student_no' => $memberData['student_no'],
            ]);
        }

        return redirect()->route('adviser.groups.index')
            ->with('success', 'Group updated successfully!');
    }

    /**
     * Display a listing of the groups for the current adviser.
     */
    public function index()
    {
        $groups = Group::with(['term', 'members'])
            ->where('adviser_id', Auth::id())
            ->latest()
            ->paginate(10);

        return view('adviser.groups.index', compact('groups'));
    }
}
