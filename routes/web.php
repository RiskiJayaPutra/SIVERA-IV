<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\AssetTypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ItAssetController;
use App\Http\Controllers\NetworkAssetController;
use App\Http\Controllers\CctvAssetController;
use App\Http\Controllers\LocotrackAssetController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Master Assets & Types
    Route::get('assets', [AssetController::class, 'index'])->name('assets.index');
    Route::resource('asset-types', AssetTypeController::class)->middleware('superadmin');
    
    // Locations
    Route::resource('locations', LocationController::class);
    
    // Batch save generic dynamic assets
    Route::post('locations/{id}/assets/batch', [AssetController::class, 'batchSave'])->name('assets.batch');
    Route::post('assets/global-batch', [AssetController::class, 'globalBatchSave'])->name('assets.global-batch');
    
    // Users
    Route::resource('users', UserController::class)->middleware('superadmin');
    
    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('/reports/preview', [ReportController::class, 'previewExport'])->name('reports.preview');
    Route::post('/reports/export', [ReportController::class, 'export'])->name('reports.export');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/password', [ProfileController::class, 'password'])->name('profile.password');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
