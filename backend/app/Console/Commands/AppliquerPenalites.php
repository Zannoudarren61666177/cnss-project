<?php

namespace App\Console\Commands;

use App\Mail\CotisationNotificationMail;
use App\Models\Cotisation;
use App\Models\Notification;
use App\Models\Penalite;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class AppliquerPenalites extends Command
{
    protected $signature   = 'cotisations:penalites';
    protected $description = 'Applique les pénalités progressives aux cotisations en retard';

    // Taux progressifs : mois 1 = 3%, mois 2 = 5%, mois 3 = 7%, mois 4+ = 10%
    private array $taux = [1 => 3, 2 => 5, 3 => 7];

    public function handle(): void
    {
        // Cotisations non payées dont l'échéance est dépassée
        $cotisations = Cotisation::whereNotIn('status', ['Payée', 'payée', 'Vérifiée'])
            ->whereNotNull('echeance')
            ->where('echeance', '<', now()->startOfDay())
            ->with(['employeur.user'])
            ->get();

        $this->info("Traitement de {$cotisations->count()} cotisations en retard...");

        foreach ($cotisations as $cotisation) {
            // Calculer le nombre de mois de retard
            $moisRetard = (int) now()->startOfMonth()->diffInMonths($cotisation->echeance->startOfMonth()) + 1;
            $moisRetard = max(1, $moisRetard);

            // Taux selon le mois de retard
            $taux = $this->taux[$moisRetard] ?? 10;

            // Vérifier si une pénalité existe déjà pour ce mois de retard
            $existante = Penalite::where('cotisation_id', $cotisation->id)
                ->where('mois_retard', $moisRetard)
                ->exists();

            if ($existante) {
                continue;
            }

            $montantPenalite = round($cotisation->montant * $taux / 100, 2);

            Penalite::create([
                'cotisation_id'      => $cotisation->id,
                'employeur_id'       => $cotisation->employeur_id,
                'montant_cotisation' => $cotisation->montant,
                'taux'               => $taux,
                'montant'            => $montantPenalite,
                'mois_retard'        => $moisRetard,
                'status'             => 'en_attente',
                'date_application'   => now(),
            ]);

            // Mettre à jour le statut
            $cotisation->update(['status' => 'En retard']);

            // Notification en base
            if ($cotisation->employeur?->user) {
                Notification::create([
                    'user_id' => $cotisation->employeur->user->id,
                    'type'    => 'penalite',
                    'content' => "Une pénalité de {$taux}% ({$montantPenalite} FCFA) a été appliquée à votre cotisation {$cotisation->mois}/{$cotisation->annee} pour retard de paiement.",
                    'read_at' => null,
                ]);

                // Email
                try {
                    Mail::to($cotisation->employeur->user->email)
                        ->send(new CotisationNotificationMail($cotisation, 'penalite', $montantPenalite, $taux));
                } catch (\Exception $e) {
                    $this->warn("Email non envoyé : " . $e->getMessage());
                }
            }

            $this->info("⚠️  {$cotisation->employeur?->company_name} — Pénalité {$taux}% = {$montantPenalite} FCFA");
        }

        $this->info('Traitement des pénalités terminé.');
    }
}