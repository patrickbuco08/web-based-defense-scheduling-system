<?php

use Bocum\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

use Bocum\Http\Controllers\RoomController;
use Bocum\Http\Controllers\Admin\TermController;
use Bocum\Http\Controllers\Admin\CoordinatorController;
use Bocum\Http\Controllers\CalendarController;
// use Bocum\Http\Controllers\Coordinator\DefenseController;
use Bocum\Http\Controllers\DefenseController;
use Bocum\Http\Controllers\Adviser\GroupController as AdviserGroupController;
use Illuminate\Http\Request;
use Bocum\Http\Controllers\AccountController;
use Bocum\Http\Controllers\DepartmentController;
use Bocum\Http\Controllers\Admin\PermissionController;
use Bocum\Http\Controllers\Admin\RoleController;
use Bocum\Http\Controllers\CriticController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {


    Route::get('/app/{any?}', function () {
        return view('app.index');
    })->where('any', '.*');

    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::resource('accounts', AccountController::class)
        ->parameters(['accounts' => 'user'])
        ->except(['show']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Calendar (visible to all authenticated for MVP)
    // Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');

    Route::get('terms/active', [TermController::class, 'activeTerm'])->name('terms.active');
    Route::resource('terms', TermController::class)->except(['show']);

    Route::resource('departments', DepartmentController::class)->except(['show', 'create', 'edit']);

    Route::get('critics', [CriticController::class, 'index'])->name('critics.index');

    Route::get('defenses/conflicts/check/{defense}', [DefenseController::class, 'checkConflicts'])
    ->name('defenses.conflicts.check');
    Route::get('defenses/departments', [DefenseController::class, 'departmentIndex'])->name('defenses.departmentIndex');
    Route::resource('defenses', DefenseController::class)->only(['index', 'show', 'create', 'store', 'destroy', 'update']);

    Route::resource('rooms', RoomController::class)->except(['show']);

    // Admin-only
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::patch('rooms/{room}/toggle-status', [RoomController::class, 'toggleStatus'])->name('rooms.toggle-status');
        Route::resource('coordinators', CoordinatorController::class)->only(['index', 'create', 'store', 'destroy']);

        // Roles API
        Route::resource('roles', RoleController::class)->except(['edit', 'create']);

        // Permissions & Departments API
        Route::get('permissions', [PermissionController::class, 'index']);
    });

    // Coordinator-only
    // Route::middleware('role:coordinator')->prefix('coordinator')->name('coordinator.')->group(function () {
    //     Route::resource('defenses', DefenseController::class)->except(['show']);
    // });

    // Adviser-only
    Route::middleware('role:adviser')->prefix('adviser')->name('adviser.')->group(function () {
        Route::resource('groups', AdviserGroupController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
    });
});

require __DIR__ . '/auth.php';
