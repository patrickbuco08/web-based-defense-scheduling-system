<?php

use Illuminate\Support\Facades\Route;
use Bocum\Models\Defense;
use Illuminate\Http\Request;

Route::get('/defenses', function () {
    $defenses = Defense::with([
        'room',
        'group',
        'adviser',
        'proposedBy',
        'approvedBy',
        'term',
        'panelists',
        'group.members',
    ])->where('status', 'approved')->get();

    return response()->json($defenses);
});

Route::middleware('auth:web')->get('/user', function (Request $request) {
    return response()->json($request->user());
});
