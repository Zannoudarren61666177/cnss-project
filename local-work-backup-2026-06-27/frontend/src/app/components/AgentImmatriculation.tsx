import { useState, useEffect } from 'react';
import {
  Home, Users, UserPlus, Clock, ChevronRight,
  CheckCircle, XCircle, Eye,
} from 'lucide-react';
import {
  getEmployeurs, validerEmployeur, rejeterEmployeur, getEmployeur,
  getTravailleursEnAttente, validerTravailleur, rejeterTravailleur,
} from '../../api';
import RejectionModal from '../RejectionModal';
import CnssToast from '../CnssToast';
import { Badge } from './shared/Badge';
import { StatCard } from './shared/StatCard';
import { SectionHeader } from './shared/SectionHeader';
import { SearchBar } from './shared/SearchBar';

// ─── helpers ─────────────────────────────────────────────────────────────────

type ImmatStatut = 'En attente' | 'Validée' | 'Rejetée';

function statusBadge(s: ImmatStatut) {
  const map: Record<ImmatStatut, 'orange' | 'green' | 'red'> = {
    'En attente': 'orange', 'Validée': 'green', 'Rejetée': 'red',
  };
  return <Badge label={s} variant={map[s]} />;
}

function mapTravailleurStatut(statut: string): ImmatStatut {
  if (statut === 'actif') return 'Validée';
  if (statut === 'rejetee') return 'Rejetée';
  return 'En attente';
}

function groupTravailleursByEmployeur(travailleurs: any[]) {
  const map = new Map<string, any>();
  for (const t of travailleurs) {
    const emp = t.employeur;
    const key = String(emp?.id ?? t.employeur_id);
    if (!map.has(key)) {
      map.set(key, {
        employeurId: key,
        employeur: emp?.company_name ?? 'Employeur inconnu',
        immatriculation: emp?.numero_cnss ?? '—',
        travailleurs: [],
      });
    }
    map.get(key).travailleurs.push({
      id: String(t.id),
      nom: t.last_name ?? t.nom,
      prenom: t.first_name ?? t.prenom,
      dateNaissance: t.date_naissance ? new Date(t.date_naissance).toLocaleDateString('fr-FR') : '—',
      poste: t.position ?? t.poste ?? '—',
      salaire: t.salaire_brut ? Number(t.salaire_brut).toLocaleString('fr-FR') : '—',
      statut: mapTravailleurStatut(t.statut),
      raw: t,
    });
  }
  return Array.from(map.values());
}

function getFileUrl(path: string) {
  const api = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1';
  const origin = api.replace(/\/api\/v1\/?$/i, '');
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${origin}/storage/${path.replace(/^\/+/, '')}`;
}

// ─── types ────────────────────────────────────────────────────────────────────

type ImmatTab = 'apercu' | 'employeurs' | 'travailleurs' | 'historique';

const TABS = [
  { id: 'apercu' as ImmatTab,       label: 'Aperçu',                   icon: <Home className="w-4 h-4" /> },
  { id: 'employeurs' as ImmatTab,   label: 'Demandes employeurs',      icon: <Users className="w-4 h-4" /> },
  { id: 'travailleurs' as ImmatTab, label: 'Déclaration travailleurs', icon: <UserPlus className="w-4 h-4" /> },
  { id: 'historique' as ImmatTab,   label: 'Historique',               icon: <Clock className="w-4 h-4" /> },
];

// ─── component ───────────────────────────────────────────────────────────────

export function AgentImmatriculation() {
  const [tab, setTab] = useState<ImmatTab>('apercu');
  const [detailEmployeur, setDetailEmployeur] = useState<string | null>(null);
  const [employeurs, setEmployeurs] = useState<any[]>([]);
  const [allEmployeurs, setAllEmployeurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [travailleursEnAttente, setTravailleursEnAttente] = useState<any[]>([]);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<{ id: number | string; name?: string } | null>(null);
  const [showRejectTravailleurModal, setShowRejectTravailleurModal] = useState(false);
  const [rejectTravailleurTarget, setRejectTravailleurTarget] = useState<{ id: number | string; name?: string } | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info'>('success');

  const demandesTravailleursParEmployeur = groupTravailleursByEmployeur(travailleursEnAttente);

  function showToast(message: string, variant: 'success' | 'error' | 'info' = 'success') {
    setToastMessage(message);
    setToastVariant(variant);
    setToastOpen(true);
  }

  async function loadTravailleursEnAttente() {
    try {
      const data = await getTravailleursEnAttente();
      setTravailleursEnAttente(data as any[]);
    } catch (err) {
      console.error('Erreur chargement travailleurs en attente', err);
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getEmployeurs();
        setAllEmployeurs(data as any[]);
        setEmployeurs((data as any[]).filter(e => e.statut === 'en_attente' || e.statut === 'en attente'));
        await loadTravailleursEnAttente();
      } catch (err) {
        console.error('Erreur chargement employeurs', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!detailEmployeur) { setSelectedDetail(null); return; }
    let mounted = true;
    (async () => {
      try {
        const d = await getEmployeur(detailEmployeur);
        if (mounted) setSelectedDetail(d);
      } catch (err) {
        console.error('Erreur chargement detail employeur', err);
      }
    })();
    return () => { mounted = false; };
  }, [detailEmployeur]);

  // ─── aperçu ────────────────────────────────────────────────────────────────

  const renderApercu = () => (
    <div className="space-y-6">
      <SectionHeader title="Immatriculation" sub="Gestion des demandes d'immatriculation employeurs et travailleurs" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Employeurs en attente" value={employeurs.length} icon={<Users className="w-5 h-5" />} color="bg-violet-100 text-violet-600" />
        <StatCard label="Travailleurs en attente" value={travailleursEnAttente.length} icon={<UserPlus className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="Validés" value={allEmployeurs.filter(e => e.statut === 'validee' || e.statut === 'Validée').length} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-100 text-green-600" />
        <StatCard label="Rejetés" value={allEmployeurs.filter(e => e.statut === 'rejetee' || e.statut === 'Rejetée').length} sub="Ce mois" icon={<XCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">Demandes employeurs récentes</h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : (
              employeurs.slice(0, 3).map(e => (
                <div key={e.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{e.company_name ?? e.raison_sociale}</p>
                    <p className="text-xs text-gray-500">{e.id} · {e.secteur}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge('En attente')}
                    <button onClick={() => { setTab('employeurs'); setDetailEmployeur(e.id.toString()); }} className="text-blue-600 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setTab('employeurs')} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Voir toutes les demandes <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">Déclarations travailleurs</h3>
          <div className="space-y-3">
            {demandesTravailleursParEmployeur.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune déclaration travailleur en attente.</p>
            ) : (
              demandesTravailleursParEmployeur.slice(0, 3).map(emp => (
                <div key={emp.employeurId} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-gray-900">{emp.employeur}</p>
                    <Badge label={`${emp.travailleurs.length} travailleur(s)`} variant="blue" />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{emp.immatriculation}</p>
                  <button onClick={() => setTab('travailleurs')} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    Voir les travailleurs <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setTab('travailleurs')} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Voir toutes les déclarations <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // ─── employeurs ────────────────────────────────────────────────────────────

  const renderEmployeurs = () => (
    <>
      <div className="space-y-4">
        {!detailEmployeur ? (
          <>
            <SectionHeader title="Demandes d'immatriculation employeurs" sub={`${employeurs.length} demandes en attente`} />
            <SearchBar placeholder="Rechercher par raison sociale, secteur..." />
            <div className="space-y-3">
              {employeurs.map(emp => (
                <div key={emp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{emp.company_name ?? emp.raison_sociale}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">ID {emp.id}</p>
                    </div>
                    {statusBadge('En attente')}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div><span className="text-gray-500">Secteur:</span><span className="ml-2 font-medium text-gray-900">{emp.secteur ?? '—'}</span></div>
                    <div><span className="text-gray-500">Téléphone:</span><span className="ml-2 font-medium text-gray-900">{emp.phone ?? '—'}</span></div>
                    <div className="sm:col-span-2"><span className="text-gray-500">Adresse:</span><span className="ml-2 font-medium text-gray-900">{emp.address ?? '—'}</span></div>
                    <div><span className="text-gray-500">Email:</span><span className="ml-2 font-medium text-gray-900">{emp.email ?? '—'}</span></div>
                  </div>
                  {(!emp.statut || emp.statut === 'en_attente' || emp.statut === 'en attente') && (
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                      <button
                        onClick={async () => {
                          try {
                            const res = await validerEmployeur(emp.id);
                            if (res && res.employeur) {
                              const updated = res.employeur;
                              setAllEmployeurs(prev => prev.map(p => p.id === updated.id ? updated : p));
                              setEmployeurs(prev => prev.filter(e => e.id !== updated.id));
                            } else {
                              const data = await getEmployeurs();
                              setAllEmployeurs(data as any[]);
                              setEmployeurs((data as any[]).filter(e => e.statut === 'en_attente' || e.statut === 'en attente'));
                            }
                            showToast(res?.message || 'Employeur validé et e-mail envoyé.');
                          } catch (err: any) {
                            showToast(err?.message || 'Erreur lors de la validation', 'error');
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />Valider et envoyer attestation
                      </button>
                      <button
                        onClick={() => { setRejectTarget({ id: emp.id, name: emp.company_name ?? emp.raison_sociale }); setShowRejectModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />Rejeter
                      </button>
                      <button
                        onClick={() => setDetailEmployeur(emp.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />Voir détails
                      </button>
                    </div>
                  )}
                  {(emp.statut === 'validee' || emp.statut === 'Validée') && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-green-900">Demande validée</p>
                          <p className="text-xs text-green-700 mt-0.5">N° Immatriculation: <span className="font-mono font-bold">{emp.numero_cnss ?? '—'}</span></p>
                          <p className="text-xs text-green-600 mt-1">✓ Attestation envoyée · ✓ Lien d'adhésion envoyé à {emp.email}</p>
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
              <ChevronRight className="w-4 h-4 rotate-180" />Retour à la liste
            </button>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Détails de la demande</h2>
              {!selectedDetail ? (
                <p className="text-gray-500">Chargement...</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Raison sociale</p>
                    <p className="font-semibold text-gray-900">{selectedDetail.company_name}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><p className="text-sm text-gray-500">Adresse</p><p className="font-medium text-gray-900">{selectedDetail.address}</p></div>
                    <div><p className="text-sm text-gray-500">Téléphone</p><p className="font-medium text-gray-900">{selectedDetail.phone}</p></div>
                    <div><p className="text-sm text-gray-500">Email</p><p className="font-medium text-gray-900">{selectedDetail.email}</p></div>
                    <div><p className="text-sm text-gray-500">Numéro CNSS</p><p className="font-medium text-gray-900">{selectedDetail.numero_cnss ?? '—'}</p></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pièces justificatives</p>
                    {selectedDetail.pieces_justificatives && Object.keys(selectedDetail.pieces_justificatives).length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {Object.entries(selectedDetail.pieces_justificatives).map(([key, val]: any) => {
                          const url = getFileUrl(String(val));
                          return (
                            <li key={key} className="text-sm">
                              <span className="text-gray-700 font-medium">{key}:</span>{' '}
                              {url ? <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">Ouvrir</a> : <span className="text-gray-500">{String(val)}</span>}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Aucune pièce téléversée.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <RejectionModal
        open={showRejectModal}
        onClose={() => { setShowRejectModal(false); setRejectTarget(null); }}
        employerName={rejectTarget?.name}
        onConfirm={async (raison) => {
          if (!rejectTarget) return;
          try {
            await rejeterEmployeur(rejectTarget.id, raison);
            const data = await getEmployeurs();
            setEmployeurs((data as any[]).filter(e => e.statut === 'en_attente' || e.statut === 'en attente'));
            setShowRejectModal(false);
            setRejectTarget(null);
            showToast('Demande rejetée et e-mail envoyé.');
          } catch (err: any) {
            showToast(err?.message || 'Erreur lors du rejet', 'error');
          }
        }}
      />
      <CnssToast open={toastOpen} message={toastMessage} variant={toastVariant} onClose={() => setToastOpen(false)} />
    </>
  );

  // ─── travailleurs ──────────────────────────────────────────────────────────

  const renderTravailleurs = () => (
    <div className="space-y-4">
      <SectionHeader title="Déclaration des travailleurs" sub={`${travailleursEnAttente.length} déclaration(s) en attente`} />
      <SearchBar placeholder="Rechercher par employeur ou travailleur..." />

      {demandesTravailleursParEmployeur.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-gray-500">Aucune déclaration travailleur en attente.</p>
        </div>
      ) : (
        demandesTravailleursParEmployeur.map(emp => (
          <div key={emp.employeurId} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">{emp.employeur}</h3>
                <p className="text-sm text-gray-500 mt-0.5">Immatriculation: <span className="font-mono font-semibold text-gray-700">{emp.immatriculation}</span></p>
              </div>
              <Badge label={`${emp.travailleurs.length} travailleur(s)`} variant="blue" />
            </div>
            <div className="space-y-2">
              {emp.travailleurs.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{t.nom} {t.prenom}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.poste} · Né(e) le {t.dateNaissance} · Salaire: {t.salaire} FCFA</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(t.statut)}
                    {t.statut === 'En attente' && (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              const res = await validerTravailleur(t.id);
                              await loadTravailleursEnAttente();
                              showToast(res?.message || 'Travailleur validé et email envoyé.');
                            } catch (err: any) {
                              showToast(err?.message || 'Erreur lors de la validation', 'error');
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="Valider"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setRejectTravailleurTarget({ id: t.id, name: `${t.prenom} ${t.nom}` }); setShowRejectTravailleurModal(true); }}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Rejeter"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <RejectionModal
        open={showRejectTravailleurModal}
        onClose={() => { setShowRejectTravailleurModal(false); setRejectTravailleurTarget(null); }}
        employerName={rejectTravailleurTarget?.name}
        onConfirm={async (raison) => {
          if (!rejectTravailleurTarget) return;
          try {
            await rejeterTravailleur(rejectTravailleurTarget.id, raison);
            await loadTravailleursEnAttente();
            setShowRejectTravailleurModal(false);
            setRejectTravailleurTarget(null);
            showToast("Déclaration travailleur rejetée. L'employeur a été notifié.");
          } catch (err: any) {
            showToast(err?.message || 'Erreur lors du rejet', 'error');
          }
        }}
      />
      <CnssToast open={toastOpen} message={toastMessage} variant={toastVariant} onClose={() => setToastOpen(false)} />
    </div>
  );

  // ─── historique ────────────────────────────────────────────────────────────

  const renderHistorique = () => {
    const traites = allEmployeurs
      .filter(e => !(e.statut === 'en_attente' || e.statut === 'en attente' || e.statut === null))
      .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());

    return (
      <div>
        <SectionHeader title="Historique" sub="Toutes les demandes traitées" />
        <SearchBar placeholder="Rechercher dans l'historique..." />
        <div className="space-y-3">
          {traites.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-500">Aucune demande traitée pour le moment.</p>
            </div>
          ) : (
            traites.map(e => (
              <div key={e.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{e.company_name ?? e.raison_sociale}</p>
                  <p className="text-xs text-gray-500">ID {e.id} · {new Date(e.updated_at || e.created_at).toLocaleString()}</p>
                  {e.numero_cnss && <p className="text-sm text-green-700 mt-1">N° Immatriculation: <span className="font-mono font-bold">{e.numero_cnss}</span></p>}
                  {e.raison_rejet && <p className="text-sm text-red-600 mt-1">Raison du rejet: {e.raison_rejet}</p>}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${e.statut?.toLowerCase().includes('valide') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {e.statut}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // ─── render ────────────────────────────────────────────────────────────────

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

      {tab === 'apercu'      && renderApercu()}
      {tab === 'employeurs'  && renderEmployeurs()}
      {tab === 'travailleurs' && renderTravailleurs()}
      {tab === 'historique'  && renderHistorique()}
    </div>
  );
}