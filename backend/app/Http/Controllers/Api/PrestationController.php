<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestation;
use App\Models\Travailleur;
use Illuminate\Http\Request;
use App\Helpers\ActivityLogger;

class PrestationController extends Controller
{
    public function index()
    {
        return Prestation::with('travailleur')->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'travailleur_id' => ['required', 'exists:travailleurs,id'],
            'type'           => ['required', 'string', 'max:255'],
            'montant'        => ['required', 'numeric'],
            'status'         => ['nullable', 'string', 'max:50'],
            'date_debut'     => ['nullable', 'date'],
            'date_fin'       => ['nullable', 'date'],
            'motif'          => ['nullable', 'string'],
        ]);

        $data['reference'] = 'PREST-' . strtoupper(uniqid());
        $data['status']    = $data['status'] ?? 'En attente';

        return response()->json(Prestation::create($data), 201);
    }

    // ← Route pour qu'un travailleur soumette une demande
    public function demander(Request $request)
    {
        $user = $request->user();

        // Récupérer le travailleur lié à l'utilisateur connecté
        $travailleur = Travailleur::where('user_id', $user->id)->first();

        if (!$travailleur) {
            return response()->json(['message' => 'Profil travailleur introuvable.'], 404);
        }

        if ($travailleur->statut !== 'actif') {
            return response()->json(['message' => 'Votre compte doit être actif pour soumettre une demande.'], 403);
        }

        $data = $request->validate([
            'type'       => ['required', 'string', 'max:255'],
            'montant'    => ['required', 'numeric', 'min:0'],
            'motif'      => ['required', 'string', 'max:1000'],
            'date_debut' => ['nullable', 'date'],
            'date_fin'   => ['nullable', 'date', 'after_or_equal:date_debut'],
        ]);

        $prestation = Prestation::create([
            'travailleur_id' => $travailleur->id,
            'type'           => $data['type'],
            'montant'        => $data['montant'],
            'motif'          => $data['motif'],
            'date_debut'     => $data['date_debut'] ?? null,
            'date_fin'       => $data['date_fin'] ?? null,
            'status'         => 'En attente',
            'reference'      => 'PREST-' . strtoupper(uniqid()),
        ]);

        ActivityLogger::log("Demande de prestation {$prestation->reference} soumise", 'Prestations');

        return response()->json([
            'message'    => 'Demande soumise avec succès.',
            'prestation' => $prestation->load('travailleur'),
        ], 201);
    }

    public function show(string $id)
    {
        return Prestation::with('travailleur')->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $prestation = Prestation::findOrFail($id);
        $data = $request->validate([
            'travailleur_id' => ['sometimes', 'required', 'exists:travailleurs,id'],
            'type'           => ['sometimes', 'required', 'string', 'max:255'],
            'montant'        => ['sometimes', 'required', 'numeric'],
            'status'         => ['nullable', 'string', 'max:50'],
            'date_debut'     => ['nullable', 'date'],
            'date_fin'       => ['nullable', 'date'],
            'motif'          => ['nullable', 'string'],
        ]);
        $prestation->update($data);
        return response()->json($prestation);
    }

    public function destroy(string $id)
    {
        Prestation::findOrFail($id)->delete();
        return response()->json(['message' => 'Prestation supprimée']);
    }

    public function valider(string $id)
    {
        $prestation = Prestation::findOrFail($id);
        $prestation->update(['status' => 'Approuvée']);
        ActivityLogger::log("Approbation prestation #{$prestation->reference}", 'Prestations');
        return response()->json(['message' => 'Prestation approuvée', 'prestation' => $prestation]);
    }

    public function rejeter(Request $request, string $id)
    {
        $prestation = Prestation::findOrFail($id);
        $raison = $request->input('raison', '');
        $prestation->update([
            'status'        => 'Rejetée',
            'raison_rejet'  => $raison,
        ]);
        ActivityLogger::log("Rejet prestation #{$prestation->reference}", 'Prestations');
        return response()->json(['message' => 'Prestation rejetée']);
    }

    public function publiques()
    {
        return response()->json(
            Prestation::where('status', 'Approuvée')
                ->with('travailleur')
                ->get(['id', 'type', 'montant', 'date_debut', 'date_fin'])
        );
    }

    // Mes prestations (travailleur connecté)
    public function mesPrestations(Request $request)
    {
        $user = $request->user();
        $travailleur = Travailleur::where('user_id', $user->id)->first();

        if (!$travailleur) {
            return response()->json([]);
        }

        return response()->json(
            Prestation::where('travailleur_id', $travailleur->id)
                ->latest()
                ->get()
        );
    }
}