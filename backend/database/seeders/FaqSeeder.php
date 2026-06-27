<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Comment créer mon compte employeur ?',
                'reponse' => "Pour créer votre compte employeur, vous devez d'abord soumettre une demande d'adhésion via le formulaire d'inscription en ligne. Après validation de votre dossier par un agent CNSS, vous recevrez par email votre numéro CNSS et pourrez activer votre compte avec votre email et un mot de passe de votre choix.",
                'categorie' => 'Immatriculation',
            ],
            [
                'question' => 'Quels sont les délais de paiement des cotisations ?',
                'reponse' => "Les cotisations doivent être déclarées et payées au plus tard 15 jours après la fin du mois concerné. Par exemple, les cotisations du mois de janvier doivent être réglées avant le 15 février.",
                'categorie' => 'Cotisations',
            ],
            [
                'question' => 'Quel est le taux de cotisation CNSS ?',
                'reponse' => "Le taux global de cotisation est de 19% du salaire brut, réparti en 3,6% à la charge du salarié et 15,4% à la charge de l'employeur.",
                'categorie' => 'Cotisations',
            ],
            [
                'question' => "Comment déclarer un nouveau travailleur ?",
                'reponse' => "Connectez-vous à votre espace employeur, puis utilisez le formulaire 'Déclarer un nouveau travailleur' pour renseigner ses informations personnelles et professionnelles. Le travailleur recevra ensuite son propre numéro CNSS après validation.",
                'categorie' => 'Travailleurs',
            ],
            [
                'question' => "Où trouver mon attestation d'affiliation ?",
                'reponse' => "Votre attestation d'affiliation est disponible dans la section 'Mes documents' de votre espace personnel. Elle peut être téléchargée à tout moment au format PDF.",
                'categorie' => 'Documents',
            ],
            [
                'question' => "Quelles sont les prestations offertes par la CNSS ?",
                'reponse' => "La CNSS gère trois branches de prestations : les prestations familiales (allocations familiales, maternité), la branche des pensions (vieillesse, invalidité, survivants) et les risques professionnels (accidents du travail, maladies professionnelles).",
                'categorie' => 'Prestations',
            ],
            [
                'question' => "Combien de mois de cotisation faut-il pour la retraite ?",
                'reponse' => "180 mois de cotisations (soit 15 ans) sont nécessaires pour ouvrir droit à une pension de vieillesse à la CNSS.",
                'categorie' => 'Prestations',
            ],
            [
                'question' => "Comment consulter mes droits à la retraite ?",
                'reponse' => "Pour consulter vos droits à la retraite, connectez-vous à votre espace personnel sur le site CNSS. Dans la section 'Mes droits', vous trouverez le détail de vos cotisations, le nombre de mois validés et une estimation de votre future pension.",
                'categorie' => 'Prestations',
            ],
            [
                'question' => "Comment contacter la CNSS ?",
                'reponse' => "Vous pouvez nous joindre au +229 90 19 00 00, par email à info@cnss.bj, ou vous rendre directement à notre siège situé au 390, Avenue Jean-Paul II, Cotonou.",
                'categorie' => 'Contact',
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                $faq
            );
        }
    }
}