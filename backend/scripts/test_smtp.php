<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Mail;

$to = $argv[1] ?? config('mail.from.address');

try {
    Mail::raw('Test SMTP CNSS — si vous recevez ce message, la configuration mail fonctionne.', function ($m) use ($to) {
        $m->to($to)->subject('Test SMTP CNSS Digital');
    });
    echo "OK: email envoye a {$to}\n";
} catch (Throwable $e) {
    echo 'ERR: ' . $e->getMessage() . "\n";
    exit(1);
}
