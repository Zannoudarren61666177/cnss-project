<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ActivityLogger;
use App\Mail\AttestationTravailleurMail;
use App\Models\Agent;
use App\Models\Employeur;
use App\Models\Notification;
use App\Models\Travailleur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

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
            'email'             => ['required', 'email', 'max:255'],
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
        ]);

        $employeur = Employeur::findOrFail($data['employeur_id']);

        if ($employeur->statut !== 'validee') {
            return response()->json([
                'message' => 'Votre entreprise doit être immatriculée avant de déclarer des travailleurs.',
            ], 422);
        }

        $user = $request->user();
        if ($user->role === 'employeur') {
            if (! $user->employeur || (int) $user->employeur->id !== (int) $data['employeur_id']) {
                return response()->json(['message' => 'Non autorisé.'], 403);
            }
        }

        if ($request->hasFile('piece_identite')) {
            $data['piece_identite'] = $request->file('piece_identite')->store('pieces-identite', 'public');
        }

        $data['statut'] = 'en_attente';

        $travailleur = Travailleur::create($data);

        ActivityLogger::log(
            "Déclaration travailleur {$travailleur->first_name} {$travailleur->last_name} — employeur {$employeur->company_name}",
            'Immatriculation'
        );

        $agents = Agent::where('type', 'immatriculation')->get();
        foreach ($agents as $agent) {
            if ($agent->user_id) {
                Notification::create([
                    'user_id' => $agent->user_id,
                    'type'    => 'declaration_travailleur',
                    'content' => "Nouvelle déclaration travailleur: {$travailleur->first_name} {$travailleur->last_name} (Employeur: {$employeur->company_name})",
                ]);
            }
        }

        return response()->json([
            'message'     => 'Déclaration envoyée aux agents CNSS pour validation.',
            'travailleur' => $travailleur->load('employeur'),
        ], 201);
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
            'first_name'   => ['sometimes', 'required', 'string', 'max:255'],
            'last_name'    => ['sometimes', 'required', 'string', 'max:255'],
            'cin'          => ['sometimes', 'required', 'string', 'max:50', 'unique:travailleurs,cin,' . $travailleur->id],
            'phone'        => ['nullable', 'string', 'max:50'],
            'email'        => ['nullable', 'email', 'max:255'],
            'position'     => ['nullable', 'string', 'max:255'],
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
            Travailleur::where('employeur_id', $employeur_id)
                ->with('user')
                ->orderByDesc('created_at')
                ->get()
        );
    }

    public function enAttente()
    {
        return Travailleur::with('employeur')
            ->where('statut', 'en_attente')
            ->orderByDesc('created_at')
            ->get();
    }

    public function valider(string $id)
    {
        $travailleur = Travailleur::with('employeur')->findOrFail($id);

        if ($travailleur->statut === 'rejetee') {
            return response()->json(['message' => 'Cette déclaration a été rejetée.'], 409);
        }

        if ($travailleur->statut === 'actif') {
            return $this->envoyerAttestationEmail($travailleur, true);
        }

        do {
            // Compatible PHP 32 bits : 9999999999 dépasse PHP_INT_MAX
            $numeroCnss = sprintf('%03d%07d', random_int(100, 999), random_int(0, 9999999));
        } while (Travailleur::where('numero_cnss', $numeroCnss)->exists());

        $travailleur->update([
            'statut'       => 'actif',
            'numero_cnss'  => $numeroCnss,
            'raison_rejet' => null,
        ]);

        $travailleur->refresh()->load('employeur');

        ActivityLogger::log(
            "Validation travailleur {$travailleur->first_name} {$travailleur->last_name} — CNSS {$numeroCnss}",
            'Immatriculation'
        );

        $employeur = $travailleur->employeur;

        if ($employeur?->user_id) {
            Notification::create([
                'user_id' => $employeur->user_id,
                'type'    => 'travailleur_valide',
                'content' => json_encode([
                    'message'        => "Le travailleur {$travailleur->first_name} {$travailleur->last_name} a été immatriculé avec succès.",
                    'travailleur_id' => $travailleur->id,
                    'numero_cnss'    => $numeroCnss,
                    'nom'            => "{$travailleur->first_name} {$travailleur->last_name}",
                ], JSON_UNESCAPED_UNICODE),
            ]);
        }

        return $this->envoyerAttestationEmail($travailleur, false);
    }

    public function renvoyerAttestation(string $id)
    {
        $travailleur = Travailleur::with('employeur')->findOrFail($id);

        if ($travailleur->statut !== 'actif' || ! $travailleur->numero_cnss) {
            return response()->json([
                'message' => 'Le travailleur doit être validé avant l\'envoi de l\'attestation.',
            ], 422);
        }

        return $this->envoyerAttestationEmail($travailleur, true);
    }

    private function envoyerAttestationEmail(Travailleur $travailleur, bool $renvoi): \Illuminate\Http\JsonResponse
    {
        $travailleur->loadMissing('employeur');
        $employeur = $travailleur->employeur;

        if (! $travailleur->email) {
            return response()->json([
                'message'      => 'Travailleur validé, mais aucune adresse email renseignée.',
                'numero_cnss'  => $travailleur->numero_cnss,
                'travailleur'  => $travailleur,
                'email_envoye' => false,
            ], $renvoi ? 422 : 200);
        }

        if (! $employeur) {
            return response()->json([
                'message'      => 'Employeur introuvable pour ce travailleur.',
                'travailleur'  => $travailleur,
                'email_envoye' => false,
            ], 422);
        }

        try {
            Mail::to($travailleur->email)->send(new AttestationTravailleurMail($travailleur, $employeur));

            return response()->json([
                'message'      => $renvoi
                    ? 'Email avec attestation renvoyé au travailleur.'
                    : 'Travailleur validé. Email avec attestation et lien de création de compte envoyé.',
                'numero_cnss'  => $travailleur->numero_cnss,
                'travailleur'  => $travailleur,
                'email_envoye' => true,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message'      => ($renvoi ? 'Renvoi' : 'Validation') . ' effectué(e), mais l\'envoi de l\'email a échoué : ' . $e->getMessage(),
                'numero_cnss'  => $travailleur->numero_cnss,
                'travailleur'  => $travailleur,
                'email_envoye' => false,
            ], 207);
        }
    }

    public function rejeter(Request $request, string $id)
    {
        $travailleur = Travailleur::with('employeur')->findOrFail($id);

        $data = $request->validate([
            'raison' => ['required', 'string', 'max:1000'],
        ]);

        $travailleur->update([
            'statut'       => 'rejetee',
            'raison_rejet' => $data['raison'],
        ]);

        ActivityLogger::log(
            "Rejet travailleur {$travailleur->first_name} {$travailleur->last_name}",
            'Immatriculation'
        );

        $employeur = $travailleur->employeur;
        if ($employeur?->user_id) {
            Notification::create([
                'user_id' => $employeur->user_id,
                'type'    => 'travailleur_rejete',
                'content' => json_encode([
                    'message' => "La déclaration de {$travailleur->first_name} {$travailleur->last_name} a été rejetée.",
                    'raison'  => $data['raison'],
                    'nom'     => "{$travailleur->first_name} {$travailleur->last_name}",
                ], JSON_UNESCAPED_UNICODE),
            ]);
        }

        return response()->json(['message' => 'Déclaration travailleur rejetée. L\'employeur a été notifié.']);
    }

    public function activerCompte(Request $request)
    {
        $data = $request->validate([
            'numero_cnss' => ['required', 'string'],
            'email'       => ['required', 'email'],
            'password'    => ['required', 'string', 'min:8'],
        ]);

        $travailleur = Travailleur::where('numero_cnss', $data['numero_cnss'])
            ->where('email', $data['email'])
            ->where('statut', 'actif')
            ->first();

        if (! $travailleur) {
            return response()->json([
                'message' => 'Numéro CNSS ou email incorrect, ou affiliation non encore validée.',
            ], 404);
        }

        if ($travailleur->user_id) {
            return response()->json([
                'message' => 'Un compte existe déjà pour cette immatriculation.',
            ], 409);
        }

        $user = User::create([
            'name'     => trim("{$travailleur->first_name} {$travailleur->last_name}"),
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => 'travailleur',
        ]);

        $travailleur->update(['user_id' => $user->id]);

        $token = $user->createToken('api-token')->plainTextToken;

        $userData = $user->toArray();
        $userData['travailleur'] = $travailleur->load('employeur');

        return response()->json([
            'message' => 'Compte travailleur activé avec succès.',
            'user'    => $userData,
            'token'   => $token,
        ], 201);
    }

    public function telechargerAttestation(Request $request, string $id)
    {
        $travailleur = Travailleur::with('employeur')->findOrFail($id);

        if ($travailleur->statut !== 'actif' || ! $travailleur->numero_cnss) {
            return response()->json(['message' => 'Aucune attestation disponible.'], 404);
        }

        $user = $request->user();
        if ($user->role === 'employeur') {
            if (! $user->employeur || (int) $user->employeur->id !== (int) $travailleur->employeur_id) {
                return response()->json(['message' => 'Non autorisé.'], 403);
            }
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.attestation-travailleur', [
            'travailleur' => $travailleur,
            'employeur'   => $travailleur->employeur,
        ]);

        return $pdf->download("attestation-travailleur-{$travailleur->numero_cnss}.pdf");
    }
}
