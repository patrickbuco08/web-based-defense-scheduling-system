<?php

use Bocum\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

use Bocum\Http\Controllers\Admin\RoomController;
use Bocum\Http\Controllers\Admin\TermController;
use Bocum\Http\Controllers\Admin\CoordinatorController;
use Bocum\Http\Controllers\CalendarController;
use Bocum\Http\Controllers\Coordinator\DefenseController;
use Bocum\Http\Controllers\Adviser\DefenseController as AdviserDefenseController;
use Bocum\Http\Controllers\Adviser\GroupController as AdviserGroupController;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', fn() => redirect()->route('calendar.index'));


Route::get('/test-react', function () {
    return view('test-react');
})->name('test-react');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Calendar (visible to all authenticated for MVP)
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');

    // Admin-only
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('rooms', RoomController::class)->except(['show']);
        Route::patch('rooms/{room}/toggle-status', [RoomController::class, 'toggleStatus'])->name('rooms.toggle-status');
        Route::resource('terms', TermController::class)->except(['show']);
        Route::resource('coordinators', CoordinatorController::class)->only(['index', 'create', 'store', 'destroy']);
    });

    // Coordinator-only
    Route::middleware('role:coordinator')->prefix('coordinator')->name('coordinator.')->group(function () {
        Route::resource('defenses', DefenseController::class)->except(['show']);
    });

    // Adviser-only
    Route::middleware('role:adviser')->prefix('adviser')->name('adviser.')->group(function () {
        Route::resource('groups', AdviserGroupController::class)->only(['index', 'create', 'store', 'edit', 'update']);
        Route::resource('defenses', AdviserDefenseController::class)->only(['index', 'show']);
    });
});

require __DIR__ . '/auth.php';
