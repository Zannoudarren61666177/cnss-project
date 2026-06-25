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
        'numero_cnss' => ['required', 'string'],
        'email'       => ['required', 'email', 'max:255', 'unique:users,email'],
        'password'    => ['required', 'string', 'min:8'],
    ]);

    $numeroCnss = trim($data['numero_cnss']);

    // Vérifie que le numéro contient seulement des chiffres
    if (!preg_match('/^[0-9]+$/', $numeroCnss)) {
        return response()->json([
            'message' => 'Le numéro CNSS doit contenir uniquement des chiffres.'
        ], 422);
    }

    $len = strlen($numeroCnss);

    // EMPLOYEUR : 8 chiffres
    if ($len === 8) {
        // Vérifier qu'il n'existe pas déjà un employeur avec ce numéro
        if (Employeur::where('numero_cnss', $numeroCnss)->exists()) {
            return response()->json([
                'message' => 'Un compte existe déjà pour ce numéro CNSS.'
            ], 409);
        }

        $user = User::create([
            'name'     => $data['email'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => 'employeur',
            'statut'   => 'actif',
        ]);

        Employeur::create([
            'user_id'      => $user->id,
            'numero_cnss'  => $numeroCnss,
            'password'     => Hash::make($data['password']),
            'ifu'          => 'EN ATTENTE',
            'company_name' => $data['email'],
            'email'        => $data['email'], // important
            'statut'       => 'actif',
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Compte employeur créé avec succès.',
            'user'    => $this->serializeUser($user),
            'token'   => $token,
        ], 201);
    }

    // TRAVAILLEUR : 10 à 12 chiffres
    if ($len >= 10 && $len <= 12) {
        // Vérifier qu'il n'existe pas déjà un travailleur avec ce numéro
        if (Travailleur::where('numero_cnss', $numeroCnss)->exists()) {
            return response()->json([
                'message' => 'Un compte existe déjà pour ce numéro CNSS.'
            ], 409);
        }

        $user = User::create([
            'name'     => $data['email'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => 'travailleur',
            'statut'   => 'actif',
        ]);

        Travailleur::create([
            'user_id'     => $user->id,
            'numero_cnss' => $numeroCnss,
            'password'    => Hash::make($data['password']),
            'first_name'  => 'User',
            'last_name'   => '',
            'email'       => $data['email'] ?? null, // seulement si la colonne existe
            'statut'      => 'actif',
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Compte travailleur créé avec succès.',
            'user'    => $this->serializeUser($user),
            'token'   => $token,
        ], 201);
    }

    return response()->json([
        'message' => 'Format de numéro CNSS invalide. Employeur: 8 chiffres, Travailleur: 10-12 chiffres.'
    ], 422);
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

        $user = $request->user()->load('employeur', 'travailleur', 'agent');

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Mot de passe actuel incorrect.',
            ], 422);
        }

        // Le cast 'hashed' sur User hash automatiquement — ne pas pré-hasher
        $user->update([
            'password' => $data['new_password'],
        ]);

        $hashed = Hash::make($data['new_password']);

        if ($user->role === 'employeur' && $user->employeur) {
            $user->employeur->update(['password' => $hashed]);
        } elseif ($user->role === 'travailleur' && $user->travailleur) {
            $user->travailleur->update(['password' => $hashed]);
        } elseif (in_array($user->role, ['agent', 'admin'], true) && $user->agent) {
            $user->agent->update(['password' => $hashed]);
        }

        return response()->json([
            'message' => 'Mot de passe changé avec succès.',
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user()->load('employeur', 'travailleur', 'agent');

        $baseData = $request->validate([
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        if (isset($baseData['email'])) {
            $user->update(['email' => $baseData['email']]);
        }

        switch ($user->role) {
            case 'employeur':
                if (! $user->employeur) {
                    return response()->json(['message' => 'Profil employeur introuvable.'], 404);
                }
                $data = $request->validate([
                    'company_name' => ['sometimes', 'string', 'max:255'],
                    'phone'        => ['nullable', 'string', 'max:50'],
                    'address'      => ['nullable', 'string', 'max:255'],
                    'email'        => ['nullable', 'email', 'max:255'],
                ]);
                $user->employeur->update($data);
                if (! empty($data['company_name'])) {
                    $user->update(['name' => $data['company_name']]);
                }
                break;

            case 'travailleur':
                if (! $user->travailleur) {
                    return response()->json(['message' => 'Profil travailleur introuvable.'], 404);
                }
                $data = $request->validate([
                    'phone'   => ['nullable', 'string', 'max:50'],
                    'email'   => ['nullable', 'email', 'max:255'],
                    'adresse' => ['nullable', 'string', 'max:255'],
                ]);
                $user->travailleur->update($data);
                break;

            case 'agent':
            case 'admin':
                if ($user->agent) {
                    $data = $request->validate([
                        'phone' => ['nullable', 'string', 'max:50'],
                        'email' => ['nullable', 'email', 'max:255'],
                    ]);
                    $user->agent->update($data);
                }
                break;
        }

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user'    => $this->serializeUser($user->fresh()->load('employeur', 'travailleur', 'agent')),
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $data = $request->validate([
            'email_notifications' => ['sometimes', 'boolean'],
            'sms_notifications'   => ['sometimes', 'boolean'],
            'push_notifications'  => ['sometimes', 'boolean'],
        ]);

        $user = $request->user();
        $prefs = array_merge($user->preferences ?? [], $data);
        $user->update(['preferences' => $prefs]);

        return response()->json([
            'message'     => 'Préférences enregistrées.',
            'preferences' => $prefs,
        ]);
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
    $request->validate([
        'current_password' => ['required', 'string'],
        'new_password'     => ['required', 'string', 'min:8'],
    ]);

    if (! $request->has('new_password_confirmation')) {
        $request->merge(['new_password_confirmation' => $request->input('new_password')]);
    }

    return $this->changePassword($request);
}
}
