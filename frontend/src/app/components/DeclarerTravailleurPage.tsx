import { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, FileText, Upload, Send, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '../hooks/useUser';
import { CNSSLogo } from './CNSSLogo';
import { CnssSuccessModal } from './CnssSuccessModal';
import { createTravailleur } from '../api';

export function DeclarerTravailleurPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const dashboardRoute = user
    ? (user.role === 'admin' ? '/admin'
      : user.role === 'agent' ? '/agent/immatriculation'
      : '/employeur/tableau-de-bord')
    : '/';
  const employeurId = user?.profile?.id ?? user?.employeur?.id;

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    dateNaissance: '',
    lieuNaissance: '',
    sexe: 'M',
    nationalite: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    poste: '',
    typeContrat: 'CDI',
    dateEmbauche: '',
    salaireBrut: '',
    categorieEmploye: 'Cadre',
  });
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdentityFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!employeurId) {
      setError('Impossible d\'identifier votre entreprise. Reconnectez-vous.');
      return;
    }

    setLoading(true);
    try {
      await createTravailleur(
        {
          employeur_id: employeurId,
          first_name: formData.prenom,
          last_name: formData.nom,
          cin: formData.cin,
          email: formData.email,
          phone: formData.telephone,
          adresse: formData.adresse,
          ville: formData.ville,
          position: formData.poste,
          date_naissance: formData.dateNaissance,
          lieu_naissance: formData.lieuNaissance,
          sexe: formData.sexe,
          nationalite: formData.nationalite,
          type_contrat: formData.typeContrat,
          date_embauche: formData.dateEmbauche,
          salaire_brut: formData.salaireBrut,
          categorie_emploi: formData.categorieEmploye,
        },
        identityFile
      );

      setSubmittedName(`${formData.prenom} ${formData.nom}`);
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de la déclaration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <CnssSuccessModal
        open={showSuccessModal}
        title="Déclaration envoyée"
        message={`Les informations de ${submittedName} ont bien été transmises aux agents de la CNSS pour immatriculation. Vous serez notifié dès que la demande sera traitée.`}
        actionLabel="Retour au tableau de bord"
        onClose={() => navigate(dashboardRoute)}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={dashboardRoute}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-8">
            <CNSSLogo size="large" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Déclarer un nouveau travailleur
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Remplissez ce formulaire pour déclarer un nouveau travailleur à la CNSS
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informations personnelles
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom du travailleur" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom du travailleur" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">N° CIN / NPI</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="cin" value={formData.cin} onChange={handleChange} placeholder="Numéro d'identification" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" name="lieuNaissance" value={formData.lieuNaissance} onChange={handleChange} placeholder="Lieu de naissance" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
                    <select name="sexe" value={formData.sexe} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationalité</label>
                    <input type="text" name="nationalite" value={formData.nationalite} onChange={handleChange} placeholder="Nationalité" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pièce d'identité</label>
                  <div className="relative">
                    <input type="file" id="identity-file" onChange={handleFileChange} accept="image/*,.pdf" className="hidden" required />
                    <label htmlFor="identity-file" className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{identityFile ? identityFile.name : 'Télécharger la pièce d\'identité'}</span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Formats acceptés : JPG, PNG, PDF (max 5 MB)</p>
                </div>
              </div>
            </div>

            {/* Coordonnées */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Coordonnées
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@exemple.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+229 XX XX XX XX" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse complète" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <input type="text" name="ville" value={formData.ville} onChange={handleChange} placeholder="Ville de résidence" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Informations professionnelles
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poste occupé</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="poste" value={formData.poste} onChange={handleChange} placeholder="Intitulé du poste" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat</label>
                    <select name="typeContrat" value={formData.typeContrat} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Apprentissage">Apprentissage</option>
                      <option value="Interim">Intérim</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="date" name="dateEmbauche" value={formData.dateEmbauche} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salaire brut mensuel (FCFA)</label>
                    <input type="number" name="salaireBrut" value={formData.salaireBrut} onChange={handleChange} placeholder="Montant du salaire" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <select name="categorieEmploye" value={formData.categorieEmploye} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                      <option value="Cadre">Cadre</option>
                      <option value="Agent de maitrise">Agent de maîtrise</option>
                      <option value="Employe">Employé</option>
                      <option value="Ouvrier">Ouvrier</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <input type="checkbox" className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mt-1" required />
              <span className="text-sm text-gray-700">
                Je certifie que les informations fournies sont exactes et complètes.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer la déclaration à la CNSS
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
