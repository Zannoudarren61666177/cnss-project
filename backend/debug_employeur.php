<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use App\Models\Employeur;
use App\Models\User;

$employeur = Employeur::where('numero_cnss', '16879391')->first();

if (!$employeur) {
    echo "Employeur not found\n";
    exit(1);
}

echo "=== Employeur Found ===\n";
echo "ID: {$employeur->id}\n";
echo "CNSS: {$employeur->numero_cnss}\n";
echo "User ID: {$employeur->user_id}\n";
echo "Password: " . (($employeur->password) ? "Yes (length: " . strlen($employeur->password) . ")" : "NULL") . "\n";

if ($employeur->user_id) {
    $user = User::find($employeur->user_id);
    if ($user) {
        echo "\n=== Associated User ===\n";
        echo "User ID: {$user->id}\n";
        echo "Email: {$user->email}\n";
        echo "Role: {$user->role}\n";
        echo "Password Hash: " . substr($user->password, 0, 20) . "...\n";
        
        // Test password
        $password = 'password123';
        echo "\nPassword check: " . (\Illuminate\Support\Facades\Hash::check($password, $user->password) ? "PASS" : "FAIL") . "\n";
        echo "Password from employeur check: " . (\Illuminate\Support\Facades\Hash::check($password, $employeur->password) ? "PASS" : "FAIL") . "\n";
    } else {
        echo "User not found for user_id {$employeur->user_id}\n";
    }
}
