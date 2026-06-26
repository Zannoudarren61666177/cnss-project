<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Mail\AttestationTravailleurMail;
use App\Models\Travailleur;
use Illuminate\Support\Facades\Mail;

$id = $argv[1] ?? 3;

$travailleur = Travailleur::with('employeur')->findOrFail($id);
$employeur = $travailleur->employeur;

if (! $employeur) {
    echo "ERR: employeur manquant\n";
    exit(1);
}

try {
    Mail::to($travailleur->email)->send(new AttestationTravailleurMail($travailleur, $employeur));
    echo "OK: email envoye a {$travailleur->email}\n";
} catch (Throwable $e) {
    echo 'ERR: ' . $e->getMessage() . "\n";
    exit(1);
}
