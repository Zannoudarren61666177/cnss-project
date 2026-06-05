<?php

namespace Database\Seeders;

use App\Models\Employeur;
use App\Models\Travailleur;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeurSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'employeur@example.com'],
            ['name' => 'Employeur Demo', 'password' => bcrypt('password')]
        );

        $employeur = Employeur::firstOrCreate(
            ['email' => $user->email],
            [
                'user_id' => $user->id,
                'company_name' => 'Société Demo SARL',
                'siret' => 'SIRET123456',
                'address' => 'Abidjan, Côte d\'Ivoire',
                'phone' => '+22507070707',
                'email' => $user->email,
            ]
        );

        // Create a few travailleurs for this employeur
        $user1 = User::firstOrCreate(
            ['email' => 'jean.kouadio@example.com'],
            ['name' => 'Jean Kouadio', 'password' => bcrypt('password')]
        );

        Travailleur::firstOrCreate([
            'cin' => 'TRV001',
        ],[
            'user_id' => $user1->id,
            'employeur_id' => $employeur->id,
            'first_name' => 'Jean',
            'last_name' => 'Kouadio',
            'cin' => 'TRV001',
            'phone' => '+22501000001',
            'email' => 'jean.kouadio@example.com',
            'position' => 'Comptable',
        ]);

        $user2 = User::firstOrCreate(
            ['email' => 'fatou.diallo@example.com'],
            ['name' => 'Fatou Diallo', 'password' => bcrypt('password')]
        );

        Travailleur::firstOrCreate([
            'cin' => 'TRV002',
        ],[
            'user_id' => $user2->id,
            'employeur_id' => $employeur->id,
            'first_name' => 'Fatou',
            'last_name' => 'Diallo',
            'cin' => 'TRV002',
            'phone' => '+22501000002',
            'email' => 'fatou.diallo@example.com',
            'position' => 'Secrétaire',
        ]);

    }
}
