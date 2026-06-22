<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Agent;
use Illuminate\Support\Facades\Hash;

// Create a test agent user
$user = User::create([
    'name' => 'Agent Test',
    'email' => 'agent.test@cnss.bj',
    'password' => Hash::make('password123'),
    'role' => 'agent',
    'statut' => 'actif'
]);

// Create agent profile with numeric name (10 digits)
Agent::create([
    'user_id' => $user->id,
    'name' => '5678901234', // 10-digit numeric name
    'agent_type' => 'immatriculation' // or another type
]);

echo "Agent created successfully!\n";
echo "CNSS Number: 5678901234\n";
echo "Password: password123\n";
