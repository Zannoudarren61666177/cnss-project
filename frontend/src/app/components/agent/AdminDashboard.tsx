import { useState, useEffect, useCallback, type FormEvent } from 'react';
import {
  Users, FileText, Heart, Shield, Settings,
  Bell, Activity, RefreshCw, Plus, Download, Edit, XCircle,
  Key, AlertCircle, TrendingUp, BarChart2,
  Lock, ChevronRight,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  createAgent,
  getAgents,
  updateAgentRole,
  updateAgent,
  deleteAgent,
  updateEmployeur,
  deleteEmployeur,
  updateTravailleur,
  deleteTravailleur,
  getEmployeurs,
  getTravailleurs,
  getCotisations,
  getPrestations,
  getActivityLogs,
  getStatsAdmin,
  getNotifications,
} from '../../api';
import { CNSSLogo } from '../CNSSLogo';
import { ROLES, type RoleId } from './shared/roles';
import { StatCard } from './shared/StatCard';
import { Badge } from './shared/Badge';
import { SectionHeader } from './shared/SectionHeader';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Agent {
  id: number;
  nom: string;
  email: string;
  role: RoleId;
  statut: string;
  derniere: string;
}

interface UserRow {
  id: number;
  nom: string;
  email: string;
  profil: string;
  category: 'agent' | 'employeur' | 'travailleur';
  role: string;
  statut: string;
  derniere: string;
  raw: any;
}

interface Stats {
  totalEmployeurs: number;
  employeursActifs: number;
  employeursEnAttente: number;
  employeursValides: number;
  employeursRejetes: number;
  totalTravailleurs: number;
  travailleursActifs: number;
  cotisationsEnAttente: number;
  cotisationsEnRetard: number;
  cotisationsVerifiees: number;
  cotisationsMontant: number;
  cotisationsRetard: number;
  cotisationsTaux: number;
  prestationsEnAttente: number;
  prestationsApprouvees: number;
  prestationsMontant: number;
  prestationsDemandes: number;
  prestationsDelai: number;
  ticketsOuverts: number;
  immatriculationsEnAttente: number;
  // Graphiques
  cotisationsParMois: { periode: string; total: number }[];
  cotisationsParStatut: { name: string; value: number }[];
  prestationsParType: { name: string; value: number }[];
}

type AdminTab = 'supervision' | 'utilisateurs' | 'statistiques' | 'parametres';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoleInfo(roleId: RoleId) {
  return ROLES.find(r => r.id === roleId) ?? ROLES[0];
}

function n(v: any, fallback = 0): number {
  return typeof v === 'number' && isFinite(v) ? v : fallback;
}

function s(v: any, fallback = '—'): string {
  return typeof v === 'string' && v.trim() !== '' ? v : fallback;
}

function capitalize(value: string): string {
  if (!value || typeof value !== 'string') return '—';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function mapAgent(a: any): Agent {
  const statutRaw = a.statut ?? (a.user?.statut ?? (a.is_active ? 'actif' : 'inactif'));
  return {
    id: a.id,
    nom: s(a.name, s(a.nom, '—')),
    email: s(a.email ?? a.user?.email, '—'),
    role: (a.type ?? a.role ?? 'support') as RoleId,
    statut: capitalize(s(statutRaw, 'inactif')),
    derniere: a.last_login_at
      ? new Date(a.last_login_at).toLocaleString('fr-FR')
      : a.updated_at ? new Date(a.updated_at).toLocaleString('fr-FR') : '—',
  };
}

function mapEmployeur(e: any): UserRow {
  return {
    id: e.id,
    nom: s(e.company_name, s(e.email, '—')),
    email: s(e.email, '—'),
    profil: 'Employeur',
    category: 'employeur',
    role: 'Employeur',
    statut: capitalize(s(e.statut, 'inactif')),
    derniere: e.updated_at ? new Date(e.updated_at).toLocaleString('fr-FR') : '—',
    raw: e,
  };
}

function mapTravailleur(t: any): UserRow {
  const fullName = [t.first_name, t.last_name].filter(Boolean).join(' ').trim();
  return {
    id: t.id,
    nom: s(fullName, s(t.email, '—')),
    email: s(t.email, '—'),
    profil: 'Travailleur',
    category: 'travailleur',
    role: 'Travailleur',
    statut: capitalize(s(t.statut, 'inactif')),
    derniere: t.updated_at ? new Date(t.updated_at).toLocaleString('fr-FR') : '—',
    raw: t,
  };
}

function buildStats(raw: any, employeurs: any[], travailleurs: any[], cotisations: any[], prestations: any[], notifications: any[]): Stats {
  if (raw) {
    const emp = raw.employeurs ?? {};
    const tra = raw.travailleurs ?? {};
    const cot = raw.cotisations ?? {};
    const pre = raw.prestations ?? {};
    return {
      totalEmployeurs:        n(emp.total),
      employeursActifs:       n(emp.valides),
      employeursEnAttente:    n(emp.en_attente),
      employeursValides:      n(emp.valides),
      employeursRejetes:      n(emp.rejetes),
      totalTravailleurs:      n(tra.total),
      travailleursActifs:     n(tra.actifs),
      cotisationsEnAttente:   n(cot.en_attente),
      cotisationsEnRetard:    n(cot.en_retard),
      cotisationsVerifiees:   n(cot.verifiees),
      cotisationsMontant:     n(cot.total_encaisse),
      cotisationsRetard:      n(cot.en_retard),
      cotisationsTaux:        n(raw.taux_recouvrement),
      prestationsEnAttente:   n(pre.en_attente),
      prestationsApprouvees:  n(pre.approuvees),
      prestationsMontant:     n(pre.total_verse),
      prestationsDemandes:    n(pre.total),
      prestationsDelai:       n(raw.delai_moyen),
      ticketsOuverts:         notifications.filter((no: any) => !no.read_at).length,
      immatriculationsEnAttente: n(emp.en_attente),
      cotisationsParMois:     Array.isArray(cot.par_mois) ? cot.par_mois : [],
      cotisationsParStatut:   Array.isArray(cot.par_statut) ? cot.par_statut : [],
      prestationsParType:     Array.isArray(pre.par_type) ? pre.par_type : [],
    };
  }
  // fallback local
  return {
    totalEmployeurs:        employeurs.length,
    employeursActifs:       employeurs.filter(e => e.statut === 'validee').length,
    employeursEnAttente:    employeurs.filter(e => e.statut === 'en_attente').length,
    employeursValides:      employeurs.filter(e => e.statut === 'validee').length,
    employeursRejetes:      employeurs.filter(e => e.statut === 'rejetee').length,
    totalTravailleurs:      travailleurs.length,
    travailleursActifs:     travailleurs.filter(t => t.statut === 'actif').length,
    cotisationsEnAttente:   cotisations.filter(c => c.statut === 'en_attente').length,
    cotisationsEnRetard:    cotisations.filter(c => c.statut === 'en_retard').length,
    cotisationsVerifiees:   cotisations.filter(c => c.statut === 'verifiee').length,
    cotisationsMontant:     0,
    cotisationsRetard:      cotisations.filter(c => c.statut === 'en_retard').length,
    cotisationsTaux:        0,
    prestationsEnAttente:   prestations.filter(p => p.statut === 'en_attente').length,
    prestationsApprouvees:  prestations.filter(p => p.statut === 'approuvee').length,
    prestationsMontant:     0,
    prestationsDemandes:    prestations.length,
    prestationsDelai:       0,
    ticketsOuverts:         notifications.filter((n: any) => !n.read_at).length,
    immatriculationsEnAttente: employeurs.filter(e => e.statut === 'en_attente').length,
    cotisationsParMois:     [],
    cotisationsParStatut:   [],
    prestationsParType:     [],
  };
}

const PIE_COLORS = ['#50C878', '#FFB84D', '#E74C3C', '#4A90E2', '#9B59B6', '#1ABC9C'];

// ─── Composant principal ──────────────────────────────────────────────────────

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('supervision');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [employeurs, setEmployeurs] = useState<any[]>([]);
  const [travailleurs, setTravailleurs] = useState<any[]>([]);
  const [cotisations, setCotisations] = useState<any[]>([]);
  const [prestations, setPrestations] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<number | null>(null);
  const [searchAgent, setSearchAgent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [expandedEmployeur, setExpandedEmployeur] = useState<number | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetUser, setResetUser] = useState<UserRow | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [newAgentForm, setNewAgentForm] = useState({
    numero_cnss: '',
    numero_immatriculation: '',
    email: '',
    password: '',
    type: '' as RoleId | '',
    department: '',
    phone: '',
    first_name: '',
    last_name: '',
  });
  

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rAg, rEm, rTr, rCo, rPr, rLg, rSt, rNo] = await Promise.allSettled([
        getAgents(), getEmployeurs(), getTravailleurs(),
        getCotisations(), getPrestations(),
        getActivityLogs(), getStatsAdmin(), getNotifications(),
      ]);
      const ag = rAg.status === 'fulfilled' ? rAg.value : [];
      const em = rEm.status === 'fulfilled' ? rEm.value : [];
      const tr = rTr.status === 'fulfilled' ? rTr.value : [];
      const co = rCo.status === 'fulfilled' ? rCo.value : [];
      const pr = rPr.status === 'fulfilled' ? rPr.value : [];
      const lg = rLg.status === 'fulfilled' ? rLg.value : [];
      const st = rSt.status === 'fulfilled' ? rSt.value : null;
      const no = rNo.status === 'fulfilled' ? rNo.value : [];
      const agentRows = (ag as any[]).map(mapAgent);
      const employerRows = (em as any[]).map(mapEmployeur);
      const travailleurRows = (tr as any[]).map(mapTravailleur);
      setAgents(agentRows);
      setUsers([...agentRows, ...employerRows, ...travailleurRows]);
      setEmployeurs(em as any[]);
      setTravailleurs(tr as any[]);
      setCotisations(co as any[]);
      setPrestations(pr as any[]);
      setLogs(lg as any[]);
      setNotifications(no as any[]);
      setStats(buildStats(st, em as any[], tr as any[], co as any[], pr as any[], no as any[]));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  

  function validateAgentForm(form: typeof newAgentForm) {
    // Validation disabled per request: admin can create agent accounts without frontend checks
    return null;
  }

  async function handleResetPassword(user: UserRow) {
    // open modal to enter new password
    setResetUser(user);
    setResetPassword('');
    setResetError(null);
    setResetModalOpen(true);
  }

  async function submitResetPassword() {
    if (!resetUser) return;
    if (!resetPassword || resetPassword.length < 8) {
      setResetError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setResetLoading(true);
    setResetError(null);
    try {
      if (resetUser.category === 'agent') {
        await updateAgent(resetUser.id, { password: resetPassword });
      } else if (resetUser.category === 'employeur') {
        await updateEmployeur(resetUser.id, { password: resetPassword });
      } else {
        await updateTravailleur(resetUser.id, { password: resetPassword });
      }
      alert('Mot de passe réinitialisé avec succès.');
      setResetModalOpen(false);
      setResetUser(null);
      setResetPassword('');
      // refresh lists
      load();
    } catch (err: any) {
      setResetError(err?.message ?? 'Erreur lors de la réinitialisation du mot de passe.');
    } finally {
      setResetLoading(false);
    }
  }

  async function handleDeleteUser(user: UserRow) {
    if (!window.confirm(`Supprimer définitivement ${user.nom} (${user.role}) ?`)) return;

    try {
      if (user.category === 'agent') {
        await deleteAgent(user.id);
      } else if (user.category === 'employeur') {
        await deleteEmployeur(user.id);
      } else {
        await deleteTravailleur(user.id);
      }
      setUsers(prev => prev.filter(u => u.id !== user.id || u.category !== user.category));
      setAgents(prev => prev.filter(a => a.id !== user.id));
      alert('Utilisateur supprimé.');
    } catch (err: any) {
      alert(err?.message ?? 'Erreur lors de la suppression de l’utilisateur.');
    }
  }

  async function handleRoleChange(agentId: number, newRole: string) {
    try {
      await updateAgentRole(agentId, newRole);
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, role: newRole } : a));
      setUsers(prev => prev.map(u => u.category === 'agent' && u.id === agentId ? { ...u, role: getRoleInfo(newRole).label } : u));
    } catch (err: any) {
      alert(err?.message ?? 'Erreur lors de la mise à jour du rôle');
    } finally {
      setEditingAgent(null);
    }
  }

  async function handleCreateAgent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    // No frontend validation required — proceed to create

    try {
      // ensure we send numero_immatriculation for backend compatibility
      const payload = { ...newAgentForm, numero_immatriculation: newAgentForm.numero_cnss || newAgentForm.numero_immatriculation };
      const created = await createAgent(payload as any);
      const mapped = mapAgent(created);
      setAgents(prev => [mapped, ...prev]);
      setUsers(prev => [
        mapped,
        ...prev,
      ] as UserRow[]);
      setCreateSuccess('Agent créé avec succès.');
      setShowCreateForm(false);
      setNewAgentForm({
        numero_cnss: '',
        numero_immatriculation: '',
        email: '',
        password: '',
        type: '',
        department: '',
        phone: '',
        first_name: '',
        last_name: '',
      });
    } catch (err: any) {
      setCreateError(err?.message ?? 'Erreur lors de la création de l’agent.');
    }
  }

  const filteredUsers = users.filter(u =>
    (u.nom ?? '').toLowerCase().includes(searchAgent.toLowerCase()) ||
    (u.email ?? '').toLowerCase().includes(searchAgent.toLowerCase()) ||
    (u.profil ?? '').toLowerCase().includes(searchAgent.toLowerCase()) ||
    (u.role ?? '').toLowerCase().includes(searchAgent.toLowerCase())
  );

  // Graphiques supervision
  const employeursChart = [
    { name: 'Validés',    value: stats?.employeursValides ?? 0,    color: '#50C878' },
    { name: 'En attente', value: stats?.employeursEnAttente ?? 0,  color: '#FFB84D' },
    { name: 'Rejetés',    value: stats?.employeursRejetes ?? 0,    color: '#E74C3C' },
  ].filter(d => d.value > 0);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'supervision',  label: 'Supervision générale', icon: <Activity className="w-4 h-4" /> },
    { id: 'utilisateurs', label: 'Gestion utilisateurs', icon: <Users className="w-4 h-4" /> },
    { id: 'statistiques', label: 'Statistiques globales', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'parametres',   label: 'Paramètres système',   icon: <Settings className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-semibold">{error}</p>
          <button onClick={load} className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Supervision ── */}
      {tab === 'supervision' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <SectionHeader title="Supervision générale" sub="Vue d'ensemble de toutes les activités CNSS" />
            <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" /> Actualiser
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Agents" value={agents.length.toLocaleString()} sub="Nombre d’agents en temps réel" icon={<Shield className="w-5 h-5" />} color="bg-green-100 text-green-600" />
            <StatCard label="Employeurs" value={stats!.totalEmployeurs.toLocaleString()} sub={`${stats!.employeursActifs} validés`} icon={<Users className="w-5 h-5" />} color="bg-violet-100 text-violet-600" />
            <StatCard label="Travailleurs" value={stats!.totalTravailleurs.toLocaleString()} sub={`${stats!.travailleursActifs} actifs`} icon={<Users className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
            <StatCard label="Cotisations en attente" value={stats!.cotisationsEnAttente} icon={<FileText className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
          </div>

          {/* PieCharts */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Employeurs', data: employeursChart },
              { title: 'Travailleurs', data: [
                { name: 'Actifs', value: stats?.travailleursActifs ?? 0, color: PIE_COLORS[0] },
                { name: 'Inactifs', value: Math.max(0, (stats?.totalTravailleurs ?? 0) - (stats?.travailleursActifs ?? 0)), color: PIE_COLORS[1] },
              ].filter(d => d.value > 0) },
              { title: 'Cotisations', data: (stats!.cotisationsParStatut ?? []).map((d, i) => ({ ...d, color: PIE_COLORS[i % PIE_COLORS.length] })) },
            ].map(chart => (
              <div key={chart.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-2 text-center">{chart.title}</h3>
                {chart.data.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Aucune donnée</div>
                ) : (
                  <div className="w-full h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chart.data} cx="50%" cy="45%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                          {chart.data.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={50} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Agents actifs */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Agents actifs</h3>
              {agents.filter(a => a.statut === 'Actif').length === 0 ? (
                <p className="text-sm text-gray-500">Aucun agent actif.</p>
              ) : (
                <div className="space-y-2">
                  {agents.filter(a => a.statut === 'Actif').slice(0, 6).map(a => {
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
              )}
              <button onClick={() => setTab('utilisateurs')} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Gérer les agents <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Journal */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Journal d'activité récente</h3>
              {logs.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune activité enregistrée.</p>
              ) : (
                <div className="space-y-2">
                  {logs.slice(0, 6).map((l: any, i: number) => (
                    <div key={l.id ?? i} className="flex items-start gap-3 text-sm py-2 border-b border-gray-50 last:border-0">
                      <Activity className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-900">{typeof l.user === 'string' ? l.user : l.user?.name ?? l.user?.email ?? l.causer ?? '—'}</span>
                        <span className="text-gray-500"> — {l.description ?? l.action ?? '—'}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {l.created_at ? new Date(l.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Utilisateurs ── */}
      {tab === 'utilisateurs' && (
        <div className="space-y-4">
          <SectionHeader
            title="Gestion des utilisateurs"
            sub={`${users.length} comptes enregistrés`}
            action={
              <button
                onClick={() => {
                  setShowCreateForm(prev => {
                    const next = !prev;
                    if (next) {
                      setNewAgentForm({ numero_cnss: '', email: '', password: '', type: '', department: '', phone: '', first_name: '', last_name: '' });
                      setCreateError(null);
                      setCreateSuccess(null);
                    }
                    return next;
                  });
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />Créer un compte
              </button>
            }
          />

          {showCreateForm && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Créer un nouvel agent</h3>
              <form key={showCreateForm ? 'create-open' : 'create-closed'} onSubmit={handleCreateAgent} className="grid gap-4 md:grid-cols-2" noValidate autoComplete="off">
                <input type="text" name="prevent_autofill" autoComplete="username" style={{ display: 'none' }} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro CNSS</label>
                  <input
                    type="text"
                    name="numero_cnss"
                    autoComplete="off"
                    value={newAgentForm.numero_cnss}
                    onChange={e => setNewAgentForm(prev => ({ ...prev, numero_cnss: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email_new_agent"
                    autoComplete="off"
                    value={newAgentForm.email}
                    onChange={e => setNewAgentForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    name="password_new_agent"
                    autoComplete="new-password"
                    value={newAgentForm.password}
                    onChange={e => setNewAgentForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select
                    value={newAgentForm.type}
                    onChange={e => setNewAgentForm(prev => ({ ...prev, type: e.target.value as RoleId }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choisir un rôle</option>
                    {ROLES.map(role => <option key={role.id} value={role.id}>{role.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="first_name"
                    autoComplete="given-name"
                    value={newAgentForm.first_name}
                    onChange={e => setNewAgentForm(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="last_name"
                    autoComplete="family-name"
                    value={newAgentForm.last_name}
                    onChange={e => setNewAgentForm(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                  <input
                    type="text"
                    name="department"
                    autoComplete="organization"
                    value={newAgentForm.department}
                    onChange={e => setNewAgentForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    name="phone"
                    autoComplete="tel"
                    value={newAgentForm.phone}
                    onChange={e => setNewAgentForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  {createError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{createError}</p>}
                  {createSuccess && <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{createSuccess}</p>}
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setCreateError(null);
                        setCreateSuccess(null);
                        setNewAgentForm({
                          numero_cnss: '',
                          email: '',
                          password: '',
                          type: '',
                          department: '',
                          phone: '',
                          first_name: '',
                          last_name: '',
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchAgent}
              onChange={e => setSearchAgent(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* ── Split sections: Agents / Employeurs / Travailleurs ── */}
          <div className="space-y-6">
            {/* Agents */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Agents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Agent', 'Email', 'Profil / Rôle', 'Statut', 'Dernière connexion', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {agents.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">Aucun agent</td></tr>
                    ) : agents.map(a => {
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
                                onChange={e => handleRoleChange(a.id, e.target.value)}
                                onBlur={() => setEditingAgent(null)}
                                autoFocus
                                className="text-xs border border-blue-400 rounded px-2 py-1 focus:outline-none"
                              >
                                {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                              </select>
                            ) : (
                              <button onClick={() => setEditingAgent(a.id)} className="group flex items-center gap-1">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>
                                  {roleInfo.badge}
                                </span>
                                <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3"><Badge label={a.statut} variant={a.statut === 'Actif' ? 'green' : 'gray'} /></td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{a.derniere}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleResetPassword({ id: a.id, nom: a.nom, email: a.email, profil: 'Agent', category: 'agent', role: a.role, statut: a.statut, derniere: a.derniere, raw: {} })} className="p-1.5 text-gray-400 hover:text-blue-600" title="Réinitialiser mot de passe"><Key className="w-4 h-4" /></button>
                              <button onClick={() => setEditingAgent(a.id)} className="p-1.5 text-gray-400 hover:text-orange-600" title="Modifier le rôle"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteUser({ id: a.id, nom: a.nom, email: a.email, profil: 'Agent', category: 'agent', role: a.role, statut: a.statut, derniere: a.derniere, raw: {} })} className="p-1.5 text-gray-400 hover:text-red-600" title="Supprimer"><XCircle className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Employeurs (expand to show travailleurs) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Employeurs</h3>
              <div className="space-y-3">
                {employeurs.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun employeur.</p>
                ) : employeurs.map(emp => (
                  <div key={emp.id} className="p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{emp.company_name ?? emp.email}</p>
                        <p className="text-xs text-gray-500">{emp.email} · <span className="font-semibold">{capitalize(emp.statut ?? 'inactif')}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setExpandedEmployeur(prev => prev === emp.id ? null : emp.id)} className="px-3 py-1 text-sm border rounded">{expandedEmployeur === emp.id ? 'Masquer travailleurs' : 'Voir travailleurs'}</button>
                        <button onClick={() => handleResetPassword({ id: emp.id, nom: emp.company_name ?? emp.email, email: emp.email, profil: 'Employeur', category: 'employeur', role: 'Employeur', statut: emp.statut, derniere: emp.updated_at, raw: emp })} className="p-1.5 text-gray-400 hover:text-blue-600" title="Réinitialiser mot de passe"><Key className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteUser({ id: emp.id, nom: emp.company_name ?? emp.email, email: emp.email, profil: 'Employeur', category: 'employeur', role: 'Employeur', statut: emp.statut, derniere: emp.updated_at, raw: emp })} className="p-1.5 text-gray-400 hover:text-red-600" title="Supprimer"><XCircle className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {expandedEmployeur === emp.id && (
                      <div className="mt-3 border-t pt-3 space-y-2">
                        {travailleurs.filter((t: any) => t.employeur_id === emp.id || (t.employeur && t.employeur.id === emp.id)).length === 0 ? (
                          <p className="text-sm text-gray-500">Aucun travailleur pour cet employeur.</p>
                        ) : (
                          travailleurs.filter((t: any) => t.employeur_id === emp.id || (t.employeur && t.employeur.id === emp.id)).map((t: any) => (
                            <div key={t.id} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold">{(t.first_name || t.last_name) ? `${t.first_name ?? ''} ${t.last_name ?? ''}`.trim() : t.email}</p>
                                <p className="text-xs text-gray-500">{t.email} · {capitalize(t.statut ?? 'inactif')}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleResetPassword({ id: t.id, nom: t.first_name ?? t.email, email: t.email, profil: 'Travailleur', category: 'travailleur', role: 'Travailleur', statut: t.statut, derniere: t.updated_at, raw: t })} className="p-1.5 text-gray-400 hover:text-blue-600" title="Réinitialiser mot de passe"><Key className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteUser({ id: t.id, nom: t.first_name ?? t.email, email: t.email, profil: 'Travailleur', category: 'travailleur', role: 'Travailleur', statut: t.statut, derniere: t.updated_at, raw: t })} className="p-1.5 text-gray-400 hover:text-red-600" title="Supprimer"><XCircle className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Travailleurs (all) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Travailleurs</h3>
              {travailleurs.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun travailleur enregistré.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Employeur</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {travailleurs.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">{(t.first_name || t.last_name) ? `${t.first_name ?? ''} ${t.last_name ?? ''}`.trim() : t.email}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{t.email}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{t.employeur?.company_name ?? t.employeur?.email ?? '—'}</td>
                          <td className="px-4 py-3"><Badge label={capitalize(t.statut ?? 'inactif')} variant={t.statut === 'actif' ? 'green' : 'gray'} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleResetPassword({ id: t.id, nom: t.first_name ?? t.email, email: t.email, profil: 'Travailleur', category: 'travailleur', role: 'Travailleur', statut: t.statut, derniere: t.updated_at, raw: t })} className="p-1.5 text-gray-400 hover:text-blue-600" title="Réinitialiser mot de passe"><Key className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteUser({ id: t.id, nom: t.first_name ?? t.email, email: t.email, profil: 'Travailleur', category: 'travailleur', role: 'Travailleur', statut: t.statut, derniere: t.updated_at, raw: t })} className="p-1.5 text-gray-400 hover:text-red-600" title="Supprimer"><XCircle className="w-4 h-4" /></button>
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
        </div>
      )}

      {/* ── Statistiques ── */}
      {tab === 'statistiques' && (
        <div className="space-y-6">
          <SectionHeader title="Statistiques globales" sub="Indicateurs de performance du système CNSS" />

          {/* Cartes KPI */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold opacity-90">Cotisations encaissées</h3>
                <TrendingUp className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-3xl font-bold mb-2">
                {stats!.cotisationsMontant > 0 ? stats!.cotisationsMontant.toLocaleString('fr-FR') : '—'} FCFA
              </p>
              <div className="space-y-1 text-sm opacity-90">
                <p>{stats!.cotisationsVerifiees} déclarations vérifiées</p>
                <p className="text-red-200">{stats!.cotisationsRetard} employeurs en retard</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold opacity-90">Prestations versées</h3>
                <Heart className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-3xl font-bold mb-2">
                {stats!.prestationsMontant > 0 ? stats!.prestationsMontant.toLocaleString('fr-FR') : '—'} FCFA
              </p>
              <div className="space-y-1 text-sm opacity-90">
                <p>{stats!.prestationsDemandes} demandes reçues</p>
                <p>{stats!.prestationsApprouvees} approuvées</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold opacity-90">Personnel actif</h3>
                <Shield className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-3xl font-bold mb-2">{agents.filter(a => a.statut === 'Actif').length}</p>
              <div className="space-y-1 text-sm opacity-90">
                <p>Total agents: {agents.length}</p>
                <p>Inactifs: {agents.filter(a => a.statut !== 'Actif').length}</p>
                {agents.length > 0 && (
                  <p>Taux d'activité: <span className="font-bold">{Math.round((agents.filter(a => a.statut === 'Actif').length / agents.length) * 100)}%</span></p>
                )}
              </div>
            </div>
          </div>

          {/* BarChart — évolution cotisations par mois */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Évolution des cotisations encaissées</h3>
            {stats!.cotisationsParMois.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                Aucune donnée mensuelle disponible.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats!.cotisationsParMois} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="periode" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(v: number) => [`${v.toLocaleString('fr-FR')} FCFA`, 'Montant']} />
                    <Bar dataKey="total" fill="#4A90E2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* PieCharts — statut cotisations + type prestations */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-center">Cotisations par statut</h3>
              {stats!.cotisationsParStatut.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Aucune donnée</div>
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats!.cotisationsParStatut.map((d, i) => ({ ...d, color: PIE_COLORS[i % PIE_COLORS.length] }))}
                        cx="50%" cy="45%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                        {stats!.cotisationsParStatut.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={50} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-center">Prestations par type</h3>
              {stats!.prestationsParType.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Aucune donnée</div>
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats!.prestationsParType.map((d, i) => ({ ...d, color: PIE_COLORS[i % PIE_COLORS.length] }))}
                        cx="50%" cy="45%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                        {stats!.prestationsParType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={50} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Barres de progression par service */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Demandes en attente par service</h3>
            <div className="space-y-4">
              {[
                { service: 'Immatriculation', value: stats!.immatriculationsEnAttente, couleur: 'bg-violet-500' },
                { service: 'Cotisation',      value: stats!.cotisationsEnAttente,       couleur: 'bg-teal-500' },
                { service: 'Prestations',     value: stats!.prestationsEnAttente,       couleur: 'bg-pink-500' },
                { service: 'Support',         value: stats!.ticketsOuverts,             couleur: 'bg-orange-500' },
              ].map((s, i) => {
                const total = stats!.immatriculationsEnAttente + stats!.cotisationsEnAttente + stats!.prestationsEnAttente + stats!.ticketsOuverts || 1;
                const pct = Math.round((s.value / total) * 100);
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-36 flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">{s.service}</p>
                      <p className="text-xs text-gray-500">{s.value} en attente</p>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.couleur} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Journal complet */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Journal d'activité complet</h3>
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune activité enregistrée.</p>
            ) : (
              <div className="space-y-2">
                {logs.map((l: any, i: number) => (
                  <div key={l.id ?? i} className="flex items-start gap-3 text-sm py-3 border-b border-gray-50 last:border-0">
                    <Activity className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-gray-900">{typeof l.user === 'string' ? l.user : l.user?.name ?? l.user?.email ?? l.causer ?? '—'}</span>
                      <span className="text-gray-500"> — {l.description ?? l.action ?? '—'}</span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {l.created_at ? new Date(l.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Paramètres ── */}
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
                    <p className="text-sm font-semibold text-gray-900">Complexité mot de passe</p>
                    <p className="text-xs text-gray-500">Minimum 12 caractères</p>
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
                    <p className="text-xs text-gray-500">J-7, J-3, J-1</p>
                  </div>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Notifications par email</p>
                  </div>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
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
                  <p className="text-sm font-semibold text-gray-900">Actions enregistrées</p>
                  <span className="text-lg font-bold text-gray-900">{logs.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">Rétention des logs</p>
                  <Badge label="5 ans" variant="blue" />
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200">
                  <Download className="w-4 h-4" /> Exporter les journaux
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Configuration générale</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Mode maintenance</p>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700">
                    <AlertCircle className="w-3.5 h-3.5" /> Activer le mode maintenance
                  </button>
                </div>
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Sauvegarde automatique</p>
                  <Badge label="Activée - Quotidienne" variant="green" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Zone d'administration critique</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Les modifications des paramètres système nécessitent une validation par deux administrateurs et sont enregistrées dans le journal d'audit.
                </p>
                <Badge label="Niveau d'accès: Administrateur" variant="red" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {resetModalOpen && resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-100">
            <div className="flex justify-center mb-3">
              <CNSSLogo size="medium" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Réinitialiser le mot de passe</h3>
            <p className="text-sm text-gray-600 mb-4">Utilisateur : <span className="font-semibold">{resetUser.nom}</span></p>
            <input
              type="password"
              placeholder="Nouveau mot de passe (min. 8 caractères)"
              value={resetPassword}
              onChange={e => setResetPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500"
            />
            {resetError && <p className="text-sm text-red-600 mb-3">{resetError}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setResetModalOpen(false); setResetUser(null); setResetPassword(''); setResetError(null); }} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm">Annuler</button>
              <button onClick={submitResetPassword} disabled={resetLoading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{resetLoading ? 'En cours...' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}