<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cotisation;
use Illuminate\Http\Request;
use App\Helpers\ActivityLogger;

class CotisationController extends Controller
{
    public function index()
    {
        return Cotisation::with('employeur')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employeur_id' => ['required', 'exists:employeurs,id'],
            'montant' => ['required', 'numeric'],
            'mois' => ['required', 'integer', 'between:1,12'],
            'annee' => ['required', 'integer'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        return response()->json(Cotisation::create($data), 201);
    }

    public function show(string $id)
    {
        return Cotisation::with(['employeur', 'details.travailleur'])->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $cotisation = Cotisation::findOrFail($id);

        $data = $request->validate([
            'employeur_id' => ['sometimes', 'required', 'exists:employeurs,id'],
            'montant' => ['sometimes', 'required', 'numeric'],
            'mois' => ['sometimes', 'required', 'integer', 'between:1,12'],
            'annee' => ['sometimes', 'required', 'integer'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $cotisation->update($data);

        return response()->json($cotisation);
    }

    public function destroy(string $id)
    {
        $cotisation = Cotisation::findOrFail($id);
        $cotisation->delete();

        return response()->json(['message' => 'Cotisation supprimée']);
    }

    public function valider(string $id)
    {
        $cotisation = Cotisation::findOrFail($id);
        $cotisation->update(['status' => 'Vérifiée']);

        ActivityLogger::log("Validation déclaration #{$cotisation->id}", 'Cotisation');

        return response()->json([
            'message'    => 'Déclaration validée',
            'cotisation' => $cotisation,
        ]);
    }

    public function relancer(string $id)
    {
        $cotisation = Cotisation::with('employeur.user')->findOrFail($id);

        if (!$cotisation->employeur || !$cotisation->employeur->user) {
            return response()->json(['message' => 'Employeur introuvable'], 404);
        }

        \App\Models\Notification::create([
            'user_id' => $cotisation->employeur->user->id,
            'type'    => 'relance_cotisation',
            'content' => "Rappel : votre déclaration de cotisations pour la période {$cotisation->mois}/{$cotisation->annee} est en retard. Merci de régulariser votre situation.",
            'read_at' => null,
        ]);

        return response()->json(['message' => 'Relance envoyée avec succès']);
    }

    public function parEmployeur(string $employeur_id)
    {
        return response()->json(
            Cotisation::where('employeur_id', $employeur_id)
                ->with('details.travailleur')
                ->orderByDesc('annee')
                ->orderByDesc('mois')
                ->get()
        );
    }

    public function genererPourEmployeur(Request $request)
    {
        $data = $request->validate([
            'employeur_id' => ['required', 'exists:employeurs,id'],
            'mois'         => ['required', 'integer', 'between:1,12'],
            'annee'        => ['required', 'integer'],
        ]);

        $tauxSalarial = 3.6;
        $tauxPatronal = 15.4;

        $travailleurs = \App\Models\Travailleur::where('employeur_id', $data['employeur_id'])
            ->where('statut', 'actif')
            ->whereNotNull('salaire_brut')
            ->get();

        if ($travailleurs->isEmpty()) {
            return response()->json([
                'message' => 'Aucun travailleur actif avec un salaire renseigné pour cet employeur.',
            ], 422);
        }

        $montantTotal = 0;
        $details = [];

        foreach ($travailleurs as $travailleur) {
            $salaire = (float) $travailleur->salaire_brut;
            $montantSalarial = round($salaire * $tauxSalarial / 100, 2);
            $montantPatronal = round($salaire * $tauxPatronal / 100, 2);
            $total = $montantSalarial + $montantPatronal;

            $montantTotal += $total;

            $details[] = [
                'travailleur_id'    => $travailleur->id,
                'salaire_brut'      => $salaire,
                'taux_salarial'     => $tauxSalarial,
                'taux_patronal'     => $tauxPatronal,
                'montant_salarial'  => $montantSalarial,
                'montant_patronal'  => $montantPatronal,
                'montant_total'     => $total,
            ];
        }

        $cotisation = Cotisation::create([
            'employeur_id' => $data['employeur_id'],
            'montant'      => $montantTotal,
            'mois'         => $data['mois'],
            'annee'        => $data['annee'],
            'status'       => 'En attente',
            'reference'    => 'CTS-' . $data['annee'] . str_pad($data['mois'], 2, '0', STR_PAD_LEFT) . '-' . $data['employeur_id'],
            'echeance'     => now()->setDate($data['annee'], $data['mois'], 1)->endOfMonth()->addDays(15),
        ]);

        foreach ($details as $detail) {
            $detail['cotisation_id'] = $cotisation->id;
            \App\Models\CotisationDetail::create($detail);
        }

        return response()->json([
            'message'    => 'Cotisation générée avec succès',
            'cotisation' => $cotisation->load('details.travailleur'),
        ], 201);
    }
}