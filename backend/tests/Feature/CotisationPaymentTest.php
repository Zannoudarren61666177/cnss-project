<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CotisationPaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_initializes_payment_for_a_cotisation(): void
    {
        Http::fake([
            'https://sandbox-api.fedapay.com/v1/transactions' => Http::response(['id' => 42], 201),
            'https://sandbox-api.fedapay.com/v1/transactions/42/token' => Http::response(['url' => 'https://pay.fedapay.com/42'], 200),
        ]);

        $user = \App\Models\User::create([
            'name' => 'Employeur Test',
            'email' => 'employeur@example.com',
            'password' => bcrypt('password'),
            'role' => 'employeur',
            'statut' => 'actif',
        ]);

        $employeur = \App\Models\Employeur::create([
            'user_id' => $user->id,
            'company_name' => 'ACME',
            'numero_cnss' => 'CNSS123',
            'statut' => 'actif',
        ]);

        $cotisation = \App\Models\Cotisation::create([
            'employeur_id' => $employeur->id,
            'montant' => 5000,
            'mois' => 6,
            'annee' => 2026,
            'status' => 'En attente',
            'reference' => 'CTS-202606-1',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/cotisations/{$cotisation->id}/initier-paiement");

        $response->assertStatus(201)
            ->assertJsonPath('payment_url', 'https://pay.fedapay.com/42')
            ->assertJsonPath('transaction_id', 42);

        $this->assertDatabaseHas('cotisations', [
            'id' => $cotisation->id,
            'transaction_id' => 42,
        ]);
    }
}
