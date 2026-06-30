<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AgentSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $profils = [
            ['matricule' => 'AGT-IMMAT', 'type' => 'immatriculation', 'department' => 'Immatriculation', 'label' => 'Agent Immatriculation'],
            ['matricule' => 'AGT-EMP',   'type' => 'employeur',       'department' => 'Gestion Employeurs', 'label' => 'Agent Employeurs'],
            ['matricule' => 'AGT-COT',   'type' => 'cotisation',      'department' => 'Cotisations', 'label' => 'Agent Cotisations'],
            ['matricule' => 'AGT-PREST', 'type' => 'prestations',     'department' => 'Prestations', 'label' => 'Agent Prestations'],
            ['matricule' => 'AGT-SUP',   'type' => 'support',         'department' => 'Support', 'label' => 'Agent Support'],
        ];

        foreach ($profils as $p) {
            // generate a numeric identifier for agent (10-12 digits) in a 32-bit safe way
            $len = rand(10, 12);
            $matricule = (string) mt_rand(1, 9);
            for ($i = 1; $i < $len; $i++) {
                $matricule .= (string) mt_rand(0, 9);
            }

            $email = $matricule . '@cnss.bj';

            $user = User::firstOrCreate(
                ['name' => $matricule],
                [
                    'email'    => $email,
                    'password' => bcrypt('password123'),
                    'role'     => 'agent',
                    'statut'   => 'actif',
                ]
            );

            if ($this->command) {
                $this->command->info("Agent créé: {$matricule} (type={$p['type']}) — mot de passe: password123");
            }

            Agent::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'type'       => $p['type'],
                    'department' => $p['department'],
                    'phone'      => '+229 97 11 11 11',
                    'email'      => $user->email,
                    'first_name' => 'Agent',
                    'last_name'  => $p['label'],
                ]
            );
        }

        // Compte admin
        User::firstOrCreate(
            ['name' => 'AGT-ADMIN'],
            [
                'email'    => 'agt.admin@cnss.bj',
                'password' => bcrypt('password123'),
                'role'     => 'admin',
                'statut'   => 'actif',
            ]
        );
    }
}