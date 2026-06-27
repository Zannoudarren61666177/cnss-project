import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import { User, History, Users2, TrendingUp, Award, MapPin, Phone, Mail, Network, Shield, Heart, Briefcase } from 'lucide-react';


export function PresentationPage() {
  const [activeSection, setActiveSection] = useState<'dg' | 'historique' | 'directeurs' | 'organigramme'>('dg');
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
      case 'dg':
        return (
          <div className="max-w-7xl mx-auto">
            {/* En-tête style journal */}
            <div className="border-b-4 border-[#4A90E2] mb-12 pb-6">
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
                  CNSS Bénin — Direction Générale
                </p>
                <h1
                  className="text-5xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Le Directeur Général
                </h1>
                <p className="text-gray-600 italic">
                  Apollinaire CADETE TCHINTCHIN
                </p>
              </div>
            </div>

            {/* Layout type journal - 2 colonnes */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Colonne gauche - Photo et infos */}
              <div className="lg:col-span-1">
                <div className="bg-white border-2 p-6">
                  <img
                    src="https://i.postimg.cc/KjhXcC81/Apollinaire-Tchitchin.png"
                    alt="Apollinaire CADETE TCHINTCHIN"
                    className=" h-full"
                  />
                </div>
              </div>

              {/* Colonne droite - Contenu type journal */}
              <div className="lg:col-span-2 space-y-8">
                {/* Mot du DG */}
                <div className="bg-white border-2 border-gray-200 p-8">
                  <div className="border-b-2 border-gray-900 pb-3 mb-6">
                    <h2
                      className="text-3xl font-bold text-gray-900"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Mot du Directeur Général
                    </h2>
                  </div>

                  <div
                    className="prose prose-lg max-w-none"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    <p className="text-xl italic text-gray-700 mb-6 border-l-4 border-[#4A90E2] pl-6 py-2">
                      "Chers employeurs, assurés, employés et partenaires de la
                      CNSS,"
                    </p>

                    <p className="text-gray-800 leading-relaxed mb-4 text-justify">
                      <span className="text-6xl font-bold text-[#4A90E2] float-left mr-3 mt-1 leading-none">
                        C
                      </span>
                      'est avec un grand honneur que je m'adresse à vous en tant
                      que Directeur Général de la Caisse Nationale de Sécurité
                      Sociale du Bénin. Notre mission est noble : garantir la
                      protection sociale de tous les travailleurs béninois et
                      leurs familles.
                    </p>

                    <p className="text-gray-800 leading-relaxed mb-4 text-justify">
                      Dans un monde en constante évolution, nous nous engageons
                      à moderniser nos services, à digitaliser nos processus et
                      à améliorer continuellement l'expérience de nos affiliés.
                      La transformation numérique que nous menons vise à vous
                      offrir des services plus rapides, plus accessibles et plus
                      transparents.
                    </p>

                    <div className="bg-[#4A90E2] text-white p-6 my-6">
                      <p
                        className="text-xl font-semibold text-center"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        "Ensemble, construisons un système de sécurité sociale
                        fort, inclusif et durable pour le Bénin."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Biographie */}
                <div className="bg-white border-2 border-gray-200 p-8">
                  <div className="border-b-2 border-gray-900 pb-3 mb-6">
                    <h2
                      className="text-3xl font-bold text-gray-900"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Biographie
                    </h2>
                  </div>

                  <div
                    className="space-y-6"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    <p className="text-gray-800 leading-relaxed text-justify">
                      Apollinaire CADETE TCHINTCHIN a été nommé Directeur
                      Général de la Caisse Nationale de Sécurité Sociale (CNSS)
                      du Bénin le 7 juin 2019. Juriste de formation, il est
                      titulaire d'un DESS en Droit des Affaires et Fiscalités.
                    </p>

                    <div className="bg-gray-50 p-6 border-l-4 border-[#4A90E2]">
                      <h3 className="font-bold text-gray-900 text-xl mb-3">
                        Parcours à la CNSS
                      </h3>
                      <p className="text-gray-800 leading-relaxed text-justify">
                        Avant sa nomination à la tête de l'institution, M.
                        TCHINTCHIN a occupé plusieurs postes de responsabilité
                        au sein de la CNSS : Directeur des Prestations, Attaché
                        du Directeur Général, et Chef de la Cellule des Affaires
                        Juridiques. Cette expérience approfondie lui confère une
                        connaissance complète des mécanismes de la sécurité
                        sociale au Bénin.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 border-l-4 border-[#4A90E2]">
                      <h3 className="font-bold text-gray-900 text-xl mb-3">
                        Vision et Réalisations
                      </h3>
                      <p className="text-gray-800 leading-relaxed text-justify">
                        Sous sa direction, la CNSS a entrepris une
                        transformation digitale majeure visant à améliorer
                        l'accès aux services et la qualité des prestations
                        offertes aux affiliés. Il a également mis en place une
                        politique de transparence et de bonne gouvernance qui a
                        renforcé la confiance des partenaires sociaux.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 border-l-4 border-[#4A90E2]">
                      <h3 className="font-bold text-gray-900 text-xl mb-3">
                        Engagements et Priorités
                      </h3>
                      <p className="text-gray-800 leading-relaxed text-justify">
                        Ses priorités incluent l'extension de la couverture
                        sociale, l'amélioration de la qualité des services, la
                        modernisation des infrastructures et le renforcement des
                        capacités du personnel. Il œuvre également pour une
                        meilleure collaboration avec les partenaires techniques
                        et financiers afin d'assurer la pérennité du système de
                        sécurité sociale au Bénin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'historique':
        return (
          <div>
            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .history-card {
                animation: fadeInUp 0.6s ease forwards;
                transform-style: preserve-3d;
                perspective: 1000px;
              }
              .history-card:hover .card-inner {
                transform: translateY(-6px) rotateX(2deg);
                box-shadow: 0 24px 48px rgba(74,144,226,0.18), 0 2px 8px rgba(0,0,0,0.10);
              }
              .card-inner {
                transition: transform 0.35s cubic-bezier(.25,.8,.25,1), box-shadow 0.35s ease;
                transform-style: preserve-3d;
              }
              .evolution-card:hover {
                transform: translateY(-8px) scale(1.03);
                box-shadow: 0 32px 64px rgba(74,144,226,0.22), 0 0 0 2px #4A90E2;
              }
              .evolution-card {
                transition: transform 0.35s cubic-bezier(.25,.8,.25,1), box-shadow 0.35s ease;
              }
              .timeline-dot {
                box-shadow: 0 0 0 4px rgba(74,144,226,0.25), 0 0 0 8px rgba(74,144,226,0.1);
              }
            `}</style>

            {/* En-tête */}
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest text-[#4A90E2] font-semibold mb-3">CNSS Bénin</p>
              <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Notre Histoire</h1>
              <div className="w-20 h-1 bg-[#4A90E2] mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Le système de Sécurité Sociale destiné à la couverture des salariés soumis aux dispositions du code du travail remonte aux temps coloniaux. Son institution s'est faite progressivement à travers trois branches de prestations.
              </p>
            </div>

            {/* Les 3 branches — design photo original */}
            <div className="grid md:grid-cols-3 gap-0 mb-24 rounded-3xl overflow-hidden shadow-2xl" style={{ perspective: '1200px' }}>
              {[
                {
                  titre: 'Prestations Familiales et de Maternité',
                  desc: 'Soutien aux charges de famille et protection à la maternité pour tous les salariés.',
                  photo: 'https://i.postimg.cc/sD7JLL5W/Gemini-Generated-Image-30634x30634x3063.png',
                  accent: '#4A90E2',
                  tag: 'Branche 01',
                },
                {
                  titre: 'Prestations des Risques Professionnels',
                  desc: 'Couverture des accidents du travail et des maladies professionnelles.',
                  photo: 'https://images.unsplash.com/photo-1552879890-3a06dd3a06c2?w=800&h=900&fit=crop',
                  accent: '#1a5fa8',
                  tag: 'Branche 02',
                },
                {
                  titre: 'Prestations de Pensions',
                  desc: 'Garantie d\'une retraite digne pour les travailleurs et leurs ayants droit.',
                  photo: 'https://i.postimg.cc/0NR1sFBh/Gemini-Generated-Image-grb4s2grb4s2grb4.png',
                  accent: '#2276d2',
                  tag: 'Branche 03',
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden group"
                  style={{ minHeight: 440 }}
                >
                  {/* Photo fond */}
                  <img
                    src={b.photo}
                    alt={b.titre}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay dégradé vertical */}
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(0deg, rgba(10,20,50,0.92) 0%, rgba(10,20,50,0.55) 55%, rgba(10,20,50,0.15) 100%)`
                  }}></div>
                  {/* Bande colorée latérale */}
                  <div className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
                    style={{ background: b.accent }}></div>

                  {/* Contenu */}
                  <div className="relative z-10 flex flex-col justify-end h-full p-8" style={{ minHeight: 440 }}>
                    {/* Tag flottant */}
                    <div className="absolute top-6 right-6">
                      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                        {b.tag}
                      </span>
                    </div>

                    {/* Ligne décorative */}
                    <div className="w-10 h-0.5 mb-4 transition-all duration-500 group-hover:w-20" style={{ background: b.accent }}></div>

                    <h3 className="text-white text-xl font-bold mb-3 leading-snug" style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
                      {b.titre}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Evolution — cartes 3D */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Comment la CNSS a évolué ?</h2>
                <div className="w-12 h-1 bg-[#4A90E2] mx-auto"></div>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { sigle: 'CCPF', nom: 'Caisse de Compensation des Prestations Familiales', annee: '1956' },
                  { sigle: 'CCPFAT', nom: 'Caisse de Compensation des Prestations Familiales et des Accidents du Travail', annee: '1959' },
                  { sigle: 'CDSS', nom: 'Caisse Dahoméenne de Sécurité Sociale', annee: '1970' },
                  { sigle: 'OBSS', nom: 'Office Béninois de Sécurité Sociale', annee: '1976' },
                  { sigle: 'CNSS', nom: 'Caisse Nationale de Sécurité Sociale', annee: '2003', current: true },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`evolution-card rounded-xl p-6 text-center w-44 cursor-default ${
                        e.current
                          ? 'bg-[#4A90E2] text-white shadow-2xl'
                          : 'bg-white border-2 border-gray-200 text-gray-800 shadow-lg'
                      }`}
                      style={{
                        boxShadow: e.current
                          ? '0 20px 48px rgba(74,144,226,0.35), 0 2px 8px rgba(0,0,0,0.1)'
                          : '0 8px 32px rgba(0,0,0,0.08)',
                        perspective: '800px',
                      }}
                    >
                      <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${e.current ? 'text-blue-100' : 'text-[#4A90E2]'}`}>{e.annee}</div>
                      <div className="text-2xl font-black mb-2">{e.sigle}</div>
                      <div className={`text-xs leading-snug ${e.current ? 'text-blue-100' : 'text-gray-500'}`}>{e.nom}</div>
                      {e.current && (
                        <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1 font-semibold">Actuelle</div>
                      )}
                    </div>
                    {i < 4 && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline verticale */}
            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Les grandes étapes</h2>
                <div className="w-12 h-1 bg-[#4A90E2] mx-auto"></div>
              </div>

              <div className="relative max-w-4xl mx-auto">
                {/* Ligne centrale */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4A90E2] via-blue-300 to-[#4A90E2] md:-translate-x-1/2"></div>

                <div className="space-y-10">
                  {[
                    {
                      annee: '26 Jan. 1956',
                      titre: 'Fondation — CCPF',
                      texte: 'Institution des prestations familiales couvrant les charges de famille et la maternité. Le financement était entièrement à la charge des employeurs. Les prestations familiales s\'élevaient alors à 350 FCFA.',
                    },
                    {
                      annee: '1959',
                      titre: 'Naissance de la CCPFAT',
                      texte: 'Suite à l\'institution d\'un système de réparation des accidents du travail et des maladies professionnelles, la caisse prend le nom de Caisse de Compensation des Prestations Familiales et des Accidents du Travail.',
                    },
                    {
                      annee: '27 Mars 1958',
                      titre: 'Branche Pensions',
                      texte: 'Institution de la branche des pensions de retraite avec la création de l\'Institut de Prévoyance et de Retraite de l\'Afrique Occidentale (IPRAO). Le service des pensions sera assuré par cet institut jusqu\'en 1970.',
                    },
                    {
                      annee: '1970',
                      titre: 'CDSS — Caisse Dahoméenne',
                      texte: 'La CCPFAT est profondément transformée et devient la Caisse Dahoméenne de Sécurité Sociale (CDSS). En mars 1971, elle sera temporairement scindée en deux institutions avant d\'être réunifiée en janvier 1973.',
                    },
                    {
                      annee: '26 Jan. 1976',
                      titre: 'Naissance de l\'OBSS',
                      texte: 'La Caisse Dahoméenne de Sécurité Sociale (CDSS) prend le nom de l\'Office Béninois de Sécurité Sociale (OBSS), marquant l\'indépendance et l\'identité béninoise de l\'institution.',
                    },
                    {
                      annee: '21 Mars 2003',
                      titre: 'La CNSS est née',
                      texte: 'La loi n° 98-019 du 21 Mars 2003 portant code de Sécurité Sociale en République du Bénin transforme l\'OBSS en Caisse Nationale de Sécurité Sociale (CNSS), son nom actuel.',
                      current: true,
                    },
                    {
                      annee: 'Aujourd\'hui',
                      titre: 'Prestations familiales : 2 500 FCFA',
                      texte: 'Les prestations familiales qui s\'élevaient à 350 FCFA en 1957 ont évolué progressivement : 500 FCFA (1958), 700 FCFA (1960), 1 000 FCFA (1972), 1 500 FCFA (1995) pour atteindre aujourd\'hui 2 500 FCFA par mois et par enfant.',
                    },
                  ].map((item, i) => (
                    <div key={i} className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`}>
                      {/* Dot */}
                      <div className="absolute left-8 md:left-1/2 top-5 w-4 h-4 rounded-full border-4 border-white md:-translate-x-1/2 z-10 timeline-dot"
                        style={{ background: item.current ? '#4A90E2' : '#93C5FD' }}></div>

                      {/* Spacer md */}
                      <div className="hidden md:block flex-1"></div>

                      {/* Card */}
                      <div className={`ml-16 md:ml-0 flex-1 history-card`} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div
                          className={`card-inner rounded-xl p-6 ${item.current ? 'bg-[#4A90E2] text-white' : 'bg-white border border-gray-100 text-gray-800'}`}
                          style={{
                            boxShadow: item.current
                              ? '0 16px 40px rgba(74,144,226,0.30), 0 2px 8px rgba(0,0,0,0.08)'
                              : '0 8px 24px rgba(0,0,0,0.07)',
                          }}
                        >
                          <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${item.current ? 'text-blue-100' : 'text-[#4A90E2]'}`}>{item.annee}</div>
                          <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>{item.titre}</h3>
                          <p className={`text-sm leading-relaxed ${item.current ? 'text-blue-50' : 'text-gray-600'}`}>{item.texte}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                <span className="text-blue-600 font-semibold">
                  Notre équipe de direction
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Les Directeurs Techniques
              </h1>
              <p className="text-lg text-gray-600">
                Une équipe d'experts dédiés à la modernisation et l'excellence
                des services de la CNSS
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  nom: "Marcel NOUTEVI",
                  poste: "Assistant du Directeur Général",
                  photo: "https://i.postimg.cc/5y5KNGZt/none.png",     
                  bio: "",
                  email: "adg@cnss.bj",
                },
                {
                  nom: "Bachir ABOUDOU",
                  poste: "Directeur de l’Audit Interne et de l’Inspection",
                  photo: "https://i.postimg.cc/BnzBJjWr/Bachir-Abdou.jpg",
                  bio: "",
                  email: "daii@cnss.bj",
                },
                {
                  nom: "Roger A. ABALLO",
                  poste: "Directeur des Ressources Humaines",
                  photo: "https://i.postimg.cc/rzXzh27Q/Roger-Aballo.jpg",
                  bio: "",
                  email: "drh@cnss.bj",
                },
                {
                  nom: "Thomas HOUNGBO",
                  poste: "Directeur Financier et Comptable",
                  photo: "https://i.postimg.cc/c1jDskQ7/Hugues-Sodogla.jpg",
                  bio: "",
                  email: "dfc@cnss.bj",
                },
                {
                  nom: "Edgard ZOHOUN",
                  poste: "Directeur du Recouvrement",
                  photo: "https://i.postimg.cc/5y5KNGZt/none.png",
                  bio: "",
                  email: "dr@cnss.bj",
                },
                {
                  nom: "Daniel GOUROUBERA",
                  poste: "Directeur des Prestations par intérim",
                  photo: "https://i.postimg.cc/QxVd7bnJ/daniel-Gouroubera.png",
                  bio: "",
                  email: "dpi@cnss.bj",
                },

                {
                  nom: "Azizou SALE",
                  poste: "Directeur des Systèmes d’Information",
                  photo: "https://i.postimg.cc/5y5KNGZt/none.png",
                  bio: "",
                  email: "dsi@cnss.bj",
                },
                {
                  nom: "Djouwératou BOUKARI ABOUDOU",
                  poste: "Directrice du Budget et du Patrimoine",
                  photo: "https://i.postimg.cc/5y5KNGZt/none.png",
                  bio: "",
                  email: "dbp@cnss.bj",
                },
                {
                  nom: "Hamzat ALLOU DJERMA",
                  poste: "Personne Responsable des Marchés Publics",
                  photo:
                    "https://i.postimg.cc/s2XgyJdK/Hamzat-Allou-Djerma.png",
                  bio: "",
                  email: "prmp@cnss.bj",
                },
              ].map((directeur, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={directeur.photo}
                      alt={directeur.nom}
                      className="w-full  object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {directeur.nom}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mb-3">
                      {directeur.poste}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {directeur.bio}
                    </p>
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
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Organigramme de la CNSS
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Structure organisationnelle et hiérarchique de la Caisse
                Nationale de Sécurité Sociale
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
                      <p className="text-xl font-bold">
                        Apollinaire CADETE TCHINTCHIN
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ligne verticale de connexion */}
                <div className="w-1 h-12 bg-blue-300"></div>

                {/* Lignes horizontales vers les directions */}
                <div className="relative w-full">
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-blue-300"
                    style={{ top: "0" }}
                  ></div>

                  {/* Directions techniques - 2 lignes de 3 */}
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {[
                      {
                        titre: "Direction des RH",
                        responsable: "Roger ABALLO",
                        services: ["Recrutement", "Formation", "Paie"],
                      },
                      {
                        titre: "Direction SI",
                        responsable: "Azizou SALE",
                        services: [
                          "Développement",
                          "Infrastructure",
                          "Support",
                        ],
                      },
                      {
                        titre: "Direction Prestations",
                        responsable: "Daniel GOUROUBERA",
                        services: ["Retraites", "Famille", "AT-MP"],
                      },
                      {
                        titre: "Direction Financière",
                        responsable: "Hugues SODOGLA",
                        services: ["Comptabilité", "Budget", "Trésorerie"],
                      },
                      {
                        titre: "Direction du Budget et du Patrimoine",
                        responsable: "Djouwératou BOUKARI ABOUDOU",
                        services: ["Contentieux", "Contrats", "Conformité"],
                      },
                      {
                        titre: "Direction Audit Interne et de l'Inspection",
                        responsable: "Bachir ABOUDOU",
                        services: ["Contrôle", "Risques", "Qualité"],
                      },
                      {
                        titre: "Direction de Recouvrement",
                        responsable: "Edgard ZOHOUN",
                        services: ["Contentieux", "Contrats", "Conformité"],
                      },
                    ].map((direction, index) => (
                      <div key={index} className="relative">
                        {/* Ligne verticale vers chaque direction */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-blue-300 -mt-8"></div>

                        <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-6 h-full">
                          <div className="mb-4">
                            <p className="text-blue-600 font-semibold text-sm mb-2">
                              {direction.titre}
                            </p>
                            <p className="font-bold text-gray-900">
                              {direction.responsable}
                            </p>
                          </div>
                          <div className="space-y-2">
                            {direction.services.map((service, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-gray-600 flex items-center gap-2"
                              >
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
                onClick={() => setActiveSection('dg')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'dg'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
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