<?php

namespace Bocum\Http\Controllers\Admin;

use Bocum\Http\Controllers\Controller;
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
        $terms = Term::orderByDesc('is_current')
            ->orderByDesc('id')
            ->paginate(10);

        return view('admin.terms.index', compact('terms'));
    }

    // lets create a new endpoint to get the active term
    public function activeTerm()
    {
        $term = Term::where('is_current', true)->first();

        return response()->json($term);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.terms.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_year' => 'required|string|max:9|regex:/^\d{4}-\d{4}$/',
            'semester' => 'required|string|in:1st,2nd,Summer',
            'is_current' => 'sometimes|boolean',
        ]);

        return DB::transaction(function () use ($validated) {
            // If this term is being set as current, unset any existing current term
            if ($validated['is_current'] ?? false) {
                Term::where('is_current', true)->update(['is_current' => false]);
            }

            Term::create($validated);

            return redirect()->route('admin.terms.index')
                ->with('status', 'Term created successfully.');
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
            'semester' => 'required|string|in:1st,2nd,Summer',
            'is_current' => 'sometimes|boolean',
        ]);

        return DB::transaction(function () use ($validated, $term) {
            // If this term is being set as current, unset any existing current term
            if ($validated['is_current'] ?? false) {
                Term::where('is_current', true)
                    ->where('id', '!=', $term->id)
                    ->update(['is_current' => false]);
            }

            $term->update($validated);

            return redirect()->route('admin.terms.index')
                ->with('status', 'Term updated successfully.');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Term $term)
    {
        // Prevent deletion if this is the current term
        if ($term->is_current) {
            return back()->with('error', 'Cannot delete the current term. Please set another term as current first.');
        }

        // Prevent deletion if there are associated defenses
        if ($term->defenses()->exists()) {
            return back()->with('error', 'Cannot delete term with associated defenses.');
        }

        $term->delete();

        return redirect()->route('admin.terms.index')
            ->with('status', 'Term deleted successfully.');
    }
}
