<?php

namespace Bocum\Http\Controllers\Admin;

use Bocum\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the roles with pagination.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $roles = Role::select(['id', 'name', 'guard_name', 'created_at'])->get();

        return response()->json([
            'data' => $roles,
            'message' => 'Roles retrieved successfully.'
        ]);
    }

    /**
     * Store a newly created role in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'guard_name' => 'sometimes|string|max:255|in:web,api',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        DB::beginTransaction();

        try {
            $role = Role::create([
                'name' => $validated['name'],
                'guard_name' => $validated['guard_name'] ?? 'web',
            ]);

            if (isset($validated['permissions'])) {
                $permissions = Permission::whereIn('id', $validated['permissions'])->pluck('name');
                $role->syncPermissions($permissions);
            }

            DB::commit();

            return response()->json([
                'data' => $role->load('permissions'),
                'message' => 'Role created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create role.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified role.
     *
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Role $role): JsonResponse
    {
        $role->load('permissions');

        return response()->json([
            'data' => $role,
            'message' => 'Role retrieved successfully.'
        ]);
    }

    /**
     * Update the specified role in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $role->id,
            'guard_name' => 'sometimes|string|max:255|in:web,api',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        DB::beginTransaction();

        try {
            $role->update([
                'name' => $validated['name'] ?? $role->name,
                'guard_name' => $validated['guard_name'] ?? $role->guard_name,
            ]);

            if (isset($validated['permissions'])) {
                $permissions = Permission::whereIn('id', $validated['permissions'])->pluck('name');
                $role->syncPermissions($permissions);
            }

            DB::commit();

            return response()->json([
                'data' => $role->load('permissions'),
                'message' => 'Role updated successfully.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update role.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified role from storage.
     *
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Role $role): JsonResponse
    {
        if ($role->users()->exists()) {
            return response()->json([
                'message' => 'Cannot delete role because it is assigned to users.'
            ], 422);
        }

        $role->delete();

        return response()->json([
            'message' => 'Role deleted successfully.'
        ]);
    }
}
