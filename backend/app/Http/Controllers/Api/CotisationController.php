<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cotisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Helpers\ActivityLogger;

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
            'montant'      => ['required', 'numeric'],
            'mois'         => ['required', 'integer', 'between:1,12'],
            'annee'        => ['required', 'integer'],
            'status'       => ['nullable', 'string', 'max:50'],
        ]);

        return response()->json(Cotisation::create($data), 201);
    }

    public function show(string $id)
    {
        return Cotisation::with(['employeur', 'details.travailleur'])->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $cotisation = Cotisation::findOrFail($id);

        $data = $request->validate([
            'employeur_id' => ['sometimes', 'required', 'exists:employeurs,id'],
            'montant'      => ['sometimes', 'required', 'numeric'],
            'mois'         => ['sometimes', 'required', 'integer', 'between:1,12'],
            'annee'        => ['sometimes', 'required', 'integer'],
            'status'       => ['nullable', 'string', 'max:50'],
        ]);

        $cotisation->update($data);

        return response()->json($cotisation);
    }

    public function initierPaiement(Request $request, string $id)
    {
        $cotisation = Cotisation::with('employeur.user')->findOrFail($id);

        // Déjà payée
        if (in_array($cotisation->status, ['Payée', 'payée', 'Vérifiée', 'verifiée'])) {
            return response()->json(['message' => 'Cette cotisation a déjà été payée.'], 409);
        }

        $secretKey = env('FEDAPAY_SECRET_KEY');
        $baseUrl   = env('FEDAPAY_ENV', 'sandbox') === 'live'
            ? 'https://api.fedapay.com/v1'
            : 'https://sandbox-api.fedapay.com/v1';

        if (empty($secretKey)) {
            return response()->json(['message' => 'La configuration FedaPay est incomplète.'], 500);
        }

        // ── Réutiliser la transaction existante si elle est encore en attente ──
        if ($cotisation->transaction_id) {
            $existing = Http::withToken($secretKey)
                ->acceptJson()
                ->get($baseUrl . '/transactions/' . $cotisation->transaction_id);

            if ($existing->successful()) {
                $existingData   = $existing->json();
                $existingStatus = data_get($existingData, 'v1/transaction.status');
                $existingUrl    = data_get($existingData, 'v1/transaction.payment_url');

                if (in_array($existingStatus, ['pending']) && $existingUrl) {
                    return response()->json([
                        'message'        => 'Transaction existante réutilisée.',
                        'payment_url'    => $existingUrl,
                        'transaction_id' => $cotisation->transaction_id,
                        'cotisation'     => $cotisation,
                    ], 200);
                }

                // Si approuvée, mettre à jour le statut
                if (in_array($existingStatus, ['approved', 'successful', 'succeeded'])) {
                    $cotisation->update(['status' => 'Payée', 'date_paiement' => now()]);
                    return response()->json(['message' => 'Cette cotisation a déjà été payée.'], 409);
                }
            }
        }

        // ── Nettoyage du téléphone ────────────────────────────────────────────
        $phone = preg_replace('/\D/', '', $cotisation->employeur?->phone ?? '');
        if (empty($phone)) {
            $phone = '22961000000';
        }

        // ── Créer une nouvelle transaction FedaPay ────────────────────────────
        $payload = [
            'description'     => 'Cotisation CNSS ' . ($cotisation->reference ?? $cotisation->id),
            'amount'          => (int) round((float) $cotisation->montant),
            'currency'        => ['iso' => 'XOF'],
            'callback_url'    => $request->input('callback_url', url('/api/v1/cotisations/paiement/callback')),
            'custom_metadata' => [
                'cotisation_id' => $cotisation->id,
                'employeur_id'  => $cotisation->employeur_id,
            ],
            'customer' => [
                'email'        => $cotisation->employeur?->user?->email ?? 'employeur@cnss.bj',
                'firstname'    => $cotisation->employeur?->company_name ?? 'Employeur',
                'lastname'     => 'CNSS',
                'phone_number' => [
                    'number'  => $phone,
                    'country' => 'BJ',
                ],
            ],
        ];

        $response = Http::withToken($secretKey)->acceptJson()->post($baseUrl . '/transactions', $payload);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Echec de l\'initialisation du paiement FedaPay.',
                'details' => $response->json(),
            ], 502);
        }

        $transaction   = $response->json();
        $transactionId = data_get($transaction, 'v1/transaction.id');
        $paymentUrl    = data_get($transaction, 'v1/transaction.payment_url');

        if (!$transactionId || !$paymentUrl) {
            return response()->json([
                'message' => 'Reponse FedaPay invalide.',
                'details' => $transaction,
            ], 502);
        }

        $cotisation->update(['transaction_id' => $transactionId]);

        return response()->json([
            'message'        => 'Paiement initialise avec succes.',
            'payment_url'    => $paymentUrl,
            'transaction_id' => $transactionId,
            'cotisation'     => $cotisation->fresh(),
        ], 201);
    }

    public function verifierPaiement(Request $request, string $id)
    {
        $cotisation = Cotisation::findOrFail($id);

        if (!$cotisation->transaction_id) {
            return response()->json(['message' => 'Aucune transaction associee a cette cotisation.'], 404);
        }

        $secretKey = env('FEDAPAY_SECRET_KEY');
        $baseUrl   = env('FEDAPAY_ENV', 'sandbox') === 'live'
            ? 'https://api.fedapay.com/v1'
            : 'https://sandbox-api.fedapay.com/v1';

        $response = Http::withToken($secretKey)
            ->acceptJson()
            ->get($baseUrl . '/transactions/' . $cotisation->transaction_id);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Impossible de verifier la transaction FedaPay.',
                'details' => $response->json(),
            ], 502);
        }

        // FedaPay retourne sous 'v1/transaction'
        $data   = $response->json();
        $status = strtolower((string) (
            data_get($data, 'v1/transaction.status')
            ?? data_get($data, 'status')
            ?? ''
        ));

        if (in_array($status, ['approved', 'successful', 'succeeded', 'paid', 'complete', 'completed', 'success'])) {
            $cotisation->update([
                'status'        => 'Payée',
                'date_paiement' => now(),
            ]);

            return response()->json([
                'statut'     => 'payee',
                'message'    => 'Paiement confirme.',
                'cotisation' => $cotisation->fresh(),
            ]);
        }

        return response()->json([
            'statut'  => $status,
            'message' => 'Paiement non encore confirme.',
        ]);
    }

    public function callbackPaiement(Request $request)
    {
        $transactionId = $request->input('transaction_id')
            ?? $request->input('id')
            ?? $request->json('transaction_id')
            ?? $request->json('id');

        $status = $request->input('status')
            ?? $request->input('event.status')
            ?? $request->json('status');

        if (!$transactionId) {
            return response()->json(['message' => 'Aucune transaction recue.'], 400);
        }

        $cotisation = Cotisation::where('transaction_id', $transactionId)->first();

        if (!$cotisation) {
            return response()->json(['message' => 'Cotisation introuvable pour cette transaction.'], 404);
        }

        $normalizedStatus = strtolower((string) $status);

        if (in_array($normalizedStatus, ['approved', 'successful', 'succeeded', 'paid', 'complete', 'completed', 'success'])) {
            $cotisation->update(['status' => 'Payée', 'date_paiement' => now()]);
        } elseif (in_array($normalizedStatus, ['failed', 'canceled', 'cancelled', 'expired', 'error'])) {
            $cotisation->update(['status' => 'Echec']);
        }

        return response()->json(['message' => 'Callback traite.', 'cotisation' => $cotisation->fresh()]);
    }

    public function destroy(string $id)
    {
        $cotisation = Cotisation::findOrFail($id);
        $cotisation->delete();

        return response()->json(['message' => 'Cotisation supprimee']);
    }

    public function valider(string $id)
    {
        $cotisation = Cotisation::findOrFail($id);
        $cotisation->update(['status' => 'Vérifiée']);

        ActivityLogger::log("Validation declaration #{$cotisation->id}", 'Cotisation');

        return response()->json([
            'message'    => 'Declaration validee',
            'cotisation' => $cotisation,
        ]);
    }

    public function relancer(string $id)
    {
        $cotisation = Cotisation::with('employeur.user')->findOrFail($id);

        if (!$cotisation->employeur || !$cotisation->employeur->user) {
            return response()->json(['message' => 'Employeur introuvable'], 404);
        }

        \App\Models\Notification::create([
            'user_id' => $cotisation->employeur->user->id,
            'type'    => 'relance_cotisation',
            'content' => "Rappel : votre declaration de cotisations pour la periode {$cotisation->mois}/{$cotisation->annee} est en retard. Merci de regulariser votre situation.",
            'read_at' => null,
        ]);

        return response()->json(['message' => 'Relance envoyee avec succes']);
    }

    public function parEmployeur(string $employeur_id)
    {
        return response()->json(
            Cotisation::where('employeur_id', $employeur_id)
                ->with('details.travailleur')
                ->orderByDesc('annee')
                ->orderByDesc('mois')
                ->get()
        );
    }

    public function genererPourEmployeur(Request $request)
    {
        $data = $request->validate([
            'employeur_id' => ['required', 'exists:employeurs,id'],
            'mois'         => ['required', 'integer', 'between:1,12'],
            'annee'        => ['required', 'integer'],
        ]);

        $tauxSalarial = 3.6;
        $tauxPatronal = 15.4;

        $travailleurs = \App\Models\Travailleur::where('employeur_id', $data['employeur_id'])
            ->where('statut', 'actif')
            ->whereNotNull('salaire_brut')
            ->get();

        if ($travailleurs->isEmpty()) {
            return response()->json([
                'message' => 'Aucun travailleur actif avec un salaire renseigne pour cet employeur.',
            ], 422);
        }

        $montantTotal = 0;
        $details      = [];

        foreach ($travailleurs as $travailleur) {
            $salaire         = (float) $travailleur->salaire_brut;
            $montantSalarial = round($salaire * $tauxSalarial / 100, 2);
            $montantPatronal = round($salaire * $tauxPatronal / 100, 2);
            $total           = $montantSalarial + $montantPatronal;

            $montantTotal += $total;

            $details[] = [
                'travailleur_id'   => $travailleur->id,
                'salaire_brut'     => $salaire,
                'taux_salarial'    => $tauxSalarial,
                'taux_patronal'    => $tauxPatronal,
                'montant_salarial' => $montantSalarial,
                'montant_patronal' => $montantPatronal,
                'montant_total'    => $total,
            ];
        }

        $cotisation = Cotisation::create([
            'employeur_id' => $data['employeur_id'],
            'montant'      => $montantTotal,
            'mois'         => $data['mois'],
            'annee'        => $data['annee'],
            'status'       => 'En attente',
            'reference'    => 'CTS-' . $data['annee'] . str_pad($data['mois'], 2, '0', STR_PAD_LEFT) . '-' . $data['employeur_id'],
            'echeance'     => now()->setDate($data['annee'], $data['mois'], 1)->endOfMonth()->addDays(15),
        ]);

        foreach ($details as $detail) {
            $detail['cotisation_id'] = $cotisation->id;
            \App\Models\CotisationDetail::create($detail);
        }

        return response()->json([
            'message'    => 'Cotisation generee avec succes',
            'cotisation' => $cotisation->load('details.travailleur'),
        ], 201);
    }
}