<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use App\Models\Employeur;
use App\Models\Travailleur;
use App\Models\Agent;
use App\Models\User;

echo "=== Synchronisation des mots de passe ===\n\n";

// Sync Employeurs
echo "Synchronisation des employeurs...\n";
$employeurs = Employeur::with('user')->get();
foreach ($employeurs as $employeur) {
    if ($employeur->user && !$employeur->password) {
        $employeur->password = $employeur->user->password;
        $employeur->save();
        echo "✓ Employeur {$employeur->numero_cnss}: mot de passe synchronisé\n";
    }
}

// Sync Travailleurs
echo "\nSynchronisation des travailleurs...\n";
$travailleurs = Travailleur::with('user')->get();
foreach ($travailleurs as $travailleur) {
    if ($travailleur->user && !$travailleur->password) {
        $travailleur->password = $travailleur->user->password;
        $travailleur->save();
        echo "✓ Travailleur {$travailleur->numero_cnss}: mot de passe synchronisé\n";
    }
}

// Sync Agents
echo "\nSynchronisation des agents...\n";
$agents = Agent::with('user')->get();
foreach ($agents as $agent) {
    if ($agent->user && !$agent->password) {
        $agent->password = $agent->user->password;
        $agent->save();
        echo "✓ Agent {$agent->user->name}: mot de passe synchronisé\n";
    }
}

echo "\n✅ Synchronisation terminée!\n";
