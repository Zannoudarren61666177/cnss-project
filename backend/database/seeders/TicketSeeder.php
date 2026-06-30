<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer le premier utilisateur pour les tickets de test
        $user = User::first();

        if (!$user) {
            $this->command->warn('Aucun utilisateur trouvé. Création impossible des tickets.');
            return;
        }

        $tickets = [
            [
                'user_id' => $user->id,
                'sujet' => 'Problème de connexion à mon espace employeur',
                'description' => 'Je n\'arrive pas à me connecter à mon espace employeur depuis 2 jours. Le message d\'erreur indique "Identifiants invalides" alors que je suis sûr de mon mot de passe.',
                'priorite' => 'Haute',
                'statut' => 'Ouvert',
            ],
            [
                'user_id' => $user->id,
                'sujet' => 'Demande d\'information sur les cotisations',
                'description' => 'Je souhaiterais savoir quels sont les délais de paiement des cotisations pour le mois de juin 2026.',
                'priorite' => 'Normale',
                'statut' => 'En cours',
            ],
            [
                'user_id' => $user->id,
                'sujet' => 'Erreur lors du téléchargement de l\'attestation',
                'description' => 'Lorsque j\'essaie de télécharger mon attestation d\'affiliation, une erreur 500 s\'affiche. Pouvez-vous m\'aider ?',
                'priorite' => 'Critique',
                'statut' => 'Ouvert',
            ],
            [
                'user_id' => $user->id,
                'sujet' => 'Question sur les droits à la retraite',
                'description' => 'Comment puis-je consulter mes droits à la retraite ? Je ne trouve pas l\'option dans mon espace personnel.',
                'priorite' => 'Normale',
                'statut' => 'Résolu',
                'reponse' => 'Vous pouvez consulter vos droits à la retraite dans la section "Mes droits" de votre espace personnel. Le lien se trouve dans le menu de navigation à gauche.',
                'date_resolution' => now()->subDays(2),
            ],
            [
                'user_id' => $user->id,
                'sujet' => 'Modification de mes coordonnées',
                'description' => 'J\'ai changé d\'adresse et je souhaite mettre à jour mes coordonnées dans le système.',
                'priorite' => 'Basse',
                'statut' => 'Ouvert',
            ],
        ];

        foreach ($tickets as $ticket) {
            Ticket::create($ticket);
        }

        $this->command->info('Tickets de support créés avec succès.');
    }
}
