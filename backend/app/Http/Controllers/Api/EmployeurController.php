<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employeur;
use Illuminate\Http\Request;
use App\Helpers\ActivityLogger;
use App\Mail\AttestationEmployeurMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Models\Notification;
use App\Models\Agent;

class EmployeurController extends Controller
{
    public function index()
    {
        return Employeur::with(['user', 'travailleurs'])->get();
    }

    public function demanderAdhesion(Request $request)
{
    $data = $request->validate([
        'type_employeur'          => ['required', 'string', 'max:50'],
        'company_name'            => ['required', 'string', 'max:255'],
        'ifu'                      => ['nullable', 'string', 'max:50'],
        'siret'                    => ['nullable', 'string', 'max:50'],
        'secteur'                  => ['nullable', 'string', 'max:255'],
        'forme_juridique'         => ['nullable', 'string', 'max:255'],
        'address'                  => ['required', 'string', 'max:255'],
        'phone'                    => ['required', 'string', 'max:50'],
        'email'                    => ['required', 'email', 'max:255'],
        'nom_representant'         => ['required', 'string', 'max:255'],
        'prenom_representant'      => ['required', 'string', 'max:255'],
        'npi_representant'         => ['required', 'string', 'max:50'],
        'telephone_representant'   => ['required', 'string', 'max:50'],
    ]);

    $data['statut'] = 'en_attente';

    $pieces = [];
    foreach ($request->allFiles() as $cle => $fichier) {
        if (is_array($fichier)) {
            foreach ($fichier as $k => $fileItem) {
                if ($fileItem && $fileItem->isValid()) {
                    $pieces[$cle][$k] = $fileItem->store('pieces-employeurs', 'public');
                }
            }
        } else {
            if ($fichier && $fichier->isValid()) {
                $pieces[$cle] = $fichier->store('pieces-employeurs', 'public');
            }
        }
    }
    $data['pieces_justificatives'] = $pieces;

    $employeur = Employeur::create($data);

    ActivityLogger::log("Nouvelle demande d'adhésion : {$employeur->company_name}", 'Immatriculation');

    // Create notifications for immatriculation agents
    $agents = Agent::where('type', 'immatriculation')->get();
    foreach ($agents as $agent) {
        if ($agent->user_id) {
            Notification::create([
                'user_id' => $agent->user_id,
                'type'    => 'immatriculation_request',
                'content' => "Nouvelle demande d'adhésion: {$employeur->company_name} (ID: {$employeur->id})",
            ]);
        }
    }

    return response()->json([
        'message'   => 'Votre demande d\'adhésion a été soumise avec succès.',
        'employeur' => $employeur,
    ], 201);
}
    public function show(string $id)
    {
        return Employeur::with(['user', 'travailleurs'])->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $employeur = Employeur::findOrFail($id);

        $data = $request->validate([
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'siret' => ['sometimes', 'required', 'string', 'max:50', 'unique:employeurs,siret,' . $employeur->id],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $employeur->update($data);

        if (isset($data['password']) && $employeur->user) {
            $employeur->user->update(['password' => Hash::make($data['password'])]);
            $employeur->update(['password' => Hash::make($data['password'])]);
        }

        return response()->json($employeur);
    }

    public function destroy(string $id)
    {
        $employeur = Employeur::findOrFail($id);
        $user = $employeur->user;
        $employeur->delete();

        if ($user) {
            $user->delete();
        }

        return response()->json(['message' => 'Employeur supprimé']);
    }
    public function valider(string $id)
{
    $employeur = Employeur::findOrFail($id);

    if ($employeur->statut === 'validee') {
        return response()->json([
            'message' => 'Cette demande a déjà été validée.',
        ], 409);
    }

    do {
        $numeroCnss = strval(mt_rand(10000000, 99999999));
    } while (Employeur::where('numero_cnss', $numeroCnss)->exists());

    $employeur->update([
        'statut'      => 'validee',
        'numero_cnss' => $numeroCnss,
    ]);

    $employeur->refresh();

    ActivityLogger::log("Validation employeur {$employeur->company_name} — CNSS {$numeroCnss}", 'Immatriculation');

    $emailEnvoye = false;
    if ($employeur->email) {
        try {
            Mail::to($employeur->email)->send(new AttestationEmployeurMail($employeur));
            $emailEnvoye = true;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message'     => 'Employeur validé, mais l\'envoi de l\'email a échoué. Vérifiez la configuration mail (MAIL_*).',
                'numero_cnss' => $numeroCnss,
                'employeur'   => $employeur,
                'email_envoye' => false,
            ], 207);
        }
    }

    return response()->json([
        'message'      => $emailEnvoye
            ? 'Employeur validé avec succès. Un email avec l\'attestation a été envoyé.'
            : 'Employeur validé avec succès. Aucune adresse email renseignée.',
        'numero_cnss'  => $numeroCnss,
        'employeur'    => $employeur,
        'email_envoye' => $emailEnvoye,
    ]);
}

public function rejeter(Request $request, string $id)
{
    $employeur = Employeur::findOrFail($id);

    $data = $request->validate([
        'raison' => ['required', 'string', 'max:1000'],
    ]);

    $employeur->update([
        'statut' => 'rejetee',
        'raison_rejet' => $data['raison'],
    ]);

    ActivityLogger::log("Rejet employeur {$employeur->company_name}", 'Immatriculation');

    if ($employeur->email) {
        Mail::to($employeur->email)->send(new \App\Mail\RejetEmployeurMail($employeur, $data['raison']));
    }

    return response()->json(['message' => 'Demande rejetée et e-mail envoyé']);
}

public function activerCompte(Request $request)
{
    $data = $request->validate([
        'numero_cnss' => ['required', 'string'],
        'email'       => ['required', 'email'],
        'password'    => ['required', 'string', 'min:8'],
    ]);

    $employeur = Employeur::where('numero_cnss', $data['numero_cnss'])
        ->where('email', $data['email'])
        ->where('statut', 'validee')
        ->first();

    if (! $employeur) {
        return response()->json([
            'message' => 'Numéro CNSS ou email incorrect, ou immatriculation non encore validée.',
        ], 404);
    }

    if ($employeur->user_id) {
        return response()->json([
            'message' => 'Un compte existe déjà pour cette immatriculation.',
        ], 409);
    }

    $user = \App\Models\User::create([
        'name'     => $employeur->company_name,
        'email'    => $data['email'],
        'password' => Hash::make($data['password']),
        'role'     => 'employeur',
    ]);

    $employeur->update(['user_id' => $user->id]);

    $token = $user->createToken('api-token')->plainTextToken;

    $userData = $user->toArray();
$userData['employeur'] = $employeur;

return response()->json([
    'message' => 'Compte activé avec succès.',
    'user'    => $userData,
    'token'   => $token,
], 201);
}

public function telechargerAttestation(Request $request)
{
    $employeur = $request->user()->employeur;

    if (!$employeur || $employeur->statut !== 'validee') {
        return response()->json(['message' => 'Aucune attestation disponible.'], 404);
    }

    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.attestation-employeur', ['employeur' => $employeur]);

    return $pdf->download("attestation-cnss-{$employeur->numero_cnss}.pdf");
}
}
