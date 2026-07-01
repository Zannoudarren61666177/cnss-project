<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Travailleur;

$statuses = Travailleur::select('statut')
    ->selectRaw('COUNT(*) as total')
    ->groupBy('statut')
    ->get();

foreach ($statuses as $status) {
    echo sprintf("status=%s total=%d\n", $status->statut, $status->total);
}

echo "\nTravailleurs avec email non null (first 20):\n";
$workers = Travailleur::whereNotNull('email')->where('email', '<>', '')->orderBy('id')->take(20)->get();
foreach ($workers as $w) {
    echo sprintf("%d | %s | %s | %s | employeur_id=%s\n", $w->id, $w->email, $w->statut, $w->numero_cnss ?? 'NULL', $w->employeur_id ?? 'NULL');
}
