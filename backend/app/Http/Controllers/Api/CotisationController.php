<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cotisation;
use Illuminate\Http\Request;

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
        return Cotisation::with('employeur')->findOrFail($id);
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
}
