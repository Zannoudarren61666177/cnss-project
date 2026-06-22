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
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\SearchController;

Route::prefix('v1')->group(function () {

    // ─── Routes PUBLIQUES ───────────────────────────────────────────────────
    Route::post('auth/login',    [AuthController::class, 'login']);
    Route::post('auth/register', [AuthController::class, 'register']);

    Route::get('slides',               [SlideController::class,    'index']);
    Route::get('actualites',           [ActualiteController::class, 'index']);
    Route::get('prestations/publiques',[PrestationController::class,'publiques']);
    Route::get('faqs', [FaqController::class, 'index']);
    Route::post('employeurs/activer-compte', [EmployeurController::class, 'activerCompte']);
    Route::get('recherche', [SearchController::class, 'rechercher']);
    Route::get('recherche', [SearchController::class, 'rechercher']);
    Route::post('chatbot', [ChatbotController::class, 'repondre']);
    Route::post('employeurs/demander-adhesion', [EmployeurController::class, 'demanderAdhesion']);
    Route::post('employeurs/demander-adhesion', [EmployeurController::class, 'demanderAdhesion']);

    // ─── Routes PRIVÉES ─────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/user',    [AuthController::class, 'user']);
        Route::post('auth/change-password', [AuthController::class, 'changePassword']);
        Route::apiResource('faqs', FaqController::class)->except(['index']);
        Route::get('activity-logs', function () {
    return \App\Models\ActivityLog::with('user')->latest()->limit(20)->get();
});

        // Stats
        Route::get('stats', [StatsController::class, 'index']);

        // Validation employeurs (avant apiResource)
        Route::post('employeurs/{id}/valider', [EmployeurController::class, 'valider']);
        Route::post('employeurs/{id}/rejeter', [EmployeurController::class, 'rejeter']);

        // Validation cotisations (avant apiResource)
        Route::post('cotisations/{id}/valider', [CotisationController::class, 'valider']);
        Route::post('cotisations/{id}/relancer', [CotisationController::class, 'relancer']);

        // Validation prestations (avant apiResource)
        Route::post('prestations/{id}/valider', [PrestationController::class, 'valider']);
        Route::post('prestations/{id}/rejeter', [PrestationController::class, 'rejeter']);
        Route::post('cotisations/generer', [CotisationController::class, 'genererPourEmployeur']);
        Route::get('cotisations/par-employeur/{employeur_id}', [CotisationController::class, 'parEmployeur']);

        // Travailleurs par employeur (avant apiResource)
        Route::get('travailleurs/par-employeur/{employeur_id}', [TravailleurController::class, 'parEmployeur']);


        // Resources
        Route::apiResource('employeurs',  EmployeurController::class);
        Route::apiResource('travailleurs', TravailleurController::class);
        Route::apiResource('agents',      AgentController::class);
        Route::apiResource('cotisations', CotisationController::class);
        Route::apiResource('prestations', PrestationController::class);

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/marquer-toutes-lues', [NotificationController::class, 'marquerToutesLues']);
        Route::post('notifications/{id}/marquer-lue', [NotificationController::class, 'marquerLue']);
        Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);
        Route::get('employeurs/mon-attestation', [EmployeurController::class, 'telechargerAttestation']);
        Route::post('auth/changer-mot-de-passe', [AuthController::class, 'changerMotDePasse']);

    });
});