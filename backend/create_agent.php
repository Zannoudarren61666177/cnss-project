#!/usr/bin/env php
<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Agent;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

// Test create agent with known CNSS
$cnss = '9876543210'; // 10 digits

$user = User::firstOrCreate(
    ['name' => $cnss],
    [
        'email'    => $cnss . '@cnss.bj',
        'password' => Hash::make('password123'),
        'role'     => 'agent',
        'statut'   => 'actif',
    ]
);

Agent::firstOrCreate(
    ['user_id' => $user->id],
    [
        'type'       => 'immatriculation',
        'department' => 'Immatriculation',
        'phone'      => '+229 97 11 11 11',
        'email'      => $user->email,
    ]
);

echo "Agent created/updated with CNSS: $cnss\n";
echo "Password: password123\n";
