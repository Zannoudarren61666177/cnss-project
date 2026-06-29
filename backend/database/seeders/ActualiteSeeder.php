<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Actualite;

class ActualiteSeeder extends Seeder
{
    public function run(): void
    {
        $actualites = [
            [
                'categorie'        => 'Annonce',
                'titre'            => 'Nouvelle plateforme digitale CNSS',
                'extrait'          => 'La CNSS lance sa plateforme digitale moderne permettant aux employeurs et travailleurs de gérer leurs cotisations en ligne...',
                'description'      => "La Caisse Nationale de Sécurité Sociale du Bénin franchit une étape majeure dans sa transformation numérique avec le lancement officiel de sa nouvelle plateforme digitale.\n\nCette plateforme constitue un guichet unique en ligne permettant aux employeurs de déclarer et payer leurs cotisations, aux travailleurs de consulter leur relevé de carrière et leurs droits en temps réel, et aux deux catégories de télécharger leurs documents officiels sans se déplacer.\n\nDéveloppée avec les technologies les plus récentes, la plateforme garantit la sécurité des données personnelles et la fiabilité des transactions. Elle est accessible depuis n'importe quel appareil connecté à internet — ordinateur, smartphone ou tablette.\n\nLes premiers retours des utilisateurs pilotes sont très positifs : une réduction du temps de traitement des demandes de 70%, une diminution des déplacements physiques en agence, et une meilleure transparence dans le suivi des dossiers.\n\nLa CNSS prévoit d'enrichir progressivement la plateforme avec de nouvelles fonctionnalités : paiement par Mobile Money intégré, chatbot intelligent de support, et alertes automatiques pour les échéances de cotisations.",
                'date_publication' => '2026-04-25',
                'temps_lecture'    => '3 min',
                'image'            => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=700&fit=crop',
                'actif'            => true,
            ],
            [
                'categorie'        => 'Information',
                'titre'            => 'Paiement des cotisations par Mobile Money',
                'extrait'          => 'Payez vos cotisations CNSS avec MTN Mobile Money, Moov Money et Celtiis Cash. Un service disponible 24h/24...',
                'description'      => "La CNSS élargit ses modes de paiement en intégrant les solutions Mobile Money les plus utilisées au Bénin : MTN Mobile Money, Moov Money et Celtiis Cash.\n\nCe nouveau service répond à une demande forte des employeurs, en particulier des petites et moyennes entreprises qui souhaitent simplifier leurs démarches de paiement des cotisations sociales.\n\nLe processus est simple : après avoir établi sa déclaration en ligne ou en agence, l'employeur reçoit un code de paiement qu'il saisit directement dans son application Mobile Money. La transaction est confirmée instantanément et un reçu numérique est émis.\n\nCe service est disponible 24h/24, 7j/7, y compris les jours fériés. Il permet d'éviter les files d'attente en agence et les risques liés aux paiements en espèces.\n\nLes frais de transaction sont à la charge de la CNSS pour les cotisations d'un montant inférieur à 500 000 FCFA. Au-delà, les frais standard de l'opérateur s'appliquent.\n\nPour toute assistance, contactez le support CNSS au (+229) 90 19 00 00 ou via le chat en ligne disponible sur la plateforme.",
                'date_publication' => '2026-04-20',
                'temps_lecture'    => '2 min',
                'image'            => 'https://i.postimg.cc/pr7dvk8y/Gemini-Generated-Image-fxahlfxahlfxahlf.png',
                'actif'            => true,
            ],
            [
                'categorie'        => 'Événement',
                'titre'            => 'Journée portes ouvertes dans nos agences',
                'extrait'          => 'Du 1er au 5 mai 2026, toutes nos agences vous accueillent pour répondre à vos questions sur vos droits sociaux...',
                'description'      => "Dans le cadre de sa politique de proximité avec les assurés sociaux, la CNSS organise une semaine portes ouvertes dans l'ensemble de ses 12 agences régionales, du 1er au 5 mai 2026.\n\nDurant cette semaine spéciale, les équipes de la CNSS seront mobilisées pour accueillir employeurs et travailleurs, répondre à leurs questions et les accompagner dans leurs démarches administratives.\n\nAu programme de ces journées :\n\n- Permanences de conseils personnalisés sur les droits et obligations des affiliés\n- Sessions d'information sur les nouvelles fonctionnalités de la plateforme digitale\n- Assistance pour l'inscription et la prise en main de l'espace en ligne\n- Vérification et mise à jour des dossiers individuels\n- Simulation de calcul de pension de retraite\n\nDes conseillers spécialisés seront disponibles sans rendez-vous de 8h à 17h30 dans toutes les agences. Des dispositifs mobiles seront également déployés dans certaines communes éloignées pour toucher un maximum d'assurés.\n\nVenez avec vos pièces d'identité et vos documents CNSS pour un accompagnement optimal.",
                'date_publication' => '2026-04-15',
                'temps_lecture'    => '2 min',
                'image'            => 'https://i.postimg.cc/GtDWBjVB/Gemini-Generated-Image-8rkdks8rkdks8rkd.png',
                'actif'            => true,
            ],
            [
                'categorie'        => 'Réglementation',
                'titre'            => 'Barème des cotisations 2026 — ce qui change',
                'extrait'          => "Les taux de cotisation patronale et salariale pour l'année 2026 ont été officiellement publiés. Voici ce que vous devez savoir...",
                'description'      => "Conformément aux dispositions du Code de Sécurité Sociale et des textes réglementaires en vigueur, la CNSS porte à la connaissance des employeurs et travailleurs les taux de cotisation applicables pour l'exercice 2026.\n\nLes taux demeurent stables pour l'essentiel des branches, conformément aux engagements pris lors des concertations avec les partenaires sociaux.\n\nCotisation salariale (à la charge du travailleur) :\n\n- Branche vieillesse : 3,6% du salaire brut\n- Branche risques professionnels : 0% (entièrement patronale)\n- Total salarial : 3,6%\n\nCotisation patronale (à la charge de l'employeur) :\n\n- Branche vieillesse : 6,4% du salaire brut\n- Branche risques professionnels : de 1% à 5% selon le secteur d'activité\n- Branche familiale : 6,4% du salaire brut\n- Total patronal : de 13,8% à 17,8%\n\nLe plafond mensuel de cotisation est fixé à 600 000 FCFA. Les salaires dépassant ce plafond ne font pas l'objet de cotisations supplémentaires.\n\nLes employeurs sont tenus de déclarer et reverser les cotisations au plus tard le 15 du mois suivant la période de paie. Tout retard entraîne des pénalités calculées au taux légal.",
                'date_publication' => '2026-01-05',
                'temps_lecture'    => '4 min',
                'image'            => 'https://i.postimg.cc/Pq8P5gKP/Gemini-Generated-Image-dqh9avdqh9avdqh9.png',
                'actif'            => true,
            ],
            [
                'categorie'        => 'Infrastructures',
                'titre'            => "Inauguration de l'agence rénovée de Natitingou",
                'extrait'          => "Après 6 mois de travaux, l'agence de Natitingou accueille à nouveau les assurés dans un cadre modernisé et plus fonctionnel...",
                'description'      => "L'agence CNSS de Natitingou a officiellement rouvert ses portes le 10 mars 2026 après une rénovation complète de ses locaux. Cette modernisation s'inscrit dans le programme national de réhabilitation des infrastructures de la CNSS lancé en 2024.\n\nLes travaux ont permis de doubler la superficie des locaux d'accueil, d'installer un système de climatisation, de mettre en place des salles d'attente confortables avec numérotation électronique, et d'équiper les agents de nouveaux postes informatiques connectés au système central.\n\nL'agence de Natitingou couvre les départements de l'Atacora et de la Donga. Elle dessert environ 8 000 assurés et plus de 400 entreprises affiliées dans cette zone géographique.\n\nLa nouvelle agence dispose également d'une salle de formation pouvant accueillir 30 personnes pour les sessions d'information et de sensibilisation organisées régulièrement par la CNSS à destination des employeurs et des travailleurs de la région.\n\nL'inauguration s'est déroulée en présence du Directeur Général de la CNSS, M. Apollinaire CADETE TCHINTCHIN, et des autorités locales. Elle traduit l'engagement de la CNSS à renforcer sa présence et la qualité de ses services dans toutes les régions du Bénin.",
                'date_publication' => '2026-03-10',
                'temps_lecture'    => '3 min',
                'image'            => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=700&fit=crop',
                'actif'            => true,
            ],
            [
                'categorie'        => 'Prestations',
                'titre'            => 'Retraite anticipée : les nouvelles conditions',
                'extrait'          => "Suite à la révision du Code de Sécurité Sociale, les conditions d'accès à la retraite anticipée ont été assouplies pour certaines catégories de travailleurs...",
                'description'      => "Dans le cadre de l'application des dispositions de la loi n° 98-019 portant Code de Sécurité Sociale, la CNSS clarifie les conditions d'accès à la retraite anticipée, suite à plusieurs demandes d'éclaircissement reçues de la part d'employeurs et de travailleurs.\n\nLa retraite anticipée permet à un travailleur de liquider ses droits à pension avant l'âge légal de 60 ans, sous certaines conditions strictement définies par la réglementation.\n\nConditions générales :\n\n- Avoir atteint l'âge de 55 ans révolus\n- Avoir validé au minimum 240 mois (20 ans) de cotisations\n- Justifier d'une incapacité de travail d'au moins 50%\n\nConditions spécifiques pour les emplois pénibles :\n\n- Avoir exercé pendant au moins 15 ans dans un emploi reconnu comme pénible (mines, industrie chimique, manutention lourde)\n- Avoir 52 ans révolus\n- Justifier d'au moins 180 mois de cotisations\n\nLa pension de retraite anticipée est calculée de la même manière que la pension de droit commun, avec application d'un coefficient de majoration pour les travailleurs ayant cotisé au-delà du minimum requis.\n\nPour toute demande, les dossiers doivent être déposés en agence CNSS accompagnés des pièces justificatives correspondantes. Les délais de traitement sont de 60 jours à compter du dépôt du dossier complet.",
                'date_publication' => '2026-02-28',
                'temps_lecture'    => '4 min',
                'image'            => 'https://i.postimg.cc/vTTh18K4/Gemini-Generated-Image-dbqc7udbqc7udbqc.png',
                'actif'            => true,
            ],
        ];

        foreach ($actualites as $data) {
            // Évite les doublons si on relance le seeder
            Actualite::firstOrCreate(
                ['titre' => $data['titre']],
                $data
            );
        }

        $this->command->info('✅ ' . count($actualites) . ' actualités insérées.');
    }
}