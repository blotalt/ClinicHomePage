<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AppointmentRequestController;
use App\Http\Controllers\Admin\ContentItemController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DatabaseController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PageContentController;
use App\Http\Controllers\Admin\ServiceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('database', [DatabaseController::class, 'index'])->name('database');
        Route::get('history', [ActivityLogController::class, 'index'])->name('history.index');
        Route::delete('history', [ActivityLogController::class, 'clear'])->name('history.clear');
        Route::post('media/upload', [MediaController::class, 'upload'])->name('media.upload');

        // Section copy for one page, edited as a single form.
        Route::get('pages/{group}', [PageContentController::class, 'edit'])
            ->name('pages.edit');
        Route::put('pages/{group}', [PageContentController::class, 'update'])
            ->name('pages.update');

        // Services have their own table and relations.
        Route::get('services', [ServiceController::class, 'index'])
            ->name('services.index');
        Route::get('services/create', [ServiceController::class, 'create'])
            ->name('services.create');
        Route::post('services', [ServiceController::class, 'store'])
            ->name('services.store');
        Route::post('services/reorder', [ServiceController::class, 'reorder'])
            ->name('services.reorder');
        Route::get('services/{service}/edit', [ServiceController::class, 'edit'])
            ->name('services.edit');
        Route::put('services/{service}', [ServiceController::class, 'update'])
            ->name('services.update');
        Route::delete('services/{service}', [ServiceController::class, 'destroy'])
            ->name('services.destroy');

        // Repeatable CMS blocks: pillars, highlights, clinic details.
        Route::get('content/{collection}', [ContentItemController::class, 'index'])
            ->name('content.index');
        Route::get('content/{collection}/create', [ContentItemController::class, 'create'])
            ->name('content.create');
        Route::post('content/{collection}', [ContentItemController::class, 'store'])
            ->name('content.store');
        Route::post('content/{collection}/reorder', [ContentItemController::class, 'reorder'])
            ->name('content.reorder');
        Route::get('content/{collection}/{item}/edit', [ContentItemController::class, 'edit'])
            ->name('content.edit');
        Route::put('content/{collection}/{item}', [ContentItemController::class, 'update'])
            ->name('content.update');
        Route::delete('content/{collection}/{item}', [ContentItemController::class, 'destroy'])
            ->name('content.destroy');

        Route::get('requests', [AppointmentRequestController::class, 'index'])
            ->name('requests.index');
        Route::get('requests/{appointmentRequest}', [AppointmentRequestController::class, 'show'])
            ->name('requests.show');
        Route::delete('requests/{appointmentRequest}', [AppointmentRequestController::class, 'destroy'])
            ->name('requests.destroy');
    });
