<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // 1er de chaque mois à 8h00 — génération des cotisations
        $schedule->command('cotisations:generer')
            ->monthlyOn(1, '08:00')
            ->withoutOverlapping()
            ->runInBackground();

        // 12 de chaque mois à 8h00 — rappel J-3
        $schedule->command('cotisations:rappels')
            ->monthlyOn(12, '08:00')
            ->withoutOverlapping();

        // 15 de chaque mois à 8h00 — rappel jour J
        $schedule->command('cotisations:rappels')
            ->monthlyOn(15, '08:00')
            ->withoutOverlapping();

        // 16 de chaque mois à 00h01 — application des pénalités
        $schedule->command('cotisations:penalites')
            ->monthlyOn(16, '00:01')
            ->withoutOverlapping()
            ->runInBackground();
    }

    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');
        require base_path('routes/console.php');
    }
}