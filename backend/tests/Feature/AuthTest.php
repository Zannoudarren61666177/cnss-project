<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Employeur;
use App\Models\Travailleur;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_employeur_can_login_with_8_digits()
    {
        $user = User::create([
            'name' => 'EntrepriseTest',
            'email' => 'employeur.login@test',
            'password' => Hash::make('password123'),
            'role' => 'employeur',
        ]);

        $employeur = Employeur::create([
            'user_id' => $user->id,
            'company_name' => 'Entreprise Test',
            'numero_cnss' => '21055652',
            'statut' => 'validee',
            'email' => 'employeur.login@test',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'numero_cnss' => '21055652',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['user', 'token']);
    }

    public function test_travailleur_can_login_with_10_to_12_digits()
    {
        $user = User::create([
            'name' => 'TravailleurTest',
            'email' => 'travailleur.login@test',
            'password' => Hash::make('password123'),
            'role' => 'travailleur',
        ]);

        $travailleur = Travailleur::create([
            'user_id' => $user->id,
            'first_name' => 'Test',
            'last_name' => 'User',
            'numero_cnss' => '1800590763',
            'statut' => 'actif',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'numero_cnss' => '1800590763',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['user', 'token']);
    }

    public function test_agent_can_login_with_numeric_identifier()
    {
        $identifier = '12345678901'; // 11 digits
        $user = User::create([
            'name' => $identifier,
            'email' => 'agent.login@test',
            'password' => Hash::make('password123'),
            'role' => 'agent',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'numero_cnss' => $identifier,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['user', 'token']);
    }

    public function test_non_numeric_numero_is_rejected()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'numero_cnss' => 'ABC-123',
            'password' => 'whatever',
        ]);

        $response->assertStatus(422);
    }
}
