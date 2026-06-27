<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employeur;
use App\Models\Travailleur;
use App\Models\Cotisation;
use App\Models\CotisationDetail;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeurTestSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Compte utilisateur de l'employeur
        $user = User::updateOrCreate(
            ['email' => 'employeur.test@cnss.bj'],
            [
                'name'     => 'Entreprise Test SARL',
                'password' => Hash::make('password123'),
                'role'     => 'employeur',
                'statut'   => 'actif',
            ]
        );

        // 2. Fiche employeur, déjà validée — generate 8-digit numeric CNSS
        do {
            $employeurNumero = strval(mt_rand(10000000, 99999999));
        } while (Employeur::where('numero_cnss', $employeurNumero)->exists());

        $employeur = Employeur::updateOrCreate(
            ['numero_cnss' => $employeurNumero],
            [
                'user_id'         => $user->id,
                'company_name'    => 'Entreprise Test SARL',
                'type_employeur'  => 'societe',
                'ifu'             => '3202012345678',
                'statut'          => 'validee',
                'address'         => 'Quartier Akpakpa, Cotonou',
                'phone'           => '+229 97 00 00 01',
                'email'           => 'employeur.test@cnss.bj',
                'nom_representant'       => 'KPADONOU',
                'prenom_representant'    => 'Marcel',
                'npi_representant'       => 'NPI123456789',
                'telephone_representant' => '+229 97 00 00 01',
            ]
        );

        // 3. Compte utilisateur du travailleur
        $userTravailleur = User::updateOrCreate(
            ['email' => 'travailleur.test@cnss.bj'],
            [
                'name'     => 'ADJOVI Romuald',
                'password' => Hash::make('password123'),
                'role'     => 'travailleur',
                'statut'   => 'actif',
            ]
        );

        // 4. Fiche travailleur, liée à l'employeur
        $travailleur = Travailleur::updateOrCreate(
            ['email' => 'travailleur.test@cnss.bj'],
            [
                'user_id'           => $userTravailleur->id,
                'employeur_id'      => $employeur->id,
                'first_name'        => 'Romuald',
                'last_name'         => 'ADJOVI',
                'cin'               => 'CIN00112233',
                'phone'             => '+229 97 00 00 02',
                'position'          => 'Comptable',
                'numero_cnss'       => (function() {
                    $len = rand(10, 12);
                    $s = (string) mt_rand(1,9);
                    for ($i = 1; $i < $len; $i++) {
                        $s .= (string) mt_rand(0,9);
                    }
                    return $s;
                })(),
                'statut'            => 'actif',
                'date_naissance'    => '1995-04-12',
                'lieu_naissance'    => 'Cotonou',
                'sexe'              => 'M',
                'nationalite'       => 'Béninoise',
                'adresse'           => 'Cocotomey, Abomey-Calavi',
                'ville'             => 'Abomey-Calavi',
                'type_contrat'      => 'CDI',
                'date_embauche'     => now()->subMonths(8)->startOfMonth(),
                'salaire_brut'      => 250000,
                'categorie_emploi'  => 'Employe',
            ]
        );

        // 5. Deuxième travailleur (pour des listes plus réalistes)
        $userTravailleur2 = User::updateOrCreate(
            ['email' => 'travailleur2.test@cnss.bj'],
            [
                'name'     => 'HOUNSOU Estelle',
                'password' => Hash::make('password123'),
                'role'     => 'travailleur',
                'statut'   => 'actif',
            ]
        );

        $travailleur2 = Travailleur::updateOrCreate(
            ['email' => 'travailleur2.test@cnss.bj'],
            [
                'user_id'           => $userTravailleur2->id,
                'employeur_id'      => $employeur->id,
                'first_name'        => 'Estelle',
                'last_name'         => 'HOUNSOU',
                'cin'               => 'CIN00445566',
                'phone'             => '+229 97 00 00 03',
                'position'          => 'Assistante de direction',
                'numero_cnss'       => (function() {
                    $len = rand(10, 12);
                    $s = (string) mt_rand(1,9);
                    for ($i = 1; $i < $len; $i++) {
                        $s .= (string) mt_rand(0,9);
                    }
                    return $s;
                })(),
                'statut'            => 'actif',
                'date_naissance'    => '1998-09-23',
                'lieu_naissance'    => 'Porto-Novo',
                'sexe'              => 'F',
                'nationalite'       => 'Béninoise',
                'adresse'           => 'Zogbo, Cotonou',
                'ville'             => 'Cotonou',
                'type_contrat'      => 'CDI',
                'date_embauche'     => now()->subMonths(5)->startOfMonth(),
                'salaire_brut'      => 180000,
                'categorie_emploi'  => 'Employe',
            ]
        );

        // 6. Cotisations sur les 3 derniers mois pour le premier travailleur
        for ($i = 2; $i >= 0; $i--) {
            $date = now()->subMonths($i);

            $cotisation = Cotisation::create([
                'employeur_id' => $employeur->id,
                'mois'         => $date->month,
                'annee'        => $date->year,
                'montant'      => 250000 * 0.19 + 180000 * 0.19,
                'status'       => 'Vérifiée',
                'reference'    => 'CTS-' . $date->format('Ym') . '-' . $employeur->id,
                'echeance'     => $date->copy()->endOfMonth()->addDays(15),
            ]);

            CotisationDetail::create([
                'cotisation_id'    => $cotisation->id,
                'travailleur_id'   => $travailleur->id,
                'salaire_brut'     => 250000,
                'taux_salarial'    => 3.6,
                'taux_patronal'    => 15.4,
                'montant_salarial' => 250000 * 0.036,
                'montant_patronal' => 250000 * 0.154,
                'montant_total'    => 250000 * 0.19,
            ]);
        }

        $this->command->info('Employeur de test créé : employeur.test@cnss.bj / password123');
        $this->command->info('Travailleur de test créé : travailleur.test@cnss.bj / password123');
    }
}