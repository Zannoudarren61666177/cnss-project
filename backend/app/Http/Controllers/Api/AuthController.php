<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employeur;
use App\Models\Travailleur;
use App\Models\Agent;
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

        // Only numeric CNSS numbers are supported
        $onlyDigits = preg_match('/^[0-9]+$/', $numeroCnss);

        if (! $onlyDigits) {
            throw ValidationException::withMessages([
                'numero_cnss' => ['Numéro CNSS invalide. Il doit contenir uniquement des chiffres.'],
            ]);
        }

        $len = strlen($numeroCnss);

        // Employeurs: exactly 8 digits
        if ($len === 8) {
            $employeur = Employeur::where('numero_cnss', $numeroCnss)->first();
            if ($employeur && $employeur->user_id) {
                $user = User::find($employeur->user_id);
            }
        }

        // Agents: 10-12 digits. First try to match a User by name (legacy simple mapping), then Travailleur.
        if (! $user && $len >= 10 && $len <= 12) {
            // Agent user accounts may be stored with the numeric identifier in the `name` field
            $user = User::whereIn('role', ['agent', 'admin'])
                ->where('name', $numeroCnss)
                ->first();

            // If not an agent account, try travailleur
            if (! $user) {
                $travailleur = Travailleur::where('numero_cnss', $numeroCnss)->first();
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
            'numero_cnss' => ['required', 'numeric', 'digits_between:8,12'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        // Determine user type based on CNSS number length
        $cnssLength = strlen($data['numero_cnss']);
        
        if ($cnssLength === 8) {
            $role = 'employeur';
        } else if ($cnssLength >= 10 && $cnssLength <= 12) {
            $role = 'travailleur';
        } else {
            return response()->json([
                'message' => 'Format de numéro CNSS invalide. Employeur: 8 chiffres, Travailleur/Agent: 10-12 chiffres'
            ], 422);
        }

        try {
            // Create user
            $user = User::create([
                'name' => $data['email'] ?? 'User',
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $role,
                'statut' => 'actif',
            ]);

            // Create corresponding profile entry
            if ($role === 'employeur') {
                Employeur::create([
                    'user_id' => $user->id,
                    'numero_cnss' => $data['numero_cnss'],
                    'password' => Hash::make($data['password']),
                    'ifu' => 'EN ATTENTE',
                    'company_name' => $data['email'],
                    'statut' => 'actif',
                ]);
            } else if ($role === 'travailleur') {
                Travailleur::create([
                    'user_id' => $user->id,
                    'numero_cnss' => $data['numero_cnss'],
                    'password' => Hash::make($data['password']),
                    'first_name' => 'User',
                    'last_name' => '',
                    'statut' => 'actif',
                ]);
            }

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'message' => 'Compte créé avec succès',
                'user' => $this->serializeUser($user),
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du compte',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Mot de passe actuel incorrect.',
            ], 422);
        }

        // Update user password
        $user->update([
            'password' => Hash::make($data['new_password']),
        ]);

        // Also update password in specific table if it exists
        if ($user->role === 'employeur' && $user->employeur) {
            $user->employeur->update([
                'password' => Hash::make($data['new_password']),
            ]);
        } else if ($user->role === 'travailleur' && $user->travailleur) {
            $user->travailleur->update([
                'password' => Hash::make($data['new_password']),
            ]);
        } else if ($user->role === 'agent' && $user->agent) {
            $user->agent->update([
                'password' => Hash::make($data['new_password']),
            ]);
        }

        return response()->json([
            'message' => 'Mot de passe changé avec succès.',
        ], 200);
    }

    public function user(Request $request)
{
    return response()->json($this->serializeUser($request->user()));
}

private function serializeUser(User $user): array
{
    // Force load relations
    $user->load('employeur', 'travailleur', 'agent');
    
    $userData = $user->toArray();

    switch ($user->role) {
        case 'employeur':
            $userData['profile'] = $user->employeur?->toArray();
            break;
        case 'travailleur':
            $userData['profile'] = $user->travailleur?->toArray();
            break;
        case 'agent':
            $userData['profile'] = $user->agent?->toArray();
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
