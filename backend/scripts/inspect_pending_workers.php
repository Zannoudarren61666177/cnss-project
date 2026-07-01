<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Travailleur;

$workers = Travailleur::where('statut', 'en_attente')->orderBy('id')->take(50)->get();

foreach ($workers as $w) {
    echo sprintf("%d | email=%s | statut=%s | numero_cnss=%s | employeur_id=%s\n", $w->id, $w->email ?? 'NULL', $w->statut, $w->numero_cnss ?? 'NULL', $w->employeur_id ?? 'NULL');
}

echo "Total pending: " . $workers->count() . "\n";
