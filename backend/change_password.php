<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Exemple: Modifier mot de passe de l'employeur CNSS 16879391
$user = User::where('role', 'employeur')
    ->whereHas('employeur', function ($q) {
        $q->where('numero_cnss', '16879391');
    })
    ->first();

if ($user) {
    $user->password = Hash::make('nouveau_mot_de_passe');
    $user->save();
    echo "Mot de passe modifié pour: {$user->email}\n";
} else {
    echo "Utilisateur non trouvé\n";
}
