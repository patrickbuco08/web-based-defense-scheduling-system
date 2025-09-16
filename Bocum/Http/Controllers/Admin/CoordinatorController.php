<?php

namespace Bocum\Http\Controllers\Admin;

use Bocum\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Bocum\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class CoordinatorController extends Controller
{
    /**
     * Display a listing of coordinators.
     */
    public function index()
    {
        $coordinators = User::role('coordinator')
            ->with('roles')
            ->latest()
            ->paginate(15);
            
        return view('admin.coordinators.index', compact('coordinators'));
    }

    /**
     * Show the form for creating a new coordinator.
     */
    public function create()
    {
        return view('admin.coordinators.create');
    }

    /**
     * Store a newly created coordinator in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')
            ],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        $user->assignRole('coordinator');

        return redirect()
            ->route('admin.coordinators.index')
            ->with('status', 'Coordinator account created successfully.');
    }

    /**
     * Remove the specified coordinator from storage.
     */
    public function destroy(User $coordinator)
    {
        // Prevent deleting yourself
        if (Auth::id() === $coordinator->id) {
            return redirect()
                ->route('admin.coordinators.index')
                ->with('error', 'You cannot delete your own account.');
        }

        // Prevent deleting non-coordinator users
        if (!$coordinator->hasRole('coordinator')) {
            return redirect()
                ->route('admin.coordinators.index')
                ->with('error', 'The specified user is not a coordinator.');
        }

        $coordinator->delete();

        return redirect()
            ->route('admin.coordinators.index')
            ->with('status', 'Coordinator account deleted successfully.');
    }
}
