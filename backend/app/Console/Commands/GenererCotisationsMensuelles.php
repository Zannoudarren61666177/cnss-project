<?php

namespace App\Console\Commands;

use App\Mail\CotisationNotificationMail;
use App\Models\Cotisation;
use App\Models\Employeur;
use App\Models\CotisationDetail;
use App\Models\Notification;
use App\Models\Travailleur;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class GenererCotisationsMensuelles extends Command
{
    protected $signature   = 'cotisations:generer';
    protected $description = 'Génère les cotisations mensuelles pour tous les employeurs actifs';

    public function handle(): void
    {
        $mois  = now()->month;
        $annee = now()->year;

        $employeurs = Employeur::where('statut', 'actif')
            ->whereHas('travailleurs', fn($q) => $q->where('statut', 'actif')->whereNotNull('salaire_brut'))
            ->with(['user', 'travailleurs' => fn($q) => $q->where('statut', 'actif')->whereNotNull('salaire_brut')])
            ->get();

        $this->info("Génération des cotisations pour {$employeurs->count()} employeurs...");

        foreach ($employeurs as $employeur) {
            // Éviter les doublons
            $existe = Cotisation::where('employeur_id', $employeur->id)
                ->where('mois', $mois)
                ->where('annee', $annee)
                ->exists();

            if ($existe) {
                $this->warn("Cotisation déjà générée pour {$employeur->company_name}");
                continue;
            }

            $tauxSalarial = 3.6;
            $tauxPatronal = 15.4;
            $montantTotal = 0;
            $details      = [];

            foreach ($employeur->travailleurs as $travailleur) {
                $salaire         = (float) $travailleur->salaire_brut;
                $montantSalarial = round($salaire * $tauxSalarial / 100, 2);
                $montantPatronal = round($salaire * $tauxPatronal / 100, 2);
                $total           = $montantSalarial + $montantPatronal;
                $montantTotal   += $total;

                $details[] = [
                    'travailleur_id'   => $travailleur->id,
                    'salaire_brut'     => $salaire,
                    'taux_salarial'    => $tauxSalarial,
                    'taux_patronal'    => $tauxPatronal,
                    'montant_salarial' => $montantSalarial,
                    'montant_patronal' => $montantPatronal,
                    'montant_total'    => $total,
                ];
            }

            // Échéance = 15 du mois courant
            $echeance = now()->setDay(15)->startOfDay();

            $cotisation = Cotisation::create([
                'employeur_id' => $employeur->id,
                'montant'      => $montantTotal,
                'mois'         => $mois,
                'annee'        => $annee,
                'status'       => 'En attente',
                'reference'    => 'CTS-' . $annee . str_pad($mois, 2, '0', STR_PAD_LEFT) . '-' . $employeur->id,
                'echeance'     => $echeance,
            ]);

            foreach ($details as $detail) {
                $detail['cotisation_id'] = $cotisation->id;
                CotisationDetail::create($detail);
            }

            // Notification en base
            if ($employeur->user) {
                Notification::create([
                    'user_id' => $employeur->user->id,
                    'type'    => 'cotisation_generee',
                    'content' => "Votre cotisation de " . number_format($montantTotal, 0, ',', ' ') . " FCFA pour {$mois}/{$annee} est disponible. Échéance : 15/{$mois}/{$annee}.",
                    'read_at' => null,
                ]);

                // Email
                try {
                    Mail::to($employeur->user->email)
                        ->send(new CotisationNotificationMail($cotisation, 'generee'));
                } catch (\Exception $e) {
                    $this->warn("Email non envoyé pour {$employeur->company_name} : " . $e->getMessage());
                }
            }

            $this->info("✅ {$employeur->company_name} — {$montantTotal} FCFA");
        }

        $this->info('Génération terminée.');
    }
}