<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $credentials = $request->validate([
        'numero_cnss' => ['required', 'string'],
        'password'    => ['required', 'string'],
    ]);

    $numeroCnss = trim($credentials['numero_cnss']);
    $user = null;

    if (str_starts_with($numeroCnss, 'AGT-')) {
        $user = User::whereIn('role', ['agent', 'admin'])
            ->where('name', $numeroCnss)
            ->first();
    } else {
        $employeur = \App\Models\Employeur::where('numero_cnss', $numeroCnss)->first();
        if ($employeur && $employeur->user_id) {
            $user = User::find($employeur->user_id);
        }

        if (! $user) {
            $travailleur = \App\Models\Travailleur::where('numero_cnss', $numeroCnss)->first();
            if ($travailleur && $travailleur->user_id) {
                $user = User::find($travailleur->user_id);
            }
        }
    }

    if (! $user || ! Hash::check($credentials['password'], $user->password)) {
        throw ValidationException::withMessages([
            'numero_cnss' => ['Numéro CNSS ou mot de passe incorrect.'],
        ]);
    }

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'user'  => $this->serializeUser($user),
        'token' => $token,
    ]);
}
  public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public function user(Request $request)
{
    return response()->json($this->serializeUser($request->user()));
}

private function serializeUser(User $user): array
{
    $userData = $user->toArray();

    switch ($user->role) {
        case 'employeur':
            $userData['employeur'] = $user->employeur;
            break;
        case 'travailleur':
            $userData['travailleur'] = $user->travailleur;
            break;
        case 'agent':
            $agent = $user->agent;
            $userData['agent_type'] = $agent?->type;
            break;
    }

    return $userData;
}

public function changerMotDePasse(Request $request)
{
    $data = $request->validate([
        'current_password' => ['required', 'string'],
        'new_password'      => ['required', 'string', 'min:8'],
    ]);

    $user = $request->user();

    if (! \Illuminate\Support\Facades\Hash::check($data['current_password'], $user->password)) {
        return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
    }

    $user->update(['password' => $data['new_password']]);

    return response()->json(['message' => 'Mot de passe modifié avec succès.']);
}
}
