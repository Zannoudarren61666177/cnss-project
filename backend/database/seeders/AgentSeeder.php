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
            $user = User::firstOrCreate(
                ['name' => $p['matricule']],
                [
                    'email'    => strtolower(str_replace('-', '.', $p['matricule'])) . '@cnss.bj',
                    'password' => bcrypt('password123'),
                    'role'     => 'agent',
                    'statut'   => 'actif',
                ]
            );

            Agent::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'type'       => $p['type'],
                    'department' => $p['department'],
                    'phone'      => '+229 97 11 11 11',
                    'email'      => $user->email,
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