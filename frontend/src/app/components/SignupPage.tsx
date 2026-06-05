import { Send, Mail, ArrowLeft, User, Phone, MapPin, FileText, Upload, Building2, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CNSSLogo } from './CNSSLogo';

export function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    npi: '',
    email: '',
    telephone: '',
    adresse: '',
    ifu: '',
    registreCommerce: '',
    nomEntreprise: '',
    secteurActivite: '',
    activitesSecondaires: '',
    adresseEntreprise: '',
    telephoneEntreprise: '',
  });
  const [identityFile, setIdentityFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demande adhésion:', formData, 'Identity file:', identityFile);
    alert('Votre demande d\'adhésion a été soumise avec succès ! Vous recevrez votre numéro d\'immatriculation par email après validation.');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-500 hover:gap-3 mb-8 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-8">
            <CNSSLogo size="large" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Formulaire d'adhésion
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Inscrivez votre entreprise à la CNSS
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de l'entreprise */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Informations de l'entreprise
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="nomEntreprise"
                      value={formData.nomEntreprise}
                      onChange={handleChange}
                      placeholder="Nom de votre entreprise"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFU (Identifiant Fiscal Unique)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="ifu"
                      value={formData.ifu}
                      onChange={handleChange}
                      placeholder="Numéro IFU de l'entreprise"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registre de commerce
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="registreCommerce"
                      value={formData.registreCommerce}
                      onChange={handleChange}
                      placeholder="Numéro du registre de commerce"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activité principale
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="secteurActivite"
                      value={formData.secteurActivite}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      required
                    >
                      <option value="">Sélectionnez une activité</option>
                      <option value="Agriculture, sylviculture et pêche">Agriculture, sylviculture et pêche</option>
                      <option value="Industries extractives">Industries extractives</option>
                      <option value="Industries manufacturières">Industries manufacturières</option>
                      <option value="Production et distribution d'électricité, de gaz">Production et distribution d'électricité, de gaz</option>
                      <option value="Production et distribution d'eau">Production et distribution d'eau</option>
                      <option value="Construction">Construction</option>
                      <option value="Commerce de gros et de détail">Commerce de gros et de détail</option>
                      <option value="Transport et entreposage">Transport et entreposage</option>
                      <option value="Hébergement et restauration">Hébergement et restauration</option>
                      <option value="Information et communication">Information et communication</option>
                      <option value="Activités financières et d'assurance">Activités financières et d'assurance</option>
                      <option value="Activités immobilières">Activités immobilières</option>
                      <option value="Activités spécialisées, scientifiques et techniques">Activités spécialisées, scientifiques et techniques</option>
                      <option value="Activités de services administratifs et de soutien">Activités de services administratifs et de soutien</option>
                      <option value="Administration publique">Administration publique</option>
                      <option value="Enseignement">Enseignement</option>
                      <option value="Santé humaine et action sociale">Santé humaine et action sociale</option>
                      <option value="Arts, spectacles et activités récréatives">Arts, spectacles et activités récréatives</option>
                      <option value="Autres activités de services">Autres activités de services</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activités secondaires <span className="text-gray-500 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    name="activitesSecondaires"
                    value={formData.activitesSecondaires}
                    onChange={handleChange}
                    placeholder="Listez vos activités secondaires, séparées par des virgules"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Ex: Vente de produits dérivés, Services de maintenance, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse de l'entreprise
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="adresseEntreprise"
                      value={formData.adresseEntreprise}
                      onChange={handleChange}
                      placeholder="Adresse complète de l'entreprise"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone de l'entreprise
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="telephoneEntreprise"
                      value={formData.telephoneEntreprise}
                      onChange={handleChange}
                      placeholder="+229 XX XX XX XX"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informations du représentant */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informations du représentant légal
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Votre prénom"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NPI (Numéro Personnel d'Identification)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="npi"
                      value={formData.npi}
                      onChange={handleChange}
                      placeholder="Numéro NPI du représentant légal"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre.email@exemple.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+229 XX XX XX XX"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse personnelle
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Votre adresse personnelle"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pièce d'identité
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="identity-file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="identity-file"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">
                        {identityFile ? identityFile.name : 'Télécharger votre pièce d\'identité'}
                      </span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Formats acceptés : JPG, PNG, PDF (max 5 MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mt-1"
                required
              />
              <span className="text-sm text-gray-600">
                J'accepte les{' '}
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  conditions d'utilisation
                </a>
                {' '}et la{' '}
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  politique de confidentialité
                </a>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-lg hover:scale-105 active:scale-95 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Soumettre ma demande d'adhésion
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm mb-3">
              Vous avez déjà un numéro d'immatriculation ?
            </p>
            <Link
              to="/creer-compte"
              className="inline-block w-full py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-105 active:scale-95 font-semibold transition-all duration-200"
            >
              Activer mon compte en ligne
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          En soumettant ce formulaire, vous acceptez nos{' '}
          <a href="#" className="text-blue-500 hover:text-blue-600">
            conditions d'utilisation
          </a>
          {' '}et notre{' '}
          <a href="#" className="text-blue-500 hover:text-blue-600">
            politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
}
