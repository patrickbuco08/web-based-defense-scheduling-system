<?php

use Illuminate\Support\Facades\Route;
use Bocum\Models\Defense;

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