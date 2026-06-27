export interface Actualite {
  id: string;
  categorie: string;
  titre: string;
  description: string;
  extrait: string;
  contenu: string;
  date: string;
  lecture: string;
  image: string;
  auteur: string;
}

export const ACTUALITES: Actualite[] = [
  {
    id: 'plateforme-digitale',
    categorie: 'Annonce',
    titre: 'Nouvelle plateforme digitale CNSS',
    description: 'Découvrez notre nouvelle plateforme en ligne pour faciliter vos démarches administratives et le suivi de vos droits.',
    extrait: 'La CNSS lance sa plateforme digitale moderne permettant aux employeurs et travailleurs de gérer leurs cotisations en ligne...',
    contenu: `La Caisse Nationale de Sécurité Sociale du Bénin franchit une étape majeure dans sa transformation numérique avec le lancement officiel de sa nouvelle plateforme digitale.

Cette plateforme constitue un guichet unique en ligne permettant aux employeurs de déclarer et payer leurs cotisations, aux travailleurs de consulter leur relevé de carrière et leurs droits en temps réel, et aux deux catégories de télécharger leurs documents officiels sans se déplacer.

Développée avec les technologies les plus récentes, la plateforme garantit la sécurité des données personnelles et la fiabilité des transactions. Elle est accessible depuis n'importe quel appareil connecté à internet — ordinateur, smartphone ou tablette.

Les premiers retours des utilisateurs pilotes sont très positifs : une réduction du temps de traitement des demandes de 70%, une diminution des déplacements physiques en agence, et une meilleure transparence dans le suivi des dossiers.

La CNSS prévoit d'enrichir progressivement la plateforme avec de nouvelles fonctionnalités : paiement par Mobile Money intégré, chatbot intelligent de support, et alertes automatiques pour les échéances de cotisations.`,
    date: '25 Avril 2026',
    lecture: '3 min',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=700&fit=crop',
    auteur: 'Direction de la Communication CNSS',
  },
  {
    id: 'mobile-money',
    categorie: 'Information',
    titre: 'Paiement des cotisations par Mobile Money',
    description: 'Il est désormais possible de régler vos cotisations directement via Mobile Money. Plus simple, plus rapide.',
    extrait: 'Payez vos cotisations CNSS avec MTN Mobile Money, Moov Money et Celtiis Cash. Un service disponible 24h/24...',
    contenu: `La CNSS élargit ses modes de paiement en intégrant les solutions Mobile Money les plus utilisées au Bénin : MTN Mobile Money, Moov Money et Celtiis Cash.

Ce nouveau service répond à une demande forte des employeurs, en particulier des petites et moyennes entreprises qui souhaitent simplifier leurs démarches de paiement des cotisations sociales.

Le processus est simple : après avoir établi sa déclaration en ligne ou en agence, l'employeur reçoit un code de paiement qu'il saisit directement dans son application Mobile Money. La transaction est confirmée instantanément et un reçu numérique est émis.

Ce service est disponible 24h/24, 7j/7, y compris les jours fériés. Il permet d'éviter les files d'attente en agence et les risques liés aux paiements en espèces.

Les frais de transaction sont à la charge de la CNSS pour les cotisations d'un montant inférieur à 500 000 FCFA. Au-delà, les frais standard de l'opérateur s'appliquent.

Pour toute assistance, contactez le support CNSS au (+229) 90 19 00 00 ou via le chat en ligne disponible sur la plateforme.`,
    date: '20 Avril 2026',
    lecture: '2 min',
    image: 'https://i.postimg.cc/pr7dvk8y/Gemini-Generated-Image-fxahlfxahlfxahlf.png',
    auteur: 'Direction des Services Numériques CNSS',
  },
  {
    id: 'portes-ouvertes',
    categorie: 'Événement',
    titre: 'Journée portes ouvertes dans nos agences',
    description: 'Venez nous rencontrer lors de nos journées portes ouvertes pour obtenir des conseils personnalisés.',
    extrait: 'Du 1er au 5 mai 2026, toutes nos agences vous accueillent pour répondre à vos questions sur vos droits sociaux...',
    contenu: `Dans le cadre de sa politique de proximité avec les assurés sociaux, la CNSS organise une semaine portes ouvertes dans l'ensemble de ses 12 agences régionales, du 1er au 5 mai 2026.

Durant cette semaine spéciale, les équipes de la CNSS seront mobilisées pour accueillir employeurs et travailleurs, répondre à leurs questions et les accompagner dans leurs démarches administratives.

Au programme de ces journées :

- Permanences de conseils personnalisés sur les droits et obligations des affiliés
- Sessions d'information sur les nouvelles fonctionnalités de la plateforme digitale
- Assistance pour l'inscription et la prise en main de l'espace en ligne
- Vérification et mise à jour des dossiers individuels
- Simulation de calcul de pension de retraite

Des conseillers spécialisés seront disponibles sans rendez-vous de 8h à 17h30 dans toutes les agences. Des dispositifs mobiles seront également déployés dans certaines communes éloignées pour toucher un maximum d'assurés.

Venez avec vos pièces d'identité et vos documents CNSS pour un accompagnement optimal.`,
    date: '15 Avril 2026',
    lecture: '2 min',
    image: 'https://i.postimg.cc/GtDWBjVB/Gemini-Generated-Image-8rkdks8rkdks8rkd.png',
    auteur: 'Direction de la Communication CNSS',
  },
  {
    id: 'cotisations-2026',
    categorie: 'Réglementation',
    titre: 'Barème des cotisations 2026 — ce qui change',
    description: 'La CNSS publie les nouveaux taux de cotisation applicables à compter du 1er janvier 2026.',
    extrait: 'Les taux de cotisation patronale et salariale pour l\'année 2026 ont été officiellement publiés. Voici ce que vous devez savoir...',
    contenu: `Conformément aux dispositions du Code de Sécurité Sociale et des textes réglementaires en vigueur, la CNSS porte à la connaissance des employeurs et travailleurs les taux de cotisation applicables pour l'exercice 2026.

Les taux demeurent stables pour l'essentiel des branches, conformément aux engagements pris lors des concertations avec les partenaires sociaux.

Cotisation salariale (à la charge du travailleur) :
- Branche vieillesse : 3,6% du salaire brut
- Branche risques professionnels : 0% (entièrement patronale)
- Total salarial : 3,6%

Cotisation patronale (à la charge de l'employeur) :
- Branche vieillesse : 6,4% du salaire brut
- Branche risques professionnels : de 1% à 5% selon le secteur d'activité
- Branche familiale : 6,4% du salaire brut
- Total patronal : de 13,8% à 17,8%

Le plafond mensuel de cotisation est fixé à 600 000 FCFA. Les salaires dépassant ce plafond ne font pas l'objet de cotisations supplémentaires.

Les employeurs sont tenus de déclarer et reverser les cotisations au plus tard le 15 du mois suivant la période de paie. Tout retard entraîne des pénalités calculées au taux légal.`,
    date: '5 Janvier 2026',
    lecture: '4 min',
    image: 'https://i.postimg.cc/Pq8P5gKP/Gemini-Generated-Image-dqh9avdqh9avdqh9.png',
    auteur: 'Direction des Cotisations CNSS',
  },
  {
    id: 'agence-natitingou',
    categorie: 'Infrastructures',
    titre: 'Inauguration de l\'agence rénovée de Natitingou',
    description: 'L\'agence CNSS de Natitingou rouvre ses portes après des travaux de modernisation complets.',
    extrait: 'Après 6 mois de travaux, l\'agence de Natitingou accueille à nouveau les assurés dans un cadre modernisé et plus fonctionnel...',
    contenu: `L'agence CNSS de Natitingou a officiellement rouvert ses portes le 10 mars 2026 après une rénovation complète de ses locaux. Cette modernisation s'inscrit dans le programme national de réhabilitation des infrastructures de la CNSS lancé en 2024.

Les travaux ont permis de doubler la superficie des locaux d'accueil, d'installer un système de climatisation, de mettre en place des salles d'attente confortables avec numérotation électronique, et d'équiper les agents de nouveaux postes informatiques connectés au système central.

L'agence de Natitingou couvre les départements de l'Atacora et de la Donga. Elle dessert environ 8 000 assurés et plus de 400 entreprises affiliées dans cette zone géographique.

La nouvelle agence dispose également d'une salle de formation pouvant accueillir 30 personnes pour les sessions d'information et de sensibilisation organisées régulièrement par la CNSS à destination des employeurs et des travailleurs de la région.

L'inauguration s'est déroulée en présence du Directeur Général de la CNSS, M. Apollinaire CADETE TCHINTCHIN, et des autorités locales. Elle traduit l'engagement de la CNSS à renforcer sa présence et la qualité de ses services dans toutes les régions du Bénin.`,
    date: '10 Mars 2026',
    lecture: '3 min',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=700&fit=crop',
    auteur: 'Direction de la Communication CNSS',
  },
  {
    id: 'retraite-anticipee',
    categorie: 'Prestations',
    titre: 'Retraite anticipée : les nouvelles conditions',
    description: 'La CNSS précise les conditions d\'accès à la retraite anticipée pour les travailleurs exposés à des emplois pénibles.',
    extrait: 'Suite à la révision du Code de Sécurité Sociale, les conditions d\'accès à la retraite anticipée ont été assouplies pour certaines catégories de travailleurs...',
    contenu: `Dans le cadre de l'application des dispositions de la loi n° 98-019 portant Code de Sécurité Sociale, la CNSS clarifie les conditions d'accès à la retraite anticipée, suite à plusieurs demandes d'éclaircissement reçues de la part d'employeurs et de travailleurs.

La retraite anticipée permet à un travailleur de liquider ses droits à pension avant l'âge légal de 60 ans, sous certaines conditions strictement définies par la réglementation.

Conditions générales :
- Avoir atteint l'âge de 55 ans révolus
- Avoir validé au minimum 240 mois (20 ans) de cotisations
- Justifier d'une incapacité de travail d'au moins 50%

Conditions spécifiques pour les emplois pénibles :
- Avoir exercé pendant au moins 15 ans dans un emploi reconnu comme pénible (mines, industrie chimique, manutention lourde)
- Avoir 52 ans révolus
- Justifier d'au moins 180 mois de cotisations

La pension de retraite anticipée est calculée de la même manière que la pension de droit commun, avec application d'un coefficient de majoration pour les travailleurs ayant cotisé au-delà du minimum requis.

Pour toute demande, les dossiers doivent être déposés en agence CNSS accompagnés des pièces justificatives correspondantes. Les délais de traitement sont de 60 jours à compter du dépôt du dossier complet.`,
    date: '28 Février 2026',
    lecture: '4 min',
    image: 'https://i.postimg.cc/vTTh18K4/Gemini-Generated-Image-dbqc7udbqc7udbqc.png',
    auteur: 'Direction des Prestations CNSS',
  },
];
