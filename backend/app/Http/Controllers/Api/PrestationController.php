<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestation;
use Illuminate\Http\Request;
use App\Helpers\ActivityLogger;

class PrestationController extends Controller
{
    public function index()
    {
        return Prestation::with('travailleur')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'travailleur_id' => ['required', 'exists:travailleurs,id'],
            'type' => ['required', 'string', 'max:255'],
            'montant' => ['required', 'numeric'],
            'status' => ['nullable', 'string', 'max:50'],
            'date_debut' => ['nullable', 'date'],
            'date_fin' => ['nullable', 'date'],
        ]);

        return response()->json(Prestation::create($data), 201);
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
            'type' => ['sometimes', 'required', 'string', 'max:255'],
            'montant' => ['sometimes', 'required', 'numeric'],
            'status' => ['nullable', 'string', 'max:50'],
            'date_debut' => ['nullable', 'date'],
            'date_fin' => ['nullable', 'date'],
        ]);

        $prestation->update($data);

        return response()->json($prestation);
    }

    public function destroy(string $id)
    {
        $prestation = Prestation::findOrFail($id);
        $prestation->delete();

        return response()->json(['message' => 'Prestation supprimée']);
    }
    public function valider(string $id)
{
    $prestation = Prestation::findOrFail($id);
    $prestation->update(['status' => 'Approuvée']);
    ActivityLogger::log("Approbation prestation #{$prestation->id}", 'Prestations');

    return response()->json([
        'message'    => 'Prestation approuvée',
        'prestation' => $prestation,
    ]);
}

public function rejeter(string $id)
{
    $prestation = Prestation::findOrFail($id);
    $prestation->update(['status' => 'Rejetée']);
    ActivityLogger::log("Rejet prestation #{$prestation->id}", 'Prestations');

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
}
