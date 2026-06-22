<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employeur;
use App\Models\Travailleur;
use App\Models\Cotisation;
use App\Models\Prestation;
use App\Models\Agent;

class StatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'employeurs' => [
                'total'      => Employeur::count(),
                'en_attente' => Employeur::where('statut', 'en_attente')->count(),
                'valides'    => Employeur::where('statut', 'validee')->count(),
                'rejetes'    => Employeur::where('statut', 'rejetee')->count(),
            ],
            'travailleurs' => [
                'total'  => Travailleur::count(),
                'actifs' => Travailleur::where('statut', 'actif')->count(),
            ],
            'cotisations' => [
                'total'          => Cotisation::count(),
                'en_attente'     => Cotisation::where('status', 'En attente')->count(),
                'en_retard'      => Cotisation::where('status', 'En retard')->count(),
                'verifiees'      => Cotisation::where('status', 'Vérifiée')->count(),
                'total_encaisse' => Cotisation::where('status', 'Vérifiée')->sum('montant'),

                // Répartition par statut (pour le PieChart)
                'par_statut' => Cotisation::selectRaw('status, COUNT(*) as total')
                    ->groupBy('status')
                    ->get()
                    ->map(fn ($row) => ['name' => $row->status ?? 'Non défini', 'value' => $row->total]),

                // Évolution mensuelle (pour le graphique en barres)
                'par_mois' => Cotisation::selectRaw('mois, annee, SUM(montant) as total')
                    ->groupBy('annee', 'mois')
                    ->orderBy('annee')->orderBy('mois')
                    ->get()
                    ->map(fn ($row) => ['periode' => "{$row->mois}/{$row->annee}", 'total' => (float) $row->total]),
            ],
            'prestations' => [
                'total'       => Prestation::count(),
                'en_attente'  => Prestation::where('status', 'En attente')->count(),
                'approuvees'  => Prestation::where('status', 'Approuvée')->count(),
                'total_verse' => Prestation::where('status', 'Approuvée')->sum('montant'),

                // Répartition par type (pour le PieChart)
                'par_type' => Prestation::selectRaw('type, COUNT(*) as total')
                    ->groupBy('type')
                    ->get()
                    ->map(fn ($row) => ['name' => $row->type, 'value' => $row->total]),
            ],
            'agents' => [
                'total' => Agent::count(),
            ],
        ]);
    }
}