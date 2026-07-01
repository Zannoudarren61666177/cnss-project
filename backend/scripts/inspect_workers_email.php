<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Travailleur;

$workers = Travailleur::where('statut', 'en_attente')
    ->whereNotNull('email')
    ->where('email', '<>', '')
    ->take(20)
    ->get();

foreach ($workers as $w) {
    echo sprintf("%d | %s | %s | %s\n", $w->id, $w->email, $w->statut, $w->numero_cnss);
}

echo "Count: " . $workers->count() . "\n";
