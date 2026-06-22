<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employeur;
use Illuminate\Http\Request;
use App\Helpers\ActivityLogger;
use App\Mail\AttestationEmployeurMail;
use Illuminate\Support\Facades\Mail;

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
    foreach ($request->files->all() as $cle => $fichier) {
        if ($fichier && $fichier->isValid()) {
            $pieces[$cle] = $fichier->store('pieces-employeurs', 'public');
        }
    }
    $data['pieces_justificatives'] = $pieces;

    $employeur = Employeur::create($data);

    ActivityLogger::log("Nouvelle demande d'adhésion : {$employeur->company_name}", 'Immatriculation');

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
        ]);

        $employeur->update($data);

        return response()->json($employeur);
    }

    public function destroy(string $id)
    {
        $employeur = Employeur::findOrFail($id);
        $employeur->delete();

        return response()->json(['message' => 'Employeur supprimé']);
    }
    public function valider(string $id)
{
    $employeur = Employeur::findOrFail($id);

    $numeroCnss = 'BJ-EMP-' . now()->format('Ymd') . '-' . str_pad($id, 4, '0', STR_PAD_LEFT);

    $employeur->update([
        'statut'      => 'validee',
        'numero_cnss' => $numeroCnss,
    ]);

    if ($employeur->email) {
        Mail::to($employeur->email)->send(new AttestationEmployeurMail($employeur));
    }

    return response()->json([
        'message'     => 'Employeur validé avec succès. Un email a été envoyé.',
        'numero_cnss' => $numeroCnss,
        'employeur'   => $employeur,
    ]);
}

public function rejeter(string $id)
{
    $employeur = Employeur::findOrFail($id);
    $employeur->update(['statut' => 'rejetee']);
    ActivityLogger::log("Rejet employeur {$employeur->company_name}", 'Immatriculation');

    return response()->json(['message' => 'Demande rejetée']);
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
        'password' => $data['password'],
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
