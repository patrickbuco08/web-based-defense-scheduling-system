<?php

namespace Bocum\Http\Controllers\Admin;

use Bocum\Http\Controllers\Controller;
use Bocum\Models\Defense;
use Bocum\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $terms = Term::orderBy('id', 'desc')->get();

        return response()->json($terms);
    }

    // lets create a new endpoint to get the active term
    public function activeTerm()
    {
        $term = Term::where('is_current', true)->first();

        return response()->json($term);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_year' => 'required|string|max:9|regex:/^\d{4}-\d{4}$/',
            'semester' => 'required|string',
            'is_current' => 'sometimes|boolean',
        ]);

        return DB::transaction(function () use ($validated) {
            // If this term is being set as current, unset any existing current term
            if ($validated['is_current'] ?? false) {
                $currentTermIds = Term::where('is_current', true)->pluck('id');

                if ($currentTermIds->isNotEmpty()) {
                    // Only archive completed defenses (approved/reschedule that have passed their end time)
                    Defense::whereHas('group', function ($query) use ($currentTermIds) {
                        $query->whereIn('term_id', $currentTermIds);
                    })
                        ->where('archived', false)
                        ->where(function ($query) {
                            $query->whereIn('status', ['approved', 'reschedule'])
                                  ->where('end_at', '<', now());
                        })
                        ->update(['archived' => true]);
                }

                Term::where('is_current', true)->update(['is_current' => false]);
            }

            $term = Term::create($validated);

            if ($validated['is_current'] ?? false) {
                Defense::whereHas('group', function ($query) use ($term) {
                    $query->where('term_id', $term->id);
                })
                    ->where('archived', true)
                    ->update(['archived' => false]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Term created successfully.',
            ]);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Term $term)
    {
        return view('admin.terms.edit', compact('term'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Term $term)
    {
        $validated = $request->validate([
            'school_year' => 'required|string|max:9|regex:/^\d{4}-\d{4}$/',
            'semester' => 'required|string',
            'is_current' => 'sometimes|boolean',
        ]);

        return DB::transaction(function () use ($validated, $term) {
            // If this term is being set as current, unset any existing current term
            if ($validated['is_current'] ?? false) {
                $currentTermIds = Term::where('is_current', true)
                    ->where('id', '!=', $term->id)
                    ->pluck('id');

                if ($currentTermIds->isNotEmpty()) {
                    // Only archive completed defenses (approved/reschedule that have passed their end time)
                    Defense::whereHas('group', function ($query) use ($currentTermIds) {
                        $query->whereIn('term_id', $currentTermIds);
                    })
                        ->where('archived', false)
                        ->where(function ($query) {
                            $query->whereIn('status', ['approved', 'reschedule'])
                                  ->where('end_at', '<', now());
                        })
                        ->update(['archived' => true]);
                }

                Term::where('is_current', true)
                    ->where('id', '!=', $term->id)
                    ->update(['is_current' => false]);
            }

            $term->update($validated);

            if ($validated['is_current'] ?? false) {
                Defense::whereHas('group', function ($query) use ($term) {
                    $query->where('term_id', $term->id);
                })
                    ->where('archived', true)
                    ->update(['archived' => false]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Term updated successfully.',
            ]);
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Term $term)
    {
        // Prevent deletion if this is the current term
        if ($term->is_current) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete the current term. Please set another term as current first.',
            ], 400);
        }

        // Prevent deletion if there are associated defenses
        if ($term->groups()->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete term with associated groups.',
            ], 400);
        }

        $term->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Term deleted successfully.',
        ]);
    }
}
