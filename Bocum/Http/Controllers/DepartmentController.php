<?php

namespace Bocum\Http\Controllers;

use Bocum\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the departments.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $departments = Department::all(['id', 'code', 'name', 'school', 'created_at']);

        return response()->json($departments);
    }

    /**
     * Store a newly created department in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:10|unique:departments,code',
            'name' => 'required|string|max:255|unique:departments,name',
            'school' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $department = Department::create([
            'code' => $request->code,
            'name' => $request->name,
            'school' => $request->school,
        ]);

        return response()->json([
            'success' => true,
            'data' => $department,
            'message' => 'Department created successfully.'
        ], 201);
    }

    /**
     * Display the specified department.
     *
     * @param  \Bocum\Models\Department  $department
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Department $department)
    {
        return response()->json([
            'success' => true,
            'data' => $department,
            'message' => 'Department retrieved successfully.'
        ]);
    }

    /**
     * Update the specified department in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Bocum\Models\Department  $department
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Department $department)
    {
        $validator = Validator::make($request->all(), [
            'code' => [
                'required',
                'string',
                'max:10',
                Rule::unique('departments', 'code')->ignore($department->id)
            ],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('departments', 'name')->ignore($department->id)
            ],
            'school' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $department->update([
            'code' => $request->code,
            'name' => $request->name,
            'school' => $request->school,
        ]);

        return response()->json([
            'success' => true,
            'data' => $department,
            'message' => 'Department updated successfully.'
        ]);
    }

    /**
     * Remove the specified department from storage.
     *
     * @param  \Bocum\Models\Department  $department
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Department $department)
    {
        // Check if department is being used before deleting
        if ($department->users()->exists() || $department->groups()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete department. It is currently in use.'
            ], 422);
        }

        $department->delete();

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully.'
        ]);
    }
}
