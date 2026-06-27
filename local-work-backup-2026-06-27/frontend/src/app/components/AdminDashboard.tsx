import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Activity, AlertCircle, BarChart2, Download, Edit, FileText,
  Heart, Key, Lock, MessageSquare, Plus, Settings,
  Shield, TrendingUp, Users, UserPlus, XCircle, Bell,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { ROLES, type RoleId } from './shared/roles';
import { Badge } from './shared/Badge';
import { StatCard } from './shared/StatCard';
import { SectionHeader } from './shared/SectionHeader';
import { SearchBar } from './shared/SearchBar';
import {
  createAgent, getAgents, getActivityLogs,
  getStatsAdmin, updateAgentRole,
} from '../../api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface AgentRow {
  id: string | number;
  nom: string;
  email: string;
  role: RoleId;
  statut: 'Actif' | 'Inactif';
  derniere: string;
}

interface NewAgentForm {
  name: string;
  email: string;
  password: string;
  type: RoleId;
  department: string;
  phone: string;
}

// ─── Constantes statiques ─────────────────────────────────────────────────────

const FALLBACK_CHART_COLORS = [
  '#4A90E2', '#50C878', '#9B59B6', '#E74C3C', '#F59E0B', '#EF4444',
];

const FALLBACK_CATEGORIES_EMPLOYEURS: ChartDataItem[] = [
  { name: 'Société',              value: 1245, color: '#4A90E2' },
  { name: 'Établissement',        value: 458,  color: '#50C878' },
  { name: 'École',                value: 287,  color: '#FFB84D' },
  { name: 'Cabinet/Étude',        value: 165,  color: '#9B59B6' },
  { name: 'ONG/Association',      value: 132,  color: '#E74C3C' },
  { name: 'Structure étatique',   value: 78,   color: '#3498DB' },
  { name: 'Église',               value: 32,   color: '#1ABC9C' },
  { name: 'Gens de maison',       value: 18,   color: '#F39C12' },
  { name: 'Assurance volontaire', value: 3,    color: '#E67E22' },
];

const FALLBACK_COTISATIONS: ChartDataItem[] = [
  { name: 'À jour',    value: 2156, color: '#50C878' },
  { name: 'En retard', value: 42,   color: '#E74C3C' },
  { name: 'En cours',  value: 49,   color: '#FFB84D' },
];

const FALLBACK_PRESTATIONS: ChartDataItem[] = [
  { name: 'Prestations familiales', value: 67, color: '#4A90E2' },
  { name: 'Risques professionnels', value: 41, color: '#E74C3C' },
  { name: 'Pensions',               value: 48, color: '#50C878' },
];

const FALLBACK_COTISATIONS_STATS = {
  declarationsRecues: 2156,
  montantTotal: '18450000000',
  enRetard: 42,
  tauxRecouvrement: 89,
};

const FALLBACK_PRESTATIONS_STATS = {
  demandes: 156,
  approuvees: 124,
  montantVerse: '245000000',
  delaiMoyen: 5.2,
};

const ACTIVITE_PAR_SERVICE = [
  { service: 'Immatriculation',    demandes: 12, color: 'bg-violet-500' },
  { service: 'Gestion employeurs', demandes: 8,  color: 'bg-blue-500'   },
  { service: 'Cotisation',         demandes: 28, color: 'bg-teal-500'   },
  { service: 'Prestations',        demandes: 19, color: 'bg-pink-500'   },
];

const PERFORMANCES_SERVICE = [
  { service: 'Immatriculation',    delai: '2.3 jours', taux: 94, couleur: 'bg-violet-500' },
  { service: 'Gestion employeurs', delai: '1.8 jours', taux: 97, couleur: 'bg-blue-500'   },
  { service: 'Cotisation',         delai: '3.1 jours', taux: 89, couleur: 'bg-teal-500'   },
  { service: 'Prestations',        delai: '5.2 jours', taux: 91, couleur: 'bg-pink-500'   },
];

const INITIAL_FORM: NewAgentForm = {
  name: '', email: '', password: '', type: 'support', department: '', phone: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyFallbackColors(data: ChartDataItem[], fallback: string[]): ChartDataItem[] {
  return data.map((item, i) => ({
    ...item,
    color: item.color ?? fallback[i % fallback.length],
  }));
}

function validateAgentForm(form: NewAgentForm): string | null {
  if (!form.name.trim())         return 'Le nom complet est requis.';
  if (!form.email.trim())        return "L'email est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                  return "Format d'email invalide.";
  if (form.password.length < 8)  return 'Le mot de passe doit contenir au moins 8 caractères.';
  return null;
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function PieCard({ title, data }: { title: string; data: ChartDataItem[] }) {
  const colored = applyFallbackColors(data, FALLBACK_CHART_COLORS);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-2 text-center">{title}</h3>
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={colored} cx="50%" cy="45%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
              {colored.map((entry, i) => <Cell key={i} fill={entry.color!} />)}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom" height={60} iconType="circle"
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value, entry: any) => (
                <span className="text-xs text-gray-600">{value}: {entry.payload.value.toLocaleString()}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div className={`w-10 h-6 ${on ? 'bg-green-500' : 'bg-gray-300'} rounded-full relative cursor-pointer flex-shrink-0`}>
      <div className={`absolute ${on ? 'right-1' : 'left-1'} top-1 w-4 h-4 bg-white rounded-full transition-all`} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Chargement des données...</p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <p className="text-sm text-red-600 font-medium">{message}</p>
        <button onClick={onRetry} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
          Réessayer
        </button>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type AdminTab = 'supervision' | 'utilisateurs' | 'statistiques' | 'parametres';

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'supervision',  label: 'Supervision générale',  icon: <Activity className="w-4 h-4" />  },
  { id: 'utilisateurs', label: 'Gestion utilisateurs',  icon: <Users className="w-4 h-4" />     },
  { id: 'statistiques', label: 'Statistiques globales', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'parametres',   label: 'Paramètres système',    icon: <Settings className="w-4 h-4" />  },
];

// ─── Composant principal ──────────────────────────────────────────────────────

export function AdminDashboard() {
  const [tab, setTab]                           = useState<AdminTab>('supervision');
  const [editingAgent, setEditingAgent]         = useState<string | null>(null);
  const [stats, setStats]                       = useState<any | null>(null);
  const [agents, setAgents]                     = useState<any[]>([]);
  const [logs, setLogs]                         = useState<any[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm]     = useState(false);
  const [createError, setCreateError]           = useState<string | null>(null);
  const [createSuccess, setCreateSuccess]       = useState<string | null>(null);
  const [newAgentForm, setNewAgentForm]         = useState<NewAgentForm>(INITIAL_FORM);

  const getRoleInfo = (roleId: RoleId) => ROLES.find(r => r.id === roleId) ?? ROLES[0];

  // ── Mémoïsation des agents normalisés ──────────────────────────────────────
  const agentsWithStatus = useMemo<AgentRow[]>(() =>
    agents.map(agent => ({
      id:       agent.id,
      nom:      agent.user?.name ?? agent.email ?? `Agent ${agent.id}`,
      email:    agent.email ?? agent.user?.email ?? '—',
      role:     (agent.type ?? 'support') as RoleId,
      statut:   (agent.statut ?? 'Actif') as 'Actif' | 'Inactif',
      derniere: agent.derniere ?? '—',
    })),
  [agents]);

  // ── Chargement initial ─────────────────────────────────────────────────────
  async function loadAdminData() {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, agentsRes, logsRes] = await Promise.all([
        getStatsAdmin(),
        getAgents(),
        getActivityLogs(),
      ]);
      setStats(statsRes);
      setAgents(agentsRes);
      setLogs(logsRes);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAdminData(); }, []);

  // ── Changement de rôle ─────────────────────────────────────────────────────
  async function handleRoleChange(agentId: string, newRole: RoleId) {
    try {
      await updateAgentRole(Number(agentId), newRole);
      setAgents(prev =>
        prev.map(a => a.id.toString() === agentId ? { ...a, type: newRole } : a)
      );
    } catch (err: any) {
      console.error('Erreur mise à jour rôle agent :', err);
    } finally {
      // Toujours fermer l'édition, succès ou échec
      setEditingAgent(null);
    }
  }

  // ── Création d'agent ───────────────────────────────────────────────────────
  async function handleCreateAgent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    // Validation côté client
    const validationError = validateAgentForm(newAgentForm);
    if (validationError) {
      setCreateError(validationError);
      return;
    }

    try {
      const created = await createAgent(newAgentForm);
      setAgents(prev => [created, ...prev]);
      setCreateSuccess('Agent créé avec succès.');
      setShowCreateForm(false);
      setNewAgentForm(INITIAL_FORM);
    } catch (err: any) {
      setCreateError(err.message || "Erreur lors de la création de l'agent.");
    }
  }

  function updateForm(field: keyof NewAgentForm, value: string) {
    setNewAgentForm(prev => ({ ...prev, [field]: value }));
  }

  // ─── Rendu : état de chargement / erreur ───────────────────────────────────

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} onRetry={loadAdminData} />;

  // ─── Supervision ───────────────────────────────────────────────────────────

  function renderSupervision() {
    const cotisStats  = stats?.cotisations ?? FALLBACK_COTISATIONS_STATS;
    const prestStats  = stats?.prestations ?? FALLBACK_PRESTATIONS_STATS;

    return (
      <div className="space-y-6">
        <SectionHeader title="Supervision générale" sub="Vue d'ensemble de toutes les activités CNSS" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Employeurs immatriculés" value={(stats?.employeurs?.total ?? 0).toLocaleString()}    sub={`${(stats?.employeurs?.valides ?? 0).toLocaleString()} validés`} icon={<Users className="w-5 h-5" />}    color="bg-violet-100 text-violet-600" />
          <StatCard label="Travailleurs actifs"     value={(stats?.travailleurs?.actifs ?? 0).toLocaleString()} sub={`Total: ${(stats?.travailleurs?.total ?? 0).toLocaleString()}`}  icon={<UserPlus className="w-5 h-5" />}  color="bg-blue-100 text-blue-600"    />
          <StatCard label="Déclarations cotisation" value={stats?.cotisations?.en_attente ?? 0}                sub="En attente"                                                         icon={<FileText className="w-5 h-5" />}  color="bg-orange-100 text-orange-600" />
          <StatCard label="Demandes prestations"    value={stats?.prestations?.en_attente ?? 0}                sub="À instruire"                                                        icon={<Heart className="w-5 h-5" />}     color="bg-pink-100 text-pink-600"    />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <PieCard title="Employeurs par catégorie"      data={stats?.employeurs?.par_forme_juridique ?? FALLBACK_CATEGORIES_EMPLOYEURS} />
          <PieCard title="Cotisations — Juin 2026"       data={stats?.cotisations?.par_statut         ?? FALLBACK_COTISATIONS}           />
          <PieCard title="Prestations par type — Juin 2026" data={stats?.prestations?.par_type        ?? FALLBACK_PRESTATIONS}           />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Activité par service</h3>
            <div className="space-y-3">
              {ACTIVITE_PAR_SERVICE.map((s, i) => (
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
              {agentsWithStatus.filter(a => a.statut === 'Actif').slice(0, 5).map(a => {
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
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Aucune activité enregistrée.</p>
            ) : logs.map(l => (
              <div key={l.id} className="flex items-start gap-3 text-sm py-3 border-b border-gray-50 last:border-0">
                <Activity className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-900">{l.user}</span>
                  <span className="text-gray-500"> — {l.action}</span>
                  <div className="mt-0.5"><Badge label={l.service} variant="blue" /></div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{l.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Utilisateurs ──────────────────────────────────────────────────────────

  function renderUtilisateurs() {
    const inactifs = agentsWithStatus.filter(a => a.statut === 'Inactif');

    return (
      <div className="space-y-4">
        <SectionHeader
          title="Gestion des utilisateurs"
          sub={`${agentsWithStatus.length} comptes agents enregistrés`}
          action={
            <button
              onClick={() => { setShowCreateForm(p => !p); setCreateError(null); setCreateSuccess(null); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />Créer un compte
            </button>
          }
        />

        {/* ── Formulaire création ── */}
        {showCreateForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Nouvel agent</h3>
            <form onSubmit={handleCreateAgent} className="grid gap-4 md:grid-cols-2" noValidate>
              {(
                [
                  { label: 'Nom complet',   field: 'name',       type: 'text'     },
                  { label: 'Email',          field: 'email',      type: 'email'    },
                  { label: 'Mot de passe',   field: 'password',   type: 'password' },
                  { label: 'Département',    field: 'department', type: 'text'     },
                  { label: 'Téléphone',      field: 'phone',      type: 'tel'      },
                ] as { label: string; field: keyof NewAgentForm; type: string }[]
              ).map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={newAgentForm[field]}
                    onChange={e => updateForm(field, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={newAgentForm.type}
                  onChange={e => updateForm('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 space-y-3">
                {createError   && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{createError}</p>}
                {createSuccess && <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{createSuccess}</p>}
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                    Enregistrer
                  </button>
                  <button type="button" onClick={() => { setShowCreateForm(false); setNewAgentForm(INITIAL_FORM); setCreateError(null); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    Annuler
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <SearchBar placeholder="Rechercher un agent..." />

        {/* ── Table agents ── */}
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
              {agentsWithStatus.map(a => {
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
                      {editingAgent === String(a.id) ? (
                        <select
                          defaultValue={a.role}
                          autoFocus
                          onChange={e => handleRoleChange(String(a.id), e.target.value as RoleId)}
                          className="text-xs border border-blue-400 rounded px-2 py-1 focus:outline-none"
                        >
                          {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                        </select>
                      ) : (
                        <button onClick={() => setEditingAgent(String(a.id))} className="group flex items-center gap-1">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>{roleInfo.badge}</span>
                          <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3"><Badge label={a.statut} variant={a.statut === 'Actif' ? 'green' : 'gray'} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{a.derniere}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"   title="Réinitialiser mot de passe"><Key className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors" title="Modifier"><Edit className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"    title="Désactiver"><XCircle className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Répartition + Inactifs ── */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Répartition par profil</h3>
            <div className="space-y-3">
              {ROLES.map(role => (
                <div key={role.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${role.color}`}>{role.badge}</span>
                    <span className="text-sm text-gray-600">{role.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{agentsWithStatus.filter(a => a.role === role.id).length}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Comptes inactifs</h3>
            {inactifs.length > 0 ? (
              <div className="space-y-2">
                {inactifs.map(a => {
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
              <p className="text-sm text-gray-500">Aucun compte inactif.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Statistiques ──────────────────────────────────────────────────────────

  function renderStatistiques() {
    const cotisStats = stats?.cotisations ?? FALLBACK_COTISATIONS_STATS;
    const prestStats = stats?.prestations ?? FALLBACK_PRESTATIONS_STATS;
    const actifs     = agentsWithStatus.filter(a => a.statut === 'Actif').length;
    const tauxAct    = agentsWithStatus.length
      ? Math.round((actifs / agentsWithStatus.length) * 100) : 0;

    return (
      <div className="space-y-6">
        <SectionHeader title="Statistiques globales" sub="Indicateurs de performance du système CNSS" />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold opacity-90">Cotisations ce mois</h3>
              <TrendingUp className="w-8 h-8 opacity-75" />
            </div>
            <p className="text-4xl font-bold mb-2">{parseInt(cotisStats.montantTotal).toLocaleString()} FCFA</p>
            <div className="space-y-1 text-sm opacity-90">
              <p>{cotisStats.declarationsRecues.toLocaleString()} déclarations reçues</p>
              <p>Taux de recouvrement: <span className="font-bold">{cotisStats.tauxRecouvrement}%</span></p>
              <p className="text-red-200">{cotisStats.enRetard} employeurs en retard</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold opacity-90">Prestations ce mois</h3>
              <Heart className="w-8 h-8 opacity-75" />
            </div>
            <p className="text-4xl font-bold mb-2">{parseInt(prestStats.montantVerse).toLocaleString()} FCFA</p>
            <div className="space-y-1 text-sm opacity-90">
              <p>{prestStats.demandes} demandes reçues</p>
              <p>{prestStats.approuvees} approuvées</p>
              <p>Délai moyen: <span className="font-bold">{prestStats.delaiMoyen} jours</span></p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold opacity-90">Personnel actif</h3>
              <Shield className="w-8 h-8 opacity-75" />
            </div>
            <p className="text-4xl font-bold mb-2">{actifs}</p>
            <div className="space-y-1 text-sm opacity-90">
              <p>Total agents: {agentsWithStatus.length}</p>
              <p>Comptes inactifs: {agentsWithStatus.filter(a => a.statut === 'Inactif').length}</p>
              <p>Taux d'activité: <span className="font-bold">{tauxAct}%</span></p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Évolution des cotisations</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.cotisations?.par_mois ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="periode" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} FCFA`} />
                  <Bar dataKey="total" fill="#4A90E2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Performances par service</h3>
            <div className="space-y-4 mt-2">
              {PERFORMANCES_SERVICE.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-40 flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{s.service}</p>
                    <p className="text-xs text-gray-500">Délai moyen: {s.delai}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.couleur}`} style={{ width: `${s.taux}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-10 text-right">{s.taux}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Paramètres ────────────────────────────────────────────────────────────

  function renderParametres() {
    const notifItems = [
      { label: 'Alertes cotisations en retard', sub: 'Notification automatique J-7, J-3, J-1', on: true  },
      { label: 'Notifications par email',        sub: 'Copie des alertes importantes par email', on: true  },
      { label: 'SMS automatiques',               sub: "Rappels par SMS pour échéances critiques", on: false },
    ];

    return (
      <div className="space-y-6">
        <SectionHeader title="Paramètres système" sub="Configuration générale de la plateforme CNSS" />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sécurité */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Shield className="w-5 h-5 text-blue-600" /></div>
              <div><h3 className="font-bold text-gray-900">Sécurité et accès</h3><p className="text-xs text-gray-500">Gestion des permissions et authentification</p></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div><p className="text-sm font-semibold text-gray-900">Authentification à deux facteurs</p><p className="text-xs text-gray-500">Obligatoire pour les agents</p></div>
                <Toggle on={true} />
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div><p className="text-sm font-semibold text-gray-900">Durée de session</p><p className="text-xs text-gray-500">Déconnexion automatique après inactivité</p></div>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                  <option>30 minutes</option><option>1 heure</option><option>2 heures</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div><p className="text-sm font-semibold text-gray-900">Complexité mot de passe</p><p className="text-xs text-gray-500">Minimum 12 caractères, majuscules, chiffres, symboles</p></div>
                <Badge label="Élevée" variant="green" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center"><Bell className="w-5 h-5 text-orange-600" /></div>
              <div><h3 className="font-bold text-gray-900">Notifications</h3><p className="text-xs text-gray-500">Configuration des alertes système</p></div>
            </div>
            <div className="space-y-3">
              {notifItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div><p className="text-sm font-semibold text-gray-900">{item.label}</p><p className="text-xs text-gray-500">{item.sub}</p></div>
                  <Toggle on={item.on} />
                </div>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Settings className="w-5 h-5 text-purple-600" /></div>
              <div><h3 className="font-bold text-gray-900">Configuration générale</h3><p className="text-xs text-gray-500">Paramètres de la plateforme</p></div>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-gray-100 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-1">Mode maintenance</p>
                <p className="text-xs text-gray-500 mb-3">Désactiver temporairement l'accès public</p>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700">
                  <AlertCircle className="w-3.5 h-3.5" />Activer le mode maintenance
                </button>
              </div>
              <div className="p-3 border border-gray-100 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-1">Sauvegarde automatique</p>
                <p className="text-xs text-gray-500 mb-2">Dernière sauvegarde: 17/06/2026 à 03:00</p>
                <Badge label="Activée — Quotidienne" variant="green" />
              </div>
            </div>
          </div>

          {/* Audit */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><Activity className="w-5 h-5 text-red-600" /></div>
              <div><h3 className="font-bold text-gray-900">Journaux et audit</h3><p className="text-xs text-gray-500">Traçabilité des actions</p></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div><p className="text-sm font-semibold text-gray-900">Actions enregistrées aujourd'hui</p><p className="text-xs text-gray-500">Toutes les opérations critiques</p></div>
                <span className="text-lg font-bold text-gray-900">{logs.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div><p className="text-sm font-semibold text-gray-900">Rétention des logs</p><p className="text-xs text-gray-500">Conservation légale</p></div>
                <Badge label="5 ans" variant="blue" />
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200">
                <Download className="w-4 h-4" />Exporter les journaux
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
              <div className="flex items-center gap-3 flex-wrap">
                <Badge label="Niveau d'accès: Administrateur" variant="red" />
                <span className="text-xs text-gray-500">Dernière modification: 15/06/2026 par AZONDEKON Lucie</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Rendu principal ───────────────────────────────────────────────────────

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === 'supervision'  && renderSupervision()}
      {tab === 'utilisateurs' && renderUtilisateurs()}
      {tab === 'statistiques' && renderStatistiques()}
      {tab === 'parametres'   && renderParametres()}
    </div>
  );
}