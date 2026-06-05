<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Travailleur;
use Illuminate\Http\Request;

class TravailleurController extends Controller
{
    public function index()
    {
        return Travailleur::with(['employeur', 'user'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employeur_id' => ['required', 'exists:employeurs,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'cin' => ['required', 'string', 'max:50', 'unique:travailleurs,cin'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
        ]);

        $data['user_id'] = $request->user()->id;

        return response()->json(Travailleur::create($data), 201);
    }

    public function show(string $id)
    {
        return Travailleur::with(['employeur', 'user'])->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $travailleur = Travailleur::findOrFail($id);

        $data = $request->validate([
            'employeur_id' => ['sometimes', 'required', 'exists:employeurs,id'],
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'cin' => ['sometimes', 'required', 'string', 'max:50', 'unique:travailleurs,cin,' . $travailleur->id],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
        ]);

        $travailleur->update($data);

        return response()->json($travailleur);
    }

    public function destroy(string $id)
    {
        $travailleur = Travailleur::findOrFail($id);
        $travailleur->delete();

        return response()->json(['message' => 'Travailleur supprimé']);
    }
}
