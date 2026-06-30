import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, CreditCard, Eye, Heart, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge, type BadgeVariant } from './shared/Badge';
import { StatCard } from './shared/StatCard';
import { SectionHeader } from './shared/SectionHeader';
import { SearchBar } from './shared/SearchBar';
import { getPrestations, validerPrestation, rejeterPrestation } from '../../api';
import CnssToast from '../CnssToast';

type StatutPrestation = 'En attente' | 'En cours' | 'Approuvée' | 'Rejetée';

function mapStatut(s: string): StatutPrestation {
  const val = s?.toLowerCase().trim() ?? '';
  if (val.includes('approuv'))  return 'Approuvée';
  if (val.includes('cours'))    return 'En cours';
  if (val.includes('rejet'))    return 'Rejetée';
  return 'En attente';
}

function mapPrestation(p: any) {
  return {
    id: p.id,
    ref: p.reference ?? p.ref ?? `PREST-${p.id}`,
    nom: p.beneficiaire?.name
      ?? p.travailleur?.name
      ?? (p.travailleur ? `${p.travailleur.first_name ?? ''} ${p.travailleur.last_name ?? ''}`.trim() : null)
      ?? p.nom
      ?? '—',
    type: p.type_prestation ?? p.type ?? '—',
    date: p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : '—',
    montant: p.montant ?? null,
    methode: p.methode_paiement ?? p.methode ?? '—',
    statut: mapStatut(p.status ?? p.statut ?? ''), // ← status (backend) ou statut
    raw: p,
  };
}

export function AgentPrestations() {
  const [prestations, setPrestations] = useState<ReturnType<typeof mapPrestation>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info'>('success');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPrestations();
      setPrestations((data as any[]).map(mapPrestation));
    } catch (err: any) {
      showToast(err?.message ?? 'Erreur de chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function showToast(message: string, variant: 'success' | 'error' | 'info' = 'success') {
    setToastMessage(message);
    setToastVariant(variant);
    setToastOpen(true);
  }

  async function handleValider(id: number) {
    try {
      await validerPrestation(id);
      await load();
      showToast('Prestation approuvée avec succès.');
    } catch (err: any) {
      showToast(err?.message ?? 'Erreur lors de la validation', 'error');
    }
  }

  async function handleRejeter(id: number) {
    try {
      await rejeterPrestation(id);
      await load();
      showToast('Prestation rejetée.');
    } catch (err: any) {
      showToast(err?.message ?? 'Erreur lors du rejet', 'error');
    }
  }

  const statusBadge = (s: StatutPrestation) => {
    const map: Record<StatutPrestation, BadgeVariant> = {
      'En attente': 'orange',
      'En cours':   'blue',
      'Approuvée':  'green',
      'Rejetée':    'red',
    };
    return <Badge label={s} variant={map[s]} />;
  };

  const filtered = prestations.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.ref.toLowerCase().includes(search.toLowerCase())
  );

  const aApprouver = prestations.filter(p => p.statut === 'Approuvée' && p.montant);
  const montantTotal = prestations
    .filter(p => p.statut === 'Approuvée')
    .reduce((sum, p) => {
      const val = parseFloat(String(p.montant ?? '0').replace(/\s/g, '').replace(',', '.'));
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Prestations" sub="Instruction et paiement des prestations sociales" />
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Demandes reçues" value={loading ? '...' : prestations.length} sub="Total"
          icon={<Heart className="w-5 h-5" />} color="bg-pink-100 text-pink-600" />
        <StatCard label="En attente" value={loading ? '...' : prestations.filter(p => p.statut === 'En attente').length}
          icon={<Clock className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="Approuvées" value={loading ? '...' : prestations.filter(p => p.statut === 'Approuvée').length}
          icon={<CheckCircle className="w-5 h-5" />} color="bg-green-100 text-green-600" />
        <StatCard
          label="Total versé"
          value={loading ? '...' : montantTotal > 0 ? `${montantTotal.toLocaleString('fr-FR')} FCFA` : '— FCFA'}
          sub="Approuvées"
          icon={<CreditCard className="w-5 h-5" />}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      <div>
        <SearchBar
          placeholder="Rechercher par bénéficiaire ou type de prestation..."
          value={search}
          onChange={setSearch}
        />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Référence', 'Bénéficiaire', 'Type', 'Date', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Chargement...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">
                    Aucune prestation trouvée.
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.ref}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{p.nom}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.type}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.date}</td>
                  <td className="px-4 py-3">{statusBadge(p.statut)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600" title="Voir détails">
                        <Eye className="w-4 h-4" />
                      </button>
                      {p.statut === 'En attente' && (
                        <>
                          <button onClick={() => handleValider(p.id)} className="p-1 text-gray-400 hover:text-green-600" title="Approuver">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleRejeter(p.id)} className="p-1 text-gray-400 hover:text-red-600" title="Rejeter">
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
          <h3 className="font-bold text-gray-900">
            Paiements à effectuer
            {aApprouver.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                {aApprouver.length}
              </span>
            )}
          </h3>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
            <CreditCard className="w-4 h-4" /> Traiter tous
          </button>
        </div>

        {aApprouver.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucun paiement en attente.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {aApprouver.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900">{p.nom}</p>
                  <p className="text-xs text-gray-500">{p.type} · {p.methode}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">
                    {p.montant ? `${Number(p.montant).toLocaleString('fr-FR')} FCFA` : '—'}
                  </p>
                  <button className="mt-1 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700">
                    Payer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CnssToast open={toastOpen} message={toastMessage} variant={toastVariant} onClose={() => setToastOpen(false)} />
    </div>
  );
}