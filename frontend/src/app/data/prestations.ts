export interface Prestation {
  id: string;
  numero: string;
  titre: string;
  description: string;
  contenu: string;
  photo: string;
  tag: string;
  avantages: { label: string; valeur: string }[];
  conditions: string[];
  documents: string[];
  contact: string;
}

export const PRESTATIONS: Prestation[] = [
  {
    id: 'familiales',
    numero: '01',
    titre: 'Prestations Familiales',
    description: 'Allocations mensuelles, congé maternité et prime de naissance pour soutenir chaque famille affiliée.',
    contenu: `Les prestations familiales constituent l'un des piliers fondamentaux de la protection sociale assurée par la CNSS depuis 1956. Elles visent à compenser les charges liées à l'entretien des enfants à charge des travailleurs affiliés.

La branche familiale couvre deux risques essentiels : les charges de famille et la maternité. Le financement est assuré par les cotisations patronales, garantissant ainsi une couverture universelle pour tous les salariés relevant du code du travail béninois.

Depuis juin 1979, les prestations ont été étendues aux enfants des salariés retraités, reconnaissant ainsi la continuité du droit social au-delà de la vie active.`,
    photo: 'https://images.unsplash.com/photo-1649028489371-6e3c36f12ee7?w=1200&h=700&fit=crop',
    tag: '2 500 FCFA / enfant / mois',
    avantages: [
      { label: 'Allocations familiales', valeur: '2 500 FCFA / enfant / mois' },
      { label: 'Indemnité journalière maternité', valeur: '100% du salaire de base' },
      { label: 'Prime de naissance', valeur: 'Versée à la déclaration de naissance' },
      { label: 'Extension aux enfants retraités', valeur: 'Depuis juin 1979' },
      { label: 'Durée congé maternité', valeur: '14 semaines minimum' },
    ],
    conditions: [
      "Être affilié à la CNSS en tant que salarié",
      "Avoir un contrat de travail en cours de validité",
      "Déclarer les enfants à charge auprès de la CNSS",
      "Les enfants doivent être âgés de moins de 14 ans (21 ans si scolarisés)",
    ],
    documents: [
      "Acte de naissance de l'enfant",
      "Certificat de scolarité (pour les enfants scolarisés)",
      "Certificat médical de grossesse (pour la maternité)",
      "Livret de famille",
    ],
    contact: "(+229) 90 19 00 00",
  },
  {
    id: 'risques',
    numero: '02',
    titre: 'Risques Professionnels',
    description: "Prise en charge totale en cas d'accident du travail ou de maladie professionnelle.",
    contenu: `La branche des risques professionnels protège les travailleurs contre les conséquences des accidents survenus dans le cadre de leur activité professionnelle et des maladies contractées du fait ou à l'occasion du travail.

Cette branche garantit une prise en charge immédiate et complète, sans délai de carence, dès le premier jour d'arrêt de travail. La CNSS assure ainsi la continuité du revenu et la prise en charge des soins médicaux, que l'accident survienne au poste de travail ou sur le trajet domicile-travail.

En cas d'incapacité permanente, une rente est versée au travailleur. En cas de décès, les ayants droit bénéficient d'une rente de survie et d'un capital décès.`,
    photo: 'https://images.unsplash.com/photo-1622612023350-b15f063eabe6?w=1200&h=700&fit=crop',
    tag: '100% des soins couverts',
    avantages: [
      { label: 'Prise en charge médicale', valeur: 'Totale et immédiate' },
      { label: 'Indemnités journalières', valeur: "Dès le 1er jour d'arrêt" },
      { label: "Rente d'incapacité permanente", valeur: 'Selon taux d\'incapacité' },
      { label: 'Capital décès', valeur: 'Versé aux ayants droit' },
      { label: 'Rente de survie', valeur: 'Pour conjoint et orphelins' },
    ],
    conditions: [
      "Être salarié affilié à la CNSS",
      "L'accident doit survenir au lieu de travail ou sur le trajet",
      "Déclarer l'accident dans les 48 heures à l'employeur",
      "L'employeur doit déclarer l'accident à la CNSS dans les 48 heures",
    ],
    documents: [
      "Déclaration d'accident de travail (formulaire CNSS)",
      "Certificat médical initial d'accident du travail",
      "Rapport de l'employeur",
      "Pièce d'identité du travailleur",
    ],
    contact: "(+229) 90 19 00 00",
  },
  {
    id: 'pensions',
    numero: '03',
    titre: 'Pensions de Retraite',
    description: "Pension de vieillesse, retraite anticipée et pension d'invalidité pour une retraite sereine.",
    contenu: `La branche des pensions constitue le fondement de la sécurité sociale à long terme. Instituée depuis le 27 mars 1958, elle garantit à tout travailleur affilié un revenu de remplacement à l'âge de la retraite, après une carrière de cotisations.

La pension de vieillesse est calculée sur la base du salaire moyen des meilleures années de cotisation et du nombre de trimestres validés. Plus le travailleur a cotisé longtemps, plus sa pension est élevée, dans la limite du plafond fixé par la réglementation.

La retraite anticipée est possible dans certains cas (emplois pénibles, incapacité partielle), sous réserve d'avoir validé un nombre minimum de trimestres. La pension d'invalidité intervient lorsque le travailleur se trouve dans l'impossibilité permanente d'exercer une activité professionnelle.`,
    photo: 'https://images.unsplash.com/photo-1593614202631-c29a06abba1d?w=1200&h=700&fit=crop',
    tag: 'Dès 60 ans / 180 mois',
    avantages: [
      { label: 'Pension de vieillesse', valeur: "À partir de 60 ans" },
      { label: 'Cotisations minimales requises', valeur: '180 mois (15 ans)' },
      { label: 'Retraite anticipée', valeur: 'Sur demande justifiée' },
      { label: "Pension d'invalidité", valeur: "Incapacité permanente ≥ 2/3" },
      { label: 'Pension de réversion', valeur: 'Pour le conjoint survivant' },
    ],
    conditions: [
      "Avoir atteint l'âge légal de départ à la retraite (60 ans)",
      "Avoir cotisé au moins 180 mois (15 ans)",
      "Avoir cessé toute activité salariée",
      "Faire une demande officielle auprès de la CNSS",
    ],
    documents: [
      "Demande de liquidation de pension (formulaire CNSS)",
      "Pièce d'identité en cours de validité",
      "Relevé de carrière établi par la CNSS",
      "Attestation de cessation d'activité",
      "Relevé d'identité bancaire (RIB)",
    ],
    contact: "(+229) 90 19 00 00",
  },
  {
    id: 'sante',
    numero: '04',
    titre: 'Soins de Santé',
    description: "Consultations, hospitalisations et médicaments remboursés pour le travailleur et sa famille.",
    contenu: `La couverture santé de la CNSS garantit aux travailleurs affiliés et à leurs familles un accès facilité aux soins médicaux. Elle couvre les consultations médicales, les hospitalisations, les actes paramédicaux et les médicaments prescrits par un médecin.

La prise en charge s'étend au conjoint et aux enfants à charge reconnus par la CNSS. Les soins peuvent être dispensés dans les structures de santé publiques et dans les cliniques conventionnées avec la CNSS sur l'ensemble du territoire national.

Le système de tiers payant permet dans de nombreux cas d'éviter l'avance de frais, les établissements de santé facturant directement à la CNSS la part prise en charge.`,
    photo: 'https://images.unsplash.com/photo-1672655412906-8e10ba6ee373?w=1200&h=700&fit=crop',
    tag: "Jusqu'à 80% remboursés",
    avantages: [
      { label: 'Consultations médicales', valeur: 'Prise en charge partielle' },
      { label: 'Hospitalisation', valeur: 'Couverture assurée' },
      { label: 'Médicaments prescrits', valeur: 'Sur ordonnance médicale' },
      { label: 'Actes paramédicaux', valeur: 'Laboratoire, radiologie' },
      { label: 'Maternité et pédiatrie', valeur: 'Suivi complet couvert' },
    ],
    conditions: [
      "Être affilié à la CNSS et à jour de ses cotisations",
      "Présenter sa carte d'affilié CNSS",
      "Consulter dans un établissement conventionné",
      "Conserver toutes les pièces justificatives pour le remboursement",
    ],
    documents: [
      "Carte d'affilié CNSS",
      "Ordonnance médicale originale",
      "Factures et reçus des soins",
      "Résultats d'examens médicaux",
    ],
    contact: "(+229) 90 19 00 00",
  },
];
