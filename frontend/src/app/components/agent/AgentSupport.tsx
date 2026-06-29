import { useEffect, useState, type FormEvent } from 'react';
import { BookOpen, ChevronRight, Edit, MessageSquare, Newspaper, Plus, Save, Trash2, X } from 'lucide-react';
import { Badge, type BadgeVariant } from './shared/Badge';
import { StatCard } from './shared/StatCard';
import { SectionHeader } from './shared/SectionHeader';
import { SearchBar } from './shared/SearchBar';
import {
  createFaq, deleteFaq, getFaqs, updateFaq,
  deleteActualite, getActualitesAdmin,
} from '../../api';
import { apiFetch } from '../../api';

// ─── Catégories disponibles ───────────────────────────────────────────────────
const CATEGORIES_ACTUALITE = [
  'Annonce',
  'Information',
  'Événement',
  'Réglementation',
  'Infrastructures',
  'Prestations',
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Ticket = {
  id: string; user: string; sujet: string;
  date: string; priorite: string; statut: 'Ouvert' | 'En cours' | 'Résolu';
};

type FaqForm = {
  question: string;
  reponse: string;
  categorie: string;
  actif: boolean;
};

type ActualiteForm = {
  categorie: string;
  titre: string;
  description: string;
  extrait: string;
  date_publication: string;
  temps_lecture: string;
  actif: boolean;
  imageFile: File | null;
  imagePreview: string;
};

const defaultFaqForm: FaqForm = {
  question: '', reponse: '', categorie: '', actif: true,
};

const defaultActualiteForm: ActualiteForm = {
  categorie: '',
  titre: '',
  description: '',
  extrait: '',
  date_publication: new Date().toISOString().slice(0, 10),
  temps_lecture: '',
  actif: true,
  imageFile: null,
  imagePreview: '',
};

// ─── Helpers API avec FormData ────────────────────────────────────────────────
async function saveActualiteApi(form: ActualiteForm, id?: number | string): Promise<any> {
  const fd = new FormData();
  fd.append('titre',            form.titre);
  fd.append('categorie',        form.categorie);
  fd.append('description',      form.description);
  fd.append('extrait',          form.extrait);
  fd.append('date_publication', form.date_publication);
  fd.append('temps_lecture',    form.temps_lecture);
  fd.append('actif',            form.actif ? '1' : '0');
  if (id) fd.append('_method', 'PUT'); // Laravel method spoofing
  if (form.imageFile) fd.append('image', form.imageFile);

  const path = id ? `/actualites/${id}` : '/actualites';
  return apiFetch(path, { method: 'POST', body: fd });
}

// ─── Composant ────────────────────────────────────────────────────────────────
export function AgentSupport() {
  const [tickets] = useState<Ticket[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [actualites, setActualites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [faqForm, setFaqForm] = useState<FaqForm>(defaultFaqForm);
  const [faqMode, setFaqMode] = useState<'create' | 'edit' | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<number | string | null>(null);

  const [actualiteForm, setActualiteForm] = useState<ActualiteForm>(defaultActualiteForm);
  const [actualiteMode, setActualiteMode] = useState<'create' | 'edit' | null>(null);
  const [editingActualiteId, setEditingActualiteId] = useState<number | string | null>(null);

  useEffect(() => { loadSupportContent(); }, []);

  async function loadSupportContent() {
    setLoading(true);
    setError(null);
    try {
      const [faqResponse, actualitesResponse] = await Promise.all([
        getFaqs(),
        getActualitesAdmin(),
      ]);
      setFaqs(faqResponse);
      setActualites(actualitesResponse);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger le support');
    } finally {
      setLoading(false);
    }
  }

  // ─── FAQ ──────────────────────────────────────────────────────────────────
  const prioriteVariant = (p: string): BadgeVariant => {
    if (p === 'Critique') return 'red';
    if (p === 'Haute') return 'orange';
    if (p === 'Normale') return 'blue';
    return 'gray';
  };
  const statutVariant = (s: Ticket['statut']): BadgeVariant => {
    if (s === 'Ouvert') return 'orange';
    if (s === 'En cours') return 'blue';
    return 'green';
  };

  const startFaqCreate = () => {
    setSuccess(null); setFaqForm(defaultFaqForm);
    setEditingFaqId(null); setFaqMode('create');
  };
  const startFaqEdit = (faq: any) => {
    setSuccess(null);
    setFaqForm({ question: faq.question ?? '', reponse: faq.reponse ?? '', categorie: faq.categorie ?? '', actif: faq.actif ?? true });
    setEditingFaqId(faq.id); setFaqMode('edit');
  };
  const cancelFaqForm = () => {
    setFaqForm(defaultFaqForm); setFaqMode(null); setEditingFaqId(null); setSuccess(null);
  };

  const saveFaq = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      if (faqMode === 'edit' && editingFaqId != null) {
        await updateFaq(editingFaqId, faqForm);
        setSuccess('FAQ mise à jour avec succès.');
      } else {
        await createFaq(faqForm);
        setSuccess('FAQ créée avec succès.');
      }
      await loadSupportContent();
      cancelFaqForm();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement de la FAQ');
    } finally {
      setSaving(false);
    }
  };

  const removeFaq = async (id: number | string) => {
    if (!window.confirm('Supprimer cette FAQ ?')) return;
    setSaving(true); setError(null);
    try {
      await deleteFaq(id);
      setSuccess('FAQ supprimée avec succès.');
      await loadSupportContent();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  // ─── Actualités ───────────────────────────────────────────────────────────
  const startActualiteCreate = () => {
    setSuccess(null); setActualiteForm(defaultActualiteForm);
    setEditingActualiteId(null); setActualiteMode('create');
  };
  const startActualiteEdit = (a: any) => {
    setSuccess(null);
    setActualiteForm({
      categorie: a.categorie ?? '',
      titre: a.titre ?? '',
      description: a.description ?? '',
      extrait: a.extrait ?? '',
      date_publication: a.date_publication?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      temps_lecture: a.temps_lecture ?? '',
      actif: a.actif ?? true,
      imageFile: null,
      imagePreview: a.image ?? '',
    });
    setEditingActualiteId(a.id); setActualiteMode('edit');
  };
  const cancelActualiteForm = () => {
    setActualiteForm(defaultActualiteForm); setActualiteMode(null);
    setEditingActualiteId(null); setSuccess(null);
  };

  const saveActualite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      await saveActualiteApi(actualiteForm, actualiteMode === 'edit' ? editingActualiteId ?? undefined : undefined);
      setSuccess(actualiteMode === 'edit' ? 'Actualité mise à jour.' : 'Actualité créée.');
      await loadSupportContent();
      cancelActualiteForm();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement de l\'actualité');
    } finally {
      setSaving(false);
    }
  };

  const removeActualite = async (id: number | string) => {
    if (!window.confirm('Supprimer cette actualité ?')) return;
    setSaving(true); setError(null);
    try {
      await deleteActualite(id);
      setSuccess('Actualité supprimée.');
      await loadSupportContent();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <SectionHeader title="Support & Contenu" sub="Gestion des tickets, FAQ et actualités" />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Tickets ouverts" value={tickets.filter(t => t.statut === 'Ouvert').length} icon={<MessageSquare className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="Articles FAQ" value={faqs.length} icon={<BookOpen className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="Actualités" value={actualites.length} icon={<Newspaper className="w-5 h-5" />} color="bg-green-100 text-green-600" />
      </div>

      {error   && <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3">{success}</div>}

      {/* Tickets */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Tickets de support</h3>
        <SearchBar placeholder="Rechercher un ticket..." />
        <div className="space-y-3">
          {tickets.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Aucun ticket pour le moment.</p>
          )}
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

        {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">FAQ</h3>
              <p className="text-sm text-gray-500">Ajouter, modifier ou supprimer les questions fréquentes.</p>
            </div>
            <button type="button" onClick={startFaqCreate} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
              <Plus className="w-3.5 h-3.5" /> Nouvelle 
            </button>
          </div>

          {faqMode && (
            <form onSubmit={saveFaq} className="space-y-3 mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Question</label>
                <input value={faqForm.question} onChange={e => setFaqForm(p => ({ ...p, question: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Réponse</label>
                <textarea value={faqForm.reponse} onChange={e => setFaqForm(p => ({ ...p, reponse: e.target.value }))}
                  className="w-full min-h-[100px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Catégorie</label>
                <input value={faqForm.categorie} onChange={e => setFaqForm(p => ({ ...p, categorie: e.target.value }))}
                  placeholder="Ex: Cotisations, Retraite..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={faqForm.actif} onChange={e => setFaqForm(p => ({ ...p, actif: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                Publiée
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                  <Save className="w-4 h-4" /> {faqMode === 'edit' ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" onClick={cancelFaqForm} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <X className="w-4 h-4" /> Annuler
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {(loading ? Array.from({ length: 3 }, (_, i) => ({ id: `l-${i}`, question: 'Chargement...', vues: 0 })) : faqs).map((f, i) => (
              <div key={f.id ?? i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{f.question ?? 'Article FAQ'}</p>
                  <p className="text-xs text-gray-500">{f.categorie ?? 'Sans catégorie'} · {typeof f.vues === 'number' ? f.vues.toLocaleString() : '0'} vues</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startFaqEdit(f)} type="button" className="p-1 text-gray-400 hover:text-blue-600" title="Modifier">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeFaq(f.id)} type="button" className="p-1 text-gray-400 hover:text-red-600" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Actualités ──────────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Actualités</h3>
              <p className="text-sm text-gray-500">Publier, modifier ou retirer des actualités.</p>
            </div>
            <button type="button" onClick={startActualiteCreate} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
              <Plus className="w-3.5 h-3.5" /> Nouvelle
            </button>
          </div>

          {actualiteMode && (
            <form onSubmit={saveActualite} className="space-y-3 mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Titre</label>
                <input value={actualiteForm.titre} onChange={e => setActualiteForm(p => ({ ...p, titre: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" required />
              </div>

              {/* ← Catégorie en liste déroulante */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Catégorie</label>
                <select value={actualiteForm.categorie} onChange={e => setActualiteForm(p => ({ ...p, categorie: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" required>
                  <option value="">-- Choisir une catégorie --</option>
                  {CATEGORIES_ACTUALITE.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Extrait</label>
                <textarea value={actualiteForm.extrait} onChange={e => setActualiteForm(p => ({ ...p, extrait: e.target.value }))}
                  className="w-full min-h-[70px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description complète</label>
                <textarea value={actualiteForm.description} onChange={e => setActualiteForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full min-h-[120px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date de publication</label>
                  <input type="date" value={actualiteForm.date_publication}
                    onChange={e => setActualiteForm(p => ({ ...p, date_publication: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Temps de lecture</label>
                  <input value={actualiteForm.temps_lecture} placeholder="ex: 3 min"
                    onChange={e => setActualiteForm(p => ({ ...p, temps_lecture: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
                </div>
              </div>

              {/* ← Upload image fichier */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setActualiteForm(p => ({
                      ...p,
                      imageFile: file,
                      imagePreview: URL.createObjectURL(file),
                    }));
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
                {actualiteForm.imagePreview && (
                  <img src={actualiteForm.imagePreview} alt="Aperçu"
                    className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-200" />
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={actualiteForm.actif}
                  onChange={e => setActualiteForm(p => ({ ...p, actif: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                Publiée
              </label>

              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                  <Save className="w-4 h-4" /> {actualiteMode === 'edit' ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" onClick={cancelActualiteForm} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <X className="w-4 h-4" /> Annuler
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {(loading ? Array.from({ length: 3 }, (_, i) => ({ id: `ln-${i}`, titre: 'Chargement...', actif: false, date_publication: null })) : actualites).map((a, i) => (
              <div key={a.id ?? i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                {a.image ? (
                  <img src={a.image} alt={a.titre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <Newspaper className="w-4 h-4 text-orange-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{a.titre ?? 'Actualité'}</p>
                  <p className="text-xs text-gray-500">
                    {a.categorie ?? '—'} · {a.date_publication ? new Date(a.date_publication).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={a.actif ? 'Publiée' : 'Brouillon'} variant={a.actif ? 'green' : 'gray'} />
                  <button onClick={() => startActualiteEdit(a)} type="button" className="p-1 text-gray-400 hover:text-blue-600" title="Modifier">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeActualite(a.id)} type="button" className="p-1 text-gray-400 hover:text-red-600" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}