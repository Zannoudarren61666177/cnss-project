<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$ids = [93,94];
foreach ($ids as $id) {
    $e = App\Models\Employeur::find($id);
    if (!$e) {
        echo "Not found $id\n";
        continue;
    }
    do {
        $n = (string) mt_rand(10000000, 99999999);
    } while (App\Models\Employeur::where('numero_cnss', $n)->exists());

    $e->update(['statut' => 'validee', 'numero_cnss' => $n]);
    echo "Updated $id to $n\n";
}
