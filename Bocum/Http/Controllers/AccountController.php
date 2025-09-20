<?php

namespace Bocum\Http\Controllers;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentUser = Auth::user();
        $users = User::with(['roles', 'department'])
            ->where('id', '!=', $currentUser->id)
            ->where('department_id', $currentUser->department_id)
            ->whereDoesntHave('roles', function($query) {
                $query->where('name', 'admin');
            })
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()?->name ?? 'user',
                    'department' => $user->department ? [
                        'id' => $user->department->id,
                        'name' => $user->department->name,
                    ] : null,
                    'created_at' => $user->created_at,
                    'email_verified_at' => $user->email_verified_at,
                ];
            });

        return response()->json($users);
    }

    /**
     * 
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'department_id' => 'nullable|exists:departments,id',
            'role' => 'required|string|exists:roles,name'
        ]);

        // Start a database transaction
        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'department_id' => $validated['department_id'] ?? null,
            ]);

            // Assign the role to the user
            $user->assignRole($validated['role']);

            // Commit the transaction
            DB::commit();

            // Load the role and department relationships for the response
            $user->load('roles', 'department');

            return response()->json([
                'data' => $user,
                'message' => 'User created successfully.'
            ], 201);
            
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json([
            'data' => $user,
            'message' => 'User retrieved successfully.'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'department_id' => 'sometimes|nullable|exists:departments,id',
            'role' => 'sometimes|string|exists:roles,name'
        ]);

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Only update the allowed fields
            $updateData = [
                'name' => $validated['name'] ?? $user->name,
            ];

            // Only update department_id if it's provided in the request
            if (array_key_exists('department_id', $validated)) {
                $updateData['department_id'] = $validated['department_id'];
            }

            $user->update($updateData);

            // Update role if provided
            if (isset($validated['role'])) {
                $user->syncRoles([$validated['role']]);
            }

            // Commit the transaction
            DB::commit();

            // Load the updated relationships
            $user->load('roles', 'department');

            return response()->json([
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,  // This will always be the original email
                    'role' => $user->roles->first()?->name ?? 'user',
                    'department' => $user->department ? [
                        'id' => $user->department->id,
                        'name' => $user->department->name,
                    ] : null,
                    'created_at' => $user->created_at,
                    'email_verified_at' => $user->email_verified_at,
                ],
                'message' => 'User updated successfully.'
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.'
        ]);
    }
}
