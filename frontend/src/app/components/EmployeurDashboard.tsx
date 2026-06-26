import { useState, useEffect } from 'react';
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
  Calendar,
  TrendingUp,
  AlertCircle,
  X,
  Upload,
  CheckCircle,
  UserX,
  Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { CNSSLogo } from './CNSSLogo';
import { useUser } from '../hooks/useUser';
import { clearAuth, getTravailleursParEmployeur, getNotifications, downloadTravailleurAttestation } from '../api';

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

const declarations: Declaration[] = [];

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

export function EmployeurDashboard() {
  const navigate = useNavigate();
  const { user, loading, error } = useUser();

  const [travailleurs, setTravailleurs] = useState<Travailleur[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loadingTravailleurs, setLoadingTravailleurs] = useState(false);
  const [activeTab, setActiveTab] = useState<'apercu' | 'travailleurs' | 'declarations' | 'paiements' | 'historique'>('apercu');
  const [selectedTravailleur, setSelectedTravailleur] = useState<Travailleur | null>(null);
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null);
  const [selectedPaiement, setSelectedPaiement] = useState<Declaration | null>(null);
  const [selectedModePaiement, setSelectedModePaiement] = useState<'carte' | 'mobile' | 'virement' | null>(null);
  const [showDesactivationModal, setShowDesactivationModal] = useState(false);
  const [travailleurADesactiver, setTravailleurADesactiver] = useState<Travailleur | null>(null);
  const [motifDesactivation, setMotifDesactivation] = useState('');
  const [fichierJustificatif, setFichierJustificatif] = useState<File | null>(null);

  const employeurId = user?.profile?.id;

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

  // Gérer la déconnexion
  const handleLogout = () => {
    clearAuth();
    navigate('/');
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

  // Données de l'utilisateur (entreprise)
  const companyName = user?.profile?.company_name || user?.email || 'Mon Entreprise';
  const ifu = user?.profile?.ifu || 'À compléter';
  const cnss = user?.profile?.numero_cnss || 'N/A';

  const renderContent = () => {
    switch (activeTab) {
      case 'apercu':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
              <p className="text-gray-600">Bienvenue sur votre espace employeur CNSS</p>
            </div>

            {/* Statistiques */}
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
                <p className="text-3xl font-bold text-gray-900">{travailleurs.filter(t => t.statut === 'En attente').length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Total cotisations</p>
                <p className="text-2xl font-bold text-gray-900">— FCFA</p>
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
                  <span className="font-semibold text-gray-900">Nouvelle déclaration</span>
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
              <Link
                to="/"
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:bg-red-50 transition-colors"
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
              </Link>
            </div>
          </div>
        );

      case 'travailleurs':
        if (selectedTravailleur) {
          const cotisations = cotisationsParTravailleur.filter(c => c.travailleurId === selectedTravailleur.id);
          const totalCotisations = cotisations.reduce((sum, c) => sum + c.montantTotal, 0);
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Détails du travailleur
                </h2>
                <p className="text-gray-600">Historique complet des cotisations</p>
              </div>

              {/* Informations du travailleur */}
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
                        <p className="font-semibold text-gray-900">{selectedTravailleur.poste}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date d'affiliation</p>
                        <p className="font-semibold text-gray-900">{selectedTravailleur.dateAffiliation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Salaire mensuel</p>
                        <p className="font-semibold text-gray-900">{selectedTravailleur.salaire?.toLocaleString()} FCFA</p>
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
                        <p className="text-2xl font-bold text-blue-900">{totalCotisations.toLocaleString()}</p>
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

              {/* Historique des cotisations */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Historique des cotisations
                </h3>
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
                      {cotisations.map((cotisation) => (
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
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-sm font-bold text-gray-900 text-right">TOTAL:</td>
                        <td className="px-4 py-3 text-sm font-bold text-right text-blue-600">{totalCotisations.toLocaleString()} FCFA</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <div className="flex gap-4 flex-wrap">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    <Download className="w-5 h-5" />
                    Télécharger l'historique (PDF)
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                    <FileText className="w-5 h-5" />
                    Attestation de cotisations
                  </button>
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
                    ) : travailleurs.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Aucun travailleur déclaré. <Link to="/employeur/declarer-travailleur" className="text-blue-600 hover:underline">Déclarer un travailleur</Link></td></tr>
                    ) : travailleurs.map((travailleur) => (
                      <tr key={travailleur.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{travailleur.matricule}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{travailleur.nom}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{travailleur.prenom}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{travailleur.poste}</td>
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
                  Détails de la déclaration - {selectedDeclaration.periode}
                </h2>
                <p className="text-gray-600">Calculée et émise par la CNSS le {selectedDeclaration.dateEmission}</p>
              </div>

              {/* Informations générales */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informations de la déclaration</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Période</p>
                    <p className="font-bold text-gray-900">{selectedDeclaration.periode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date d'émission</p>
                    <p className="font-bold text-gray-900">{selectedDeclaration.dateEmission}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date d'échéance</p>
                    <p className="font-bold text-gray-900">{selectedDeclaration.dateEcheance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Secteur d'activité</p>
                    <p className="font-bold text-gray-900">{selectedDeclaration.secteurActivite}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nombre de travailleurs</p>
                    <p className="font-bold text-gray-900">{selectedDeclaration.nombreTravailleurs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Masse salariale totale</p>
                    <p className="font-bold text-gray-900">{selectedDeclaration.masseSalariale.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>

              {/* Taux de cotisation */}
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

              {/* Détails du calcul par travailleur */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Détails du calcul par travailleur</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Travailleur</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Matricule</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Salaire brut</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Part salariale (4%)</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Part patronale (16%)</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total cotisation</th>
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

              {/* Récapitulatif et actions */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h3>
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

                <div className="flex gap-4">
                  {selectedDeclaration.statut !== 'Payée' && (
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                      <CreditCard className="w-5 h-5" />
                      Payer cette déclaration
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                    <Download className="w-5 h-5" />
                    Télécharger le détail (PDF)
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900 mb-1">
                      Déclaration calculée par la CNSS
                    </p>
                    <p className="text-xs text-yellow-800">
                      Cette déclaration a été calculée automatiquement par la CNSS en fonction de votre secteur d'activité ({selectedDeclaration.secteurActivite}) et de la masse salariale déclarée pour vos {selectedDeclaration.nombreTravailleurs} travailleurs. Les taux appliqués sont conformes à la réglementation en vigueur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Déclarations de cotisations</h2>
              <p className="text-gray-600">Consultez vos déclarations calculées et envoyées par la CNSS</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Comment fonctionnent les déclarations ?
                  </p>
                  <p className="text-xs text-blue-800">
                    Chaque mois, la CNSS calcule automatiquement vos cotisations à payer en fonction de votre secteur d'activité et de la masse salariale de vos travailleurs déclarés. Vous recevez une déclaration détaillée avec le calcul complet et la date d'échéance pour le paiement.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
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
                          <p className="text-xs text-gray-500 mt-1">{declaration.nombreTravailleurs} travailleurs • Secteur: {declaration.secteurActivite}</p>
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
            </div>
          </div>
        );

      case 'paiements':
        if (selectedPaiement) {
          return (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => {
                    setSelectedPaiement(null);
                    setSelectedModePaiement(null);
                  }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold"
                >
                  ← Retour aux paiements
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Paiement - {selectedPaiement.periode}
                </h2>
                <p className="text-gray-600">Choisissez votre mode de paiement et suivez les instructions</p>
              </div>

              {/* Récapitulatif du paiement */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h3>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 mb-1">Montant à payer</p>
                      <p className="text-4xl font-bold text-blue-900">{selectedPaiement.montant.toLocaleString()} FCFA</p>
                      <p className="text-sm text-gray-600 mt-2">Période: {selectedPaiement.periode}</p>
                      <p className="text-sm text-gray-600">Échéance: {selectedPaiement.dateEcheance}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Choix du mode de paiement */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Choisissez votre mode de paiement</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => setSelectedModePaiement('carte')}
                    className={`p-6 border-2 rounded-lg transition-all text-center ${
                      selectedModePaiement === 'carte'
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <CreditCard className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">Carte bancaire</p>
                    <p className="text-xs text-gray-600 mt-1">Visa, Mastercard</p>
                  </button>
                  <button
                    onClick={() => setSelectedModePaiement('mobile')}
                    className={`p-6 border-2 rounded-lg transition-all text-center ${
                      selectedModePaiement === 'mobile'
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <CreditCard className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">Mobile Money</p>
                    <p className="text-xs text-gray-600 mt-1">MTN, Moov, Celtiis</p>
                  </button>
                  <button
                    onClick={() => setSelectedModePaiement('virement')}
                    className={`p-6 border-2 rounded-lg transition-all text-center ${
                      selectedModePaiement === 'virement'
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <CreditCard className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">Virement bancaire</p>
                    <p className="text-xs text-gray-600 mt-1">Transfert bancaire</p>
                  </button>
                </div>

                {/* Instructions selon le mode de paiement */}
                {selectedModePaiement === 'carte' && (
                  <div className="border-t pt-6">
                    <h4 className="font-bold text-gray-900 mb-4">Paiement par carte bancaire</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de carte
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date d'expiration
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                        Valider le paiement
                      </button>
                    </div>
                  </div>
                )}

                {selectedModePaiement === 'mobile' && (
                  <div className="border-t pt-6">
                    <h4 className="font-bold text-gray-900 mb-4">Paiement par Mobile Money</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opérateur
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>MTN Mobile Money</option>
                          <option>Moov Money</option>
                          <option>Celtiis Cash</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de téléphone
                        </label>
                        <input
                          type="tel"
                          placeholder="+229 XX XX XX XX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          <strong>Instructions:</strong> Après avoir cliqué sur "Valider le paiement", vous recevrez une notification sur votre téléphone. Composez votre code PIN pour confirmer le paiement.
                        </p>
                      </div>
                      <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                        Valider le paiement
                      </button>
                    </div>
                  </div>
                )}

                {selectedModePaiement === 'virement' && (
                  <div className="border-t pt-6">
                    <h4 className="font-bold text-gray-900 mb-4">Paiement par virement bancaire</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                      <div>
                        <p className="text-sm text-blue-600 mb-1">Bénéficiaire</p>
                        <p className="font-bold text-gray-900">CNSS Bénin</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 mb-1">Banque</p>
                        <p className="font-bold text-gray-900">Bank of Africa Bénin</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 mb-1">IBAN</p>
                        <p className="font-bold text-gray-900 font-mono">BJ06 BJ123 45678 90123 45678 901</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 mb-1">Code SWIFT/BIC</p>
                        <p className="font-bold text-gray-900 font-mono">AFRIBJBJXXX</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 mb-1">Référence à mentionner</p>
                        <p className="font-bold text-gray-900 font-mono">CNSS-{selectedPaiement.periode.replace(' ', '-')}-{selectedPaiement.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 mb-1">Montant</p>
                        <p className="font-bold text-gray-900 text-xl">{selectedPaiement.montant.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Après avoir effectué le virement, veuillez télécharger la preuve de paiement ci-dessous. Le traitement de votre paiement peut prendre 2 à 3 jours ouvrables.
                      </p>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Télécharger la preuve de paiement
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF, JPG, PNG (max 5MB)</p>
                    </div>
                    <button className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                      Soumettre la preuve de paiement
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiements</h2>
              <p className="text-gray-600">Payez vos cotisations en ligne</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cotisations à payer</h3>
              <div className="space-y-4">
                {declarations.filter(d => d.statut !== 'Payée').map((declaration) => (
                  <div key={declaration.id} className="flex items-center justify-between p-6 border-2 border-orange-200 rounded-lg bg-orange-50">
                    <div>
                      <p className="font-bold text-gray-900 mb-1">{declaration.periode}</p>
                      <p className="text-sm text-gray-600">Échéance: {declaration.dateEcheance}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-gray-900 mb-2">{declaration.montant.toLocaleString()} FCFA</p>
                      <button
                        onClick={() => setSelectedPaiement(declaration)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        Payer maintenant
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Moyens de paiement disponibles</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold">Carte bancaire</p>
                  <p className="text-xs text-gray-600 mt-1">Visa, Mastercard</p>
                </div>
                <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold">Mobile Money</p>
                  <p className="text-xs text-gray-600 mt-1">MTN, Moov, Celtiis</p>
                </div>
                <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold">Virement bancaire</p>
                  <p className="text-xs text-gray-600 mt-1">Transfert bancaire</p>
                </div>
              </div>
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
          <button
            onClick={() => setActiveTab('apercu')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'apercu' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Aperçu</span>
          </button>
          <button
            onClick={() => setActiveTab('travailleurs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'travailleurs' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Travailleurs</span>
          </button>
          <button
            onClick={() => setActiveTab('declarations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'declarations' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Déclarations</span>
          </button>
          <button
            onClick={() => setActiveTab('paiements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'paiements' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Paiements</span>
          </button>
          <button
            onClick={() => setActiveTab('historique')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'historique' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="font-medium">Historique</span>
          </button>
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
                    <p className="text-sm font-semibold text-yellow-900 mb-1">
                      Important
                    </p>
                    <p className="text-xs text-yellow-800">
                      La désactivation d'un travailleur nécessite l'envoi de justificatifs. Cette action sera soumise à validation par la CNSS avant d'être effective. Le travailleur restera dans votre liste avec le statut "En attente de validation" jusqu'à la confirmation.
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
                  required
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
                      <span className="text-blue-600 hover:text-blue-700 font-semibold">
                        Cliquez pour télécharger
                      </span>
                      <span className="text-gray-600"> ou glissez-déposez</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFichierJustificatif(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PDF, JPG ou PNG (max 10MB)
                    </p>
                  </div>
                  {fichierJustificatif && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-900 font-medium">
                            {fichierJustificatif.name}
                          </span>
                        </div>
                        <button
                          onClick={() => setFichierJustificatif(null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Documents acceptés : lettre de licenciement, lettre de démission, certificat de travail, attestation de fin de contrat, acte de décès, etc.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Que se passe-t-il ensuite ?
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                      <li>Votre demande sera envoyée à la CNSS avec les justificatifs</li>
                      <li>Un agent CNSS examinera votre dossier sous 3 à 5 jours ouvrables</li>
                      <li>Vous recevrez une notification par email de la décision</li>
                      <li>Si validée, le travailleur sera désactivé et n'apparaîtra plus dans vos déclarations futures</li>
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
                  // Ici on simule l'envoi
                  alert(`Demande de désactivation envoyée pour ${travailleurADesactiver.prenom} ${travailleurADesactiver.nom}. Vous recevrez une notification une fois la demande traitée par la CNSS.`);
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
