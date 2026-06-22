<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Travailleur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class TravailleurController extends Controller
{
    public function index()
    {
        return Travailleur::with(['employeur', 'user'])->get();
    }

   public function store(Request $request)
{
    $data = $request->validate([
        'employeur_id'      => ['required', 'exists:employeurs,id'],
        'first_name'        => ['required', 'string', 'max:255'],
        'last_name'         => ['required', 'string', 'max:255'],
        'cin'               => ['required', 'string', 'max:50', 'unique:travailleurs,cin'],
        'phone'             => ['nullable', 'string', 'max:50'],
        'email'             => ['nullable', 'email', 'max:255'],
        'position'          => ['nullable', 'string', 'max:255'],
        'date_naissance'    => ['nullable', 'date'],
        'lieu_naissance'    => ['nullable', 'string', 'max:255'],
        'sexe'              => ['nullable', 'in:M,F'],
        'nationalite'       => ['nullable', 'string', 'max:255'],
        'adresse'           => ['nullable', 'string', 'max:255'],
        'ville'             => ['nullable', 'string', 'max:255'],
        'type_contrat'      => ['nullable', 'string', 'max:50'],
        'date_embauche'     => ['nullable', 'date'],
        'salaire_brut'      => ['nullable', 'numeric', 'min:0'],
        'categorie_emploi'  => ['nullable', 'string', 'max:100'],
        'piece_identite'    => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        'password'          => ['nullable', 'string', 'min:8'],
    ]);

    if ($request->hasFile('piece_identite')) {
        $data['piece_identite'] = $request->file('piece_identite')->store('pieces-identite', 'public');
    }

    $data['statut'] = 'en_attente';

    // If email and password provided, create a linked User so the travailleur can login
    if (!empty($data['email']) && !empty($data['password'])) {
        // avoid creating duplicate user with same email
        $user = User::where('email', $data['email'])->first();
        if (! $user) {
            $user = User::create([
                'name' => ($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''),
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'travailleur',
                'statut' => 'actif',
            ]);
        }

        $data['user_id'] = $user->id;
        // remove raw password before creating record
        unset($data['password']);
    }

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
    public function parEmployeur(string $employeur_id)
{
    return response()->json(
        \App\Models\Travailleur::where('employeur_id', $employeur_id)
            ->with('user')
            ->get()
    );
}
}
