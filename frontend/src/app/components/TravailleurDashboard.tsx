import { useState, useEffect } from 'react';
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
  Heart,
  Baby,
  Accessibility,
  Activity,
  Lock,
  Loader2,
  Plus,
  X,
  Send,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { CNSSLogo } from './CNSSLogo';
import { useUser } from '../hooks/useUser';
import {
  clearAuth,
  getTravailleurProfil,
  getTravailleurCotisations,
  getTravailleurDroits,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  downloadMonAttestationTravailleur,
  demanderPrestation,
  getMesPrestations,
} from '../api';
import CnssToast from './CnssToast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: number;
  titre: string;
  message: string;
  date: string;
  type: 'info' | 'success' | 'warning';
  lue: boolean;
}

interface CotisationRow {
  mois: string | null;
  annee: number | null;
  montant_salarial: number;
  montant_patronal: number;
  statut: string | null;
}

interface Droit {
  nom: string;
  description: string;
  eligible: boolean;
  condition: string;
  mois_cotises: number;
  mois_requis: number;
}

interface MaPrestation {
  id: number;
  reference: string;
  type: string;
  montant: number;
  status: string;
  motif: string;
  date_debut: string | null;
  date_fin: string | null;
  raison_rejet: string | null;
  created_at: string;
}

const MOIS_LABELS = [
  '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const TYPES_PRESTATION = [
  'Prestation familiale',
  'Risques professionnels',
  'Pension de retraite',
  'Pension d\'invalidité',
  'Allocation de maternité',
  'Capital décès',
];

function formatPeriode(mois: string | number | null, annee: number | null): string {
  const m = Number(mois);
  if (m >= 1 && m <= 12 && annee) {
    return `${MOIS_LABELS[m]} ${annee}`;
  }
  if (annee) return String(annee);
  return '—';
}

function formatStatutCotisation(statut: string | null): string {
  const map: Record<string, string> = {
    payee: 'Payée',
    payé: 'Payée',
    validee: 'Validée',
    en_attente: 'En attente',
    en_retard: 'En retard',
  };
  return map[statut ?? ''] ?? statut ?? '—';
}

function mapNotificationFromApi(n: any): Notification {
  let parsed: any = null;
  try {
    parsed = n.content && String(n.content).startsWith('{') ? JSON.parse(n.content) : null;
  } catch { /* ignore */ }

  const typeTitles: Record<string, string> = {
    travailleur_valide: 'Immatriculation validée',
    travailleur_rejete: 'Déclaration rejetée',
    declaration_travailleur: 'Nouvelle déclaration',
    immatriculation_request: 'Demande d\'immatriculation',
  };

  const notifType: Notification['type'] =
    n.type === 'travailleur_valide' ? 'success'
    : n.type === 'travailleur_rejete' ? 'warning'
    : 'info';

  return {
    id: n.id,
    titre: typeTitles[n.type] || 'Notification CNSS',
    message: parsed?.message ?? n.content ?? '',
    date: n.created_at ? new Date(n.created_at).toLocaleString('fr-FR') : '',
    type: notifType,
    lue: !!n.read_at,
  };
}

function getDroitIcon(nom: string) {
  if (nom.toLowerCase().includes('familial')) return <Baby className="w-5 h-5" />;
  if (nom.toLowerCase().includes('risque')) return <Activity className="w-5 h-5" />;
  if (nom.toLowerCase().includes('pension')) return <Heart className="w-5 h-5" />;
  return <Accessibility className="w-5 h-5" />;
}

function getStatutBadge(statut: string | undefined) {
  const map: Record<string, { label: string; className: string }> = {
    actif: { label: 'Actif', className: 'bg-green-100 text-green-700' },
    en_attente: { label: 'En attente', className: 'bg-orange-100 text-orange-700' },
    rejetee: { label: 'Rejetée', className: 'bg-red-100 text-red-700' },
  };
  const s = map[statut ?? ''] ?? { label: statut ?? '—', className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.className}`}>
      <CheckCircle className="w-3 h-3" /> {s.label}
    </span>
  );
}

function prestationStatutBadge(status: string) {
  const val = status?.toLowerCase() ?? '';
  if (val.includes('approuv')) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Approuvée</span>;
  }
  if (val.includes('rejet')) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><X className="w-3 h-3" /> Rejetée</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700"><Clock className="w-3 h-3" /> En attente</span>;
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

function MaSituation({
  travailleur,
  employeur,
  cotisations,
  moisCotises,
  dateAffiliation,
  loading,
}: {
  travailleur: Record<string, any> | null;
  employeur: Record<string, any> | null;
  cotisations: CotisationRow[];
  moisCotises: number;
  dateAffiliation: string;
  loading: boolean;
}) {
  const nomComplet = travailleur
    ? `${travailleur.first_name ?? travailleur.prenom ?? ''} ${travailleur.last_name ?? travailleur.nom ?? ''}`.trim()
    : '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Ma situation</h2>
        <p className="text-gray-500 text-sm">Vue d'ensemble de votre affiliation CNSS</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-gray-900">{nomComplet || '—'}</h3>
                {getStatutBadge(travailleur?.statut)}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                N° d'immatriculation :{' '}
                <span className="font-mono font-semibold text-gray-800">
                  {travailleur?.numero_cnss ?? 'En attente'}
                </span>
              </p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>{travailleur?.position ?? travailleur?.poste ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>
                    {travailleur?.date_embauche
                      ? `Embauché le ${new Date(travailleur.date_embauche).toLocaleDateString('fr-FR')}`
                      : dateAffiliation !== '—' ? `Affilié depuis le ${dateAffiliation}` : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>{travailleur?.type_contrat ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>
                    {travailleur?.salaire_brut
                      ? `${Number(travailleur.salaire_brut).toLocaleString('fr-FR')} FCFA / mois`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-xl shadow-sm p-6 text-white flex flex-col justify-between">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Mois cotisés</p>
          <div>
            <p className="text-5xl font-bold mt-2">{moisCotises}</p>
            <p className="text-blue-200 text-sm mt-1">sur 180 requis pour la retraite</p>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-blue-500 rounded-full">
              <div
                className="h-2 bg-white rounded-full"
                style={{ width: `${Math.min((moisCotises / 180) * 100, 100)}%` }}
              />
            </div>
            <p className="text-blue-200 text-xs mt-1.5">
              {Math.round((moisCotises / 180) * 100)}% du chemin parcouru
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Cotisations récentes</h3>
          <span className="text-sm text-gray-500">12 derniers mois</span>
        </div>
        {cotisations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">Aucune cotisation enregistrée pour le moment.</p>
        ) : (
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
                {cotisations.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-900">{formatPeriode(c.mois, c.annee)}</td>
                    <td className="py-3 text-gray-700">{Number(c.montant_salarial ?? 0).toLocaleString('fr-FR')} FCFA</td>
                    <td className="py-3 text-gray-700">{Number(c.montant_patronal ?? 0).toLocaleString('fr-FR')} FCFA</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" /> {formatStatutCotisation(c.statut)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Mon employeur actuel</h3>
        {employeur ? (
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Raison sociale</p>
              <p className="font-semibold text-gray-900">{employeur.company_name ?? employeur.raison_sociale ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Numéro employeur CNSS</p>
              <p className="font-mono font-semibold text-gray-900">{employeur.numero_cnss ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">IFU</p>
              <p className="font-mono font-semibold text-gray-900">{employeur.ifu ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Statut employeur</p>
              <p className="font-semibold text-gray-900 capitalize">{employeur.statut ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Secteur d'activité</p>
              <p className="font-semibold text-gray-900">{employeur.secteur ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Ville</p>
              <p className="font-semibold text-gray-900">{employeur.address ?? employeur.adresse ?? '—'}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucun employeur associé.</p>
        )}
      </div>
    </div>
  );
}

function DroitsEtPrestations({
  droits,
  loading,
  mesPrestations,
  loadingPrestations,
  onSubmitDemande,
  submitting,
}: {
  droits: Droit[];
  moisCotises: number;
  loading: boolean;
  mesPrestations: MaPrestation[];
  loadingPrestations: boolean;
  onSubmitDemande: (data: { type: string; montant: number; motif: string; date_debut?: string; date_fin?: string }) => Promise<boolean>;
  submitting: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: '', montant: '', motif: '', date_debut: '', date_fin: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const prestations = droits.map((d, i) => ({
    id: i + 1,
    nom: d.nom,
    description: d.description,
    statut: d.eligible ? 'eligible' as const
      : d.mois_requis > 0 && d.mois_cotises > 0 ? 'en_cours' as const
      : 'non_eligible' as const,
    icon: getDroitIcon(d.nom),
    montant: d.condition,
    dateOuverture: d.mois_requis > 0
      ? `${d.mois_cotises} / ${d.mois_requis} mois cotisés`
      : undefined,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.type || !form.montant || !form.motif) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const montantNum = parseFloat(form.montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      setFormError('Le montant doit être un nombre positif.');
      return;
    }

    const success = await onSubmitDemande({
      type: form.type,
      montant: montantNum,
      motif: form.motif,
      date_debut: form.date_debut || undefined,
      date_fin: form.date_fin || undefined,
    });

    if (success) {
      setForm({ type: '', montant: '', motif: '', date_debut: '', date_fin: '' });
      setShowForm(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Droits & prestations</h2>
          <p className="text-gray-500 text-sm">Vos droits ouverts et les prestations auxquelles vous pouvez prétendre</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Annuler' : 'Nouvelle demande'}
        </button>
      </div>

      {/* Formulaire de demande */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Soumettre une demande de prestation</h3>

          {formError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Type de prestation *</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choisir --</option>
                {TYPES_PRESTATION.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Montant demandé (FCFA) *</label>
              <input
                type="number"
                min="0"
                value={form.montant}
                onChange={e => setForm(f => ({ ...f, montant: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 150000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Motif de la demande *</label>
            <textarea
              value={form.motif}
              onChange={e => setForm(f => ({ ...f, motif: e.target.value }))}
              className="w-full min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Expliquez la raison de votre demande..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date de début (optionnel)</label>
              <input
                type="date"
                value={form.date_debut}
                onChange={e => setForm(f => ({ ...f, date_debut: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date de fin (optionnel)</label>
              <input
                type="date"
                value={form.date_fin}
                onChange={e => setForm(f => ({ ...f, date_fin: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Envoi en cours...' : 'Soumettre la demande'}
          </button>
        </form>
      )}

      {/* Mes demandes soumises */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Mes demandes soumises</h3>
        {loadingPrestations ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : mesPrestations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">Aucune demande soumise pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {mesPrestations.map(p => (
              <div key={p.id} className="flex items-start justify-between gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-gray-900">{p.type}</p>
                    {prestationStatutBadge(p.status)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{p.reference}</p>
                  <p className="text-xs text-gray-600 mt-1">{p.motif}</p>
                  {p.raison_rejet && (
                    <p className="text-xs text-red-600 mt-1">Motif du rejet : {p.raison_rejet}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Soumise le {new Date(p.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <p className="font-bold text-sm text-gray-900 flex-shrink-0">
                  {Number(p.montant).toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Droits ouverts */}
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

      {prestations.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Aucune prestation disponible.</p>
      ) : (
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
                    {p.montant && <span className="text-gray-700 font-medium">{p.montant}</span>}
                    {p.dateOuverture && <span className="text-gray-500">{p.dateOuverture}</span>}
                  </div>
                )}
              </div>
              {p.statut !== 'non_eligible' && (
                <div className="flex-shrink-0 p-2 text-gray-400">
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MesDocuments({
  travailleur,
  onDownloadAttestation,
  downloading,
}: {
  travailleur: Record<string, any> | null;
  onDownloadAttestation: () => void;
  downloading: boolean;
}) {
  const attestationDisponible = travailleur?.statut === 'actif' && !!travailleur?.numero_cnss;
  const dateAttestation = travailleur?.updated_at
    ? new Date(travailleur.updated_at).toLocaleDateString('fr-FR')
    : '—';

  const documents = [
    {
      id: 1,
      nom: 'Attestation d\'affiliation CNSS',
      type: 'PDF officiel',
      date: dateAttestation,
      taille: '—',
      disponible: attestationDisponible,
    },
    {
      id: 2,
      nom: 'Relevé de points retraite',
      type: 'PDF',
      date: '—',
      taille: '—',
      disponible: false,
    },
    {
      id: 3,
      nom: 'Attestation de droits',
      type: 'PDF',
      date: '—',
      taille: '—',
      disponible: false,
    },
  ];

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
                <p className="text-xs text-gray-500 mt-0.5">{doc.type} · {doc.date}</p>
              </div>
              {doc.disponible ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={onDownloadAttestation}
                    disabled={downloading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                  >
                    {downloading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Télécharger
                  </button>
                </div>
              ) : (
                <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                  <Lock className="w-3.5 h-3.5" /> {doc.id === 1 ? 'Non disponible' : 'Sur demande'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel({
  notifications,
  onMarkRead,
  onMarkAllRead,
  loading,
}: {
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  loading: boolean;
}) {
  const nonLues = notifications.filter((n) => !n.lue).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

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
            onClick={onMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune notification pour le moment.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = 'situation' | 'prestations' | 'documents' | 'notifications';

export function TravailleurDashboard() {
  const navigate = useNavigate();
  const { user, loading: userLoading, error } = useUser();

  const [activeTab, setActiveTab] = useState<Tab>('situation');
  const [travailleur, setTravailleur] = useState<Record<string, any> | null>(null);
  const [employeur, setEmployeur] = useState<Record<string, any> | null>(null);
  const [cotisations, setCotisations] = useState<CotisationRow[]>([]);
  const [droits, setDroits] = useState<Droit[]>([]);
  const [moisCotises, setMoisCotises] = useState(0);
  const [dateAffiliation, setDateAffiliation] = useState('—');
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [downloadingAttestation, setDownloadingAttestation] = useState(false);

  // ── Prestations ──
  const [mesPrestations, setMesPrestations] = useState<MaPrestation[]>([]);
  const [loadingPrestations, setLoadingPrestations] = useState(true);
  const [submittingPrestation, setSubmittingPrestation] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info'>('success');

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    (async () => {
      setLoadingData(true);
      try {
        const [profilRes, cotisationsRes, droitsRes] = await Promise.all([
          getTravailleurProfil(),
          getTravailleurCotisations(),
          getTravailleurDroits(),
        ]);
        if (!mounted) return;
        setTravailleur(profilRes.travailleur ?? null);
        setEmployeur(profilRes.employeur ?? null);
        setCotisations(cotisationsRes as CotisationRow[]);
        setDroits(droitsRes.droits ?? []);
        setMoisCotises(droitsRes.mois_cotises ?? 0);
        setDateAffiliation(droitsRes.date_affiliation ?? '—');
      } catch (err) {
        console.error('Erreur chargement espace travailleur', err);
        const profile = user.profile as Record<string, any> | undefined;
        if (profile) setTravailleur(profile);
      } finally {
        if (mounted) setLoadingData(false);
      }
    })();

    return () => { mounted = false; };
  }, [user]);

  const loadMesPrestations = async () => {
    setLoadingPrestations(true);
    try {
      const data = await getMesPrestations();
      setMesPrestations(data as MaPrestation[]);
    } catch (err) {
      console.error('Erreur chargement prestations', err);
    } finally {
      setLoadingPrestations(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadMesPrestations();
  }, [user]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingNotifs(true);
      try {
        const data = await getNotifications();
        if (mounted) setNotifs((data as any[]).map(mapNotificationFromApi));
      } catch (err) {
        console.error('Erreur chargement notifications', err);
      } finally {
        if (mounted) setLoadingNotifs(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const unreadCount = notifs.filter((n) => !n.lue).length;

  const markRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, lue: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, lue: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadAttestation = async () => {
    setDownloadingAttestation(true);
    try {
      await downloadMonAttestationTravailleur();
    } catch (err: any) {
      alert(err?.message || 'Erreur lors du téléchargement');
    } finally {
      setDownloadingAttestation(false);
    }
  };

  // ── Soumettre une demande de prestation ──
  const handleSubmitDemande = async (data: { type: string; montant: number; motif: string; date_debut?: string; date_fin?: string }): Promise<boolean> => {
    setSubmittingPrestation(true);
    try {
      await demanderPrestation(data);
      await loadMesPrestations();
      setToastMessage('Votre demande a été transmise à l\'agent prestations.');
      setToastVariant('success');
      setToastOpen(true);
      return true;
    } catch (err: any) {
      setToastMessage(err?.message ?? 'Erreur lors de l\'envoi de la demande.');
      setToastVariant('error');
      setToastOpen(true);
      return false;
    } finally {
      setSubmittingPrestation(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const nomComplet = travailleur
    ? `${travailleur.first_name ?? travailleur.prenom ?? ''} ${travailleur.last_name ?? travailleur.nom ?? ''}`.trim()
    : user?.profile
      ? `${(user.profile as any).first_name ?? ''} ${(user.profile as any).last_name ?? ''}`.trim()
      : user?.name ?? 'Travailleur';

  const numeroCnss = travailleur?.numero_cnss ?? (user?.profile as any)?.numero_cnss ?? '—';

  const navItems: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'situation', label: 'Ma situation', icon: <Home className="w-5 h-5" /> },
    { id: 'prestations', label: 'Droits & prestations', icon: <Shield className="w-5 h-5" /> },
    { id: 'documents', label: 'Mes documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadCount },
  ];

  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
          <Link
            to="/travailleur/parametres"
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Paramètres</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {userLoading ? 'Chargement…' : nomComplet}
            </h1>
            <p className="text-xs text-gray-500">
              Immatriculation : <span className="font-mono">{numeroCnss}</span>
            </p>
          </div>
          <Link
            to="/travailleur/notifications"
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[0.5rem] h-2 px-0.5 bg-red-500 rounded-full" />
            )}
          </Link>
        </header>

        <div className="p-8 max-w-5xl">
          {activeTab === 'situation' && (
            <MaSituation
              travailleur={travailleur}
              employeur={employeur}
              cotisations={cotisations}
              moisCotises={moisCotises}
              dateAffiliation={dateAffiliation}
              loading={loadingData}
            />
          )}
          {activeTab === 'prestations' && (
            <DroitsEtPrestations
              droits={droits}
              moisCotises={moisCotises}
              loading={loadingData}
              mesPrestations={mesPrestations}
              loadingPrestations={loadingPrestations}
              onSubmitDemande={handleSubmitDemande}
              submitting={submittingPrestation}
            />
          )}
          {activeTab === 'documents' && (
            <MesDocuments
              travailleur={travailleur}
              onDownloadAttestation={handleDownloadAttestation}
              downloading={downloadingAttestation}
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationsPanel
              notifications={notifs}
              onMarkRead={markRead}
              onMarkAllRead={markAllRead}
              loading={loadingNotifs}
            />
          )}
        </div>
      </main>

      <CnssToast open={toastOpen} message={toastMessage} variant={toastVariant} onClose={() => setToastOpen(false)} />
    </div>
  );
}