import { useEffect, useState, type FormEvent } from 'react';
import { BookOpen, ChevronRight, Edit, MessageSquare, Newspaper, Plus, Save, Trash2, X } from 'lucide-react';
import { Badge, type BadgeVariant } from './shared/Badge';
import { StatCard } from './shared/StatCard';
import { SectionHeader } from './shared/SectionHeader';
import { SearchBar } from './shared/SearchBar';
import {
  createActualite,
  createFaq,
  deleteActualite,
  deleteFaq,
  getActualitesAdmin,
  getFaqsAdmin,
  updateActualite,
  updateFaq,
} from '../../api';

type Ticket = { id: string; user: string; sujet: string; date: string; priorite: string; statut: 'Ouvert' | 'En cours' | 'Résolu' };

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
  image: string;
  actif: boolean;
};

const defaultFaqForm: FaqForm = {
  question: '',
  reponse: '',
  categorie: '',
  actif: true,
};

const defaultActualiteForm: ActualiteForm = {
  categorie: '',
  titre: '',
  description: '',
  extrait: '',
  date_publication: new Date().toISOString().slice(0, 10),
  temps_lecture: '',
  image: '',
  actif: true,
};

export function AgentSupport() {
  const [tickets] = useState<Ticket[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [actualites, setActualites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState<FaqForm>(defaultFaqForm);
  const [actualiteForm, setActualiteForm] = useState<ActualiteForm>(defaultActualiteForm);
  const [faqMode, setFaqMode] = useState<'create' | 'edit' | null>(null);
  const [actualiteMode, setActualiteMode] = useState<'create' | 'edit' | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<number | string | null>(null);
  const [editingActualiteId, setEditingActualiteId] = useState<number | string | null>(null);

  useEffect(() => {
    loadSupportContent();
  }, []);

  async function loadSupportContent() {
    setLoading(true);
    setError(null);

    try {
      const [faqResponse, actualitesResponse] = await Promise.all([
        getFaqsAdmin(),
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
    setSuccess(null);
    setFaqForm(defaultFaqForm);
    setEditingFaqId(null);
    setFaqMode('create');
  };

  const startFaqEdit = (faq: any) => {
    setSuccess(null);
    setFaqForm({
      question: faq.question ?? '',
      reponse: faq.reponse ?? '',
      categorie: faq.categorie ?? '',
      actif: faq.actif ?? true,
    });
    setEditingFaqId(faq.id);
    setFaqMode('edit');
  };

  const cancelFaqForm = () => {
    setFaqForm(defaultFaqForm);
    setFaqMode(null);
    setEditingFaqId(null);
    setSuccess(null);
  };

  const startActualiteCreate = () => {
    setSuccess(null);
    setActualiteForm(defaultActualiteForm);
    setEditingActualiteId(null);
    setActualiteMode('create');
  };

  const startActualiteEdit = (actualite: any) => {
    setSuccess(null);
    setActualiteForm({
      categorie: actualite.categorie ?? '',
      titre: actualite.titre ?? '',
      description: actualite.description ?? '',
      extrait: actualite.extrait ?? '',
      date_publication: actualite.date_publication?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      temps_lecture: actualite.temps_lecture ?? '',
      image: actualite.image ?? '',
      actif: actualite.actif ?? true,
    });
    setEditingActualiteId(actualite.id);
    setActualiteMode('edit');
  };

  const cancelActualiteForm = () => {
    setActualiteForm(defaultActualiteForm);
    setActualiteMode(null);
    setEditingActualiteId(null);
    setSuccess(null);
  };

  const saveFaq = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

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
      setError(err.message || 'Erreur lors de l’enregistrement de la FAQ');
    } finally {
      setSaving(false);
    }
  };

  const saveActualite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (actualiteMode === 'edit' && editingActualiteId != null) {
        await updateActualite(editingActualiteId, actualiteForm);
        setSuccess('Actualité mise à jour avec succès.');
      } else {
        await createActualite(actualiteForm);
        setSuccess('Actualité créée avec succès.');
      }
      await loadSupportContent();
      cancelActualiteForm();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’enregistrement de l’actualité');
    } finally {
      setSaving(false);
    }
  };

  const removeFaq = async (id: number | string) => {
    if (!window.confirm('Supprimer cette FAQ ?')) return;
    setSaving(true);
    setError(null);
    try {
      await deleteFaq(id);
      setSuccess('FAQ supprimée avec succès.');
      await loadSupportContent();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la FAQ');
    } finally {
      setSaving(false);
    }
  };

  const removeActualite = async (id: number | string) => {
    if (!window.confirm('Supprimer cette actualité ?')) return;
    setSaving(true);
    setError(null);
    try {
      await deleteActualite(id);
      setSuccess('Actualité supprimée avec succès.');
      await loadSupportContent();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l’actualité');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Support & Contenu" sub="Gestion des tickets, FAQ et actualités" />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Tickets ouverts" value={tickets.filter(t => t.statut === 'Ouvert').length} icon={<MessageSquare className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="Articles FAQ" value={faqs.length} icon={<BookOpen className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="Actualités publiées" value={actualites.length} sub="Ce mois" icon={<Newspaper className="w-5 h-5" />} color="bg-green-100 text-green-600" />
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">{error}</div> : null}
      {success ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3">{success}</div> : null}

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
              <button className="p-1 text-gray-400 hover:text-blue-600"><ChevronRight className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">FAQ</h3>
              <p className="text-sm text-gray-500">Ajouter, modifier ou supprimer les questions fréquentes.</p>
            </div>
            <button type="button" onClick={startFaqCreate} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
              <Plus className="w-3.5 h-3.5" /> Nouvel article
            </button>
          </div>

          {faqMode ? (
            <form onSubmit={saveFaq} className="space-y-3 mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3">
                <label className="block text-xs font-semibold text-gray-700">Question</label>
                <input
                  value={faqForm.question}
                  onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                  required
                />
              </div>
              <div className="grid gap-3">
                <label className="block text-xs font-semibold text-gray-700">Réponse</label>
                <textarea
                  value={faqForm.reponse}
                  onChange={(e) => setFaqForm(prev => ({ ...prev, reponse: e.target.value }))}
                  className="w-full min-h-[120px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-gray-700">Catégorie</label>
                <input
                  value={faqForm.categorie}
                  onChange={(e) => setFaqForm(prev => ({ ...prev, categorie: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={faqForm.actif}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, actif: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  Publiée
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                  <Save className="w-4 h-4" /> {faqMode === 'edit' ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" onClick={cancelFaqForm} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <X className="w-4 h-4" /> Annuler
                </button>
              </div>
            </form>
          ) : null}

          <div className="space-y-2">
            {(loading ? Array.from({ length: 3 }, (_, i) => ({ id: `loader-${i}`, question: 'Chargement...', vues: 0 })) : faqs).map((f, i) => (
              <div key={f.id ?? i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{f.question ?? 'Article FAQ'}</p>
                  <p className="text-xs text-gray-500">{typeof f.vues === 'number' ? f.vues.toLocaleString() : '0'} vues</p>
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

          {actualiteMode ? (
            <form onSubmit={saveActualite} className="space-y-3 mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3">
                <label className="block text-xs font-semibold text-gray-700">Titre</label>
                <input
                  value={actualiteForm.titre}
                  onChange={(e) => setActualiteForm(prev => ({ ...prev, titre: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                  required
                />
              </div>
              <div className="grid gap-3">
                <label className="block text-xs font-semibold text-gray-700">Catégorie</label>
                <input
                  value={actualiteForm.categorie}
                  onChange={(e) => setActualiteForm(prev => ({ ...prev, categorie: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                  required
                />
              </div>
              <div className="grid gap-3">
                <label className="block text-xs font-semibold text-gray-700">Extrait</label>
                <textarea
                  value={actualiteForm.extrait}
                  onChange={(e) => setActualiteForm(prev => ({ ...prev, extrait: e.target.value }))}
                  className="w-full min-h-[80px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                  required
                />
              </div>
              <div className="grid gap-3">
                <label className="block text-xs font-semibold text-gray-700">Description</label>
                <textarea
                  value={actualiteForm.description}
                  onChange={(e) => setActualiteForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[120px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-gray-700">Date de publication</label>
                <input
                  type="date"
                  value={actualiteForm.date_publication}
                  onChange={(e) => setActualiteForm(prev => ({ ...prev, date_publication: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-gray-700">Temps de lecture</label>
                <input
                  value={actualiteForm.temps_lecture}
                  onChange={(e) => setActualiteForm(prev => ({ ...prev, temps_lecture: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-gray-700">Image (URL)</label>
                <input
                  value={actualiteForm.image}
                  onChange={(e) => setActualiteForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={actualiteForm.actif}
                    onChange={(e) => setActualiteForm(prev => ({ ...prev, actif: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  Publiée
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                  <Save className="w-4 h-4" /> {actualiteMode === 'edit' ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" onClick={cancelActualiteForm} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <X className="w-4 h-4" /> Annuler
                </button>
              </div>
            </form>
          ) : null}

          <div className="space-y-3">
            {(loading ? Array.from({ length: 3 }, (_, i) => ({ id: `loader-news-${i}`, titre: 'Chargement...', statut: 'Brouillon', vues: 0 })) : actualites).map((a, i) => (
              <div key={a.id ?? i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <Newspaper className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{a.titre ?? a.categorie ?? 'Actualité'}</p>
                  <p className="text-xs text-gray-500">{a.date_publication ? new Date(a.date_publication).toLocaleDateString('fr-FR') : 'Date inconnue'}</p>
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