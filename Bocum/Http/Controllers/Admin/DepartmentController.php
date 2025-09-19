<?php

namespace Bocum\Http\Controllers\Admin;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the departments.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $departments = Department::all(['id', 'code', 'name', 'created_at']);

        return response()->json([
            'data' => $departments,
            'message' => 'Departments retrieved successfully.'
        ]);
    }
}
