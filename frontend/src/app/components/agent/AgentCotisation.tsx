import { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle, CheckCircle, Clock, Eye,
  FileText, Send, TrendingUp, RefreshCw, XCircle,
} from 'lucide-react';
import { Badge, type BadgeVariant } from './shared/Badge';
import { StatCard } from './shared/StatCard';
import { SectionHeader } from './shared/SectionHeader';
import { SearchBar } from './shared/SearchBar';
import { getCotisations, validerDeclaration, relancerCotisation } from '../../api'; // ✅ api.ts est dans src/app/
import CnssToast from '../CnssToast'; // ✅ CnssToast est dans components/

type StatutCotisation = 'En attente' | 'En retard' | 'Vérifiée' | 'Rejetée';

function mapStatut(s: string): StatutCotisation {
  if (s === 'verifiee' || s === 'payee') return 'Vérifiée';
  if (s === 'en_retard') return 'En retard';
  if (s === 'rejetee') return 'Rejetée';
  return 'En attente';
}

function mapCotisation(c: any) {
  return {
    id: c.id,
    ref: c.reference ?? c.ref ?? `COT-${c.id}`,
    employeur: c.employeur?.company_name ?? c.employeur_nom ?? '—',
    employeurId: c.employeur_id ?? c.employeur?.id,
    periode: c.periode ?? (c.mois && c.annee ? `${c.mois}/${c.annee}` : '—'),
    montant: c.montant_total ?? c.montant ?? '—',
    echeance: c.date_echeance
      ? new Date(c.date_echeance).toLocaleDateString('fr-FR')
      : '—',
    statut: mapStatut(c.statut ?? ''),
    retardJours: c.retard_jours ?? null,
    raw: c,
  };
}

export function AgentCotisation() {
  const [cotisations, setCotisations] = useState<ReturnType<typeof mapCotisation>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info'>('success');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCotisations();
      setCotisations((data as any[]).map(mapCotisation));
    } catch (err: any) {
      showToast(err?.message ?? 'Erreur de chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function showToast(message: string, variant: 'success' | 'error' | 'info') {
    setToastMessage(message);
    setToastVariant(variant);
    setToastOpen(true);
  }

  async function handleValider(id: number) {
    try {
      await validerDeclaration(id);
      await load();
      showToast('Déclaration vérifiée avec succès.', 'success');
    } catch (err: any) {
      showToast(err?.message ?? 'Erreur lors de la validation', 'error');
    }
  }

  async function handleRelancer(id: number) {
    try {
      await relancerCotisation(id);
      showToast('Relance envoyée à l\'employeur.', 'success');
    } catch (err: any) {
      showToast(err?.message ?? 'Erreur lors de la relance', 'error');
    }
  }

  async function handleRelancerTous() {
    const enRetard = cotisations.filter(c => c.statut === 'En retard');
    if (enRetard.length === 0) {
      showToast('Aucun employeur en retard.', 'info');
      return;
    }
    try {
      await Promise.allSettled(enRetard.map(c => relancerCotisation(c.id)));
      showToast(`${enRetard.length} relance(s) envoyée(s).`, 'success');
    } catch (err: any) {
      showToast(err?.message ?? 'Erreur lors des relances', 'error');
    }
  }

  const statusBadge = (s: StatutCotisation) => {
    const map: Record<StatutCotisation, BadgeVariant> = {
      'En attente': 'orange',
      'En retard': 'red',
      'Vérifiée': 'green',
      'Rejetée': 'red',
    };
    return <Badge label={s} variant={map[s]} />;
  };

  const filtered = cotisations.filter(c =>
    c.ref.toLowerCase().includes(search.toLowerCase()) ||
    c.employeur.toLowerCase().includes(search.toLowerCase())
  );

  const enRetard = cotisations.filter(c => c.statut === 'En retard');
  const montantTotal = cotisations
    .filter(c => c.statut === 'Vérifiée')
    .reduce((sum, c) => {
      const val = parseFloat(String(c.montant).replace(/\s/g, '').replace(',', '.'));
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Cotisations" sub="Vérification des déclarations et paiements employeurs" />
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Déclarations reçues"
          value={loading ? '...' : cotisations.length}
          sub="Total"
          icon={<FileText className="w-5 h-5" />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="En attente"
          value={loading ? '...' : cotisations.filter(c => c.statut === 'En attente').length}
          icon={<Clock className="w-5 h-5" />}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="En retard"
          value={loading ? '...' : enRetard.length}
          icon={<AlertCircle className="w-5 h-5" />}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          label="Total encaissé"
          value={loading ? '...' : montantTotal > 0 ? `${montantTotal.toLocaleString('fr-FR')} FCFA` : '— FCFA'}
          sub="Vérifiées"
          icon={<TrendingUp className="w-5 h-5" />}
          color="bg-teal-100 text-teal-600"
        />
      </div>

      {/* Tableau */}
      <div>
        <SearchBar
          placeholder="Rechercher par référence ou employeur..."
          value={search}
          onChange={setSearch}
        />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Référence', 'Employeur', 'Période', 'Montant', 'Échéance', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Chargement...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                    Aucune déclaration trouvée.
                  </td>
                </tr>
              ) : filtered.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{d.ref}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{d.employeur}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{d.periode}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium text-xs">
                    {d.montant !== '—' ? `${Number(d.montant).toLocaleString('fr-FR')} FCFA` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{d.echeance}</td>
                  <td className="px-4 py-3">{statusBadge(d.statut)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600" title="Voir détails">
                        <Eye className="w-4 h-4" />
                      </button>
                      {d.statut === 'En attente' && (
                        <button
                          onClick={() => handleValider(d.id)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Valider"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {d.statut === 'En retard' && (
                        <button
                          onClick={() => handleRelancer(d.id)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Relancer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employeurs en retard */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">
            Employeurs en retard
            {enRetard.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                {enRetard.length}
              </span>
            )}
          </h3>
          <button
            onClick={handleRelancerTous}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
          >
            <Send className="w-4 h-4" /> Relancer tous
          </button>
        </div>

        {enRetard.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucun employeur en retard.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enRetard.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-3 border border-red-100 rounded-lg bg-red-50">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900">{c.employeur}</p>
                  <p className="text-xs text-gray-600">
                    Ref: <span className="font-mono">{c.ref}</span>
                    {c.retardJours && (
                      <> · Retard: <span className="text-red-600 font-semibold">{c.retardJours} jours</span></>
                    )}
                    {c.montant !== '—' && (
                      <> · {Number(c.montant).toLocaleString('fr-FR')} FCFA</>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleRelancer(c.id)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                >
                  Relancer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <CnssToast open={toastOpen} message={toastMessage} variant={toastVariant} onClose={() => setToastOpen(false)} />
    </div>
  );
}