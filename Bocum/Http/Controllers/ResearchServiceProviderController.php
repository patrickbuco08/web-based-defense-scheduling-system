<?php

namespace Bocum\Http\Controllers;

use Bocum\Models\ResearchServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResearchServiceProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentUser = Auth::user();
        $query = ResearchServiceProvider::with('department');
            
        // Only filter by department if user is not an admin
        if (!$currentUser->hasRole('admin')) {
            $userDepartmentIds = $currentUser->departments->pluck('id');
            $query->whereIn('department_id', $userDepartmentIds);
        }
        
        $providers = $query->latest()->get()
            ->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'name' => $provider->name,
                    'role' => $provider->role,
                    'department' => $provider->department ? [
                        'id' => $provider->department->id,
                        'name' => $provider->department->name,
                        'code' => $provider->department->code,
                    ] : null,
                    'created_at' => $provider->created_at,
                ];
            });

        return response()->json($providers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
        ]);

        $provider = ResearchServiceProvider::create($validated);
        $provider->load('department');

        return response()->json([
            'data' => [
                'id' => $provider->id,
                'name' => $provider->name,
                'role' => $provider->role,
                'department' => $provider->department ? [
                    'id' => $provider->department->id,
                    'name' => $provider->department->name,
                    'code' => $provider->department->code,
                ] : null,
                'created_at' => $provider->created_at,
            ],
            'message' => 'Research service provider created successfully.'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ResearchServiceProvider $researchServiceProvider)
    {
        $researchServiceProvider->load('department');
        
        return response()->json([
            'data' => $researchServiceProvider,
            'message' => 'Research service provider retrieved successfully.'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ResearchServiceProvider $researchServiceProvider)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|required|string|max:255',
            'department_id' => 'sometimes|required|exists:departments,id',
        ]);

        $researchServiceProvider->update($validated);
        $researchServiceProvider->load('department');

        return response()->json([
            'data' => [
                'id' => $researchServiceProvider->id,
                'name' => $researchServiceProvider->name,
                'role' => $researchServiceProvider->role,
                'department' => $researchServiceProvider->department ? [
                    'id' => $researchServiceProvider->department->id,
                    'name' => $researchServiceProvider->department->name,
                    'code' => $researchServiceProvider->department->code,
                ] : null,
                'created_at' => $researchServiceProvider->created_at,
            ],
            'message' => 'Research service provider updated successfully.'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ResearchServiceProvider $researchServiceProvider)
    {
        $researchServiceProvider->delete();

        return response()->json([
            'message' => 'Research service provider deleted successfully.'
        ]);
    }
}
