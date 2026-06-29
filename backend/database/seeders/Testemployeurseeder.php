<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestEmployeurSeeder extends Seeder
{
    public function run(): void
    {
        $password  = 'password123';
        $hashedPwd = Hash::make($password);

        // ─── 1. User employeur ────────────────────────────────────────────────
        $userEmployeurId = DB::table('users')->insertGetId([
            'name'       => 'Société Test SARL',
            'email'      => 'employeur.test@cnss.bj',
            'password'   => $hashedPwd,
            'role'       => 'employeur',
            'statut'     => 'actif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ─── 2. Employeur (numero_cnss = 8 chiffres) ─────────────────────────
        $employeurId = DB::table('employeurs')->insertGetId([
            'user_id'             => $userEmployeurId,
            'company_name'        => 'Société Test SARL',
            'type_employeur'      => 'entreprise',
            'siret'               => 'SIRET-TEST-001',
            'address'             => 'Avenue Jean-Paul II, Cotonou',
            'phone'               => '+22961000001',
            'email'               => 'employeur.test@cnss.bj',
            'nom_representant'    => 'Dupont',
            'prenom_representant' => 'Jean',
            'npi_representant'    => 'NPI-TEST-001',
            'secteur'             => 'Commerce',
            'forme_juridique'     => 'SARL',
            'ifu'                 => 'IFU-TEST-001',
            'numero_cnss'         => '12345678',   // 8 chiffres exactement
            'password'            => $hashedPwd,
            'statut'              => 'actif',
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);

        // ─── 3. User travailleur 1 ────────────────────────────────────────────
        $userTrav1Id = DB::table('users')->insertGetId([
            'name'       => 'Alice Koffi',
            'email'      => 'alice.test@cnss.bj',
            'password'   => $hashedPwd,
            'role'       => 'travailleur',
            'statut'     => 'actif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ─── 4. Travailleur 1 (numero_cnss = 10 chiffres) ────────────────────
        DB::table('travailleurs')->insert([
            'user_id'          => $userTrav1Id,
            'employeur_id'     => $employeurId,
            'first_name'       => 'Alice',
            'last_name'        => 'Koffi',
            'date_naissance'   => '1990-05-15',
            'lieu_naissance'   => 'Cotonou',
            'sexe'             => 'F',
            'nationalite'      => 'Béninoise',
            'cin'              => 'CIN-ALI-001',
            'adresse'          => 'Quartier Akpakpa, Cotonou',
            'ville'            => 'Cotonou',
            'phone'            => '+22961000002',
            'email'            => 'alice.test@cnss.bj',
            'position'         => 'Comptable',
            'type_contrat'     => 'CDI',
            'date_embauche'    => '2022-01-10',
            'salaire_brut'     => 250000,
            'categorie_emploi' => 'Cadre',
            'numero_cnss'      => '1234567890',   // 10 chiffres
            'password'         => $hashedPwd,
            'statut'           => 'actif',
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);

        // ─── 5. User travailleur 2 ────────────────────────────────────────────
        $userTrav2Id = DB::table('users')->insertGetId([
            'name'       => 'Bob Azonsi',
            'email'      => 'bob.test@cnss.bj',
            'password'   => $hashedPwd,
            'role'       => 'travailleur',
            'statut'     => 'actif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ─── 6. Travailleur 2 (numero_cnss = 10 chiffres) ────────────────────
        DB::table('travailleurs')->insert([
            'user_id'          => $userTrav2Id,
            'employeur_id'     => $employeurId,
            'first_name'       => 'Bob',
            'last_name'        => 'Azonsi',
            'date_naissance'   => '1988-11-20',
            'lieu_naissance'   => 'Porto-Novo',
            'sexe'             => 'M',
            'nationalite'      => 'Béninois',
            'cin'              => 'CIN-BOB-002',
            'adresse'          => 'Quartier Zongo, Porto-Novo',
            'ville'            => 'Porto-Novo',
            'phone'            => '+22961000003',
            'email'            => 'bob.test@cnss.bj',
            'position'         => 'Développeur',
            'type_contrat'     => 'CDD',
            'date_embauche'    => '2023-03-01',
            'salaire_brut'     => 180000,
            'categorie_emploi' => 'Technicien',
            'numero_cnss'      => '1234567891',   // 10 chiffres
            'password'         => $hashedPwd,
            'statut'           => 'actif',
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);

        $this->command->info('');
        $this->command->info('✅ Données de test insérées avec succès !');
        $this->command->info('');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('👔 EMPLOYEUR');
        $this->command->info('   Numéro CNSS : 12345678      (8 chiffres)');
        $this->command->info('   Password    : password123');
        $this->command->info("   ID employeur: {$employeurId}");
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('👷 TRAVAILLEUR 1 — Alice Koffi');
        $this->command->info('   Numéro CNSS : 1234567890    (10 chiffres)');
        $this->command->info('   Password    : password123');
        $this->command->info('   Salaire     : 250 000 FCFA');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('👷 TRAVAILLEUR 2 — Bob Azonsi');
        $this->command->info('   Numéro CNSS : 1234567891    (10 chiffres)');
        $this->command->info('   Password    : password123');
        $this->command->info('   Salaire     : 180 000 FCFA');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('');
        $this->command->info('💰 Cotisation attendue après génération :');
        $this->command->info('   Alice : 250 000 × 19% = 47 500 FCFA');
        $this->command->info('   Bob   : 180 000 × 19% = 34 200 FCFA');
        $this->command->info('   TOTAL : 81 700 FCFA');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('');
        $this->command->info('▶  Étape suivante — générer la cotisation :');
        $this->command->info("   POST /api/v1/cotisations/generer");
        $this->command->info("   { \"employeur_id\": {$employeurId}, \"mois\": 6, \"annee\": 2026 }");
        $this->command->info('');
    }
}