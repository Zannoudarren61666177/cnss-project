<?php

namespace App\Console\Commands;

use App\Mail\CotisationNotificationMail;
use App\Models\Cotisation;
use App\Models\Notification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class RappelCotisations extends Command
{
    protected $signature   = 'cotisations:rappels';
    protected $description = 'Envoie des rappels aux employeurs dont l\'échéance approche';

    public function handle(): void
    {
        // Rappel J-3 et Jour J
        $jours = [3, 0];

        foreach ($jours as $j) {
            $date = now()->addDays($j)->startOfDay();

            $cotisations = Cotisation::whereNotIn('status', ['Payée', 'payée', 'Vérifiée'])
                ->whereDate('echeance', $date)
                ->with(['employeur.user'])
                ->get();

            foreach ($cotisations as $cotisation) {
                if (!$cotisation->employeur?->user) continue;

                $type    = $j === 0 ? 'rappel_jour_j' : 'rappel_j3';
                $message = $j === 0
                    ? "Aujourd'hui est le dernier jour pour payer votre cotisation de {$cotisation->mois}/{$cotisation->annee} ({$cotisation->montant} FCFA). Évitez les pénalités !"
                    : "Rappel : votre cotisation de {$cotisation->mois}/{$cotisation->annee} ({$cotisation->montant} FCFA) est due dans 3 jours (le 15).";

                Notification::create([
                    'user_id' => $cotisation->employeur->user->id,
                    'type'    => $type,
                    'content' => $message,
                    'read_at' => null,
                ]);

                try {
                    Mail::to($cotisation->employeur->user->email)
                        ->send(new CotisationNotificationMail(
                            $cotisation,
                            $j === 0 ? 'jour_j' : 'rappel'
                        ));
                } catch (\Exception $e) {
                    $this->warn("Email non envoyé : " . $e->getMessage());
                }

                $this->info("📧 Rappel envoyé à {$cotisation->employeur->company_name}");
            }
        }

        $this->info('Rappels envoyés.');
    }
}