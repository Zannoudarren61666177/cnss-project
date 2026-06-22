<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Employeur;
use App\Models\Travailleur;
use App\Models\User;
use App\Models\Agent;

$employeurs = Employeur::select('id','company_name','numero_cnss','email')->get();
$travailleurs = Travailleur::select('id','first_name','last_name','numero_cnss','email')->get();
$agents = User::where('role','agent')->select('id','name','email')->get();

echo "--- EMPLOYEURS ---\n";
foreach ($employeurs as $e) {
    echo "id: {$e->id} | company: {$e->company_name} | numero_cnss: {$e->numero_cnss} | email: {$e->email}\n";
}

echo "\n--- TRAVAILLEURS ---\n";
foreach ($travailleurs as $t) {
    echo "id: {$t->id} | name: {$t->first_name} {$t->last_name} | numero_cnss: {$t->numero_cnss} | email: {$t->email}\n";
}

echo "\n--- AGENTS (users role=agent) ---\n";
foreach ($agents as $a) {
    echo "id: {$a->id} | name: {$a->name} | email: {$a->email}\n";
}

