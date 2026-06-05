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
        $user = User::firstOrCreate(
            ['email' => 'agent@example.com'],
            ['name' => 'Agent CNSS', 'password' => bcrypt('password')]
        );

        Agent::firstOrCreate(
            ['email' => $user->email],
            [
                'user_id' => $user->id,
                'type' => 'operational',
                'department' => 'Support',
                'phone' => '+22501010101',
                'email' => $user->email,
            ]
        );
    }
}
