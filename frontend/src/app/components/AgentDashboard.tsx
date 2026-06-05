import { useState } from 'react';
import {
  Home,
  Users,
  FileText,
  CreditCard,
  Heart,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  Eye,
  Edit,
  UserPlus,
  TrendingUp,
  BarChart2,
  Lock,
  Key,
  Activity,
  RefreshCw,
  Filter,
  Plus,
  Send,
  BookOpen,
  Newspaper,
  HelpCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Link } from 'react-router';
import { CNSSLogo } from './CNSSLogo';

// ─── Role definitions ─────────────────────────────────────────────────────────

type RoleId =
  | 'immatriculation'
  | 'employeur'
  | 'cotisation'
  | 'prestations'
  | 'support'
  | 'admin';

interface Role {
  id: RoleId;
  label: string;
  color: string;
  badge: string;
}

const ROLES: Role[] = [
  { id: 'immatriculation', label: "Agent d'immatriculation", color: 'bg-violet-100 text-violet-700', badge: 'Immatriculation' },
  { id: 'employeur',       label: 'Agent gestion employeurs', color: 'bg-blue-100 text-blue-700',   badge: 'Employeurs'      },
  { id: 'cotisation',      label: 'Agent de cotisation',      color: 'bg-teal-100 text-teal-700',   badge: 'Cotisation'      },
  { id: 'prestations',     label: 'Agent de prestations',     color: 'bg-pink-100 text-pink-700',   badge: 'Prestations'     },
  { id: 'support',         label: 'Agent contenu / support',  color: 'bg-orange-100 text-orange-700', badge: 'Support'       },
  { id: 'admin',           label: 'Administrateur',           color: 'bg-red-100 text-red-700',     badge: 'Admin'           },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, color }: { label: string; value: string | number; sub?: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

type BadgeVariant = 'green' | 'orange' | 'red' | 'blue' | 'gray' | 'violet';
const badgeClasses: Record<BadgeVariant, string> = {
  green:  'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  red:    'bg-red-100 text-red-700',
  blue:   'bg-blue-100 text-blue-700',
  gray:   'bg-gray-100 text-gray-500',
  violet: 'bg-violet-100 text-violet-700',
};
function Badge({ label, variant = 'gray' }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClasses[variant]}`}>
      {label}
    </span>
  );
}

function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {sub && <p className="text-sm text-gray-500 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative mb-5">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

// ─── Agent Immatriculation ────────────────────────────────────────────────────

const demandesEmployeurs = [
  {
    id: 'EMP-2026-0012',
    raisonSociale: 'SOBEBRA SA',
    formeJuridique: 'SA',
    secteur: 'Industrie',
    adresse: 'Zone Industrielle, Cotonou',
    telephone: '+229 21 30 04 32',
    email: 'rh@sobebra.bj',
    dateCreation: '15 mars 1995',
    dateDemande: '05 mai 2026',
    statut: 'En attente' as const
  },
  {
    id: 'EMP-2026-0011',
    raisonSociale: 'BÉNIN TÉLÉCOM',
    formeJuridique: 'SA',
    secteur: 'Télécommunications',
    adresse: 'Avenue Clozel, Cotonou',
    telephone: '+229 21 31 50 00',
    email: 'drh@benintelecom.bj',
    dateCreation: '12 janvier 2000',
    dateDemande: '04 mai 2026',
    statut: 'En attente' as const
  },
  {
    id: 'EMP-2026-0010',
    raisonSociale: 'ECOBANK BÉNIN',
    formeJuridique: 'SA',
    secteur: 'Banque et Finance',
    adresse: 'Avenue Jean-Paul II, Cotonou',
    telephone: '+229 21 31 30 30',
    email: 'ressources.humaines@ecobank.com',
    dateCreation: '20 août 1989',
    dateDemande: '03 mai 2026',
    statut: 'Validée' as const
  },
];

const demandesTravailleursParEmployeur = [
  {
    employeurId: 'EMP-2026-0010',
    employeur: 'ECOBANK BÉNIN',
    immatriculation: 'BJ-EMP-20260503-0010',
    travailleurs: [
      { id: 'TRV-001', nom: 'AGOSSOU Félicité', prenom: 'Félicité', dateNaissance: '12/03/1985', poste: 'Chargée de clientèle', salaire: '450 000', statut: 'En attente' as const },
      { id: 'TRV-002', nom: 'KOUDJO Marcel', prenom: 'Marcel', dateNaissance: '05/07/1990', poste: 'Analyste financier', salaire: '520 000', statut: 'En attente' as const },
      { id: 'TRV-003', nom: 'HOUNKPE Sabine', prenom: 'Sabine', dateNaissance: '18/11/1988', poste: 'Responsable crédit', salaire: '680 000', statut: 'En attente' as const },
    ]
  },
];

type ImmatTab = 'apercu' | 'employeurs' | 'travailleurs' | 'historique';

function AgentImmatriculation() {
  const [tab, setTab] = useState<ImmatTab>('apercu');
  const [detailEmployeur, setDetailEmployeur] = useState<string | null>(null);
  const [detailTravailleur, setDetailTravailleur] = useState<string | null>(null);

  const tabs = [
    { id: 'apercu' as ImmatTab, label: 'Aperçu', icon: <Home className="w-4 h-4" /> },
    { id: 'employeurs' as ImmatTab, label: 'Demandes employeurs', icon: <Users className="w-4 h-4" /> },
    { id: 'travailleurs' as ImmatTab, label: 'Déclaration travailleurs', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'historique' as ImmatTab, label: 'Historique', icon: <Clock className="w-4 h-4" /> },
  ];

  const statusBadge = (s: 'En attente' | 'Validée' | 'Rejetée') => {
    const map = { 'En attente': 'orange', 'Validée': 'green', 'Rejetée': 'red' } as const;
    return <Badge label={s} variant={map[s]} />;
  };

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === 'apercu' && (
        <div className="space-y-6">
          <SectionHeader title="Immatriculation" sub="Gestion des demandes d'immatriculation employeurs et travailleurs" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Employeurs en attente" value={2} icon={<Users className="w-5 h-5" />} color="bg-violet-100 text-violet-600" />
            <StatCard label="Travailleurs en attente" value={3} sub="1 employeur" icon={<UserPlus className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
            <StatCard label="Validés ce mois" value={12} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-100 text-green-600" />
            <StatCard label="Rejetés" value={1} sub="Ce mois" icon={<XCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Demandes employeurs récentes</h3>
              <div className="space-y-3">
                {demandesEmployeurs.slice(0, 3).map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{d.raisonSociale}</p>
                      <p className="text-xs text-gray-500">{d.id} · {d.secteur}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {statusBadge(d.statut)}
                      <button onClick={() => { setTab('employeurs'); setDetailEmployeur(d.id); }} className="text-blue-600 hover:text-blue-700"><Eye className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab('employeurs')} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Voir toutes les demandes <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Déclarations travailleurs</h3>
              <div className="space-y-3">
                {demandesTravailleursParEmployeur.map(emp => (
                  <div key={emp.employeurId} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm text-gray-900">{emp.employeur}</p>
                      <Badge label={`${emp.travailleurs.length} travailleurs`} variant="blue" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{emp.immatriculation}</p>
                    <button onClick={() => { setTab('travailleurs'); }} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      Voir les travailleurs <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab('travailleurs')} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Voir toutes les déclarations <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'employeurs' && (
        <div className="space-y-4">
          {!detailEmployeur ? (
            <>
              <SectionHeader title="Demandes d'immatriculation employeurs" sub="2 demandes en attente de validation" />
              <SearchBar placeholder="Rechercher par raison sociale, secteur..." />
              <div className="space-y-3">
                {demandesEmployeurs.map(emp => (
                  <div key={emp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{emp.raisonSociale}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{emp.id} · Demande du {emp.dateDemande}</p>
                      </div>
                      {statusBadge(emp.statut)}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">Forme juridique:</span>
                        <span className="ml-2 font-medium text-gray-900">{emp.formeJuridique}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Secteur:</span>
                        <span className="ml-2 font-medium text-gray-900">{emp.secteur}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-gray-500">Adresse:</span>
                        <span className="ml-2 font-medium text-gray-900">{emp.adresse}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Téléphone:</span>
                        <span className="ml-2 font-medium text-gray-900">{emp.telephone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 font-medium text-gray-900">{emp.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date de création:</span>
                        <span className="ml-2 font-medium text-gray-900">{emp.dateCreation}</span>
                      </div>
                    </div>
                    {emp.statut === 'En attente' && (
                      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                          Valider et envoyer attestation
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors">
                          <XCircle className="w-4 h-4" />
                          Rejeter
                        </button>
                        <button onClick={() => setDetailEmployeur(emp.id)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="w-4 h-4" />
                          Voir détails
                        </button>
                      </div>
                    )}
                    {emp.statut === 'Validée' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-green-900">Demande validée</p>
                            <p className="text-xs text-green-700 mt-0.5">
                              N° Immatriculation: <span className="font-mono font-bold">BJ-EMP-20260503-0010</span>
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              ✓ Attestation envoyée · ✓ Lien d'adhésion envoyé à {emp.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <button onClick={() => setDetailEmployeur(null)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                <ChevronRight className="w-4 h-4 rotate-180" />
                Retour à la liste
              </button>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Détails de la demande</h2>
                <p className="text-gray-500">Affichage complet des informations de l'employeur...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'travailleurs' && (
        <div className="space-y-4">
          <SectionHeader title="Déclaration des travailleurs" sub="Demandes groupées par employeur" />
          <SearchBar placeholder="Rechercher par employeur ou travailleur..." />
          {demandesTravailleursParEmployeur.map(emp => (
            <div key={emp.employeurId} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900">{emp.employeur}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Immatriculation: <span className="font-mono font-semibold text-gray-700">{emp.immatriculation}</span>
                  </p>
                </div>
                <Badge label={`${emp.travailleurs.length} travailleurs`} variant="blue" />
              </div>
              <div className="space-y-2">
                {emp.travailleurs.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">{t.nom} {t.prenom}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t.poste} · Né(e) le {t.dateNaissance} · Salaire: {t.salaire} FCFA
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(t.statut)}
                      {t.statut === 'En attente' && (
                        <>
                          <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="Valider">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Rejeter">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Détails">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Tout valider ({emp.travailleurs.filter(t => t.statut === 'En attente').length})
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Exporter la liste
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'historique' && (
        <div>
          <SectionHeader title="Historique" sub="Toutes les demandes traitées" />
          <SearchBar placeholder="Rechercher dans l'historique..." />
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Historique des demandes validées et rejetées...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Agent Employeur ──────────────────────────────────────────────────────────

const employeursData = [
  {
    id: 'EMP-001',
    immatriculation: 'BJ-EMP-20210315-001',
    raisonSociale: 'SOBEBRA SA',
    secteur: 'Industrie',
    ville: 'Cotonou',
    nbTravailleurs: 245,
    statut: 'Actif' as const,
    cotisation: 'À jour'
  },
  {
    id: 'EMP-002',
    immatriculation: 'BJ-EMP-20190112-002',
    raisonSociale: 'BÉNIN TÉLÉCOM',
    secteur: 'Télécommunications',
    ville: 'Cotonou',
    nbTravailleurs: 387,
    statut: 'Actif' as const,
    cotisation: 'À jour'
  },
  {
    id: 'EMP-003',
    immatriculation: 'BJ-EMP-20200820-003',
    raisonSociale: 'ECOBANK BÉNIN',
    secteur: 'Banque et Finance',
    ville: 'Cotonou',
    nbTravailleurs: 156,
    statut: 'Actif' as const,
    cotisation: 'En retard'
  },
  {
    id: 'EMP-004',
    immatriculation: 'BJ-EMP-20180204-004',
    raisonSociale: 'ORANGE BÉNIN',
    secteur: 'Télécommunications',
    ville: 'Cotonou',
    nbTravailleurs: 298,
    statut: 'Actif' as const,
    cotisation: 'À jour'
  },
];

const travailleursParEmployeur = [
  {
    employeurId: 'EMP-001',
    employeur: 'SOBEBRA SA',
    travailleurs: [
      { mat: 'BJ-2021-00847-T', nom: 'ADJOVI Romuald', poste: 'Technicien production', ville: 'Cotonou', statut: 'Actif' as const },
      { mat: 'BJ-2022-01103-T', nom: 'SENOU Bertrand', poste: 'Responsable logistique', ville: 'Cotonou', statut: 'Actif' as const },
    ]
  },
  {
    employeurId: 'EMP-002',
    employeur: 'BÉNIN TÉLÉCOM',
    travailleurs: [
      { mat: 'BJ-2019-00312-T', nom: 'KPOSSOU Diane', poste: 'Chargée clientèle', ville: 'Porto-Novo', statut: 'Actif' as const },
    ]
  },
  {
    employeurId: 'EMP-003',
    employeur: 'ECOBANK BÉNIN',
    travailleurs: [
      { mat: 'BJ-2020-00561-T', nom: 'AÏZON Emmanuel', poste: 'Analyste crédit', ville: 'Cotonou', statut: 'Actif' as const },
      { mat: 'BJ-2018-00204-T', nom: 'HOUNKPÈ Sabine', poste: 'Chargée de clientèle', ville: 'Cotonou', statut: 'Inactif' as const },
    ]
  },
];

type EmployeurTab = 'apercu' | 'employeurs' | 'changements';

function AgentEmployeur() {
  const [tab, setTab] = useState<EmployeurTab>('apercu');
  const [selectedEmployeur, setSelectedEmployeur] = useState<string | null>(null);

  const tabs = [
    { id: 'apercu' as EmployeurTab, label: 'Aperçu', icon: <Home className="w-4 h-4" /> },
    { id: 'employeurs' as EmployeurTab, label: 'Liste employeurs', icon: <Users className="w-4 h-4" /> },
    { id: 'changements' as EmployeurTab, label: "Changements d'employeur", icon: <RefreshCw className="w-4 h-4" /> },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === 'apercu' && (
        <div className="space-y-6">
          <SectionHeader title="Gestion Employeurs" sub="Suivi des employeurs et de leurs travailleurs" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Employeurs actifs" value="2 418" icon={<Users className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
            <StatCard label="Total travailleurs" value="6 847" icon={<UserPlus className="w-5 h-5" />} color="bg-green-100 text-green-600" />
            <StatCard label="Changements en attente" value={2} icon={<RefreshCw className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
            <StatCard label="Employeurs en retard" value={5} sub="Cotisation" icon={<AlertCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Employeurs récents</h3>
              <div className="space-y-3">
                {employeursData.slice(0, 3).map(emp => (
                  <div key={emp.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { setTab('employeurs'); setSelectedEmployeur(emp.id); }}>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{emp.raisonSociale}</p>
                      <p className="text-xs text-gray-500">{emp.nbTravailleurs} travailleurs · {emp.secteur}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
              <button onClick={() => setTab('employeurs')} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Voir tous les employeurs <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Changements d'employeur</h3>
              <div className="space-y-3">
                {[
                  { nom: 'AÏZON Emmanuel', ancien: 'PORT AUTONOME', nouveau: 'ECOBANK BÉNIN' },
                  { nom: 'KPOSSOU Diane', ancien: 'BÉNIN TÉLÉCOM', nouveau: 'MTN BÉNIN' },
                ].map((c, i) => (
                  <div key={i} className="p-3 border border-gray-100 rounded-lg">
                    <p className="font-semibold text-sm text-gray-900">{c.nom}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="line-through">{c.ancien}</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="font-medium text-gray-700">{c.nouveau}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab('changements')} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Voir tous les changements <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'employeurs' && (
        <div className="space-y-4">
          {!selectedEmployeur ? (
            <>
              <SectionHeader title="Liste des employeurs" sub="2 418 employeurs immatriculés" />
              <SearchBar placeholder="Rechercher par raison sociale, secteur..." />
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['N° Immatriculation', 'Raison sociale', 'Secteur', 'Ville', 'Travailleurs', 'Cotisation', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employeursData.map(emp => (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{emp.immatriculation}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{emp.raisonSociale}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{emp.secteur}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{emp.ville}</td>
                        <td className="px-4 py-3"><Badge label={`${emp.nbTravailleurs}`} variant="blue" /></td>
                        <td className="px-4 py-3"><Badge label={emp.cotisation} variant={emp.cotisation === 'À jour' ? 'green' : 'red'} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedEmployeur(emp.id)} className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                            <button className="p-1 text-gray-400 hover:text-orange-500"><Edit className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div>
              <button onClick={() => setSelectedEmployeur(null)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                <ChevronRight className="w-4 h-4 rotate-180" />
                Retour à la liste
              </button>
              {(() => {
                const emp = employeursData.find(e => e.id === selectedEmployeur);
                const empTrav = travailleursParEmployeur.find(e => e.employeurId === selectedEmployeur);
                return emp ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{emp.raisonSociale}</h2>
                          <p className="text-sm text-gray-500 mt-0.5">{emp.immatriculation}</p>
                        </div>
                        <Badge label={emp.statut} variant="green" />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Secteur:</span>
                          <span className="ml-2 font-medium text-gray-900">{emp.secteur}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Ville:</span>
                          <span className="ml-2 font-medium text-gray-900">{emp.ville}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Travailleurs:</span>
                          <span className="ml-2 font-medium text-gray-900">{emp.nbTravailleurs}</span>
                        </div>
                      </div>
                    </div>

                    {empTrav && (
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Travailleurs de {emp.raisonSociale}</h3>
                        <div className="space-y-2">
                          {empTrav.travailleurs.map(t => (
                            <div key={t.mat} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{t.nom}</p>
                                <p className="text-xs text-gray-500">{t.mat} · {t.poste} · {t.ville}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge label={t.statut} variant={t.statut === 'Actif' ? 'green' : 'gray'} />
                                <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                                <button className="p-1 text-gray-400 hover:text-orange-500"><Edit className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      )}

      {tab === 'changements' && (
        <div className="space-y-4">
          <SectionHeader title="Changements d'employeur" sub="Demandes de transfert en attente de validation" />
          {[
            { nom: 'AÏZON Emmanuel', matricule: 'BJ-2020-00561-T', ancien: 'PORT AUTONOME DE COTONOU', nouveau: 'ECOBANK BÉNIN', date: '03 mai 2026' },
            { nom: 'KPOSSOU Diane', matricule: 'BJ-2019-00312-T', ancien: 'BÉNIN TÉLÉCOM', nouveau: 'MTN BÉNIN', date: '01 mai 2026' },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{c.nom}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.matricule}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="line-through text-gray-400">{c.ancien}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-700">{c.nouveau}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Demande du {c.date}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700">
                  <CheckCircle className="w-3.5 h-3.5" />Valider
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50">
                  <XCircle className="w-3.5 h-3.5" />Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Agent Cotisation ─────────────────────────────────────────────────────────

const declarations = [
  { ref: 'DCL-2026-1042', employeur: 'SOBEBRA SA', periode: 'Avr 2026', montant: '2 340 000', statut: 'En attente' as const, echeance: '15 mai 2026' },
  { ref: 'DCL-2026-1041', employeur: 'COMPLEXE LA VICTOIRE', periode: 'Avr 2026', montant: '187 500', statut: 'En retard' as const, echeance: '15 mai 2026' },
  { ref: 'DCL-2026-1040', employeur: 'ORANGE BÉNIN', periode: 'Avr 2026', montant: '8 120 000', statut: 'Vérifiée' as const, echeance: '15 mai 2026' },
  { ref: 'DCL-2026-1039', employeur: 'ECOBANK BÉNIN', periode: 'Avr 2026', montant: '5 450 000', statut: 'Vérifiée' as const, echeance: '15 mai 2026' },
  { ref: 'DCL-2026-1038', employeur: 'BÉNIN TÉLÉCOM', periode: 'Avr 2026', montant: '3 780 000', statut: 'Rejetée' as const, echeance: '15 mai 2026' },
];

function AgentCotisation() {
  const statusBadge = (s: typeof declarations[0]['statut']) => {
    const map = { 'En attente': 'orange', 'En retard': 'red', 'Vérifiée': 'green', 'Rejetée': 'red' } as const;
    return <Badge label={s} variant={map[s]} />;
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Cotisations" sub="Vérification des déclarations et paiements employeurs" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Déclarations reçues" value={143} sub="Ce mois" icon={<FileText className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="En attente" value={18} icon={<Clock className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="En retard" value={5} icon={<AlertCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
        <StatCard label="Total encaissé" value="487M FCFA" sub="Avr 2026" icon={<TrendingUp className="w-5 h-5" />} color="bg-teal-100 text-teal-600" />
      </div>

      <div>
        <SearchBar placeholder="Rechercher par référence ou employeur..." />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Référence', 'Employeur', 'Période', 'Montant', 'Échéance', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {declarations.map(d => (
                <tr key={d.ref} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{d.ref}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{d.employeur}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{d.periode}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium text-xs">{d.montant} FCFA</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{d.echeance}</td>
                  <td className="px-4 py-3">{statusBadge(d.statut)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      {d.statut === 'En attente' && <button className="p-1 text-gray-400 hover:text-green-600"><CheckCircle className="w-4 h-4" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Employeurs en retard</h3>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
            <Send className="w-4 h-4" />Relancer tous
          </button>
        </div>
        <div className="space-y-3">
          {[
            { nom: 'COMPLEXE LA VICTOIRE', retard: '35 jours', montant: '187 500 FCFA', dernierContact: '20 avr. 2026' },
            { nom: 'BÉNIN TÉLÉCOM', retard: '12 jours', montant: '3 780 000 FCFA', dernierContact: '01 mai 2026' },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-red-100 rounded-lg bg-red-50">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">{e.nom}</p>
                <p className="text-xs text-gray-600">Retard: <span className="text-red-600 font-semibold">{e.retard}</span> · {e.montant}</p>
              </div>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">Relancer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Agent Prestations ────────────────────────────────────────────────────────

const demandesPrest = [
  { id: 'PREST-2026-0231', nom: 'HOUNKPÈ Sabine', type: 'Pension invalidité', date: '04 mai 2026', statut: 'En attente' as const },
  { id: 'PREST-2026-0230', nom: 'AGOSSOU Félicité', type: 'Allocation maternité', date: '03 mai 2026', statut: 'En cours' as const },
  { id: 'PREST-2026-0229', nom: 'SOSSOU Patrick', type: 'Accident du travail', date: '02 mai 2026', statut: 'Approuvée' as const },
  { id: 'PREST-2026-0228', nom: 'SENOU Bertrand', type: 'Allocation familiale', date: '01 mai 2026', statut: 'Approuvée' as const },
  { id: 'PREST-2026-0227', nom: 'DJENONTIN Marie', type: 'Retraite anticipée', date: '28 avr. 2026', statut: 'Rejetée' as const },
];

function AgentPrestations() {
  const statusBadge = (s: typeof demandesPrest[0]['statut']) => {
    const map = { 'En attente': 'orange', 'En cours': 'blue', 'Approuvée': 'green', 'Rejetée': 'red' } as const;
    return <Badge label={s} variant={map[s]} />;
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Prestations" sub="Instruction et paiement des prestations sociales" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Demandes reçues" value={28} sub="Ce mois" icon={<Heart className="w-5 h-5" />} color="bg-pink-100 text-pink-600" />
        <StatCard label="En attente" value={9} icon={<Clock className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="Approuvées" value={16} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-100 text-green-600" />
        <StatCard label="Total versé" value="12,4M FCFA" sub="Avr 2026" icon={<CreditCard className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
      </div>

      <div>
        <SearchBar placeholder="Rechercher par bénéficiaire ou type de prestation..." />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Référence', 'Bénéficiaire', 'Type', 'Date', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {demandesPrest.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{d.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{d.nom}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{d.type}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{d.date}</td>
                  <td className="px-4 py-3">{statusBadge(d.statut)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      {d.statut === 'En attente' && (
                        <>
                          <button className="p-1 text-gray-400 hover:text-green-600"><CheckCircle className="w-4 h-4" /></button>
                          <button className="p-1 text-gray-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Paiements à effectuer</h3>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
            <CreditCard className="w-4 h-4" />Traiter tous
          </button>
        </div>
        <div className="space-y-3">
          {[
            { nom: 'SOSSOU Patrick', type: 'Accident du travail', montant: '450 000 FCFA', methode: 'Mobile Money' },
            { nom: 'SENOU Bertrand', type: 'Allocation familiale', montant: '9 000 FCFA', methode: 'Virement' },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">{p.nom}</p>
                <p className="text-xs text-gray-500">{p.type} · {p.methode}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-gray-900">{p.montant}</p>
                <button className="mt-1 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700">Payer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Agent Support ────────────────────────────────────────────────────────────

function AgentSupport() {
  const tickets = [
    { id: 'TKT-0812', user: 'ADJOVI Romuald', sujet: "Problème de connexion à l'espace travailleur", date: '05 mai 2026', priorite: 'Haute', statut: 'Ouvert' as const },
    { id: 'TKT-0811', user: 'Entreprise ABC SARL', sujet: 'Déclaration du mois de mars non prise en compte', date: '04 mai 2026', priorite: 'Critique', statut: 'En cours' as const },
    { id: 'TKT-0810', user: 'KPOSSOU Diane', sujet: 'Erreur sur le montant de la pension retraite estimée', date: '03 mai 2026', priorite: 'Normale', statut: 'Résolu' as const },
  ];

  const prioriteVariant = (p: string): BadgeVariant => {
    if (p === 'Critique') return 'red';
    if (p === 'Haute') return 'orange';
    if (p === 'Normale') return 'blue';
    return 'gray';
  };

  const statutVariant = (s: typeof tickets[0]['statut']): BadgeVariant => {
    if (s === 'Ouvert') return 'orange';
    if (s === 'En cours') return 'blue';
    return 'green';
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Support & Contenu" sub="Gestion des tickets, FAQ et actualités" />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Tickets ouverts" value={8} icon={<MessageSquare className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="Articles FAQ" value={24} icon={<BookOpen className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="Actualités publiées" value={12} sub="Ce mois" icon={<Newspaper className="w-5 h-5" />} color="bg-green-100 text-green-600" />
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-4">Tickets de support</h3>
        <SearchBar placeholder="Rechercher un ticket..." />
        <div className="space-y-3">
          {tickets.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start gap-4">
              <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.sujet}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.id} · {t.user} · {t.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={t.priorite} variant={prioriteVariant(t.priorite)} />
                    <Badge label={t.statut} variant={statutVariant(t.statut)} />
                  </div>
                </div>
              </div>
              <button className="p-1 text-gray-400 hover:text-blue-600"><ChevronRight className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">FAQ</h3>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">+ Nouvel article</button>
          </div>
          <div className="space-y-2">
            {[
              { question: 'Comment immatriculer un nouveau travailleur ?', vues: 2341 },
              { question: 'Quels documents pour une pension de retraite ?', vues: 1876 },
              { question: 'Payer les cotisations via Mobile Money', vues: 1543 },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-gray-900 truncate">{f.question}</p>
                  <p className="text-xs text-gray-400">{f.vues.toLocaleString()} vues</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-blue-600"><Edit className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Actualités</h3>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">+ Nouvelle</button>
          </div>
          <div className="space-y-3">
            {[
              { titre: 'Lancement du nouveau portail numérique', statut: 'Publiée', vues: 1243 },
              { titre: 'Rappel : déclarations avril dues au 15 mai', statut: 'Publiée', vues: 3892 },
              { titre: 'Ouverture agence Natitingou rénovée', statut: 'Brouillon', vues: 0 },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Newspaper className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-gray-900 truncate">{a.titre}</p>
                  <p className="text-xs text-gray-400">{a.vues > 0 ? `${a.vues} vues` : 'Brouillon'}</p>
                </div>
                <Badge label={a.statut} variant={a.statut === 'Publiée' ? 'green' : 'gray'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Administrateur ───────────────────────────────────────────────────────────

const compteAgents = [
  { id: 'agent-001', nom: 'TOKPANOU Brice',    email: 'b.tokpanou@cnss.bj',   role: 'immatriculation' as RoleId,    statut: 'Actif',    derniere: '06 mai 2026 08:41' },
  { id: 'agent-002', nom: 'ABLO Nadège',       email: 'n.ablo@cnss.bj',        role: 'employeur' as RoleId,          statut: 'Actif',    derniere: '05 mai 2026 17:02' },
  { id: 'agent-003', nom: 'DÈDÈ Rodrigue',     email: 'r.dede@cnss.bj',        role: 'cotisation' as RoleId,         statut: 'Actif',    derniere: '06 mai 2026 09:15' },
  { id: 'agent-004', nom: 'FASSINOU Pélagie',  email: 'p.fassinou@cnss.bj',    role: 'prestations' as RoleId,        statut: 'Actif',    derniere: '05 mai 2026 14:30' },
  { id: 'agent-005', nom: 'GANDONOU Stéphane', email: 's.gandonou@cnss.bj',    role: 'support' as RoleId,            statut: 'Inactif',  derniere: '28 avr. 2026 16:00' },
  { id: 'agent-006', nom: 'AZONDEKON Lucie',   email: 'l.azondekon@cnss.bj',   role: 'admin' as RoleId,              statut: 'Actif',    derniere: '06 mai 2026 08:05' },
];

const auditLog = [
  { id: 'log-001', user: 'DÈDÈ Rodrigue',    action: 'Validation déclaration DCL-2026-1040',      date: '06 mai 2026 09:12', service: 'Cotisation' },
  { id: 'log-002', user: 'TOKPANOU Brice',   action: 'Validation employeur EMP-2026-0010',        date: '06 mai 2026 08:54', service: 'Immatriculation' },
  { id: 'log-003', user: 'AZONDEKON Lucie',  action: 'Modification compte GANDONOU Stéphane',     date: '05 mai 2026 17:45', service: 'Administration' },
  { id: 'log-004', user: 'FASSINOU Pélagie', action: 'Approbation prestation PREST-2026-0229',    date: '05 mai 2026 14:27', service: 'Prestations' },
  { id: 'log-005', user: 'ABLO Nadège',      action: 'Mise à jour employeur SOBEBRA SA',          date: '05 mai 2026 13:01', service: 'Gestion Employeurs' },
];

type AdminTab = 'supervision' | 'utilisateurs';

function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('supervision');
  const [editingAgent, setEditingAgent] = useState<string | null>(null);

  const tabs = [
    { id: 'supervision' as AdminTab, label: 'Supervision générale', icon: <Activity className="w-4 h-4" /> },
    { id: 'utilisateurs' as AdminTab, label: 'Gestion utilisateurs', icon: <Users className="w-4 h-4" /> },
  ];

  const getRoleInfo = (roleId: RoleId) => ROLES.find(r => r.id === roleId)!;

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === 'supervision' && (
        <div className="space-y-6">
          <SectionHeader title="Supervision générale" sub="Vue d'ensemble de toutes les activités CNSS" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="Employeurs immatriculés" value="2 418" sub="Gestion employeurs" icon={<Users className="w-5 h-5" />} color="bg-violet-100 text-violet-600" />
            <StatCard label="Travailleurs actifs" value="6 847" sub="+ 3 en attente" icon={<UserPlus className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
            <StatCard label="Déclarations cotisation" value={18} sub="En attente" icon={<FileText className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
            <StatCard label="Demandes prestations" value={9} sub="À instruire" icon={<Heart className="w-5 h-5" />} color="bg-pink-100 text-pink-600" />
            <StatCard label="Tickets support" value={8} sub="Ouverts" icon={<MessageSquare className="w-5 h-5" />} color="bg-teal-100 text-teal-600" />
          </div>

          {/* Statistiques circulaires */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-center">Employeurs par catégorie</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'PME', value: 1450, color: '#3b82f6' },
                        { name: 'Grandes entreprises', value: 568, color: '#8b5cf6' },
                        { name: 'Micro-entreprises', value: 400, color: '#06b6d4' },
                      ]}
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {[
                        { name: 'PME', value: 1450, color: '#3b82f6' },
                        { name: 'Grandes entreprises', value: 568, color: '#8b5cf6' },
                        { name: 'Micro-entreprises', value: 400, color: '#06b6d4' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px' }}
                      formatter={(value, entry: any) => (
                        <span className="text-xs text-gray-600">{value}: {entry.payload.value.toLocaleString()}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-center">Cotisations - Mai 2026</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Payées', value: 1985, color: '#10b981' },
                        { name: 'En retard', value: 318, color: '#f59e0b' },
                        { name: 'Non payées', value: 115, color: '#ef4444' },
                      ]}
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {[
                        { name: 'Payées', value: 1985, color: '#10b981' },
                        { name: 'En retard', value: 318, color: '#f59e0b' },
                        { name: 'Non payées', value: 115, color: '#ef4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px' }}
                      formatter={(value, entry: any) => (
                        <span className="text-xs text-gray-600">{value}: {entry.payload.value.toLocaleString()}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-center">Prestations par type</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Retraite', value: 542, color: '#ec4899' },
                        { name: 'Familiales', value: 328, color: '#6366f1' },
                        { name: 'AT-MP', value: 87, color: '#f97316' },
                        { name: 'Invalidité', value: 54, color: '#14b8a6' },
                      ]}
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {[
                        { name: 'Retraite', value: 542, color: '#ec4899' },
                        { name: 'Familiales', value: 328, color: '#6366f1' },
                        { name: 'AT-MP', value: 87, color: '#f97316' },
                        { name: 'Invalidité', value: 54, color: '#14b8a6' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px' }}
                      formatter={(value, entry: any) => (
                        <span className="text-xs text-gray-600">{value}: {entry.payload.value.toLocaleString()}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Activité par service</h3>
              <div className="space-y-3">
                {[
                  { service: 'Immatriculation', demandes: 5, color: 'bg-violet-500' },
                  { service: 'Gestion Employeurs', demandes: 2, color: 'bg-blue-500' },
                  { service: 'Cotisation', demandes: 18, color: 'bg-teal-500' },
                  { service: 'Prestations', demandes: 9, color: 'bg-pink-500' },
                  { service: 'Support', demandes: 8, color: 'bg-orange-500' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-1 h-8 ${s.color} rounded-full`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{s.service}</p>
                      <p className="text-xs text-gray-500">{s.demandes} demandes en attente</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Agents actifs aujourd'hui</h3>
              <div className="space-y-2">
                {compteAgents.filter(a => a.statut === 'Actif').slice(0, 5).map(a => {
                  const roleInfo = getRoleInfo(a.role);
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-700">{a.nom[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{a.nom}</p>
                        <p className="text-xs text-gray-500">{roleInfo.label}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Journal d'activité récente</h3>
            <div className="space-y-2">
              {auditLog.map(l => (
                <div key={l.id} className="flex items-start gap-3 text-sm py-3 border-b border-gray-50 last:border-0">
                  <Activity className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-900">{l.user}</span>
                    <span className="text-gray-500"> — {l.action}</span>
                    <div className="mt-0.5">
                      <Badge label={l.service} variant="blue" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{l.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'utilisateurs' && (
        <div className="space-y-4">
          <SectionHeader title="Gestion des utilisateurs" sub={`${compteAgents.length} comptes agents enregistrés`} action={
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />Créer un compte
            </button>
          } />
          <SearchBar placeholder="Rechercher un agent..." />
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Agent', 'Email', 'Profil / Rôle', 'Statut', 'Dernière connexion', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {compteAgents.map(a => {
                  const roleInfo = getRoleInfo(a.role);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-700">{a.nom[0]}</span>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">{a.nom}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{a.email}</td>
                      <td className="px-4 py-3">
                        {editingAgent === a.id ? (
                          <select
                            defaultValue={a.role}
                            onBlur={() => setEditingAgent(null)}
                            className="text-xs border border-blue-400 rounded px-2 py-1 focus:outline-none"
                          >
                            {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                          </select>
                        ) : (
                          <button onClick={() => setEditingAgent(a.id)} className="group">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>
                              {roleInfo.badge}
                            </span>
                            <Edit className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3"><Badge label={a.statut} variant={a.statut === 'Actif' ? 'green' : 'gray'} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{a.derniere}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Réinitialiser mot de passe">
                            <Key className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Désactiver">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Répartition par profil</h3>
              <div className="space-y-3">
                {ROLES.filter(r => r.id !== 'admin').map(role => {
                  const count = compteAgents.filter(a => a.role === role.id).length;
                  return (
                    <div key={role.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${role.color}`}>
                          {role.badge}
                        </span>
                        <span className="text-sm text-gray-600">{role.label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Admin</span>
                      <span className="text-sm text-gray-600">Administrateur</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{compteAgents.filter(a => a.role === 'admin').length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Comptes inactifs</h3>
              {compteAgents.filter(a => a.statut === 'Inactif').length > 0 ? (
                <div className="space-y-2">
                  {compteAgents.filter(a => a.statut === 'Inactif').map(a => {
                    const roleInfo = getRoleInfo(a.role);
                    return (
                      <div key={a.id} className="flex items-center gap-3 p-3 border border-orange-100 rounded-lg bg-orange-50">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{a.nom}</p>
                          <p className="text-xs text-gray-500">{roleInfo.label} · Dernière connexion: {a.derniere}</p>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">Réactiver</button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun compte inactif</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main shell ───────────────────────────────────────────────────────────────

interface AgentDashboardProps {
  role: RoleId;
  userName?: string;
}

export function AgentDashboard({ role: userRole, userName = 'Agent CNSS' }: AgentDashboardProps) {
  const role = ROLES.find(r => r.id === userRole)!;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <CNSSLogo size="medium" />
            <div>
              <p className="font-bold text-gray-900 text-sm">CNSS Bénin</p>
              <p className="text-xs text-gray-500">Espace Agent</p>
            </div>
          </div>
          <div className={`px-3 py-2 rounded-lg text-xs font-semibold ${role.color}`}>
            {role.badge}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Mon espace</p>
          <p className="text-sm text-gray-600 px-4 py-3">
            Vous êtes connecté en tant que <span className="font-semibold">{role.label}</span>
          </p>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Paramètres</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="font-medium text-sm">Notifications</span>
            <span className="ml-auto min-w-[1.25rem] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
          </button>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Déconnexion</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{userName}</h1>
            <p className="text-xs text-gray-500">{role.label} · CNSS Siège Cotonou</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold ${role.color}`}>{role.badge}</span>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl">
          {userRole === 'immatriculation' && <AgentImmatriculation />}
          {userRole === 'employeur'       && <AgentEmployeur />}
          {userRole === 'cotisation'      && <AgentCotisation />}
          {userRole === 'prestations'     && <AgentPrestations />}
          {userRole === 'support'         && <AgentSupport />}
          {userRole === 'admin'           && <AdminDashboard />}
        </div>
      </main>
    </div>
  );
}

// Wrappers pour chaque profil
export function AgentImmatriculationDashboard() {
  return <AgentDashboard role="immatriculation" userName="TOKPANOU Brice" />;
}

export function AgentEmployeurDashboard() {
  return <AgentDashboard role="employeur" userName="ABLO Nadège" />;
}

export function AgentCotisationDashboard() {
  return <AgentDashboard role="cotisation" userName="DÈDÈ Rodrigue" />;
}

export function AgentPrestationsDashboard() {
  return <AgentDashboard role="prestations" userName="FASSINOU Pélagie" />;
}

export function AgentSupportDashboard() {
  return <AgentDashboard role="support" userName="GANDONOU Stéphane" />;
}

export function AdminDashboardPage() {
  return <AgentDashboard role="admin" userName="AZONDEKON Lucie" />;
}
