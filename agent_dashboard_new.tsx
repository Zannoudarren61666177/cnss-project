import { useEffect, useState } from 'react';
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
import {
  getEmployeurs,
  getTravailleurs,
  getCotisations,
  getPrestations,
  getAgents,
  getFaqs,
  getActivityLogs,
  getStatsAdmin,
  getActualites,
  validerDeclaration,
  relancerCotisation,
  validerPrestation,
  rejeterPrestation,
  getStoredUser,
} from '../api';

// ─── Helpers ───────────────────────────────────────────────────────────────────
function groupTravailleursByEmployeur(travailleurs: Travailleur[]): DemandesTravailleursParEmployeur[] {
  const grouped: Record<string, { employeurId: string; employeur: string; immatriculation: string; travailleurs: Travailleur[] }> = {};

  travailleurs.forEach((t: Travailleur) => {
    const employerObj = typeof t.employeur === 'object' && t.employeur !== null ? t.employeur : undefined;
    const employeurId = String(
      t.employeur_id ??
      t.employeurId ??
      employerObj?.id ??
      (typeof t.employeur === 'string' ? t.employeur : undefined) ??
      'unknown'
    );
    const employeurName =
      employerObj?.nom ??
      (typeof t.employeur === 'string' ? t.employeur : undefined) ??
      t.employeur_name ??
      t.employeurLabel ??
      'Inconnu';
    const immatriculation = employerObj?.immatriculation ?? t.immatriculation ?? '';

    if (!grouped[employeurId]) {
      grouped[employeurId] = { employeurId, employeur: employeurName, immatriculation, travailleurs: [] };
    }

    grouped[employeurId].travailleurs.push(t);
  });

  return Object.values(grouped);
}

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

type DemandeEmployeur = {
  id: string;
  raisonSociale: string;
  formeJuridique?: string;
  secteur?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  dateCreation?: string;
  dateDemande?: string;
  statut: 'En attente' | 'Validée' | 'Rejetée';
  immatriculation?: string;
};

type Travailleur = {
  id: string;
  nom: string;
  prenom?: string;
  dateNaissance?: string;
  poste?: string;
  salaire?: string;
  statut: 'En attente' | 'Validée' | 'Rejetée';
  employeur_id?: string;
  employeurId?: string;
  employeur?: string | { id?: string; nom?: string; immatriculation?: string };
  employeur_name?: string;
  employeurLabel?: string;
  immatriculation?: string;
};

type DemandesTravailleursParEmployeur = {
  employeurId: string;
  employeur: string;
  immatriculation: string;
  travailleurs: Travailleur[];
};

type ImmatTab = 'apercu' | 'employeurs' | 'travailleurs' | 'historique';

function AgentImmatriculation() {
  const [tab, setTab] = useState<ImmatTab>('apercu');
  const [detailEmployeur, setDetailEmployeur] = useState<string | null>(null);
  const [detailTravailleur, setDetailTravailleur] = useState<string | null>(null);
  const [demandesEmployeurs, setDemandesEmployeurs] = useState<DemandeEmployeur[]>([]);
  const [demandesTravailleursParEmployeur, setDemandesTravailleursParEmployeur] = useState<DemandesTravailleursParEmployeur[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const employeurs = await getEmployeurs();
        const travailleurs = await getTravailleurs();

        const demandes = employeurs.map((employeur: any) => ({
          id: String(employeur.id),
          raisonSociale: employeur.raison_sociale ?? employeur.nom ?? 'Employeur inconnu',
          formeJuridique: employeur.forme_juridique ?? employeur.formeJuridique,
          secteur: employeur.secteur,
          adresse: employeur.adresse,
          telephone: employeur.telephone,
          email: employeur.email,
          dateCreation: employeur.date_creation ?? employeur.created_at,
          dateDemande: employeur.date_demande ?? employeur.demande_date,
          statut: employeur.statut ?? 'En attente',
          immatriculation: employeur.immatriculation,
        })) as DemandeEmployeur[];

        setDemandesEmployeurs(demandes);
        setDemandesTravailleursParEmployeur(groupTravailleursByEmployeur(travailleurs));
      } catch (e: any) {
        setError(e?.message ?? 'Impossible de charger les données');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

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
            <StatCard label="Employeurs en attente" value={demandesEmployeurs.filter(d => d.statut === 'En attente').length} icon={<Users className="w-5 h-5" />} color="bg-violet-100 text-violet-600" />
            <StatCard label="Travailleurs en attente" value={demandesTravailleursParEmployeur.reduce((s, e) => s + e.travailleurs.length, 0)} icon={<UserPlus className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
            <StatCard label="Validés ce mois" value={demandesEmployeurs.filter(d => d.statut === 'Validée').length} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-100 text-green-600" />
            <StatCard label="Rejetés" value={demandesEmployeurs.filter(d => d.statut === 'Rejetée').length} sub="Ce mois" icon={<XCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
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
                      <button onClick={() => { setTab('employeurs'); setDetailEmployeur(d.id); }} className="text-blue-600 hover:text-blue-700" title="Voir les détails" aria-label="Voir les détails"><Eye className="w-4 h-4" /></button>
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
                          <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="Valider" aria-label="Valider">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Rejeter" aria-label="Rejeter">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Voir les détails" aria-label="Voir les détails">
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

const employeursData: {
  id: string; immatriculation: string; raisonSociale: string; secteur: string;
  ville: string; nbTravailleurs: number; statut: 'Actif' | 'Inactif'; cotisation: string;
}[] = [];

const travailleursParEmployeur: {
  employeurId: string; employeur: string;
  travailleurs: { mat: string; nom: string; poste: string; ville: string; statut: 'Actif' | 'Inactif' }[];
}[] = [];

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
            <StatCard label="Employeurs actifs" value={employeursData.filter(e => e.statut === 'Actif').length} icon={<Users className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
            <StatCard label="Total travailleurs" value={travailleursParEmployeur.reduce((s, e) => s + e.travailleurs.length, 0)} icon={<UserPlus className="w-5 h-5" />} color="bg-green-100 text-green-600" />
            <StatCard label="Changements en attente" value={0} icon={<RefreshCw className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
            <StatCard label="Employeurs en retard" value={employeursData.filter(e => e.cotisation === 'En retard').length} sub="Cotisation" icon={<AlertCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
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
                {([] as { nom: string; ancien: string; nouveau: string }[]).map((c, i) => (
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
                            <button onClick={() => setSelectedEmployeur(emp.id)} className="p-1 text-gray-400 hover:text-blue-600" title="Voir les détails" aria-label="Voir les détails"><Eye className="w-4 h-4" /></button>
                            <button title="Modifier" aria-label="Modifier" className="p-1 text-gray-400 hover:text-orange-500"><Edit className="w-4 h-4" /></button>
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
                                <button className="p-1 text-gray-400 hover:text-blue-600" title="Voir les détails" aria-label="Voir les détails">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-orange-500" title="Modifier" aria-label="Modifier">
                                  <Edit className="w-4 h-4" />
                                </button>
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
          {([] as { nom: string; matricule: string; ancien: string; nouveau: string; date: string }[]).map((c, i) => (
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

type DeclarationStatus = 'En attente' | 'En retard' | 'Vérifiée' | 'Rejetée' | 'Payée' | 'Validée';

type Declaration = {
  id: number | string;
  ref: string;
  employeur: string;
  periode: string;
  montant: string;
  statut: DeclarationStatus;
  echeance: string;
};

function mapDeclarationStatus(rawStatus: string): DeclarationStatus {
  const normalized = rawStatus?.toString().toLowerCase() ?? '';
  if (normalized.includes('attente') || normalized.includes('pending')) return 'En attente';
  if (normalized.includes('retard') || normalized.includes('late')) return 'En retard';
  if (normalized.includes('valid') || normalized.includes('paid')) return 'Vérifiée';
  if (normalized.includes('rejet')) return 'Rejetée';
  return 'En attente';
}

function AgentCotisation() {
  const [declarationsData, setDeclarationsData] = useState<Declaration[]>([]);
  const [isLoadingDeclarations, setIsLoadingDeclarations] = useState(true);
  const [declarationsError, setDeclarationsError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeclarations() {
      setIsLoadingDeclarations(true);
      setDeclarationsError(null);
      try {
        const raw = await getCotisations();
        const anyRaw = raw as any;
        const items: any[] = Array.isArray(anyRaw) ? anyRaw : anyRaw.data ?? anyRaw.items ?? [];
        const mapped: Declaration[] = items.map((item: any) => ({
          id: item.id ?? item.ref ?? item.reference ?? String(Math.random()),
          ref: item.reference ?? item.ref ?? String(item.id ?? item.reference ?? ''),
          employeur:
            item.employeur?.raison_sociale ??
            item.employeur?.nom ??
            item.employeur ??
            item.employeur_name ??
            item.nom_employeur ??
            'Employeur inconnu',
          periode: item.periode ?? item.period ?? item.date ?? '',
          montant: item.montant_total != null ? Number(item.montant_total).toLocaleString() : item.montant != null ? Number(item.montant).toLocaleString() : '0',
          statut: mapDeclarationStatus(item.statut ?? item.status ?? item.state ?? 'En attente'),
          echeance: item.echeance ?? item.date_echeance ?? item.due_date ?? '',
        }));
        setDeclarationsData(mapped);
      } catch (error: any) {
        setDeclarationsError(error?.message ?? 'Impossible de charger les déclarations');
      } finally {
        setIsLoadingDeclarations(false);
      }
    }

    loadDeclarations();
  }, []);

  const statusBadge = (s: DeclarationStatus) => {
    const map: Record<DeclarationStatus, BadgeVariant> = {
      'En attente': 'orange',
      'En retard': 'red',
      'Vérifiée': 'green',
      'Rejetée': 'red',
      'Payée': 'green',
      'Validée': 'green',
    };
    return <Badge label={s} variant={map[s]} />;
  };

  const handleValiderDeclaration = async (id: number | string) => {
    setActionLoading(id);
    setActionMessage(null);
    try {
      await validerDeclaration(Number(id));
      setDeclarationsData(prev => prev.map(d => (d.id === id ? { ...d, statut: 'Vérifiée' } : d)));
      setActionMessage('Déclaration validée avec succès.');
    } catch (error: any) {
      setActionMessage(error?.message ?? 'Erreur lors de la validation.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRelancerCotisation = async (id: number | string) => {
    setActionLoading(id);
    setActionMessage(null);
    try {
      await relancerCotisation(Number(id));
      setActionMessage('Employeur relancé avec succès.');
    } catch (error: any) {
      setActionMessage(error?.message ?? 'Erreur lors de la relance.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Cotisations" sub="Vérification des déclarations et paiements employeurs" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Déclarations reçues" value={declarationsData.length} sub="Ce mois" icon={<FileText className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="En attente" value={declarationsData.filter(d => d.statut === 'En attente').length} icon={<Clock className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="En retard" value={declarationsData.filter(d => d.statut === 'En retard').length} icon={<AlertCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
        <StatCard label="Total encaissé" value="— FCFA" sub="Ce mois" icon={<TrendingUp className="w-5 h-5" />} color="bg-teal-100 text-teal-600" />
      </div>

      {declarationsError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{declarationsError}</div>}
      {actionMessage && <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">{actionMessage}</div>}

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
              {isLoadingDeclarations ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">Chargement des déclarations...</td>
                </tr>
              ) : declarationsData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">Aucune déclaration disponible.</td>
                </tr>
              ) : (
                declarationsData.map(d => (
                  <tr key={d.ref} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{d.ref}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{d.employeur}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{d.periode}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium text-xs">{d.montant} FCFA</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.echeance}</td>
                    <td className="px-4 py-3">{statusBadge(d.statut)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600" title="Voir les détails" aria-label="Voir les détails">
                          <Eye className="w-4 h-4" />
                        </button>
                        {d.statut === 'En attente' && (
                          <button
                            onClick={() => handleValiderDeclaration(d.id)}
                            disabled={actionLoading === d.id}
                            className="p-1 text-gray-400 hover:text-green-600 disabled:opacity-50"
                            title="Valider"
                            aria-label="Valider"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {d.statut !== 'Vérifiée' && d.statut !== 'Payée' && (
                          <button
                            onClick={() => handleRelancerCotisation(d.id)}
                            disabled={actionLoading === d.id}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                            title="Relancer"
                            aria-label="Relancer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Employeurs en retard</h3>
          <button
            onClick={() => setActionMessage('Relance globale lancée pour les employeurs en retard.')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            type="button"
          >
            <Send className="w-4 h-4" />Relancer tous
          </button>
        </div>
        <div className="space-y-3">
          {declarationsData.filter(d => d.statut === 'En retard').length === 0 ? (
            <div className="p-4 rounded-lg bg-green-50 text-sm text-green-700">Aucun employeur en retard identifié.</div>
          ) : declarationsData.filter(d => d.statut === 'En retard').map((e, i) => (
            <div key={`${e.ref}-${i}`} className="flex items-center gap-4 p-3 border border-red-100 rounded-lg bg-red-50">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">{e.employeur}</p>
                <p className="text-xs text-gray-600">Référence: {e.ref} · Échéance: {e.echeance}</p>
              </div>
              <button
                onClick={() => handleRelancerCotisation(e.id)}
                disabled={actionLoading === e.id}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                type="button"
              >
                Relancer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Agent Prestations ────────────────────────────────────────────────────────

const demandesPrest: {
  id: string; nom: string; type: string; date: string;
  statut: 'En attente' | 'En cours' | 'Approuvée' | 'Rejetée';
}[] = [];

function AgentPrestations() {
  const statusBadge = (s: typeof demandesPrest[0]['statut']) => {
    const map = { 'En attente': 'orange', 'En cours': 'blue', 'Approuvée': 'green', 'Rejetée': 'red' } as const;
    return <Badge label={s} variant={map[s]} />;
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Prestations" sub="Instruction et paiement des prestations sociales" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Demandes reçues" value={demandesPrest.length} sub="Ce mois" icon={<Heart className="w-5 h-5" />} color="bg-pink-100 text-pink-600" />
        <StatCard label="En attente" value={demandesPrest.filter(d => d.statut === 'En attente').length} icon={<Clock className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="Approuvées" value={demandesPrest.filter(d => d.statut === 'Approuvée').length} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-100 text-green-600" />
        <StatCard label="Total versé" value="— FCFA" sub="Ce mois" icon={<CreditCard className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
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
                      <button className="p-1 text-gray-400 hover:text-blue-600" title="Voir les détails" aria-label="Voir les détails"><Eye className="w-4 h-4" /></button>
                      {d.statut === 'En attente' && (
                        <>
                          <button className="p-1 text-gray-400 hover:text-green-600" title="Approuver" aria-label="Approuver">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600" title="Rejeter" aria-label="Rejeter">
                            <XCircle className="w-4 h-4" />
                          </button>
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
          {([] as { nom: string; type: string; montant: string; methode: string }[]).map((p, i) => (
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
  const tickets: { id: string; user: string; sujet: string; date: string; priorite: string; statut: 'Ouvert' | 'En cours' | 'Résolu' }[] = [];

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
        <StatCard label="Tickets ouverts" value={tickets.filter(t => t.statut === 'Ouvert').length} icon={<MessageSquare className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="Articles FAQ" value={0} icon={<BookOpen className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="Actualités publiées" value={0} sub="Ce mois" icon={<Newspaper className="w-5 h-5" />} color="bg-green-100 text-green-600" />
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
              <button className="p-1 text-gray-400 hover:text-blue-600" title="Voir les détails" aria-label="Voir les détails">
                <ChevronRight className="w-5 h-5" />
              </button>
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
            {([] as { question: string; vues: number }[]).map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-gray-900 truncate">{f.question}</p>
                  <p className="text-xs text-gray-400">{f.vues.toLocaleString()} vues</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-blue-600" title="Modifier" aria-label="Modifier">
                  <Edit className="w-3 h-3" />
                </button>
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
            {([] as { titre: string; statut: string; vues: number }[]).map((a, i) => (
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

const compteAgents: {
  id: string; nom: string; email: string; role: RoleId; statut: string; derniere: string;
}[] = [
  { id: 'AG001', nom: 'TOKPANOU Brice', email: 'b.tokpanou@cnss.bj', role: 'immatriculation', statut: 'Actif', derniere: '17/06/2026 09:15' },
  { id: 'AG002', nom: 'ABLO Nadège', email: 'n.ablo@cnss.bj', role: 'employeur', statut: 'Actif', derniere: '17/06/2026 08:42' },
  { id: 'AG003', nom: 'DÈDÈ Rodrigue', email: 'r.dede@cnss.bj', role: 'cotisation', statut: 'Actif', derniere: '17/06/2026 10:03' },
  { id: 'AG004', nom: 'FASSINOU Pélagie', email: 'p.fassinou@cnss.bj', role: 'prestations', statut: 'Actif', derniere: '17/06/2026 09:28' },
  { id: 'AG005', nom: 'GANDONOU Stéphane', email: 's.gandonou@cnss.bj', role: 'support', statut: 'Actif', derniere: '17/06/2026 07:55' },
  { id: 'AG006', nom: 'AZONDEKON Lucie', email: 'l.azondekon@cnss.bj', role: 'admin', statut: 'Actif', derniere: '17/06/2026 10:20' },
  { id: 'AG007', nom: 'KPADE Séverin', email: 's.kpade@cnss.bj', role: 'immatriculation', statut: 'Actif', derniere: '16/06/2026 18:12' },
  { id: 'AG008', nom: 'HOUNDJO Armelle', email: 'a.houndjo@cnss.bj', role: 'employeur', statut: 'Inactif', derniere: '10/06/2026 14:25' },
  { id: 'AG009', nom: 'ASSANI Marcel', email: 'm.assani@cnss.bj', role: 'cotisation', statut: 'Actif', derniere: '17/06/2026 09:47' },
  { id: 'AG010', nom: 'DOSSA Françoise', email: 'f.dossa@cnss.bj', role: 'prestations', statut: 'Actif', derniere: '17/06/2026 08:18' },
  { id: 'AG011', nom: 'SOGLO Patrick', email: 'p.soglo@cnss.bj', role: 'support', statut: 'Inactif', derniere: '01/06/2026 16:40' },
];

const auditLog: {
  id: string; user: string; action: string; date: string; service: string;
}[] = [
  { id: 'LOG001', user: 'TOKPANOU Brice', action: 'Validation demande immatriculation employeur SARL BENIN TELECOM', date: '17/06 10:05', service: 'Immatriculation' },
  { id: 'LOG002', user: 'DÈDÈ Rodrigue', action: 'Vérification déclaration cotisation CFAO MOTORS', date: '17/06 09:58', service: 'Cotisation' },
  { id: 'LOG003', user: 'FASSINOU Pélagie', action: 'Approbation prestation familiale GBEDJI Monique', date: '17/06 09:42', service: 'Prestations' },
  { id: 'LOG004', user: 'ABLO Nadège', action: 'Modification fiche employeur SOCIETE GENERALE BENIN', date: '17/06 09:30', service: 'Gestion employeurs' },
  { id: 'LOG005', user: 'GANDONOU Stéphane', action: 'Résolution ticket #TK-2026-0547', date: '17/06 09:12', service: 'Support' },
  { id: 'LOG006', user: 'TOKPANOU Brice', action: 'Rejet demande immatriculation ONG ESPOIR NOUVEAU (documents incomplets)', date: '17/06 08:55', service: 'Immatriculation' },
  { id: 'LOG007', user: 'AZONDEKON Lucie', action: 'Création compte agent ASSANI Marcel', date: '17/06 08:20', service: 'Administration' },
  { id: 'LOG008', user: 'DÈDÈ Rodrigue', action: 'Relance employeurs en retard (42 notifications envoyées)', date: '17/06 08:00', service: 'Cotisation' },
];

const systemStats = {
  totalEmployeurs: 2418,
  employeursActifs: 2247,
  totalTravailleurs: 45632,
  travailleursActifs: 41850,
  demandesEnAttente: {
    immatriculation: 12,
    cotisation: 28,
    prestations: 19,
    support: 7,
  },
  cotisationsCeMois: {
    declarationsRecues: 2156,
    montantTotal: '18450000000',
    enRetard: 42,
    tauxRecouvrement: 89,
  },
  prestationsCeMois: {
    demandes: 156,
    approuvees: 124,
    montantVerse: '245000000',
    delaiMoyen: 5.2,
  },
};

const categoriesEmployeurs = [
  { name: 'Société', value: 1245, color: '#4A90E2' },
  { name: 'Établissement', value: 458, color: '#50C878' },
  { name: 'École', value: 287, color: '#FFB84D' },
  { name: 'Cabinet/Étude', value: 165, color: '#9B59B6' },
  { name: 'ONG/Association', value: 132, color: '#E74C3C' },
  { name: 'Structure étatique', value: 78, color: '#3498DB' },
  { name: 'Église', value: 32, color: '#1ABC9C' },
  { name: 'Gens de maison', value: 18, color: '#F39C12' },
  { name: 'Assurance volontaire', value: 3, color: '#E67E22' },
];

const cotisationsData = [
  { name: 'À jour', value: 2156, color: '#50C878' },
  { name: 'En retard', value: 42, color: '#E74C3C' },
  { name: 'En cours', value: 49, color: '#FFB84D' },
];

const prestationsData = [
  { name: 'Prestations familiales', value: 67, color: '#4A90E2' },
  { name: 'Risques professionnels', value: 41, color: '#E74C3C' },
  { name: 'Pensions', value: 48, color: '#50C878' },
];

const activiteParService = [
  { service: 'Immatriculation', demandes: 12, color: 'bg-violet-500' },
  { service: 'Gestion employeurs', demandes: 8, color: 'bg-blue-500' },
  { service: 'Cotisation', demandes: 28, color: 'bg-teal-500' },
  { service: 'Prestations', demandes: 19, color: 'bg-pink-500' },
  { service: 'Support', demandes: 7, color: 'bg-orange-500' },
];

type AdminTab = 'supervision' | 'utilisateurs' | 'statistiques' | 'parametres';

function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('supervision');
  const [editingAgent, setEditingAgent] = useState<string | null>(null);

  const tabs = [
    { id: 'supervision' as AdminTab, label: 'Supervision générale', icon: <Activity className="w-4 h-4" /> },
    { id: 'utilisateurs' as AdminTab, label: 'Gestion utilisateurs', icon: <Users className="w-4 h-4" /> },
    { id: 'statistiques' as AdminTab, label: 'Statistiques globales', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'parametres' as AdminTab, label: 'Paramètres système', icon: <Settings className="w-4 h-4" /> },
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
            <StatCard label="Employeurs immatriculés" value={systemStats.totalEmployeurs.toLocaleString()} sub={`${systemStats.employeursActifs} actifs`} icon={<Users className="w-5 h-5" />} color="bg-violet-100 text-violet-600" />
            <StatCard label="Travailleurs actifs" value={systemStats.travailleursActifs.toLocaleString()} sub={`Total: ${systemStats.totalTravailleurs.toLocaleString()}`} icon={<UserPlus className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
            <StatCard label="Déclarations cotisation" value={systemStats.demandesEnAttente.cotisation} sub="En attente" icon={<FileText className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
            <StatCard label="Demandes prestations" value={systemStats.demandesEnAttente.prestations} sub="À instruire" icon={<Heart className="w-5 h-5" />} color="bg-pink-100 text-pink-600" />
            <StatCard label="Tickets support" value={systemStats.demandesEnAttente.support} sub="Ouverts" icon={<MessageSquare className="w-5 h-5" />} color="bg-teal-100 text-teal-600" />
          </div>

          {/* Statistiques circulaires */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-center">Employeurs par catégorie</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoriesEmployeurs}
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoriesEmployeurs.map((entry, index) => (
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
              <h3 className="font-bold text-gray-900 mb-2 text-center">Cotisations - Juin 2026</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cotisationsData}
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {cotisationsData.map((entry, index) => (
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
              <h3 className="font-bold text-gray-900 mb-2 text-center">Prestations par type - Juin 2026</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prestationsData}
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {prestationsData.map((entry, index) => (
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
                {activiteParService.map((s, i) => (
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
                            aria-label="Changer le rôle de l'agent"
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
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Réinitialiser mot de passe" aria-label="Réinitialiser mot de passe">
                            <Key className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors" title="Modifier" aria-label="Modifier">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Désactiver" aria-label="Désactiver">
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

      {tab === 'statistiques' && (
        <div className="space-y-6">
          <SectionHeader title="Statistiques globales" sub="Indicateurs de performance du système CNSS" />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold opacity-90">Cotisations ce mois</h3>
                <TrendingUp className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-4xl font-bold mb-2">{parseInt(systemStats.cotisationsCeMois.montantTotal).toLocaleString()} FCFA</p>
              <div className="space-y-1 text-sm opacity-90">
                <p>{systemStats.cotisationsCeMois.declarationsRecues.toLocaleString()} déclarations reçues</p>
                <p>Taux de recouvrement: <span className="font-bold">{systemStats.cotisationsCeMois.tauxRecouvrement}%</span></p>
                <p className="text-red-200">{systemStats.cotisationsCeMois.enRetard} employeurs en retard</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold opacity-90">Prestations ce mois</h3>
                <Heart className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-4xl font-bold mb-2">{parseInt(systemStats.prestationsCeMois.montantVerse).toLocaleString()} FCFA</p>
              <div className="space-y-1 text-sm opacity-90">
                <p>{systemStats.prestationsCeMois.demandes} demandes reçues</p>
                <p>{systemStats.prestationsCeMois.approuvees} approuvées</p>
                <p>Délai moyen: <span className="font-bold">{systemStats.prestationsCeMois.delaiMoyen} jours</span></p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold opacity-90">Personnel actif</h3>
                <Shield className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-4xl font-bold mb-2">{compteAgents.filter(a => a.statut === 'Actif').length}</p>
              <div className="space-y-1 text-sm opacity-90">
                <p>Total agents: {compteAgents.length}</p>
                <p>Comptes inactifs: {compteAgents.filter(a => a.statut === 'Inactif').length}</p>
                <p>Taux d'activité: <span className="font-bold">{Math.round((compteAgents.filter(a => a.statut === 'Actif').length / compteAgents.length) * 100)}%</span></p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Évolution des immatriculations</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <BarChart2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Graphique d'évolution mensuelle</p>
                  <p className="text-xs mt-1">Données disponibles après intégration backend</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Taux de satisfaction</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Indicateurs de satisfaction usagers</p>
                  <p className="text-xs mt-1">Données disponibles après intégration backend</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Performances par service</h3>
            <div className="space-y-4">
              {[
                { service: 'Immatriculation', delai: '2.3 jours', taux: 94, couleur: 'bg-violet-500' },
                { service: 'Gestion employeurs', delai: '1.8 jours', taux: 97, couleur: 'bg-blue-500' },
                { service: 'Cotisation', delai: '3.1 jours', taux: 89, couleur: 'bg-teal-500' },
                { service: 'Prestations', delai: '5.2 jours', taux: 91, couleur: 'bg-pink-500' },
                { service: 'Support', delai: '1.2 jours', taux: 96, couleur: 'bg-orange-500' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-40 flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{s.service}</p>
                    <p className="text-xs text-gray-500">Délai moyen: {s.delai}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <progress
                          className={`w-full h-full rounded-full appearance-none ${s.couleur}`}
                          value={s.taux}
                          max={100}
                          aria-label={`Barre de progression ${s.service}`}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12 text-right">{s.taux}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'parametres' && (
        <div className="space-y-6">
          <SectionHeader title="Paramètres système" sub="Configuration générale de la plateforme CNSS" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Sécurité et accès</h3>
                  <p className="text-xs text-gray-500">Gestion des permissions et authentification</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Authentification à deux facteurs</p>
                    <p className="text-xs text-gray-500">Obligatoire pour les agents</p>
                  </div>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Durée de session</p>
                    <p className="text-xs text-gray-500">Déconnexion automatique après inactivité</p>
                  </div>
                  <select aria-label="Durée de session" className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                    <option>30 minutes</option>
                    <option>1 heure</option>
                    <option>2 heures</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Complexité mot de passe</p>
                    <p className="text-xs text-gray-500">Minimum 12 caractères, majuscules, chiffres, symboles</p>
                  </div>
                  <Badge label="Élevée" variant="green" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500">Configuration des alertes système</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Alertes cotisations en retard</p>
                    <p className="text-xs text-gray-500">Notification automatique J-7, J-3, J-1</p>
                  </div>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Notifications par email</p>
                    <p className="text-xs text-gray-500">Copie des alertes importantes par email</p>
                  </div>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">SMS automatiques</p>
                    <p className="text-xs text-gray-500">Rappels par SMS pour échéances critiques</p>
                  </div>
                  <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Configuration générale</h3>
                  <p className="text-xs text-gray-500">Paramètres de la plateforme</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Mode maintenance</p>
                  <p className="text-xs text-gray-500 mb-3">Désactiver temporairement l'accès public</p>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Activer le mode maintenance
                  </button>
                </div>
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Sauvegarde automatique</p>
                  <p className="text-xs text-gray-500 mb-2">Dernière sauvegarde: 17/06/2026 à 03:00</p>
                  <Badge label="Activée - Quotidienne" variant="green" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Journaux et audit</h3>
                  <p className="text-xs text-gray-500">Traçabilité des actions</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Actions enregistrées aujourd'hui</p>
                    <p className="text-xs text-gray-500">Toutes les opérations critiques</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{auditLog.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Rétention des logs</p>
                    <p className="text-xs text-gray-500">Conservation légale</p>
                  </div>
                  <Badge label="5 ans" variant="blue" />
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200">
                  <Download className="w-4 h-4" />
                  Exporter les journaux
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Zone d'administration critique</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Les modifications des paramètres système nécessitent une validation par deux administrateurs et sont enregistrées dans le journal d'audit.
                </p>
                <div className="flex items-center gap-3">
                  <Badge label="Niveau d'accès: Administrateur" variant="red" />
                  <span className="text-xs text-gray-500">Dernière modification: 15/06/2026 par AZONDEKON Lucie</span>
                </div>
              </div>
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
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Voir les notifications" aria-label="Voir les notifications">
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

function getConnectedUserName(): string {
  const user = getStoredUser();
  return (user?.name as string) ?? 'Agent CNSS';
}

export function AgentImmatriculationDashboard() {
  return <AgentDashboard role="immatriculation" userName={getConnectedUserName()} />;
}

export function AgentEmployeurDashboard() {
  return <AgentDashboard role="employeur" userName={getConnectedUserName()} />;
}

export function AgentCotisationDashboard() {
  return <AgentDashboard role="cotisation" userName={getConnectedUserName()} />;
}

export function AgentPrestationsDashboard() {
  return <AgentDashboard role="prestations" userName={getConnectedUserName()} />;
}

export function AgentSupportDashboard() {
  return <AgentDashboard role="support" userName={getConnectedUserName()} />;
}

export function AdminDashboardPage() {
  return <AgentDashboard role="admin" userName={getConnectedUserName()} />;
}
