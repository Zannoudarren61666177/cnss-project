<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'employeur@example.com')->first();
if ($user) {
    $token = $user->createToken('api_token')->plainTextToken;
    echo "User found: " . $user->name . "\n";
    echo "Token: " . $token . "\n";
} else {
    echo "User not found\n";
}
