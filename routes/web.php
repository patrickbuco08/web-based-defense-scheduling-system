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
use Bocum\Http\Controllers\Auth\AuthenticatedSessionController;
use Bocum\Http\Controllers\DepartmentController;
use Bocum\Http\Controllers\Admin\PermissionController;
use Bocum\Http\Controllers\Admin\RoleController;
use Bocum\Http\Controllers\CriticController;
use Bocum\Http\Controllers\ReportController;
use Bocum\Http\Controllers\LogsController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/app');
    }
    return redirect()->route('login');
});

// routes/web.php (dev only)
// php artisan make:mail DefenseScheduleCancelled --markdown=mail.defenses.cancelled
Route::get('/test-mail', function () {
    $defense = \Bocum\Models\Defense::with(['adviser', 'panelists'])->where('status', 'approved')->first();

    if (!$defense) {
        return 'No approved defense found.';
    }

    // Get all unique recipient emails
    $recipients = collect([$defense->adviser])
        ->merge($defense->panelists)
        ->filter()
        ->pluck('email')
        ->unique()
        ->values()
        ->all();

    if (empty($recipients)) {
        return 'No valid email recipients found for this defense.';
    }

    // Send a single email to all recipients
    Illuminate\Support\Facades\Mail::to($recipients)
        ->queue(new \Bocum\Mail\DefenseScheduleApproved($defense));

    return 'Sent email to ' . count($recipients) . ' recipients. Check Mailtrap.';
})->middleware('auth');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/app/{any?}', function () {
        return view('app.index');
    })->where('any', '.*')->name('app');

    Route::get('/user', [AuthenticatedSessionController::class, 'getUser']);

    Route::get('/accounts/departments', [AccountController::class, 'getAccountsByDepartment'])->name('accounts.departments');
    Route::resource('accounts', AccountController::class)
        ->parameters(['accounts' => 'user'])
        ->except(['show']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('terms/active', [TermController::class, 'activeTerm'])->name('terms.active');
    Route::resource('terms', TermController::class)->except(['show', 'create', 'edit']);

    Route::resource('departments', DepartmentController::class)->except(['show', 'create', 'edit']);

    Route::get('critics', [CriticController::class, 'index'])->name('critics.index');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/export/csv', [ReportController::class, 'exportCsv'])->name('reports.export.csv');
    Route::get('reports/export/xlsx', [ReportController::class, 'exportXlsx'])->name('reports.export.xlsx');

    Route::get('logs', [LogsController::class, 'index'])->name('logs.index');
    Route::get('logs/export/csv', [LogsController::class, 'exportCsv'])->name('logs.export.csv');
    Route::get('logs/export/xlsx', [LogsController::class, 'exportXlsx'])->name('logs.export.xlsx');

    Route::post('defenses/{defense}/check-conflicts', [DefenseController::class, 'checkConflicts'])->name('defenses.conflicts.check');
    Route::get('defenses/departments', [DefenseController::class, 'departmentIndex'])->name('defenses.departmentIndex');
    Route::resource('defenses', DefenseController::class)->only(['index', 'show', 'create', 'store', 'destroy', 'update']);

    Route::resource('rooms', RoomController::class)->except(['show']);

    // Admin-only
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::patch('rooms/{room}/toggle-status', [RoomController::class, 'toggleStatus'])->name('rooms.toggle-status');
        Route::resource('roles', RoleController::class)->except(['edit', 'create']);
        Route::get('permissions', [PermissionController::class, 'index']);
    });

    // Adviser-only
    Route::middleware('role:adviser')->prefix('adviser')->name('adviser.')->group(function () {
        Route::resource('groups', AdviserGroupController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
    });
});

require __DIR__ . '/auth.php';
