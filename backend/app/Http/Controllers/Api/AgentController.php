<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AgentController extends Controller
{
    public function index()
    {
        return Agent::with('user')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'numero_immatriculation' => ['nullable', 'string', 'max:64'],
            'numero_cnss' => ['nullable', 'string', 'max:64'],
            'email'       => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'    => ['required', 'string', 'min:8'],
            'type'        => ['nullable', 'string', 'max:255'],
            'department'  => ['nullable', 'string', 'max:255'],
            'phone'       => ['nullable', 'string', 'max:50'],
            'nom'         => ['nullable', 'string', 'max:255'],
            'prenoms'     => ['nullable', 'string', 'max:255'],
        ]);

        // accept either `numero_immatriculation` or legacy `numero_cnss`
        $numero = $data['numero_immatriculation'] ?? $data['numero_cnss'] ?? null;

        if (empty($numero)) {
            return response()->json(['message' => "Le champ 'numero_immatriculation' est requis."], 422);
        }

        if (User::where('name', $numero)->where('role', 'agent')->exists()) {
            return response()->json(['message' => "Un agent existe déjà avec ce numéro d'immatriculation."], 409);
        }

        $user = User::create([
            'name'     => $numero,
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => 'agent',
            'statut'   => 'actif',
        ]);

        $agent = Agent::create([
            'user_id'                 => $user->id,
            'type'                    => $data['type'] ?? null,
            'department'              => $data['department'] ?? null,
            'phone'                   => $data['phone'] ?? null,
            'email'                   => $data['email'] ?? null,
            'nom'                     => $data['nom'] ?? null,
            'prenoms'                 => $data['prenoms'] ?? null,
            'numero_immatriculation'  => $numero,
        ]);

        return response()->json($agent->load('user'), 201);
    }

    public function show(string $id)
    {
        return Agent::with('user')->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $agent = Agent::findOrFail($id);

        $data = $request->validate([
            'type' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'nom' => ['nullable', 'string', 'max:255'],
            'prenoms' => ['nullable', 'string', 'max:255'],
            'numero_immatriculation' => ['nullable', 'string', 'max:64'],
            'password' => ['nullable', 'string', 'min:8'],
            'statut' => ['nullable', 'string', 'in:actif,inactif'],
        ]);

        $agent->update([
            'type'       => $data['type'] ?? $agent->type,
            'department' => $data['department'] ?? $agent->department,
            'phone'      => $data['phone'] ?? $agent->phone,
            'email'      => $data['email'] ?? $agent->email,
            'nom'        => $data['nom'] ?? $agent->nom,
            'prenoms'    => $data['prenoms'] ?? $agent->prenoms,
            'numero_immatriculation' => $data['numero_immatriculation'] ?? $agent->numero_immatriculation,
        ]);

        if (isset($data['email']) && $agent->user) {
            $agent->user->update(['email' => $data['email']]);
        }

        if (isset($data['password']) && $agent->user) {
            $agent->user->update(['password' => Hash::make($data['password'])]);
            $agent->update(['password' => Hash::make($data['password'])]);
        }

        if (isset($data['statut']) && $agent->user) {
            $agent->user->update(['statut' => $data['statut']]);
        }

        return response()->json($agent->load('user'));
    }

    public function destroy(string $id)
    {
        $agent = Agent::findOrFail($id);
        $user = $agent->user;
        $agent->delete();

        if ($user) {
            $user->delete();
        }

        return response()->json(['message' => 'Agent supprimé']);
    }
}
