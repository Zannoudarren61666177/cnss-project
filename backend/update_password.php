<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Employeur;
use App\Models\Travailleur;
use App\Models\Agent;
use Illuminate\Support\Facades\Hash;

if ($argc < 3) {
    echo "Usage: php update_password.php <type> <cnss> <nouveau_password>\n";
    echo "Types: employeur, travailleur, agent\n";
    echo "Exemple: php update_password.php employeur 16879391 monMotDePasse123\n";
    exit(1);
}

$type = $argv[1];
$cnss = $argv[2];
$newPassword = $argv[3];

$user = null;

if ($type === 'employeur') {
    $employeur = Employeur::where('numero_cnss', $cnss)->first();
    if ($employeur) {
        $user = User::find($employeur->user_id);
    }
} elseif ($type === 'travailleur') {
    $travailleur = Travailleur::where('numero_cnss', $cnss)->first();
    if ($travailleur) {
        $user = User::find($travailleur->user_id);
    }
} elseif ($type === 'agent') {
    // Agent: la colonne 'name' contient le CNSS numérique
    $user = User::where('role', 'agent')
        ->where('name', $cnss)
        ->first();
}

if ($user) {
    $user->password = Hash::make($newPassword);
    $user->save();
    echo "✅ Mot de passe modifié!\n";
    echo "   Utilisateur: {$user->email}\n";
    echo "   CNSS: $cnss\n";
    echo "   Nouveau mot de passe: $newPassword\n";
} else {
    echo "❌ Utilisateur $type avec CNSS $cnss non trouvé\n";
}
