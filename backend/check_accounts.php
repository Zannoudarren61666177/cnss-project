<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->boot();

use App\Models\User;
use App\Models\Employeur;

echo "🔍 Vérification de la base de données:\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

// Vérifier CNSS 12345678
$employeur = Employeur::where('numero_cnss', '12345678')->first();
if ($employeur) {
    echo "✅ Employeur trouvé: " . $employeur->company_name . "\n";
    echo "   User ID: " . $employeur->user_id . "\n";
    $user = User::find($employeur->user_id);
    if ($user) {
        echo "   Email: " . $user->email . "\n";
        echo "   Role: " . $user->role . "\n";
    }
} else {
    echo "❌ Employeur CNSS 12345678 NOT FOUND\n";
}

echo "\n📊 Tous les employeurs en base:\n";
$all = Employeur::all();
echo "   Total: " . $all->count() . "\n";
foreach ($all as $e) {
    echo "   - CNSS: " . $e->numero_cnss . " | " . $e->company_name . "\n";
}

echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
