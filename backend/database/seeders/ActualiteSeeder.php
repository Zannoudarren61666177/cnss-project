<?php

namespace Database\Seeders;

use App\Models\Actualite;
use Illuminate\Database\Seeder;

class ActualiteSeeder extends Seeder
{
    public function run(): void
    {
        $actualites = [
            [
                'categorie' => 'Annonce',
                'titre' => 'Nouvelle plateforme digitale CNSS',
                'description' => 'Découvrez notre nouvelle plateforme en ligne pour faciliter vos démarches administratives et le suivi de vos droits.',
                'extrait' => 'La CNSS lance sa plateforme digitale moderne permettant aux employeurs et travailleurs de gérer leurs cotisations en ligne...',
                'date_publication' => '2026-04-25',
                'temps_lecture' => '3 min',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=700&fit=crop',
                'actif' => true,
            ],
            [
                'categorie' => 'Information',
                'titre' => 'Paiement des cotisations par Mobile Money',
                'description' => 'Il est désormais possible de régler vos cotisations directement via Mobile Money. Plus simple, plus rapide.',
                'extrait' => 'Payez vos cotisations CNSS avec MTN Mobile Money, Moov Money et Celtiis Cash. Un service disponible 24h/24...',
                'date_publication' => '2026-04-20',
                'temps_lecture' => '2 min',
                'image' => 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=700&fit=crop',
                'actif' => true,
            ],
            [
                'categorie' => 'Important',
                'titre' => 'Révision des taux de cotisation pour 2026',
                'description' => 'Les nouveaux taux de cotisation applicable à partir de janvier 2026 ont été annoncés officiellement.',
                'extrait' => 'À partir du 1er janvier 2026, les taux de cotisation CNSS subiront une révision pour adapter la protection sociale...',
                'date_publication' => '2026-04-15',
                'temps_lecture' => '5 min',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=700&fit=crop',
                'actif' => true,
            ],
            [
                'categorie' => 'Formation',
                'titre' => 'Webinaire gratuit: Gestion de la paie et cotisations',
                'description' => 'Participez à notre webinaire pour apprendre les bonnes pratiques de gestion des cotisations CNSS.',
                'extrait' => 'La CNSS organise un webinaire gratuit destiné aux responsables RH et comptables des entreprises...',
                'date_publication' => '2026-04-10',
                'temps_lecture' => '4 min',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=700&fit=crop',
                'actif' => true,
            ],
            [
                'categorie' => 'Actualité',
                'titre' => 'Extension de la couverture sociale aux travailleurs indépendants',
                'description' => 'La CNSS étend progressivement sa couverture aux travailleurs indépendants et informels.',
                'extrait' => 'À partir de juin 2026, les travailleurs indépendants pourront s\'affilier volontairement à la CNSS...',
                'date_publication' => '2026-04-05',
                'temps_lecture' => '6 min',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=700&fit=crop',
                'actif' => true,
            ],
        ];

        foreach ($actualites as $actualite) {
            Actualite::updateOrCreate(
                ['titre' => $actualite['titre']],
                $actualite
            );
        }
    }
}
