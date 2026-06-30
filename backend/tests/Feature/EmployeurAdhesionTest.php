<?php

namespace Tests\Feature;

use App\Models\Employeur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeurAdhesionTest extends TestCase
{
    use RefreshDatabase;

    public function test_demande_adhesion_persists_all_form_fields(): void
    {
        $response = $this->postJson('/api/v1/employeurs/demander-adhesion', [
            'type_employeur' => 'societe',
            'company_name' => 'Société Test',
            'ifu' => '0011223344',
            'siret' => '12345678901234',
            'secteur' => 'Industrie',
            'forme_juridique' => 'SARL',
            'address' => '12 rue des Tests',
            'phone' => '+22997000000',
            'email' => 'contact@test.bj',
            'nom_representant' => 'Dossou',
            'prenom_representant' => 'Yao',
            'npi_representant' => '12345678901',
            'telephone_representant' => '+22998000000',
        ]);

        $response->assertCreated();

        $employeur = Employeur::latest('id')->first();

        $this->assertNotNull($employeur);
        $this->assertSame('12345678901234', $employeur->siret);
        $this->assertSame('Industrie', $employeur->secteur);
        $this->assertSame('SARL', $employeur->forme_juridique);
        $this->assertSame('12 rue des Tests', $employeur->address);
    }
}
