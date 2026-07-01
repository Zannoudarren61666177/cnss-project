<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Mail\AttestationTravailleurMail;
use App\Mail\AttestationEmployeurMail;
use App\Models\Travailleur;
use App\Models\Employeur;
use Illuminate\Support\Facades\Mail;

$email = $argv[1] ?? null;

if (! $email) {
    echo "Usage: php send_attestation_by_email.php email@example.com\n";
    exit(1);
}

$travailleur = Travailleur::with('employeur')->where('email', $email)->first();

if ($travailleur) {
    if (! $travailleur->employeur) {
        echo "ERR: travailleur trouvé mais employeur manquant\n";
        exit(1);
    }

    try {
        Mail::to($email)->send(new AttestationTravailleurMail($travailleur, $travailleur->employeur));
        echo "OK: attestation travailleur envoyée à {$email}\n";
        exit(0);
    } catch (Throwable $e) {
        echo "ERR: {$e->getMessage()}\n";
        exit(1);
    }
}

$employeur = Employeur::where('email', $email)->first();

if ($employeur) {
    try {
        Mail::to($email)->send(new AttestationEmployeurMail($employeur));
        echo "OK: attestation employeur envoyée à {$email}\n";
        exit(0);
    } catch (Throwable $e) {
        echo "ERR: {$e->getMessage()}\n";
        exit(1);
    }
}

echo "ERR: aucun travailleur ou employeur trouvé pour {$email}\n";
exit(1);
