<?php

use Illuminate\Support\Facades\Route;
use Bocum\Models\Defense;
use Illuminate\Http\Request;

Route::get('/defenses', function () {
    $events = Defense::where('status', 'approved')
        ->get()
        ->map(fn($d) => [
            'id'    => $d->id,
            'title' => $d->title.' · '.$d->room->name,
            'start' => $d->start_at->toIso8601String(),
            'end'   => $d->end_at->toIso8601String(),
        ]);
    return response()->json($events);
});

Route::middleware('auth:web')->get('/user', function (Request $request) {
    return response()->json($request->user());
});