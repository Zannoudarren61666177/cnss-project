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
use App\Http\Controllers\Api\TravailleurProfilController;

Route::prefix('v1')->group(function () {

    // ─── Routes PUBLIQUES ───────────────────────────────────────────────────
    Route::post('auth/login',    [AuthController::class, 'login']);
    Route::post('auth/register', [AuthController::class, 'register']);

    Route::get('slides',                [SlideController::class,      'index']);
    Route::get('recherche',             [SearchController::class,     'rechercher']);
    Route::post('chatbot',              [ChatbotController::class,    'repondre']);
    Route::get('prestations/publiques', [PrestationController::class, 'publiques']);

    Route::post('employeurs/activer-compte',    [EmployeurController::class,   'activerCompte']);
    Route::post('travailleurs/activer-compte',  [TravailleurController::class, 'activerCompte']);
    Route::post('employeurs/demander-adhesion', [EmployeurController::class,   'demanderAdhesion']);

    // FAQ — public (dev)
    Route::get('faqs',         [FaqController::class, 'index']);
    Route::get('faqs/{id}',    [FaqController::class, 'show']);
    Route::post('faqs',        [FaqController::class, 'store']);
    Route::put('faqs/{id}',    [FaqController::class, 'update']);
    Route::delete('faqs/{id}', [FaqController::class, 'destroy']);

    // Actualités — public (dev)
    Route::get('actualites',         [ActualiteController::class, 'index']);
    Route::get('actualites/{id}',    [ActualiteController::class, 'show']);
    Route::post('actualites',        [ActualiteController::class, 'store']);
    Route::put('actualites/{id}',    [ActualiteController::class, 'update']);
    Route::delete('actualites/{id}', [ActualiteController::class, 'destroy']);

    // ─── Routes PRIVÉES ─────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('auth/logout',          [AuthController::class, 'logout']);
        Route::get('auth/user',             [AuthController::class, 'user']);
        Route::post('auth/change-password', [AuthController::class, 'changePassword']);
        Route::put('auth/profile',          [AuthController::class, 'updateProfile']);
        Route::put('auth/preferences',      [AuthController::class, 'updatePreferences']);

        // Stats & Logs
        Route::get('stats',         [StatsController::class, 'index']);
        Route::get('activity-logs', function () {
            return \App\Models\ActivityLog::with('user')->latest()->limit(50)->get();
        });

        // Travailleurs — routes spécifiques AVANT apiResource
        Route::get('travailleurs/en-attente',                   [TravailleurController::class, 'enAttente']);
        Route::get('travailleurs/par-employeur/{employeur_id}', [TravailleurController::class, 'parEmployeur']);
        Route::post('travailleurs/{id}/valider',                [TravailleurController::class, 'valider']);
        Route::post('travailleurs/{id}/rejeter',                [TravailleurController::class, 'rejeter']);
        Route::post('travailleurs/{id}/renvoyer-attestation',   [TravailleurController::class, 'renvoyerAttestation']);
        Route::get('travailleurs/{id}/attestation',             [TravailleurController::class, 'telechargerAttestation']);

        // Employeurs — routes spécifiques AVANT apiResource
        Route::get('employeurs/mon-attestation', [EmployeurController::class, 'telechargerAttestation']);
        Route::post('employeurs/{id}/valider',   [EmployeurController::class, 'valider']);
        Route::post('employeurs/{id}/rejeter',   [EmployeurController::class, 'rejeter']);

        // Cotisations — routes spécifiques AVANT apiResource
        Route::get('cotisations/par-employeur/{employeur_id}',        [CotisationController::class, 'parEmployeur']);
        Route::post('cotisations/generer',                             [CotisationController::class, 'genererPourEmployeur']);
        Route::post('cotisations/{id}/valider',                        [CotisationController::class, 'valider']);
        Route::post('cotisations/{id}/relancer',                       [CotisationController::class, 'relancer']);
        Route::post('cotisations/{id}/initier-paiement',               [CotisationController::class, 'initierPaiement']);
        Route::post('cotisations/{id}/verifier-paiement',              [CotisationController::class, 'verifierPaiement']);
        Route::match(['get', 'post'], 'cotisations/paiement/callback', [CotisationController::class, 'callbackPaiement']);

        // Prestations — routes spécifiques AVANT apiResource
        Route::post('prestations/demander',           [PrestationController::class, 'demander']);        // ← travailleur soumet
        Route::get('prestations/mes-prestations',     [PrestationController::class, 'mesPrestations']); // ← travailleur consulte
        Route::post('prestations/{id}/valider',       [PrestationController::class, 'valider']);
        Route::post('prestations/{id}/rejeter',       [PrestationController::class, 'rejeter']);

        // Espace travailleur connecté
        Route::get('travailleur/profil',      [TravailleurProfilController::class, 'monProfil']);
        Route::get('travailleur/cotisations', [TravailleurProfilController::class, 'mesCotisations']);
        Route::get('travailleur/droits',      [TravailleurProfilController::class, 'mesDroits']);
        Route::get('travailleur/attestation', [TravailleurProfilController::class, 'monAttestation']);

        // Resources
        Route::apiResource('employeurs',   EmployeurController::class);
        Route::apiResource('travailleurs', TravailleurController::class);
        Route::apiResource('agents',       AgentController::class);
        Route::apiResource('cotisations',  CotisationController::class);
        Route::apiResource('prestations',  PrestationController::class);

        // Notifications
        Route::get('notifications',                      [NotificationController::class, 'index']);
        Route::post('notifications/marquer-toutes-lues', [NotificationController::class, 'marquerToutesLues']);
        Route::post('notifications/{id}/marquer-lue',    [NotificationController::class, 'marquerLue']);
        Route::delete('notifications/{id}',              [NotificationController::class, 'destroy']);
    });
});