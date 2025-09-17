<?php

namespace Bocum\Http\Controllers\Adviser;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\Defense;
use Bocum\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DefenseController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:adviser');
    }

    public function index()
    {
        // Get defenses where the authenticated user is the adviser
        $defenses = Defense::whereHas('group', function($query) {
            $query->where('adviser_id', Auth::id());
        })->with(['group', 'room', 'term'])
          ->orderBy('created_at', 'desc')
          ->get();

        return view('adviser.defenses.index', compact('defenses'));
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
}
