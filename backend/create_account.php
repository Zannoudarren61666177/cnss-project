<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->boot();

use App\Models\User;
use App\Models\Employeur;
use Illuminate\Support\Facades\Hash;

try {
    // Créer l'utilisateur
    $user = User::create([
        'email' => 'hojine@cnss.bj',
        'password' => Hash::make('password123'),
        'name' => 'Hojine Enterprises',
        'role' => 'employeur',
        'statut' => 'actif',
    ]);

    echo "✅ User créé ID: " . $user->id . "\n";

    // Créer le profil employeur
    $employeur = Employeur::create([
        'user_id' => $user->id,
        'numero_cnss' => '12345678',
        'company_name' => 'Hojine Enterprises',
        'password' => Hash::make('password123'),
        'statut' => 'actif',
    ]);

    echo "✅ Employeur créé!\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "CNSS: 12345678\n";
    echo "Email: hojine@cnss.bj\n";
    echo "Password: password123\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
