<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeurController;
use App\Http\Controllers\Api\TravailleurController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\CotisationController;
use App\Http\Controllers\Api\PrestationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SlideController;
use App\Http\Controllers\Api\ActualiteController;

Route::prefix('v1')->group(function () {

    // ─── Routes PUBLIQUES (sans authentification) ───
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/register', [AuthController::class, 'register']);

    Route::get('slides', [SlideController::class, 'index']);
    Route::get('actualites', [ActualiteController::class, 'index']);
    Route::get('prestations/publiques', [PrestationController::class, 'publiques']);

    // ─── Routes PRIVÉES (authentification requise) ───
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/user', [AuthController::class, 'user']);

        Route::apiResource('employeurs', EmployeurController::class);
        Route::apiResource('travailleurs', TravailleurController::class);
        Route::apiResource('agents', AgentController::class);
        Route::apiResource('cotisations', CotisationController::class);
        Route::apiResource('prestations', PrestationController::class);
        Route::get('notifications', [NotificationController::class, 'index']);
    });
});