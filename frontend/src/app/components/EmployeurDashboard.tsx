import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  FileText,
  CreditCard,
  History,
  LogOut,
  Bell,
  Settings,
  Home,
  PlusCircle,
  Download,
  Search,
  TrendingUp,
  AlertCircle,
  X,
  Upload,
  CheckCircle,
  UserX,
  Info,
  RefreshCw,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { CNSSLogo } from './CNSSLogo';
import { useUser } from '../hooks/useUser';
import {
  clearAuth,
  getTravailleursParEmployeur,
  getNotifications,
  downloadTravailleurAttestation,
  initierPaiementCotisation,
  getCotisationsParEmployeur,
  verifierPaiementFedaPay,
} from '../api';

interface Travailleur {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  statut: 'Actif' | 'Inactif' | 'En attente' | 'Rejetée';
  dateAffiliation: string;
  poste?: string;
  salaire?: number;
  rawId?: number;
}

interface Declaration {
  id: number;
  periode: string;
  montant: number;
  statut: 'Payée' | 'En attente' | 'En retard';
  dateEcheance: string;
  dateEmission: string;
  secteurActivite: string;
  nombreTravailleurs: number;
  masseSalariale: number;
  tauxCotisationSalariale: number;
  tauxCotisationPatronale: number;
  montantSalarial: number;
  montantPatronal: number;
  detailsCalcul: {
    travailleur: string;
    matricule: string;
    salaire: number;
    cotisationSalariale: number;
    cotisationPatronale: number;
    total: number;
  }[];
}

interface CotisationTravailleur {
  id: number;
  travailleurId: number;
  periode: string;
  dateVersement: string;
  montantSalarial: number;
  montantPatronal: number;
  montantTotal: number;
  statut: 'Payée' | 'En attente' | 'En retard';
}

const cotisationsParTravailleur: CotisationTravailleur[] = [];

function mapTravailleurFromApi(t: any): Travailleur {
  const statutMap: Record<string, Travailleur['statut']> = {
    actif: 'Actif',
    en_attente: 'En attente',
    rejetee: 'Rejetée',
  };
  return {
    id: t.id,
    rawId: t.id,
    nom: t.last_name ?? t.nom ?? '',
    prenom: t.first_name ?? t.prenom ?? '',
    matricule: t.numero_cnss ?? 'En attente',
    statut: statutMap[t.statut] ?? 'Inactif',
    dateAffiliation: t.created_at ? new Date(t.created_at).toLocaleDateString('fr-FR') : '—',
    poste: t.position ?? t.poste,
    salaire: t.salaire_brut ? Number(t.salaire_brut) : undefined,
  };
}

function mapDeclarationFromApi(c: any): Declaration {
  const statutMap: Record<string, Declaration['statut']> = {
    'payée':      'Payée',
    'payee':      'Payée',
    'Payée':      'Payée',
    'Vérifiée':   'Payée',
    'verifiee':   'Payée',
    'approved':   'Payée',
    'En attente': 'En attente',
    'pending':    'En attente',
    'en_attente': 'En attente',
    'En retard':  'En retard',
    'late':       'En retard',
    'en_retard':  'En retard',
  };

  const details = Array.isArray(c.details) ? c.details.map((d: any) => ({
    // ← si d.travailleur est un objet, extraire le nom
    travailleur: typeof d.travailleur === 'object' && d.travailleur !== null
      ? `${d.travailleur.first_name ?? ''} ${d.travailleur.last_name ?? ''}`.trim()
      : (d.travailleur ?? `${d.prenom ?? ''} ${d.nom ?? ''}`.trim() ?? '—'),
    // ← si d.travailleur est un objet, extraire le matricule
    matricule: typeof d.travailleur === 'object' && d.travailleur !== null
      ? (d.travailleur.numero_cnss ?? '—')
      : (d.matricule ?? '—'),
    salaire:             Number(d.salaire_brut ?? d.salaire ?? 0),
    cotisationSalariale: Number(d.montant_salarial ?? d.cotisation_salariale ?? 0),
    cotisationPatronale: Number(d.montant_patronal ?? d.cotisation_patronale ?? 0),
    total:               Number(d.montant_total ?? d.total ?? 0),
  })) : [];

  let periode = c.periode ?? '';
  if (!periode && c.mois && c.annee) {
    const date = new Date(c.annee, c.mois - 1);
    periode = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    periode = periode.charAt(0).toUpperCase() + periode.slice(1);
  }

  return {
    id:                      c.id,
    periode,
    montant:                 Number(c.montant_total ?? c.montant ?? 0),
    // ← utiliser c.status (pas c.statut) car le backend retourne "status"
    statut:                  statutMap[c.status] ?? statutMap[c.statut] ?? 'En attente',
    dateEcheance:            c.echeance
                               ? new Date(c.echeance).toLocaleDateString('fr-FR')
                               : (c.date_echeance
                                   ? new Date(c.date_echeance).toLocaleDateString('fr-FR')
                                   : '—'),
    dateEmission:            c.created_at
                               ? new Date(c.created_at).toLocaleDateString('fr-FR') : '—',
    secteurActivite:         c.secteur_activite ?? c.secteur ?? '—',
    nombreTravailleurs:      Number(c.nombre_travailleurs ?? details.length ?? 0),
    masseSalariale:          Number(c.masse_salariale ?? 0),
    tauxCotisationSalariale: Number(c.taux_salarial ?? c.taux_cotisation_salariale ?? 3.6),
    tauxCotisationPatronale: Number(c.taux_patronal ?? c.taux_cotisation_patronale ?? 15.4),
    montantSalarial:         Number(c.montant_salarial ?? 0),
    montantPatronal:         Number(c.montant_patronal ?? 0),
    detailsCalcul:           details,
  };
}

export function EmployeurDashboard() {
  const navigate = useNavigate();
  const { user, loading, error } = useUser();

  const [travailleurs, setTravailleurs] = useState<Travailleur[]>([]);
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loadingTravailleurs, setLoadingTravailleurs] = useState(false);
  const [loadingDeclarations, setLoadingDeclarations] = useState(false);
  const [activeTab, setActiveTab] = useState<'apercu' | 'travailleurs' | 'declarations' | 'paiements' | 'historique'>('apercu');
  const [selectedTravailleur, setSelectedTravailleur] = useState<Travailleur | null>(null);
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null);
  const [selectedModePaiement, setSelectedModePaiement] = useState<'carte' | 'mobile' | 'virement' | null>(null);
  const [showDesactivationModal, setShowDesactivationModal] = useState(false);
  const [travailleurADesactiver, setTravailleurADesactiver] = useState<Travailleur | null>(null);
  const [motifDesactivation, setMotifDesactivation] = useState('');
  const [fichierJustificatif, setFichierJustificatif] = useState<File | null>(null);
  const [paiementEnCoursId, setPaiementEnCoursId] = useState<number | null>(null);
  const [paiementErreur, setPaiementErreur] = useState<string | null>(null);
  const [paiementSucces, setPaiementSucces] = useState<string | null>(null);
  const [rechercheTravailleurs, setRechercheTravailleurs] = useState('');

  const employeurId = user?.profile?.id;

  // ─── Charger les travailleurs ─────────────────────────────────────────────
  useEffect(() => {
    if (!employeurId) return;
    let mounted = true;
    (async () => {
      setLoadingTravailleurs(true);
      try {
        const data = await getTravailleursParEmployeur(employeurId);
        if (mounted) setTravailleurs((data as any[]).map(mapTravailleurFromApi));
      } catch (err) {
        console.error('Erreur chargement travailleurs', err);
      } finally {
        if (mounted) setLoadingTravailleurs(false);
      }
    })();
    return () => { mounted = false; };
  }, [employeurId]);

  // ─── Charger les déclarations (cotisations) ───────────────────────────────
  const chargerDeclarations = useCallback(async () => {
    if (!employeurId) return;
    setLoadingDeclarations(true);
    try {
      const data = await getCotisationsParEmployeur(employeurId);
      setDeclarations((data as any[]).map(mapDeclarationFromApi));
    } catch (err) {
      console.error('Erreur chargement déclarations', err);
    } finally {
      setLoadingDeclarations(false);
    }
  }, [employeurId]);

  useEffect(() => {
    chargerDeclarations();
  }, [chargerDeclarations]);

  // ─── Vérifier un paiement FedaPay au retour de la redirection ────────────
  useEffect(() => {
    if (!employeurId) return;
    const cotisationId = localStorage.getItem('fedapay_cotisation_id');
    const transactionId = localStorage.getItem('fedapay_transaction_id');
    if (!cotisationId || !transactionId) return;

    localStorage.removeItem('fedapay_cotisation_id');
    localStorage.removeItem('fedapay_transaction_id');

    (async () => {
      try {
        const result = await verifierPaiementFedaPay(cotisationId, transactionId);
        if (result?.statut === 'payee' || result?.statut === 'paid') {
          setPaiementSucces('Paiement confirmé avec succès !');
        } else {
          setPaiementErreur('Le paiement n\'a pas pu être confirmé. Contactez la CNSS si le montant a été débité.');
        }
        // Recharger les déclarations pour afficher le nouveau statut
        await chargerDeclarations();
      } catch (err) {
        console.error('Vérification paiement échouée', err);
      }
    })();
  }, [employeurId, chargerDeclarations]);

  // ─── Charger les notifications ────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getNotifications();
        if (mounted) {
          setUnreadNotifications((data as any[]).filter(n => !n.read_at).length);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  // ─── Initier le paiement FedaPay ─────────────────────────────────────────
  const handlePaiementCotisation = async (declaration: Declaration) => {
    setPaiementErreur(null);
    setPaiementSucces(null);
    setPaiementEnCoursId(declaration.id);

    try {
      const response = await initierPaiementCotisation(declaration.id);

      if (!response?.payment_url) {
        throw new Error('Aucun lien de paiement reçu du serveur.');
      }

      // Sauvegarder les IDs pour vérification au retour
      localStorage.setItem('fedapay_cotisation_id', String(declaration.id));
      localStorage.setItem('fedapay_transaction_id', String(response.transaction_id));

      // Rediriger vers FedaPay
      window.location.href = response.payment_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible d\'initier le paiement.';
      setPaiementErreur(message);
    } finally {
      setPaiementEnCoursId(null);
    }
  };

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

  const companyName = user?.profile?.company_name || user?.email || 'Mon Entreprise';
  const ifu = user?.profile?.ifu || 'À compléter';
  const cnss = user?.profile?.numero_cnss || 'N/A';

  const travailleursFiltres = travailleurs.filter(t =>
    rechercheTravailleurs === '' ||
    t.nom.toLowerCase().includes(rechercheTravailleurs.toLowerCase()) ||
    t.prenom.toLowerCase().includes(rechercheTravailleurs.toLowerCase()) ||
    t.matricule.toLowerCase().includes(rechercheTravailleurs.toLowerCase()) ||
    (t.poste ?? '').toLowerCase().includes(rechercheTravailleurs.toLowerCase())
  );

  const totalCotisations = declarations
    .filter(d => d.statut === 'Payée')
    .reduce((sum, d) => sum + d.montant, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'apercu':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
              <p className="text-gray-600">Bienvenue sur votre espace employeur CNSS</p>
            </div>

            {/* Alertes globales */}
            {paiementSucces && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-semibold text-green-900">{paiementSucces}</p>
                <button onClick={() => setPaiementSucces(null)} className="ml-auto text-green-600 hover:text-green-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {paiementErreur && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm font-semibold text-red-900">{paiementErreur}</p>
                <button onClick={() => setPaiementErreur(null)} className="ml-auto text-red-600 hover:text-red-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Travailleurs</p>
                <p className="text-3xl font-bold text-gray-900">{travailleurs.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Déclarations</p>
                <p className="text-3xl font-bold text-gray-900">{declarations.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">En attente</p>
                <p className="text-3xl font-bold text-gray-900">
                  {declarations.filter(d => d.statut === 'En attente').length}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Total cotisations payées</p>
                <p className="text-xl font-bold text-gray-900">
                  {totalCotisations > 0 ? `${totalCotisations.toLocaleString()} FCFA` : '— FCFA'}
                </p>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/employeur/declarer-travailleur"
                  className="flex flex-col items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <PlusCircle className="w-8 h-8 text-blue-600" />
                  <span className="font-semibold text-gray-900">Déclarer un travailleur</span>
                </Link>
                <button
                  onClick={() => setActiveTab('declarations')}
                  className="flex flex-col items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className="font-semibold text-gray-900">Mes déclarations</span>
                </button>
                <button
                  onClick={() => setActiveTab('paiements')}
                  className="flex flex-col items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <CreditCard className="w-8 h-8 text-blue-600" />
                  <span className="font-semibold text-gray-900">Payer cotisations</span>
                </button>
                <button
                  onClick={() => setActiveTab('historique')}
                  className="flex flex-col items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Download className="w-8 h-8 text-blue-600" />
                  <span className="font-semibold text-gray-900">Télécharger documents</span>
                </button>
              </div>
            </div>

            {/* Déclarations récentes */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Déclarations récentes</h3>
                <button
                  onClick={() => setActiveTab('declarations')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Voir tout
                </button>
              </div>
              {loadingDeclarations ? (
                <p className="text-center text-gray-500 py-4">Chargement des déclarations...</p>
              ) : declarations.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Aucune déclaration disponible.</p>
              ) : (
                <div className="space-y-3">
                  {declarations.slice(0, 3).map((declaration) => (
                    <div key={declaration.id} className="border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{declaration.periode}</p>
                              <p className="text-xs text-gray-500">Émise le {declaration.dateEmission}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            declaration.statut === 'Payée' ? 'bg-green-100 text-green-700' :
                            declaration.statut === 'En attente' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {declaration.statut}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Travailleurs</p>
                            <p className="font-semibold text-gray-900">{declaration.nombreTravailleurs}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Masse salariale</p>
                            <p className="font-semibold text-gray-900">{declaration.masseSalariale.toLocaleString()} FCFA</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Échéance</p>
                            <p className="font-semibold text-gray-900">{declaration.dateEcheance}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Montant total à payer</p>
                            <p className="text-xl font-bold text-blue-600">{declaration.montant.toLocaleString()} FCFA</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedDeclaration(declaration);
                              setActiveTab('declarations');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                          >
                            Voir détails
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Menu actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                to="/employeur/parametres"
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Paramètres</p>
                    <p className="text-sm text-gray-600">Gérez votre compte et vos préférences</p>
                  </div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:bg-red-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <LogOut className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Déconnexion</p>
                    <p className="text-sm text-gray-600">Quitter votre espace employeur</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 'travailleurs':
        if (selectedTravailleur) {
          const cotisations = cotisationsParTravailleur.filter(c => c.travailleurId === selectedTravailleur.id);
          const totalCotisationsTravailleur = cotisations.reduce((sum, c) => sum + c.montantTotal, 0);
          const cotisationsPayees = cotisations.filter(c => c.statut === 'Payée').length;

          return (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setSelectedTravailleur(null)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold"
                >
                  ← Retour à la liste
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Détails du travailleur</h2>
                <p className="text-gray-600">Historique complet des cotisations</p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Informations personnelles</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Nom complet</p>
                        <p className="font-semibold text-gray-900">{selectedTravailleur.prenom} {selectedTravailleur.nom}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Matricule CNSS</p>
                        <p className="font-semibold text-gray-900">{selectedTravailleur.matricule}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Poste</p>
                        <p className="font-semibold text-gray-900">{selectedTravailleur.poste ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date d'affiliation</p>
                        <p className="font-semibold text-gray-900">{selectedTravailleur.dateAffiliation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Salaire mensuel</p>
                        <p className="font-semibold text-gray-900">
                          {selectedTravailleur.salaire ? `${selectedTravailleur.salaire.toLocaleString()} FCFA` : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Statut</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedTravailleur.statut === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedTravailleur.statut}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Statistiques</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 mb-1">Total cotisations</p>
                        <p className="text-2xl font-bold text-blue-900">{totalCotisationsTravailleur.toLocaleString()}</p>
                        <p className="text-xs text-blue-700">FCFA</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600 mb-1">Cotisations payées</p>
                        <p className="text-2xl font-bold text-green-900">{cotisationsPayees}</p>
                        <p className="text-xs text-green-700">sur {cotisations.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Historique des cotisations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Période</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date de versement</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Part salariale</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Part patronale</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Montant total</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cotisations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            Aucun historique de cotisation disponible.
                          </td>
                        </tr>
                      ) : cotisations.map((cotisation) => (
                        <tr key={cotisation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{cotisation.periode}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{cotisation.dateVersement}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{cotisation.montantSalarial.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{cotisation.montantPatronal.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">{cotisation.montantTotal.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              cotisation.statut === 'Payée' ? 'bg-green-100 text-green-700' :
                              cotisation.statut === 'En attente' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {cotisation.statut}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {cotisations.length > 0 && (
                      <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-sm font-bold text-gray-900 text-right">TOTAL:</td>
                          <td className="px-4 py-3 text-sm font-bold text-right text-blue-600">{totalCotisationsTravailleur.toLocaleString()} FCFA</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <div className="flex gap-4 flex-wrap">
                  {selectedTravailleur.statut === 'Actif' && selectedTravailleur.rawId && (
                    <button
                      onClick={() => downloadTravailleurAttestation(selectedTravailleur.rawId!)}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                    >
                      <FileText className="w-5 h-5" />
                      Attestation de cotisations
                    </button>
                  )}
                  {selectedTravailleur.statut === 'Actif' && (
                    <button
                      onClick={() => {
                        setTravailleurADesactiver(selectedTravailleur);
                        setShowDesactivationModal(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                    >
                      <UserX className="w-5 h-5" />
                      Désactiver ce travailleur
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Mes travailleurs</h2>
                <p className="text-gray-600">Gérez vos travailleurs déclarés</p>
              </div>
              <Link
                to="/employeur/declarer-travailleur"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <PlusCircle className="w-5 h-5" />
                Déclarer un travailleur
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un travailleur..."
                    value={rechercheTravailleurs}
                    onChange={e => setRechercheTravailleurs(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Matricule</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nom</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Prénom</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Poste</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date d'affiliation</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingTravailleurs ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Chargement...</td></tr>
                    ) : travailleursFiltres.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          {travailleurs.length === 0
                            ? <span>Aucun travailleur déclaré. <Link to="/employeur/declarer-travailleur" className="text-blue-600 hover:underline">Déclarer un travailleur</Link></span>
                            : 'Aucun résultat pour cette recherche.'}
                        </td>
                      </tr>
                    ) : travailleursFiltres.map((travailleur) => (
                      <tr key={travailleur.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{travailleur.matricule}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{travailleur.nom}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{travailleur.prenom}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{travailleur.poste ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{travailleur.dateAffiliation}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            travailleur.statut === 'Actif' ? 'bg-green-100 text-green-700' :
                            travailleur.statut === 'En attente' ? 'bg-orange-100 text-orange-700' :
                            travailleur.statut === 'Rejetée' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {travailleur.statut}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedTravailleur(travailleur)}
                              className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-semibold transition-all"
                            >
                              Voir détails
                            </button>
                            {travailleur.statut === 'Actif' && travailleur.rawId && (
                              <button
                                onClick={() => downloadTravailleurAttestation(travailleur.rawId!)}
                                className="text-green-600 hover:text-green-700 hover:underline text-sm font-semibold transition-all flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                Attestation
                              </button>
                            )}
                            {travailleur.statut === 'Actif' && (
                              <button
                                onClick={() => {
                                  setTravailleurADesactiver(travailleur);
                                  setShowDesactivationModal(true);
                                }}
                                className="text-red-600 hover:text-red-700 hover:underline text-sm font-semibold transition-all"
                              >
                                Désactiver
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
          </div>
        );

      case 'declarations':
        if (selectedDeclaration) {
          return (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setSelectedDeclaration(null)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold"
                >
                  ← Retour aux déclarations
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Détails de la déclaration — {selectedDeclaration.periode}
                </h2>
                <p className="text-gray-600">Calculée et émise par la CNSS le {selectedDeclaration.dateEmission}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informations de la déclaration</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div><p className="text-sm text-gray-600 mb-1">Période</p><p className="font-bold text-gray-900">{selectedDeclaration.periode}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Date d'émission</p><p className="font-bold text-gray-900">{selectedDeclaration.dateEmission}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Date d'échéance</p><p className="font-bold text-gray-900">{selectedDeclaration.dateEcheance}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Secteur d'activité</p><p className="font-bold text-gray-900">{selectedDeclaration.secteurActivite}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Nombre de travailleurs</p><p className="font-bold text-gray-900">{selectedDeclaration.nombreTravailleurs}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Masse salariale totale</p><p className="font-bold text-gray-900">{selectedDeclaration.masseSalariale.toLocaleString()} FCFA</p></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Taux de cotisation appliqués</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">Taux de cotisation salariale</p>
                    <p className="text-3xl font-bold text-blue-900">{selectedDeclaration.tauxCotisationSalariale}%</p>
                    <p className="text-sm text-blue-700 mt-2">Sur le salaire brut de chaque travailleur</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 mb-1">Taux de cotisation patronale</p>
                    <p className="text-3xl font-bold text-green-900">{selectedDeclaration.tauxCotisationPatronale}%</p>
                    <p className="text-sm text-green-700 mt-2">À la charge de l'employeur</p>
                  </div>
                </div>
              </div>

              {selectedDeclaration.detailsCalcul.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Détails du calcul par travailleur</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Travailleur</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Matricule</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Salaire brut</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Part salariale</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Part patronale</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedDeclaration.detailsCalcul.map((detail, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{detail.travailleur}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{detail.matricule}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{detail.salaire.toLocaleString()} FCFA</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{detail.cotisationSalariale.toLocaleString()} FCFA</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{detail.cotisationPatronale.toLocaleString()} FCFA</td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">{detail.total.toLocaleString()} FCFA</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900 text-right">TOTAUX:</td>
                          <td className="px-4 py-3 text-sm font-bold text-right text-blue-600">{selectedDeclaration.montantSalarial.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3 text-sm font-bold text-right text-green-600">{selectedDeclaration.montantPatronal.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3 text-sm font-bold text-right text-gray-900">{selectedDeclaration.montant.toLocaleString()} FCFA</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h3>

                {paiementErreur && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{paiementErreur}</p>
                    <button onClick={() => setPaiementErreur(null)} className="ml-auto text-red-600"><X className="w-4 h-4" /></button>
                  </div>
                )}
                {paiementSucces && (
                  <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-700">{paiementSucces}</p>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-blue-600 mb-1">Montant total à payer</p>
                      <p className="text-4xl font-bold text-blue-900">{selectedDeclaration.montant.toLocaleString()} FCFA</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedDeclaration.statut === 'Payée' ? 'bg-green-100 text-green-700' :
                      selectedDeclaration.statut === 'En attente' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {selectedDeclaration.statut}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600">Part salariale retenue</p>
                      <p className="font-bold text-blue-900">{selectedDeclaration.montantSalarial.toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <p className="text-blue-600">Part patronale à votre charge</p>
                      <p className="font-bold text-blue-900">{selectedDeclaration.montantPatronal.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedDeclaration.statut !== 'Payée' && (
                    <button
                      onClick={() => handlePaiementCotisation(selectedDeclaration)}
                      disabled={paiementEnCoursId === selectedDeclaration.id}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <CreditCard className="w-5 h-5" />
                      {paiementEnCoursId === selectedDeclaration.id ? 'Redirection en cours...' : 'Payer cette déclaration'}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900 mb-1">Déclaration calculée par la CNSS</p>
                    <p className="text-xs text-yellow-800">
                      Cette déclaration a été calculée automatiquement par la CNSS en fonction de votre secteur d'activité ({selectedDeclaration.secteurActivite}) et de la masse salariale déclarée pour vos {selectedDeclaration.nombreTravailleurs} travailleurs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Déclarations de cotisations</h2>
                <p className="text-gray-600">Consultez vos déclarations calculées par la CNSS</p>
              </div>
              <button
                onClick={chargerDeclarations}
                disabled={loadingDeclarations}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingDeclarations ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Comment fonctionnent les déclarations ?</p>
                  <p className="text-xs text-blue-800">
                    Chaque mois, la CNSS calcule automatiquement vos cotisations en fonction de votre secteur d'activité et de la masse salariale de vos travailleurs. Vous recevez une déclaration avec le calcul complet et la date d'échéance.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              {loadingDeclarations ? (
                <p className="text-center text-gray-500 py-8">Chargement des déclarations...</p>
              ) : declarations.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucune déclaration disponible pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {declarations.map((declaration) => (
                    <div key={declaration.id} className="border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 mb-1">{declaration.periode}</p>
                            <p className="text-sm text-gray-600">Émise le: {declaration.dateEmission} • Échéance: {declaration.dateEcheance}</p>
                            <p className="text-xs text-gray-500 mt-1">{declaration.nombreTravailleurs} travailleurs • {declaration.secteurActivite}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-gray-900 mb-2">{declaration.montant.toLocaleString()} FCFA</p>
                          <div className="flex items-center gap-3 justify-end">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              declaration.statut === 'Payée' ? 'bg-green-100 text-green-700' :
                              declaration.statut === 'En attente' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {declaration.statut}
                            </span>
                            <button
                              onClick={() => setSelectedDeclaration(declaration)}
                              className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-semibold"
                            >
                              Voir détails
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'paiements':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiements</h2>
              <p className="text-gray-600">Payez vos cotisations via FedaPay</p>
            </div>

            {paiementErreur && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{paiementErreur}</p>
                <button onClick={() => setPaiementErreur(null)} className="ml-auto text-red-600"><X className="w-4 h-4" /></button>
              </div>
            )}
            {paiementSucces && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">{paiementSucces}</p>
                <button onClick={() => setPaiementSucces(null)} className="ml-auto text-green-600"><X className="w-4 h-4" /></button>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cotisations à payer</h3>
              {loadingDeclarations ? (
                <p className="text-center text-gray-500 py-8">Chargement...</p>
              ) : declarations.filter(d => d.statut !== 'Payée').length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold">Toutes vos cotisations sont à jour !</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {declarations.filter(d => d.statut !== 'Payée').map((declaration) => (
                    <div key={declaration.id} className={`flex items-center justify-between p-6 border-2 rounded-lg ${
                      declaration.statut === 'En retard' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'
                    }`}>
                      <div>
                        <p className="font-bold text-gray-900 mb-1">{declaration.periode}</p>
                        <p className="text-sm text-gray-600">Échéance: {declaration.dateEcheance}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          declaration.statut === 'En retard' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {declaration.statut}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-gray-900 mb-3">{declaration.montant.toLocaleString()} FCFA</p>
                        <div className="flex flex-wrap gap-3 justify-end">
                          <button
                            onClick={() => handlePaiementCotisation(declaration)}
                            disabled={paiementEnCoursId === declaration.id}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            <CreditCard className="w-5 h-5" />
                            {paiementEnCoursId === declaration.id ? 'Redirection...' : 'Payer via FedaPay'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Moyens de paiement disponibles</h3>
              <div className="grid md:grid-cols-3 gap-2">
                <div className="p-2 border border-gray-200 rounded-lg text-center">
                  <CreditCard className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Carte bancaire</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard</p>
                </div>
                <div className="p-2 border border-gray-200 rounded-lg text-center">
                  <CreditCard className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Mobile Money</p>
                  <p className="text-xs text-gray-500">MTN, Moov, Celtiis</p>
                </div>
                <div className="p-2 border border-gray-200 rounded-lg text-center">
                  <CreditCard className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Virement bancaire</p>
                  <p className="text-xs text-gray-500">Transfert bancaire</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Redirection vers plateforme sécurisée
              </p>
            </div>
          </div>
        );

      case 'historique':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Historique</h2>
              <p className="text-gray-600">Consultez l'historique de vos opérations</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Toutes les transactions</h3>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>

              {loadingDeclarations ? (
                <p className="text-center text-gray-500 py-8">Chargement...</p>
              ) : declarations.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucune transaction disponible.</p>
              ) : (
                <div className="space-y-3">
                  {declarations.map((declaration) => (
                    <div key={declaration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <History className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-semibold text-gray-900">Déclaration {declaration.periode}</p>
                          <p className="text-sm text-gray-600">{declaration.dateEcheance}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{declaration.montant.toLocaleString()} FCFA</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          declaration.statut === 'Payée' ? 'bg-green-100 text-green-700' :
                          declaration.statut === 'En attente' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {declaration.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <CNSSLogo size="medium" />
            <div>
              <p className="font-bold text-gray-900">CNSS Bénin</p>
              <p className="text-xs text-gray-600">Espace Employeur</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {([
            { key: 'apercu', label: 'Aperçu', Icon: Home },
            { key: 'travailleurs', label: 'Travailleurs', Icon: Users },
            { key: 'declarations', label: 'Déclarations', Icon: FileText },
            { key: 'paiements', label: 'Paiements', Icon: CreditCard },
            { key: 'historique', label: 'Historique', Icon: History },
          ] as const).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === key ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            to="/employeur/parametres"
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Paramètres</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>
              <p className="text-sm text-gray-600">IFU: {ifu} • CNSS: {cnss}</p>
            </div>
            <Link
              to="/employeur/notifications"
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Link>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {/* Modal de désactivation */}
      {showDesactivationModal && travailleurADesactiver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <UserX className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Désactiver un travailleur</h2>
                    <p className="text-sm text-gray-600">
                      {travailleurADesactiver.prenom} {travailleurADesactiver.nom} ({travailleurADesactiver.matricule})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDesactivationModal(false);
                    setTravailleurADesactiver(null);
                    setMotifDesactivation('');
                    setFichierJustificatif(null);
                  }}
                  aria-label="Fermer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900 mb-1">Important</p>
                    <p className="text-xs text-yellow-800">
                      La désactivation nécessite des justificatifs et sera soumise à validation par la CNSS sous 3 à 5 jours ouvrables.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de la désactivation <span className="text-red-500">*</span>
                </label>
                <select
                  value={motifDesactivation}
                  onChange={(e) => setMotifDesactivation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un motif</option>
                  <option value="licenciement">Licenciement</option>
                  <option value="demission">Démission</option>
                  <option value="fin-contrat">Fin de contrat</option>
                  <option value="retraite">Départ à la retraite</option>
                  <option value="deces">Décès</option>
                  <option value="autre">Autre motif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document justificatif <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-semibold">Cliquez pour télécharger</span>
                      <span className="text-gray-600"> ou glissez-déposez</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setFichierJustificatif(e.target.files[0]);
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PDF, JPG ou PNG (max 10MB)</p>
                  </div>
                  {fichierJustificatif && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-900 font-medium">{fichierJustificatif.name}</span>
                        </div>
                        <button onClick={() => setFichierJustificatif(null)} className="text-red-600 hover:text-red-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Que se passe-t-il ensuite ?</p>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                      <li>Votre demande sera envoyée à la CNSS avec les justificatifs</li>
                      <li>Un agent examinera votre dossier sous 3 à 5 jours ouvrables</li>
                      <li>Vous recevrez une notification par email</li>
                      <li>Si validée, le travailleur n'apparaîtra plus dans vos déclarations futures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowDesactivationModal(false);
                  setTravailleurADesactiver(null);
                  setMotifDesactivation('');
                  setFichierJustificatif(null);
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (!motifDesactivation || !fichierJustificatif) {
                    alert('Veuillez remplir tous les champs obligatoires');
                    return;
                  }
                  alert(`Demande envoyée pour ${travailleurADesactiver.prenom} ${travailleurADesactiver.nom}. Vous serez notifié par email.`);
                  setShowDesactivationModal(false);
                  setTravailleurADesactiver(null);
                  setMotifDesactivation('');
                  setFichierJustificatif(null);
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
              >
                <UserX className="w-5 h-5" />
                Confirmer la désactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}