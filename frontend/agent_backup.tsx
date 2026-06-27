import { useState, useEffect } from 'react';
import {
  Home, Users, FileText, CreditCard, Heart, MessageSquare,
   Settings, LogOut, Bell, Search, ChevronRight,
  CheckCircle, Clock, AlertCircle, XCircle, 
  //Download, 
  Eye,
  Edit, UserPlus, TrendingUp, Key, Activity,
  RefreshCw, Plus, 
  //Send, 
  BookOpen, Newspaper
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Link } from 'react-router';
import { CNSSLogo } from './CNSSLogo';
import {
  getEmployeurs, validerEmployeur, rejeterEmployeur,
  getTravailleurs, 
  //getTravailleursParEmployeur,
  getCotisations, validerDeclaration,
  getPrestations, validerPrestation, rejeterPrestation,
  getAgents, updateAgentRole,
  getStatsAdmin,
  getFaqs,
  getActualites,
  getActivityLogs,
  relancerCotisation,
  getStoredUser,
  clearAuth,
} from '../api';

type AdminTab = 'supervision' | 'utilisateurs';

// ÔöÇÔöÇÔöÇ Role definitions ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
type RoleId = 'immatriculation' | 'employeur' | 'cotisation' | 'prestations' | 'support' | 'admin';

interface Role {
  id: RoleId;
  label: string;
  color: string;
  badge: string;
}

const ROLES: Role[] = [
  { id: 'immatriculation', label: "Agent d'immatriculation", color: 'bg-violet-100 text-violet-700', badge: 'Immatriculation' },
  { id: 'employeur',       label: 'Agent gestion employeurs', color: 'bg-blue-100 text-blue-700',    badge: 'Employeurs'      },
  { id: 'cotisation',      label: 'Agent de cotisation',      color: 'bg-teal-100 text-teal-700',    badge: 'Cotisation'      },
  { id: 'prestations',     label: 'Agent de prestations',     color: 'bg-pink-100 text-pink-700',    badge: 'Prestations'     },
  { id: 'support',         label: 'Agent contenu / support',  color: 'bg-orange-100 text-orange-700', badge: 'Support'        },
  { id: 'admin',           label: 'Administrateur',           color: 'bg-red-100 text-red-700',      badge: 'Admin'           },
];

// ÔöÇÔöÇÔöÇ Shared helpers ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function StatCard({ label, value, sub, icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; color: string;
}) {
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

function SectionHeader({ title, sub, action }: {
  title: string; sub?: string; action?: React.ReactNode;
}) {
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

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-700 font-medium">{message}</p>
    </div>
  );
}

function AgentImmatriculation() {
  const [tab, setTab] = useState<ImmatTab>('apercu');
  const [detailEmployeur, setDetailEmployeur] = useState<string | null>(null);
  const [employeurs, setEmployeurs] = useState<any[]>([]);
  const [travailleurs, setTravailleurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type ImmatTab = 'apercu' | 'employeurs' | 'travailleurs' | 'historique';

  const tabs = [
    { id: 'apercu' as ImmatTab,       label: 'Aper├ºu',                  icon: <Home className="w-4 h-4" /> },
    { id: 'employeurs' as ImmatTab,   label: 'Demandes employeurs',     icon: <Users className="w-4 h-4" /> },
    { id: 'travailleurs' as ImmatTab, label: 'D├®claration travailleurs', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'historique' as ImmatTab,   label: 'Historique',              icon: <Clock className="w-4 h-4" /> },
  ];

  useEffect(() => {
    Promise.all([getEmployeurs(), getTravailleurs()])
      .then(([emps, travs]) => {
        setEmployeurs(emps);
        setTravailleurs(travs);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleValider = async (id: number) => {
    try {
      await validerEmployeur(id);
      setEmployeurs(prev => prev.map(e => e.id === id ? { ...e, statut: 'validee' } : e));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRejeter = async (id: number) => {
    try {
      await rejeterEmployeur(id);
      setEmployeurs(prev => prev.map(e => e.id === id ? { ...e, statut: 'rejetee' } : e));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, BadgeVariant> = {
      'en_attente': 'orange', 'validee': 'green', 'rejetee': 'red',
      'En attente': 'orange', 'Valid├®e': 'green',  'Rejet├®e': 'red',
    };
    const labels: Record<string, string> = {
      'en_attente': 'En attente', 'validee': 'Valid├®e', 'rejetee': 'Rejet├®e',
    };
    return <Badge label={labels[s] ?? s} variant={map[s] ?? 'gray'} />;
  };

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} />;

  const enAttente = employeurs.filter(e => e.statut === 'en_attente');
  const valides   = employeurs.filter(e => e.statut === 'validee');

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
            <StatCard label="Employeurs en attente" value={enAttente.length} icon={<Users className="w-5 h-5" />} color="bg-violet-100 text-violet-600" />
            <StatCard label="Travailleurs en attente" value={travailleurs.filter(t => t.statut === 'en_attente').length} icon={<UserPlus className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
            <StatCard label="Valid├®s ce mois" value={valides.length} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-100 text-green-600" />
            <StatCard label="Rejet├®s" value={employeurs.filter(e => e.statut === 'rejetee').length} icon={<XCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Demandes employeurs r├®centes</h3>
            <div className="space-y-3">
              {employeurs.slice(0, 3).map(emp => (
                <div key={emp.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{emp.raison_sociale ?? emp.company_name}</p>
                    <p className="text-xs text-gray-500">{emp.secteur ?? 'ÔÇö'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(emp.statut)}
                    <button onClick={() => { setTab('employeurs'); setDetailEmployeur(String(emp.id)); }} className="text-blue-600 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setTab('employeurs')} className="mt-4 text-sm text-blue-600 font-medium flex items-center gap-1">
              Voir toutes les demandes <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {tab === 'employeurs' && (
        <div className="space-y-4">
          {!detailEmployeur ? (
            <>
              <SectionHeader title="Demandes d'immatriculation employeurs" sub={`${enAttente.length} demandes en attente`} />
              <SearchBar placeholder="Rechercher par raison sociale, secteur..." />
              <div className="space-y-3">
                {employeurs.map(emp => (
                  <div key={emp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{emp.raison_sociale ?? emp.company_name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">IFU: {emp.ifu ?? emp.siret ?? 'ÔÇö'}</p>
                      </div>
                      {statusBadge(emp.statut)}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div><span className="text-gray-500">Secteur:</span><span className="ml-2 font-medium text-gray-900">{emp.secteur ?? 'ÔÇö'}</span></div>
                      <div><span className="text-gray-500">T├®l├®phone:</span><span className="ml-2 font-medium text-gray-900">{emp.telephone ?? emp.phone ?? 'ÔÇö'}</span></div>
                      <div className="sm:col-span-2"><span className="text-gray-500">Adresse:</span><span className="ml-2 font-medium text-gray-900">{emp.adresse ?? emp.address ?? 'ÔÇö'}</span></div>
                      <div><span className="text-gray-500">Email:</span><span className="ml-2 font-medium text-gray-900">{emp.email ?? 'ÔÇö'}</span></div>
                    </div>
                    {emp.statut === 'en_attente' && (
                      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                        <button onClick={() => handleValider(emp.id)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700">
                          <CheckCircle className="w-4 h-4" />Valider
                        </button>
                        <button onClick={() => handleRejeter(emp.id)} className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50">
                          <XCircle className="w-4 h-4" />Rejeter
                        </button>
                      </div>
                    )}
                    {emp.statut === 'validee' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-green-900">Demande valid├®e</p>
                            <p className="text-xs text-green-700 mt-0.5">
                              N┬░ CNSS: <span className="font-mono font-bold">{emp.numero_cnss}</span>
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
                <ChevronRight className="w-4 h-4 rotate-180" />Retour ├á la liste
              </button>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                {(() => {
                  const emp = employeurs.find(e => String(e.id) === detailEmployeur);
                  return emp ? (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">{emp.raison_sociale ?? emp.company_name}</h2>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">IFU / SIRET:</span><span className="ml-2 font-medium">{emp.ifu ?? emp.siret}</span></div>
                        <div><span className="text-gray-500">Secteur:</span><span className="ml-2 font-medium">{emp.secteur ?? 'ÔÇö'}</span></div>
                        <div><span className="text-gray-500">Adresse:</span><span className="ml-2 font-medium">{emp.adresse ?? emp.address ?? 'ÔÇö'}</span></div>
                        <div><span className="text-gray-500">T├®l├®phone:</span><span className="ml-2 font-medium">{emp.telephone ?? emp.phone ?? 'ÔÇö'}</span></div>
                        <div><span className="text-gray-500">Email:</span><span className="ml-2 font-medium">{emp.email ?? 'ÔÇö'}</span></div>
                        <div><span className="text-gray-500">Statut:</span><span className="ml-2">{statusBadge(emp.statut)}</span></div>
                      </div>
                    </div>
                  ) : <p className="text-gray-500">Employeur introuvable.</p>;
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'travailleurs' && (
        <div className="space-y-4">
          <SectionHeader title="D├®claration des travailleurs" sub={`${travailleurs.length} travailleurs enregistr├®s`} />
          <SearchBar placeholder="Rechercher par nom ou employeur..." />
          {travailleurs.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun travailleur enregistr├®.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Matricule', 'Nom', 'Poste', 'Employeur', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {travailleurs.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{t.numero_cnss ?? t.matricule ?? 'ÔÇö'}</td>
                      <td className="px-4 py-3 font-semibold">{t.nom} {t.prenom}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{t.poste ?? 'ÔÇö'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{t.employeur?.raison_sociale ?? t.employeur?.company_name ?? 'ÔÇö'}</td>
                      <td className="px-4 py-3">{statusBadge(t.statut ?? 'en_attente')}</td>
                      <td className="px-4 py-3">
                        <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'historique' && (
        <div>
          <SectionHeader title="Historique" sub="Toutes les demandes trait├®es" />
          <SearchBar placeholder="Rechercher dans l'historique..." />
          <div className="space-y-3">
            {employeurs.filter(e => e.statut !== 'en_attente').map(emp => (
              <div key={emp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{emp.raison_sociale ?? emp.company_name}</p>
                  <p className="text-xs text-gray-500">{emp.updated_at ? new Date(emp.updated_at).toLocaleDateString('fr-FR') : 'ÔÇö'}</p>
                </div>
                {statusBadge(emp.statut)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// ÔöÇÔöÇÔöÇ Agent Employeur ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

type EmployeurTab = 'apercu' | 'employeurs' | 'changements';

function AgentEmployeur() {
  const [tab, setTab] = useState<EmployeurTab>('apercu');
  const [selectedEmployeur, setSelectedEmployeur] = useState<string | null>(null);
  const [employeurs, setEmployeurs] = useState<any[]>([]);
  const [travailleurs, setTravailleurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'apercu' as EmployeurTab, label: 'Aper├ºu', icon: <Home className="w-4 h-4" /> },
    { id: 'employeurs' as EmployeurTab, label: 'Liste employeurs', icon: <Users className="w-4 h-4" /> },
    { id: 'changements' as EmployeurTab, label: "Changements d'employeur", icon: <RefreshCw className="w-4 h-4" /> },
  ];

  useEffect(() => {
    Promise.all([getEmployeurs(), getTravailleurs()])
      .then(([emps, travs]) => {
        setEmployeurs(emps);
        setTravailleurs(travs);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} />;

  const employeursActifs = employeurs.filter(e => e.statut === 'validee');
  const travailleursDe = (employeurId: string) => travailleurs.filter(t => String(t.employeur_id) === employeurId);

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
            <StatCard label="Employeurs actifs" value={employeursActifs.length} icon={<Users className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
            <StatCard label="Total travailleurs" value={travailleurs.length} icon={<UserPlus className="w-5 h-5" />} color="bg-green-100 text-green-600" />
            <StatCard label="Employeurs en attente" value={employeurs.filter(e => e.statut === 'en_attente').length} icon={<RefreshCw className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
            <StatCard label="Employeurs en retard" value={employeurs.filter(e => e.cotisation_status === 'retard').length} sub="Cotisation" icon={<AlertCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Employeurs r├®cents</h3>
            <div className="space-y-3">
              {employeursActifs.slice(0, 3).map(emp => (
                <div key={emp.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { setTab('employeurs'); setSelectedEmployeur(String(emp.id)); }}>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{emp.raison_sociale ?? emp.company_name}</p>
                    <p className="text-xs text-gray-500">{travailleursDe(String(emp.id)).length} travailleurs ┬À {emp.secteur ?? 'ÔÇö'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
            <button onClick={() => setTab('employeurs')} className="mt-4 text-sm text-blue-600 font-medium flex items-center gap-1">
              Voir tous les employeurs <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {tab === 'employeurs' && (
        <div className="space-y-4">
          {!selectedEmployeur ? (
            <>
              <SectionHeader title="Liste des employeurs" sub={`${employeursActifs.length} employeurs immatricul├®s`} />
              <SearchBar placeholder="Rechercher par raison sociale, secteur..." />
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['N┬░ CNSS', 'Raison sociale', 'Secteur', 'Travailleurs', 'Statut', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employeursActifs.map(emp => (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{emp.numero_cnss ?? 'ÔÇö'}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{emp.raison_sociale ?? emp.company_name}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{emp.secteur ?? 'ÔÇö'}</td>
                        <td className="px-4 py-3"><Badge label={`${travailleursDe(String(emp.id)).length}`} variant="blue" /></td>
                        <td className="px-4 py-3"><Badge label="Actif" variant="green" /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedEmployeur(String(emp.id))} className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
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
                <ChevronRight className="w-4 h-4 rotate-180" />Retour ├á la liste
              </button>
              {(() => {
                const emp = employeurs.find(e => String(e.id) === selectedEmployeur);
                const empTrav = travailleursDe(selectedEmployeur);
                return emp ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{emp.raison_sociale ?? emp.company_name}</h2>
                          <p className="text-sm text-gray-500 mt-0.5">{emp.numero_cnss ?? 'ÔÇö'}</p>
                        </div>
                        <Badge label="Actif" variant="green" />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4 text-sm">
                        <div><span className="text-gray-500">Secteur:</span><span className="ml-2 font-medium text-gray-900">{emp.secteur ?? 'ÔÇö'}</span></div>
                        <div><span className="text-gray-500">Adresse:</span><span className="ml-2 font-medium text-gray-900">{emp.adresse ?? emp.address ?? 'ÔÇö'}</span></div>
                        <div><span className="text-gray-500">Travailleurs:</span><span className="ml-2 font-medium text-gray-900">{empTrav.length}</span></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Travailleurs de {emp.raison_sociale ?? emp.company_name}</h3>
                      {empTrav.length === 0 ? (
                        <p className="text-sm text-gray-500">Aucun travailleur enregistr├®.</p>
                      ) : (
                        <div className="space-y-2">
                          {empTrav.map(t => (
                            <div key={t.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{t.nom} {t.prenom}</p>
                                <p className="text-xs text-gray-500">{t.numero_cnss ?? 'ÔÇö'} ┬À {t.poste ?? 'ÔÇö'}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge label={t.statut === 'actif' ? 'Actif' : 'Inactif'} variant={t.statut === 'actif' ? 'green' : 'gray'} />
                                <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      )}

      {tab === 'changements' && (
        <div className="space-y-4">
          <SectionHeader title="Changements d'employeur" sub="Module en cours de d├®veloppement" />
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <RefreshCw className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucune demande de transfert en attente.</p>
          </div>
        </div>
      )}
    </div>
  );
}
// ÔöÇÔöÇÔöÇ Agent Cotisation ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function AgentCotisation() {
  const [declarations, setDeclarations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCotisations()
      .then(data => {
        setDeclarations(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleValider = async (id: number) => {
    try {
      await validerDeclaration(id);
      setDeclarations(prev => prev.map(d => d.id === id ? { ...d, status: 'V├®rifi├®e' } : d));
    } catch (err: any) {
      alert(err.message);
    }
  };
  const handleRelancer = async (id: number) => {
  try {
    await relancerCotisation(id);
    alert('Relance envoy├®e avec succ├¿s.');
  } catch (err: any) {
    alert(err.message);
  }
};

  const statusBadge = (s: string) => {
    const map: Record<string, BadgeVariant> = {
      'En attente': 'orange', 'En retard': 'red', 'V├®rifi├®e': 'green', 'Rejet├®e': 'red',
    };
    return <Badge label={s} variant={map[s] ?? 'gray'} />;
  };

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} />;

  const enAttente   = declarations.filter(d => d.status === 'En attente');
  const enRetard     = declarations.filter(d => d.status === 'En retard');
  const totalEncaisse = declarations
    .filter(d => d.status === 'V├®rifi├®e')
    .reduce((sum, d) => sum + Number(d.montant), 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="Cotisations" sub="V├®rification des d├®clarations et paiements employeurs" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="D├®clarations re├ºues" value={declarations.length} sub="Toutes p├®riodes" icon={<FileText className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="En attente" value={enAttente.length} icon={<Clock className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="En retard" value={enRetard.length} icon={<AlertCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
        <StatCard label="Total encaiss├®" value={`${totalEncaisse.toLocaleString('fr-FR')} FCFA`} icon={<TrendingUp className="w-5 h-5" />} color="bg-teal-100 text-teal-600" />
      </div>

      <div>
        <SearchBar placeholder="Rechercher par r├®f├®rence ou employeur..." />
        {declarations.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune d├®claration enregistr├®e.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['R├®f├®rence', 'Employeur', 'P├®riode', 'Montant', '├ëch├®ance', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {declarations.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{d.reference ?? `CTS-${d.id}`}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{d.employeur?.raison_sociale ?? d.employeur?.company_name ?? 'ÔÇö'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{d.mois}/{d.annee}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium text-xs">{Number(d.montant).toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.echeance ? new Date(d.echeance).toLocaleDateString('fr-FR') : 'ÔÇö'}</td>
                    <td className="px-4 py-3">{statusBadge(d.status ?? 'En attente')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                        {d.status === 'En attente' && (
                          <button onClick={() => handleValider(d.id)} className="p-1 text-gray-400 hover:text-green-600">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {enRetard.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Employeurs en retard</h3>
          </div>
          <div className="space-y-3">
            {enRetard.map(d => (
              <div key={d.id} className="flex items-center gap-4 p-3 border border-red-100 rounded-lg bg-red-50">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900">{d.employeur?.raison_sociale ?? d.employeur?.company_name ?? 'ÔÇö'}</p>
                  <p className="text-xs text-gray-600">{Number(d.montant).toLocaleString('fr-FR')} FCFA ┬À ├ëch├®ance {d.echeance ? new Date(d.echeance).toLocaleDateString('fr-FR') : 'ÔÇö'}</p>
                </div>
                <button onClick={() => handleRelancer(d.id)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
                  Relancer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// ÔöÇÔöÇÔöÇ Agent Prestations ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function AgentPrestations() {
  const [demandesPrest, setDemandesPrest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPrestations()
      .then(data => {
        setDemandesPrest(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleValider = async (id: number) => {
    try {
      await validerPrestation(id);
      setDemandesPrest(prev => prev.map(p => p.id === id ? { ...p, status: 'Approuv├®e' } : p));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRejeter = async (id: number) => {
    try {
      await rejeterPrestation(id);
      setDemandesPrest(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejet├®e' } : p));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, BadgeVariant> = {
      'En attente': 'orange',
      'En cours': 'blue',
      'Approuv├®e': 'green',
      'Rejet├®e': 'red',
    };
    return <Badge label={s} variant={map[s] ?? 'gray'} />;
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const enAttente = demandesPrest.filter(p => p.status === 'En attente');
  const approuvees = demandesPrest.filter(p => p.status === 'Approuv├®e');
  const totalApprouve = approuvees.reduce((sum, p) => sum + Number(p.montant), 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="Prestations" sub="Instruction des demandes de prestations sociales" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Demandes re├ºues"
          value={demandesPrest.length}
          sub="Toutes p├®riodes"
          icon={<Heart className="w-5 h-5" />}
          color="bg-pink-100 text-pink-600"
        />
        <StatCard
          label="En attente"
          value={enAttente.length}
          icon={<Clock className="w-5 h-5" />}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Approuv├®es"
          value={approuvees.length}
          icon={<CheckCircle className="w-5 h-5" />}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          label="Total approuv├®"
          value={`${totalApprouve.toLocaleString('fr-FR')} FCFA`}
          icon={<CreditCard className="w-5 h-5" />}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      <div>
        <SearchBar placeholder="Rechercher par b├®n├®ficiaire ou type de prestation..." />
        {demandesPrest.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune demande de prestation enregistr├®e.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['R├®f├®rence', 'B├®n├®ficiaire', 'Type', 'Date', 'Statut', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {demandesPrest.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {d.reference ?? `PREST-${d.id}`}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {d.nom_beneficiaire ?? (d.travailleur ? `${d.travailleur.nom} ${d.travailleur.prenom}` : 'ÔÇö')}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{d.type}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {d.created_at ? new Date(d.created_at).toLocaleDateString('fr-FR') : 'ÔÇö'}
                    </td>
                    <td className="px-4 py-3">{statusBadge(d.status ?? 'En attente')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        {d.status === 'En attente' && (
                          <>
                            <button
                              onClick={() => handleValider(d.id)}
                              className="p-1 text-gray-400 hover:text-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejeter(d.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
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
        )}
      </div>
    </div>
  );
}
// ÔöÇÔöÇÔöÇ Agent Support ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function AgentSupport() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [actualites, setActualites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getFaqs(), getActualites()])
      .then(([faqData, actuData]) => {
        setFaqs(faqData);
        setActualites(actuData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <SectionHeader title="Support & Contenu" sub="Gestion de la FAQ et des actualit├®s" />

      <div className="grid sm:grid-cols-2 gap-4">
        <StatCard label="Articles FAQ" value={faqs.length} icon={<BookOpen className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="Actualit├®s publi├®es" value={actualites.length} icon={<Newspaper className="w-5 h-5" />} color="bg-green-100 text-green-600" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-4">Tickets de support</h3>
        <div className="text-center py-8">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Module de gestion des tickets de support ├á venir.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">FAQ</h3>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
              + Nouvel article
            </button>
          </div>
          {faqs.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun article FAQ pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {faqs.slice(0, 5).map(f => (
                <div key={f.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs text-gray-900 truncate">{f.question}</p>
                    <p className="text-xs text-gray-400">{f.vues.toLocaleString('fr-FR')} vues</p>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-blue-600"><Edit className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Actualit├®s</h3>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
              + Nouvelle
            </button>
          </div>
          {actualites.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune actualit├® publi├®e.</p>
          ) : (
            <div className="space-y-3">
              {actualites.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Newspaper className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs text-gray-900 truncate">{a.titre}</p>
                    <p className="text-xs text-gray-400">{a.categorie}</p>
                  </div>
                  <Badge label="Publi├®e" variant="green" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ÔöÇÔöÇÔöÇ Administrateur ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('supervision');
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'supervision' as AdminTab, label: 'Supervision g├®n├®rale', icon: <Activity className="w-4 h-4" /> },
    { id: 'utilisateurs' as AdminTab, label: 'Gestion utilisateurs', icon: <Users className="w-4 h-4" /> },
  ];

  const getRoleInfo = (roleId: string) => ROLES.find(r => r.id === roleId) ?? ROLES[0];

  useEffect(() => {
    Promise.all([getStatsAdmin(), getAgents(), getActivityLogs()])
      .then(([statsData, agentsData, logsData]) => {
        setStats(statsData);
        setAgents(agentsData);
        setLogs(logsData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      await updateAgentRole(id, newRole);
      setAgents(prev => prev.map(a => a.id === id ? { ...a, type: newRole } : a));
      setEditingAgent(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} />;

  const agentsInactifs = agents.filter(a => a.user?.statut === 'inactif');

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  const cotisationsParStatut = stats?.cotisations?.par_statut ?? [];
  const prestationsParType   = stats?.prestations?.par_type ?? [];
  const cotisationsParMois   = stats?.cotisations?.par_mois ?? [];

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
          <SectionHeader title="Supervision g├®n├®rale" sub="Vue d'ensemble de toutes les activit├®s CNSS" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Employeurs immatricul├®s" value={stats?.employeurs?.total ?? 0} sub={`${stats?.employeurs?.en_attente ?? 0} en attente`} icon={<Users className="w-5 h-5" />} color="bg-violet-100 text-violet-600" />
            <StatCard label="Travailleurs actifs" value={stats?.travailleurs?.actifs ?? 0} sub={`${stats?.travailleurs?.total ?? 0} au total`} icon={<UserPlus className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
            <StatCard label="D├®clarations cotisation" value={stats?.cotisations?.en_attente ?? 0} sub="En attente" icon={<FileText className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
            <StatCard label="Demandes prestations" value={stats?.prestations?.en_attente ?? 0} sub="├Ç instruire" icon={<Heart className="w-5 h-5" />} color="bg-pink-100 text-pink-600" />
          </div>

          {/* Graphiques */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-center">Cotisations par statut</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                {cotisationsParStatut.length === 0 ? (
                  <p className="text-sm text-gray-400">Aucune donn├®e disponible</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={cotisationsParStatut} cx="50%" cy="45%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                        {cotisationsParStatut.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={60} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-center">Prestations par type</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                {prestationsParType.length === 0 ? (
                  <p className="text-sm text-gray-400">Aucune donn├®e disponible</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={prestationsParType} cx="50%" cy="45%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                        {prestationsParType.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={60} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-center">├ëvolution des cotisations</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                {cotisationsParMois.length === 0 ? (
                  <p className="text-sm text-gray-400">Aucune donn├®e disponible</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cotisationsParMois}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periode" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString('fr-FR')} FCFA`} />
                      <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Journal d'activit├® r├®cente</h3>
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune activit├® enregistr├®e pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {logs.map(l => (
                  <div key={l.id} className="flex items-start gap-3 text-sm py-3 border-b border-gray-50 last:border-0">
                    <Activity className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-gray-900">{l.user?.name ?? 'Syst├¿me'}</span>
                      <span className="text-gray-500"> ÔÇö {l.action}</span>
                      {l.service && (
                        <div className="mt-0.5">
                          <Badge label={l.service} variant="blue" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(l.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'utilisateurs' && (
        <div className="space-y-4">
          <SectionHeader title="Gestion des utilisateurs" sub={`${agents.length} comptes agents enregistr├®s`} action={
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />Cr├®er un compte
            </button>
          } />
          <SearchBar placeholder="Rechercher un agent..." />
          {agents.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun agent enregistr├®.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Agent', 'Email', 'Profil / R├┤le', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agents.map(a => {
                    const roleInfo = getRoleInfo(a.type);
                    return (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-blue-700">{a.user?.name?.[0] ?? '?'}</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{a.user?.name ?? 'ÔÇö'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{a.email ?? a.user?.email ?? 'ÔÇö'}</td>
                        <td className="px-4 py-3">
                          {editingAgent === String(a.id) ? (
                            <select
                              defaultValue={a.type}
                              onChange={(e) => handleRoleChange(a.id, e.target.value)}
                              onBlur={() => setEditingAgent(null)}
                              className="text-xs border border-blue-400 rounded px-2 py-1 focus:outline-none"
                            >
                              {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                            </select>
                          ) : (
                            <button onClick={() => setEditingAgent(String(a.id))} className="group">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>
                                {roleInfo.badge}
                              </span>
                              <Edit className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge label={a.user?.statut === 'inactif' ? 'Inactif' : 'Actif'} variant={a.user?.statut === 'inactif' ? 'gray' : 'green'} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="R├®initialiser mot de passe">
                              <Key className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors" title="Modifier">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">R├®partition par profil</h3>
            <div className="space-y-3">
              {ROLES.map(role => {
                const count = agents.filter(a => a.type === role.id).length;
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
            </div>
          </div>

          {agentsInactifs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Comptes inactifs</h3>
              <div className="space-y-2">
                {agentsInactifs.map(a => {
                  const roleInfo = getRoleInfo(a.type);
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3 border border-orange-100 rounded-lg bg-orange-50">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{a.user?.name ?? 'ÔÇö'}</p>
                        <p className="text-xs text-gray-500">{roleInfo.label}</p>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">R├®activer</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// ÔöÇÔöÇÔöÇ Main shell ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

interface AgentDashboardProps {
  role: RoleId;
}

export function AgentDashboard({ role: userRole }: AgentDashboardProps) {
  const role = ROLES.find(r => r.id === userRole)!;
  const storedUser = getStoredUser();
  const userName = (storedUser?.name as string) ?? 'Agent CNSS';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <CNSSLogo size="medium" />
            <div>
              <p className="font-bold text-gray-900 text-sm">CNSS B├®nin</p>
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
            Vous ├¬tes connect├® en tant que <span className="font-semibold">{role.label}</span>
          </p>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Param├¿tres</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="font-medium text-sm">Notifications</span>
          </button>
          <Link
            to="/"
            onClick={() => clearAuth()}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">D├®connexion</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{userName}</h1>
            <p className="text-xs text-gray-500">{role.label} ┬À CNSS B├®nin</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold ${role.color}`}>{role.badge}</span>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
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

// Wrappers pour chaque profil ÔÇö le r├┤le vient de l'URL/route, le nom vient de l'utilisateur connect├®
export function AgentImmatriculationDashboard() {
  return <AgentDashboard role="immatriculation" />;
}

export function AgentEmployeurDashboard() {
  return <AgentDashboard role="employeur" />;
}

export function AgentCotisationDashboard() {
  return <AgentDashboard role="cotisation" />;
}

export function AgentPrestationsDashboard() {
  return <AgentDashboard role="prestations" />;
}

export function AgentSupportDashboard() {
  return <AgentDashboard role="support" />;
}

export function AdminDashboardPage() {
  return <AgentDashboard role="admin" />;
}
