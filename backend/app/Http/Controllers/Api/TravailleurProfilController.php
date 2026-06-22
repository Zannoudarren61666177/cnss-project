<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cotisation;
use App\Models\CotisationDetail;
use Illuminate\Http\Request;

class TravailleurProfilController extends Controller
{
    /**
     * Profil complet du travailleur connecté + employeur actuel
     */
    public function monProfil(Request $request)
    {
        $user = $request->user()->load('travailleur.employeur');
        $travailleur = $user->travailleur;

        if (!$travailleur) {
            return response()->json(['message' => 'Profil travailleur introuvable.'], 404);
        }

        return response()->json([
            'travailleur' => $travailleur,
            'employeur'   => $travailleur->employeur,
        ]);
    }

    /**
     * Cotisations récentes concernant ce travailleur
     * (via cotisation_details liées à ses cotisations employeur)
     */
    public function mesCotisations(Request $request)
    {
        $travailleur = $request->user()->travailleur;

        if (!$travailleur) {
            return response()->json([], 200);
        }

        $details = CotisationDetail::with('cotisation')
            ->where('travailleur_id', $travailleur->id)
            ->orderByDesc('created_at')
            ->limit(12)
            ->get()
            ->map(fn($d) => [
                'mois'              => $d->cotisation->mois ?? null,
                'annee'             => $d->cotisation->annee ?? null,
                'salaire_brut'      => $d->salaire_brut,
                'montant_salarial'  => $d->montant_salarial,
                'montant_patronal'  => $d->montant_patronal,
                'montant_total'     => $d->montant_total,
                'statut'            => $d->cotisation->status ?? null,
            ]);

        return response()->json($details);
    }

    /**
     * Droits et éligibilité aux prestations CNSS
     * Calculés selon le nombre de mois cotisés
     */
    public function mesDroits(Request $request)
    {
        $travailleur = $request->user()->travailleur;

        if (!$travailleur) {
            return response()->json([], 200);
        }

        // Nombre de mois cotisés réels
        $moisCotises = CotisationDetail::where('travailleur_id', $travailleur->id)->count();

        // Calcul de la date d'affiliation
        $dateAffiliation = $travailleur->date_embauche
            ? \Carbon\Carbon::parse($travailleur->date_embauche)
            : \Carbon\Carbon::parse($travailleur->created_at);

        $droits = [
            [
                'nom'          => 'Prestations familiales',
                'description'  => 'Allocations pour soutenir les charges de famille et la maternité.',
                'eligible'     => $moisCotises >= 6,
                'condition'    => '6 mois de cotisations requis',
                'mois_cotises' => $moisCotises,
                'mois_requis'  => 6,
            ],
            [
                'nom'          => 'Risques professionnels',
                'description'  => 'Couverture en cas d\'accident du travail ou maladie professionnelle.',
                'eligible'     => true, // Actif dès le premier jour d'affiliation
                'condition'    => 'Actif dès l\'affiliation',
                'mois_cotises' => $moisCotises,
                'mois_requis'  => 0,
            ],
            [
                'nom'          => 'Branche des pensions',
                'description'  => 'Pension de vieillesse, invalidité et survivants après 180 mois de cotisations.',
                'eligible'     => $moisCotises >= 180,
                'condition'    => '180 mois de cotisations requis',
                'mois_cotises' => $moisCotises,
                'mois_requis'  => 180,
            ],
        ];

        return response()->json([
            'mois_cotises'     => $moisCotises,
            'date_affiliation' => $dateAffiliation->format('d/m/Y'),
            'droits'           => $droits,
        ]);
    }

    /**
     * Attestation d'affiliation du travailleur (PDF)
     */
    public function monAttestation(Request $request)
    {
        $user = $request->user()->load('travailleur.employeur');
        $travailleur = $user->travailleur;

        if (!$travailleur) {
            return response()->json(['message' => 'Profil travailleur introuvable.'], 404);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.attestation-travailleur', [
            'travailleur' => $travailleur,
            'employeur'   => $travailleur->employeur,
        ]);

        return $pdf->download("attestation-cnss-{$travailleur->numero_cnss}.pdf");
    }
}