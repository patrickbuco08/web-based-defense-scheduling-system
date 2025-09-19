<?php

namespace Bocum\Http\Controllers\Admin;

use Bocum\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the permissions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $permissions = Permission::all(['id', 'name', 'guard_name', 'created_at']);
        
        return response()->json([
            'data' => $permissions,
            'message' => 'Permissions retrieved successfully.'
        ]);
    }
}
