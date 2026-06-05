import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import { User, History, Target, Users2, TrendingUp, Award, MapPin, Phone, Mail, Network, Shield, Heart, Briefcase } from 'lucide-react';

export function PresentationPage() {
  const [activeSection, setActiveSection] = useState<'missions' | 'dg' | 'historique' | 'directeurs' | 'organigramme'>('missions');
  const [stats, setStats] = useState({ travailleurs: 0, entreprises: 0, retraites: 0, agences: 0 });

  // Animation des statistiques
  useEffect(() => {
    const targets = { travailleurs: 250000, entreprises: 15000, retraites: 80000, agences: 12 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let current = { travailleurs: 0, entreprises: 0, retraites: 0, agences: 0 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = {
        travailleurs: Math.floor((targets.travailleurs * step) / steps),
        entreprises: Math.floor((targets.entreprises * step) / steps),
        retraites: Math.floor((targets.retraites * step) / steps),
        agences: Math.floor((targets.agences * step) / steps),
      };
      setStats(current);

      if (step >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, increment);

    return () => clearInterval(timer);
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'missions':
        return (
          <div className="space-y-16">
            {/* En-tête avec image */}
            <div className="relative h-96 rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&h=600&fit=crop"
                alt="Nos missions"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/80"></div>
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-4xl mx-auto px-8 text-white">
                  <h1 className="text-5xl font-bold mb-6">Nos Missions</h1>
                  <p className="text-2xl text-blue-100">
                    Garantir la protection sociale de tous les travailleurs du Bénin
                  </p>
                </div>
              </div>
            </div>

            {/* Missions avec images */}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Protection Sociale',
                  description: 'Assurer la couverture sociale de tous les travailleurs salariés et leurs ayants droit à travers un système de sécurité sociale performant et équitable.',
                  image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
                  icon: Shield,
                },
                {
                  title: 'Prestations de Qualité',
                  description: 'Servir des prestations de qualité en matière de retraite, de prestations familiales, d\'accidents de travail et de maladies professionnelles.',
                  image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
                  icon: Heart,
                },
                {
                  title: 'Excellence du Service',
                  description: 'Moderniser et digitaliser nos services pour offrir une expérience client exceptionnelle et faciliter l\'accès aux droits sociaux.',
                  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
                  icon: Award,
                },
                {
                  title: 'Développement Économique',
                  description: 'Contribuer au développement économique et social du Bénin en assurant une gestion rigoureuse et transparente des cotisations.',
                  image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop',
                  icon: TrendingUp,
                }
              ].map((mission, index) => {
                const Icon = mission.icon;
                return (
                  <div key={index} className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={mission.image}
                        alt={mission.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-blue-900/60"></div>
                      <div className="absolute top-6 right-6 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="bg-white p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{mission.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{mission.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Statistiques animées */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Nos chiffres clés</h2>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { value: stats.travailleurs, label: 'Travailleurs affiliés', suffix: '+', icon: Users2 },
                  { value: stats.entreprises, label: 'Entreprises', suffix: '+', icon: Briefcase },
                  { value: stats.retraites, label: 'Retraités', suffix: '+', icon: Heart },
                  { value: stats.agences, label: 'Agences régionales', suffix: '', icon: MapPin }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-5xl font-bold text-white mb-2">
                        {stat.value.toLocaleString()}{stat.suffix}
                      </div>
                      <div className="text-blue-100 text-base">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Objectifs détaillés */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Nos Objectifs Stratégiques</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  'Étendre la couverture sociale à 100% des travailleurs salariés d\'ici 2030',
                  'Digitaliser 90% des services administratifs pour faciliter les démarches',
                  'Réduire les délais de traitement des dossiers de 50%',
                  'Améliorer le taux de recouvrement des cotisations',
                  'Renforcer la transparence et la gouvernance',
                  'Développer des partenariats stratégiques régionaux'
                ].map((objectif, index) => (
                  <div key={index} className="flex gap-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-blue-300 transition-all">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{objectif}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'dg':
        return (
          <div className="space-y-12">
            {/* Hero section pour le mot du DG */}
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop"
                alt="Bureau du DG"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-4xl mx-auto px-8 text-white">
                  <div className="mb-6">
                    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-4">
                      <span className="text-white font-semibold">Mot du Directeur Général</span>
                    </div>
                  </div>

                  <h1 className="text-5xl font-bold mb-6">Apollinaire CADETE TCHINTCHIN</h1>
                  <p className="text-2xl text-blue-200 mb-8">Directeur Général de la CNSS Bénin</p>

                  <div className="space-y-4 text-lg text-gray-100 leading-relaxed max-w-3xl">
                    <p className="italic text-xl">
                      "Chers employeurs, assurés, employés et partenaires de la CNSS,"
                    </p>
                    <p>
                      C'est avec un grand honneur que je m'adresse à vous en tant que Directeur Général de la Caisse Nationale de Sécurité Sociale du Bénin. Notre mission est noble : garantir la protection sociale de tous les travailleurs béninois et leurs familles.
                    </p>
                    <p className="font-semibold text-white text-xl">
                      Ensemble, construisons un système de sécurité sociale fort et inclusif pour le Bénin.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Biographie avec photo */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-32">
                  <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-blue-50">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop"
                      alt="Directeur Général"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Apollinaire CADETE TCHINTCHIN</h3>
                    <p className="text-blue-600 font-semibold mb-4">Directeur Général</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>dg@cnss.bj</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>+229 21 31 30 09</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Parcours Professionnel</h2>
                  <div className="prose max-w-none text-gray-600 space-y-4">
                    <p>
                      Apollinaire CADETE TCHINTCHIN a été nommé Directeur Général de la Caisse Nationale de Sécurité Sociale (CNSS) du Bénin le 7 juin 2019. Juriste de formation, il est titulaire d'un DESS en Droit des Affaires et Fiscalités.
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Parcours à la CNSS</h3>
                    <p>
                      Avant sa nomination à la tête de l'institution, M. TCHINTCHIN a occupé plusieurs postes de responsabilité au sein de la CNSS : Directeur des Prestations, Attaché du Directeur Général, et Chef de la Cellule des Affaires Juridiques. Cette expérience approfondie lui confère une connaissance complète des mécanismes de la sécurité sociale au Bénin.
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Vision et Réalisations</h3>
                    <p>
                      Sous sa direction, la CNSS a entrepris une transformation digitale majeure visant à améliorer l'accès aux services et la qualité des prestations offertes aux affiliés. Il a également mis en place une politique de transparence et de bonne gouvernance qui a renforcé la confiance des partenaires sociaux.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'historique':
        return (
          <div className="space-y-12">
            {/* En-tête avec image */}
            <div className="relative h-96 rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1600&h=600&fit=crop"
                alt="Histoire CNSS"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80"></div>
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-4xl mx-auto px-8 text-white">
                  <h1 className="text-5xl font-bold mb-6">Notre Histoire</h1>
                  <p className="text-2xl text-gray-200">
                    Plus de 60 ans au service de la protection sociale au Bénin
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline détaillée avec images */}
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 -translate-x-1/2 hidden lg:block"></div>

              <div className="space-y-16">
                {[
                  {
                    year: '1960',
                    title: 'Création de la CNSS',
                    description: 'Création de la Caisse Nationale de Sécurité Sociale du Dahomey (ancien nom du Bénin) pour gérer les risques sociaux des travailleurs salariés. Cette création marque le début d\'une ère nouvelle dans la protection sociale au Bénin.',
                    details: 'Première équipe de 15 agents, 500 affiliés initiaux',
                    image: 'https://images.unsplash.com/photo-1450101215322-bf5cd27478cc?w=600&h=400&fit=crop'
                  },
                  {
                    year: '1975',
                    title: 'Extension de la couverture',
                    description: 'Extension majeure de la couverture sociale aux travailleurs du secteur privé et aux entreprises publiques. Introduction des prestations familiales.',
                    details: '5,000 travailleurs couverts, 200 entreprises affiliées',
                    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop'
                  },
                  {
                    year: '1990',
                    title: 'Réforme du système',
                    description: 'Grande réforme du système de sécurité sociale avec l\'introduction des prestations familiales et l\'amélioration des pensions de retraite.',
                    details: 'Nouvelle grille des cotisations, meilleure couverture',
                    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
                  },
                  {
                    year: '2005',
                    title: 'Modernisation technologique',
                    description: 'Lancement du programme de modernisation et d\'informatisation des services. Mise en place du premier système de gestion informatisé.',
                    details: 'Déploiement de 50 ordinateurs, formation de 100 agents',
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
                  },
                  {
                    year: '2015',
                    title: 'Extension géographique',
                    description: 'Ouverture de nouvelles agences régionales pour rapprocher les services des usagers dans toutes les régions du Bénin.',
                    details: '12 agences régionales, couverture nationale complète',
                    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop'
                  },
                  {
                    year: '2020',
                    title: 'Transformation digitale',
                    description: 'Lancement de la plateforme digitale permettant les déclarations et paiements en ligne. Début d\'une nouvelle ère numérique.',
                    details: 'Application mobile, paiements en ligne, e-services',
                    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop'
                  },
                  {
                    year: '2026',
                    title: 'CNSS 4.0',
                    description: 'Déploiement complet des services en ligne et intégration des paiements mobiles. Intelligence artificielle pour le service client.',
                    details: '250K+ utilisateurs en ligne, 95% de digitalisation',
                    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop'
                  }
                ].map((event, index) => (
                  <div key={index} className={`relative grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    <div className={index % 2 === 0 ? 'lg:text-right' : ''}>
                      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                        <div className={`inline-block px-6 py-3 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4`}>
                          {event.year}
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                        <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                          {event.details}
                        </div>
                      </div>
                    </div>
                    <div className={index % 2 === 0 ? 'lg:order-last' : ''}>
                      <div className="relative rounded-2xl overflow-hidden shadow-xl">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                    </div>

                    {/* Point central sur la timeline */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'directeurs':
        return (
          <div className="space-y-12">
            {/* En-tête */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-600 font-semibold">Notre équipe de direction</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Les Directeurs Techniques</h1>
              <p className="text-lg text-gray-600">
                Une équipe d'experts dédiés à la modernisation et l'excellence des services de la CNSS
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  nom: 'Marie KOUDOU',
                  poste: 'Directrice des Ressources Humaines',
                  photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
                  bio: 'Experte en gestion RH avec 15 ans d\'expérience dans le secteur public.',
                  email: 'drh@cnss.bj'
                },
                {
                  nom: 'Alain DOSSOU',
                  poste: 'Directeur des Systèmes d\'Information',
                  photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
                  bio: 'Spécialiste en transformation digitale et systèmes d\'information.',
                  email: 'dsi@cnss.bj'
                },
                {
                  nom: 'Sylvie ABALO',
                  poste: 'Directrice des Prestations',
                  photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
                  bio: 'Gestionnaire de prestations sociales, 20 ans d\'expérience.',
                  email: 'dprest@cnss.bj'
                },
                {
                  nom: 'Thomas HOUNGBO',
                  poste: 'Directeur Financier',
                  photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
                  bio: 'Expert-comptable, spécialiste en gestion financière publique.',
                  email: 'daf@cnss.bj'
                },
                {
                  nom: 'Rachelle AZONDEKON',
                  poste: 'Directrice Juridique',
                  photo: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop',
                  bio: 'Avocate spécialisée en droit du travail et sécurité sociale.',
                  email: 'djur@cnss.bj'
                },
                {
                  nom: 'Ernest AGBODJAN',
                  poste: 'Directeur du Contrôle et de l\'Audit',
                  photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
                  bio: 'Auditeur certifié, expert en contrôle interne et gestion des risques.',
                  email: 'dca@cnss.bj'
                }
              ].map((directeur, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={directeur.photo}
                      alt={directeur.nom}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{directeur.nom}</h3>
                    <p className="text-blue-600 font-semibold text-sm mb-3">{directeur.poste}</p>
                    <p className="text-gray-600 text-sm mb-4">{directeur.bio}</p>
                    <a
                      href={`mailto:${directeur.email}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Mail className="w-4 h-4" />
                      {directeur.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'organigramme':
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Organigramme de la CNSS</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Structure organisationnelle et hiérarchique de la Caisse Nationale de Sécurité Sociale
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Direction Générale au sommet */}
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-xl mb-8">
                  <div className="flex items-center gap-4">
                    <User className="w-12 h-12" />
                    <div className="text-left">
                      <p className="text-sm opacity-90">Direction Générale</p>
                      <p className="text-xl font-bold">Apollinaire CADETE TCHINTCHIN</p>
                    </div>
                  </div>
                </div>

                {/* Ligne verticale de connexion */}
                <div className="w-1 h-12 bg-blue-300"></div>

                {/* Lignes horizontales vers les directions */}
                <div className="relative w-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-300" style={{ top: '0' }}></div>

                  {/* Directions techniques - 2 lignes de 3 */}
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {[
                      { titre: 'Direction des RH', responsable: 'Marie KOUDOU', services: ['Recrutement', 'Formation', 'Paie'] },
                      { titre: 'Direction SI', responsable: 'Alain DOSSOU', services: ['Développement', 'Infrastructure', 'Support'] },
                      { titre: 'Direction Prestations', responsable: 'Sylvie ABALO', services: ['Retraites', 'Famille', 'AT-MP'] },
                      { titre: 'Direction Financière', responsable: 'Thomas HOUNGBO', services: ['Comptabilité', 'Budget', 'Trésorerie'] },
                      { titre: 'Direction Juridique', responsable: 'Rachelle AZONDEKON', services: ['Contentieux', 'Contrats', 'Conformité'] },
                      { titre: 'Direction Audit', responsable: 'Ernest AGBODJAN', services: ['Contrôle', 'Risques', 'Qualité'] }
                    ].map((direction, index) => (
                      <div key={index} className="relative">
                        {/* Ligne verticale vers chaque direction */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-blue-300 -mt-8"></div>

                        <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-6 h-full">
                          <div className="mb-4">
                            <p className="text-blue-600 font-semibold text-sm mb-2">{direction.titre}</p>
                            <p className="font-bold text-gray-900">{direction.responsable}</p>
                          </div>
                          <div className="space-y-2">
                            {direction.services.map((service, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                {service}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Sous-navigation pleine largeur */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="w-full">
            <div className="flex justify-center items-center gap-2 py-4 px-4 overflow-x-auto">
              <button
                onClick={() => setActiveSection('missions')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'missions'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Target className="w-5 h-5" />
                Nos Missions
              </button>
              <button
                onClick={() => setActiveSection('dg')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'dg'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <User className="w-5 h-5" />
                Le Directeur Général
              </button>
              <button
                onClick={() => setActiveSection('historique')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'historique'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <History className="w-5 h-5" />
                Historique
              </button>
              <button
                onClick={() => setActiveSection('directeurs')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'directeurs'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users2 className="w-5 h-5" />
                Les Directeurs Techniques
              </button>
              <button
                onClick={() => setActiveSection('organigramme')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'organigramme'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Network className="w-5 h-5" />
                Organigramme
              </button>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {renderContent()}
        </div>

        <Footer />
      </div>
    </PublicLayout>
  );
}
