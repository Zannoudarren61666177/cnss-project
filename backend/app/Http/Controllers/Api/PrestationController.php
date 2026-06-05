<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestation;
use Illuminate\Http\Request;

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
}
