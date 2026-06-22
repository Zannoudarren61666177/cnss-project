<?php
define('LARAVEL_START', microtime(true));
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use App\Models\Agent;

$agents = Agent::pluck('name');
foreach ($agents as $name) {
    echo $name . " (length: " . strlen($name) . ")\n";
}
