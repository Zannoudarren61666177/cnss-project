import { useState } from 'react';
import {
  Home,
  FileText,
  Bell,
  Shield,
  Download,
  LogOut,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  User,
  Briefcase,
  Calendar,
  TrendingUp,
  Heart,
  Baby,
  Accessibility,
  Activity,
  Eye,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router';
import { CNSSLogo } from './CNSSLogo';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: number;
  titre: string;
  message: string;
  date: string;
  type: 'info' | 'success' | 'warning';
  lue: boolean;
}

interface Document {
  id: number;
  nom: string;
  type: string;
  date: string;
  taille: string;
  disponible: boolean;
}

interface Prestation {
  id: number;
  nom: string;
  description: string;
  statut: 'eligible' | 'en_cours' | 'non_eligible';
  icon: React.ReactNode;
  montant?: string;
  dateOuverture?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const notifications: Notification[] = [];

const documents: Document[] = [];

const prestations: Prestation[] = [];

const cotisationsMensuelles: { mois: string; montant: number; statut: string }[] = [];

// ─── Sub-views ────────────────────────────────────────────────────────────────

function MaSituation() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Ma situation</h2>
        <p className="text-gray-500 text-sm">Vue d'ensemble de votre affiliation CNSS</p>
      </div>

      {/* Profil & statut */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-gray-900">—</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" /> Actif
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">N° d'immatriculation : <span className="font-mono font-semibold text-gray-800">—</span></p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>—</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>—</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>—</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>—</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-xl shadow-sm p-6 text-white flex flex-col justify-between">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Mois cotisés</p>
          <div>
            <p className="text-5xl font-bold mt-2">{cotisationsMensuelles.length}</p>
            <p className="text-blue-200 text-sm mt-1">sur 180 requis pour la retraite</p>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-blue-500 rounded-full">
              <div className="h-2 bg-white rounded-full" style={{ width: `${Math.min((cotisationsMensuelles.length / 180) * 100, 100)}%` }} />
            </div>
            <p className="text-blue-200 text-xs mt-1.5">{Math.round((cotisationsMensuelles.length / 180) * 100)}% du chemin parcouru</p>
          </div>
        </div>
      </div>

      {/* Historique cotisations récentes */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Cotisations récentes</h3>
          <span className="text-sm text-gray-500">6 derniers mois</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wide">Période</th>
                <th className="pb-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wide">Part salariale</th>
                <th className="pb-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wide">Part patronale</th>
                <th className="pb-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wide">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cotisationsMensuelles.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-medium text-gray-900">{c.mois}</td>
                  <td className="py-3 text-gray-700">{c.montant.toLocaleString()} FCFA</td>
                  <td className="py-3 text-gray-700">{(c.montant * 2).toLocaleString()} FCFA</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3" /> {c.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employeur */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Mon employeur actuel</h3>
        <div className="grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Raison sociale</p>
            <p className="font-semibold text-gray-900">—</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Numéro employeur CNSS</p>
            <p className="font-mono font-semibold text-gray-900">—</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">IFU</p>
            <p className="font-mono font-semibold text-gray-900">—</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Statut cotisation</p>
            <p className="font-semibold text-gray-900">—</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Dernière déclaration</p>
            <p className="font-semibold text-gray-900">—</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Ville</p>
            <p className="font-semibold text-gray-900">—</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DroitsEtPrestations() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Droits & prestations</h2>
        <p className="text-gray-500 text-sm">Vos droits ouverts et les prestations auxquelles vous pouvez prétendre</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Prestations actives', val: String(prestations.filter(p => p.statut === 'eligible').length), color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'En acquisition', val: String(prestations.filter(p => p.statut === 'en_cours').length), color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Non éligibles', val: String(prestations.filter(p => p.statut === 'non_eligible').length), color: 'bg-gray-50 text-gray-500 border-gray-200' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-5 ${s.color}`}>
            <p className="text-sm font-medium mb-1">{s.label}</p>
            <p className="text-3xl font-bold">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {prestations.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-xl border shadow-sm p-5 flex items-start gap-4 ${
              p.statut === 'non_eligible' ? 'opacity-60' : ''
            } ${p.statut === 'eligible' ? 'border-green-200' : p.statut === 'en_cours' ? 'border-blue-200' : 'border-gray-200'}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              p.statut === 'eligible' ? 'bg-green-100 text-green-600' :
              p.statut === 'en_cours' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-400'
            }`}>
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h4 className="font-bold text-gray-900">{p.nom}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{p.description}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  p.statut === 'eligible' ? 'bg-green-100 text-green-700' :
                  p.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {p.statut === 'eligible' && <><CheckCircle className="w-3 h-3" /> Éligible</>}
                  {p.statut === 'en_cours' && <><Clock className="w-3 h-3" /> En acquisition</>}
                  {p.statut === 'non_eligible' && <><Lock className="w-3 h-3" /> Non éligible</>}
                </span>
              </div>
              {(p.montant || p.dateOuverture) && (
                <div className="mt-3 flex flex-wrap gap-4 text-xs">
                  {p.montant && (
                    <span className="text-gray-700 font-medium">{p.montant}</span>
                  )}
                  {p.dateOuverture && (
                    <span className="text-gray-500">{p.dateOuverture}</span>
                  )}
                </div>
              )}
            </div>
            {p.statut !== 'non_eligible' && (
              <button className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MesDocuments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Mes documents</h2>
        <p className="text-gray-500 text-sm">Téléchargez vos attestations, relevés et documents officiels</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Tous les documents disponibles sont signés électroniquement par la CNSS et ont valeur juridique.
          Pour obtenir un document non disponible, contactez votre agence CNSS.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Tous mes documents</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                doc.disponible ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{doc.nom}</p>
                <p className="text-xs text-gray-500 mt-0.5">{doc.type} · {doc.date} · {doc.taille}</p>
              </div>
              {doc.disponible ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Aperçu">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Télécharger
                  </button>
                </div>
              ) : (
                <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                  <Lock className="w-3.5 h-3.5" /> Sur demande
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-3">Demander un document</h3>
        <p className="text-sm text-gray-500 mb-4">
          Certains documents nécessitent une demande formelle. Remplissez le formulaire ci-dessous et nous vous contacterons.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de document</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Attestation de droits</option>
              <option>Relevé de points retraite</option>
              <option>Attestation de prise en charge</option>
              <option>Autre document</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Motif</label>
            <input
              type="text"
              placeholder="Ex: démarche administrative"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Soumettre la demande
        </button>
      </div>
    </div>
  );
}

function Notifications({ notifications, onMarkRead }: { notifications: Notification[]; onMarkRead: (id: number) => void }) {
  const nonLues = notifications.filter((n) => !n.lue).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Notifications</h2>
          <p className="text-gray-500 text-sm">
            {nonLues > 0 ? `${nonLues} notification${nonLues > 1 ? 's' : ''} non lue${nonLues > 1 ? 's' : ''}` : 'Tout est à jour'}
          </p>
        </div>
        {nonLues > 0 && (
          <button
            onClick={() => notifications.forEach((n) => !n.lue && onMarkRead(n.id))}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white rounded-xl border shadow-sm p-5 flex gap-4 transition-colors ${
              !notif.lue ? 'border-l-4 border-l-blue-500 border-gray-200' : 'border-gray-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              notif.type === 'success' ? 'bg-green-100 text-green-600' :
              notif.type === 'warning' ? 'bg-orange-100 text-orange-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {notif.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {notif.type === 'warning' && <AlertCircle className="w-5 h-5" />}
              {notif.type === 'info' && <Bell className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <p className={`font-semibold text-gray-900 text-sm ${!notif.lue ? '' : 'font-medium'}`}>{notif.titre}</p>
                <span className="text-xs text-gray-400 flex-shrink-0">{notif.date}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
              {!notif.lue && (
                <button
                  onClick={() => onMarkRead(notif.id)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Marquer comme lu
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = 'situation' | 'prestations' | 'documents' | 'notifications';

export function TravailleurDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('situation');
  const [notifs, setNotifs] = useState<Notification[]>(notifications);

  const unreadCount = notifs.filter((n) => !n.lue).length;

  const markRead = (id: number) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, lue: true } : n)));
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'situation', label: 'Ma situation', icon: <Home className="w-5 h-5" /> },
    { id: 'prestations', label: 'Droits & prestations', icon: <Shield className="w-5 h-5" /> },
    { id: 'documents', label: 'Mes documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <CNSSLogo size="medium" />
            <div>
              <p className="font-bold text-gray-900 text-sm">CNSS Bénin</p>
              <p className="text-xs text-gray-500">Espace Travailleur</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm flex-1">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="min-w-[1.25rem] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Paramètres</span>
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
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">ADJOVI Romuald Kokou</h1>
            <p className="text-xs text-gray-500">Immatriculation : <span className="font-mono">BJ-2021-00847-T</span></p>
          </div>
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </header>

        <div className="p-8 max-w-5xl">
          {activeTab === 'situation' && <MaSituation />}
          {activeTab === 'prestations' && <DroitsEtPrestations />}
          {activeTab === 'documents' && <MesDocuments />}
          {activeTab === 'notifications' && (
            <Notifications notifications={notifs} onMarkRead={markRead} />
          )}
        </div>
      </main>
    </div>
  );
}
