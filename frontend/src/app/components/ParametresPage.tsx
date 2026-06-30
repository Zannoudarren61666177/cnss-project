import { ArrowLeft, User, Lock, Bell, Globe, Mail, Phone, Building, CreditCard, Download, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useUser } from '../hooks/useUser';
import { updateProfile, updatePreferences, getUser, storeUser } from '../api';
import { CNSSLogo } from './CNSSLogo';
import { changePassword } from '../api';

async function refreshStoredUser(refetch?: () => Promise<void>) {
  const fresh = await getUser();
  storeUser(fresh as Record<string, unknown>);
  window.dispatchEvent(new Event('cnss:user-updated'));
  if (refetch) await refetch();
}

export function ParametresPage() {
  const [activeSection, setActiveSection] = useState<'profil' | 'securite' | 'notifications' | 'entreprise'>('profil');
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ifu: '',
    registreCommerce: '',
    secteurActivite: '',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profilLoading, setProfilLoading] = useState(false);
  const [profilError, setProfilError] = useState<string | null>(null);
  const [profilSuccess, setProfilSuccess] = useState(false);
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [prefsError, setPrefsError] = useState<string | null>(null);
  const [prefsSuccess, setPrefsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // Load user/employeur data
  const { user, refetch } = useUser();

  // Initialize form values from user profile when available
  useEffect(() => {
    if (!user) return;
    const profile = user.profile as Record<string, unknown> | undefined;
    const prefs = (user.preferences ?? {}) as Record<string, boolean>;

    if (user.role === 'travailleur' && profile) {
      setFormData(prev => ({
        ...prev,
        nom: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
        email: (profile.email as string) ?? user.email ?? prev.email,
        telephone: (profile.phone as string) ?? prev.telephone,
        adresse: (profile.adresse as string) ?? (profile.ville as string) ?? prev.adresse,
        emailNotifications: prefs.email_notifications ?? prev.emailNotifications,
        smsNotifications: prefs.sms_notifications ?? prev.smsNotifications,
        pushNotifications: prefs.push_notifications ?? prev.pushNotifications,
      }));
    } else if (user.role === 'agent' || user.role === 'admin') {
      setFormData(prev => ({
        ...prev,
        email: (profile?.email as string) ?? user.email ?? prev.email,
        telephone: (profile?.phone as string) ?? prev.telephone,
        emailNotifications: prefs.email_notifications ?? prev.emailNotifications,
        smsNotifications: prefs.sms_notifications ?? prev.smsNotifications,
        pushNotifications: prefs.push_notifications ?? prev.pushNotifications,
      }));
    } else if (profile) {
      setFormData(prev => ({
        ...prev,
        nom: (profile.company_name as string) ?? prev.nom,
        ifu: (profile.ifu as string) ?? prev.ifu,
        email: (profile.email as string) ?? user.email ?? prev.email,
        telephone: (profile.phone as string) ?? prev.telephone,
        adresse: (profile.address as string) ?? prev.adresse,
        secteurActivite: (profile.secteur as string) ?? prev.secteurActivite,
        emailNotifications: prefs.email_notifications ?? prev.emailNotifications,
        smsNotifications: prefs.sms_notifications ?? prev.smsNotifications,
        pushNotifications: prefs.push_notifications ?? prev.pushNotifications,
      }));
    }
  }, [user]);

  const handleSaveProfil = async () => {
    if (!user) return;
    setProfilLoading(true);
    setProfilError(null);
    setProfilSuccess(false);

    try {
      let payload: Record<string, unknown> = {
        email: formData.email,
        phone: formData.telephone,
      };

      if (user.role === 'employeur') {
        payload.address = formData.adresse;
      } else if (user.role === 'travailleur') {
        payload.adresse = formData.adresse;
      }

      const res = await updateProfile(payload);
      storeUser(res.user as Record<string, unknown>);
      window.dispatchEvent(new Event('cnss:user-updated'));
      if (refetch) await refetch();
      setProfilSuccess(true);
      setTimeout(() => setProfilSuccess(false), 5000);
    } catch (err: unknown) {
      setProfilError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setProfilLoading(false);
    }
  };

  const handleSaveEntreprise = async () => {
    if (!user || user.role !== 'employeur') return;
    setProfilLoading(true);
    setProfilError(null);
    setProfilSuccess(false);

    try {
      const res = await updateProfile({ company_name: formData.nom });
      storeUser(res.user as Record<string, unknown>);
      window.dispatchEvent(new Event('cnss:user-updated'));
      if (refetch) await refetch();
      setProfilSuccess(true);
      setTimeout(() => setProfilSuccess(false), 5000);
    } catch (err: unknown) {
      setProfilError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setProfilLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setPrefsLoading(true);
    setPrefsError(null);
    setPrefsSuccess(false);

    try {
      await updatePreferences({
        email_notifications: formData.emailNotifications,
        sms_notifications: formData.smsNotifications,
        push_notifications: formData.pushNotifications,
      });
      await refreshStoredUser(refetch);
      setPrefsSuccess(true);
      setTimeout(() => setPrefsSuccess(false), 5000);
    } catch (err: unknown) {
      setPrefsError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement');
    } finally {
      setPrefsLoading(false);
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(formData.currentPassword, formData.newPassword, formData.confirmPassword);
      setPasswordSuccess(true);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      await refreshStoredUser(refetch);
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe');
    } finally {
      setPasswordLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profil':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations du profil</h2>
              <p className="text-gray-600">
                {user?.role === 'travailleur'
                  ? 'Gérez les informations de votre compte travailleur'
                  : user?.role === 'agent' || user?.role === 'admin'
                    ? 'Gérez les informations de votre compte agent CNSS'
                    : 'Gérez les informations de votre compte employeur'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-4">
                {(user?.role === 'travailleur') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Modifiable uniquement via votre employeur ou la CNSS</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {profilError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{profilError}</p>
                </div>
              )}

              {profilSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">Profil mis à jour avec succès</p>
                </div>
              )}

              <button
                onClick={handleSaveProfil}
                disabled={profilLoading}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {profilLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'securite':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sécurité</h2>
              <p className="text-gray-600">Gérez la sécurité de votre compte</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Modifier le mot de passe</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {passwordError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">Mot de passe modifié avec succès</p>
                </div>
              )}

              <button 
                onClick={handleSubmitPassword}
                disabled={passwordLoading}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {passwordLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Modification en cours...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Modifier le mot de passe
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Authentification à deux facteurs</h3>
              <p className="text-gray-600 mb-4">
                Renforcez la sécurité de votre compte en activant l'authentification à deux facteurs (2FA).
              </p>
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                Activer la 2FA
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
              <p className="text-gray-600">Gérez vos préférences de notifications</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Préférences de notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Notifications par email</p>
                      <p className="text-sm text-gray-600">Recevez des alertes par email</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Notifications SMS</p>
                      <p className="text-sm text-gray-600">Recevez des alertes par SMS</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Notifications push</p>
                      <p className="text-sm text-gray-600">Recevez des notifications sur votre navigateur</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              {prefsError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{prefsError}</p>
                </div>
              )}

              {prefsSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">Préférences enregistrées avec succès</p>
                </div>
              )}

              <button
                onClick={handleSavePreferences}
                disabled={prefsLoading}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {prefsLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les préférences
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'entreprise':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations de l'entreprise</h2>
              <p className="text-gray-600">Détails de votre entreprise enregistrée à la CNSS</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informations légales</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFU (Identifiant Fiscal Unique)
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="ifu"
                      value={formData.ifu}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Ce champ ne peut pas être modifié</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registre de commerce
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="registreCommerce"
                      value={formData.registreCommerce}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Ce champ ne peut pas être modifié</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur d'activité
                  </label>
                  <select
                    name="secteurActivite"
                    value={formData.secteurActivite}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    disabled
                  >
                    <option>Commerce</option>
                    <option>Agriculture</option>
                    <option>Industrie</option>
                    <option>Services</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Ce champ ne peut pas être modifié</p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Pour modifier les informations légales de votre entreprise (IFU, Registre de commerce, Secteur d'activité), veuillez contacter le service client de la CNSS ou vous rendre dans une agence CNSS.
                </p>
              </div>

              <button
                onClick={handleSaveEntreprise}
                disabled={profilLoading}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {profilLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Documents officiels</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Attestation d'immatriculation CNSS</p>
                      <p className="text-sm text-gray-600">Délivrée le 03/05/2026</p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-600 font-semibold">Télécharger</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Certificat de conformité CNSS</p>
                      <p className="text-sm text-gray-600">Valide jusqu'au 31/12/2026</p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-600 font-semibold">Télécharger</span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {(() => {
              const dashboardRoute = user
                ? (user.role === 'admin' ? '/admin'
                  : user.role === 'agent' ? '/agent/immatriculation'
                  : user.role === 'travailleur' ? '/travailleur/tableau-de-bord' : '/employeur/tableau-de-bord')
                : '/';
              return (
                <Link
                  to={dashboardRoute}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Retour au tableau de bord
                </Link>
              );
            })()}
          </div>
          <CNSSLogo size="medium" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex gap-8">
          {/* Sidebar de navigation */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('profil')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'profil' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profil</span>
                </button>
                <button
                  onClick={() => setActiveSection('securite')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'securite' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Sécurité</span>
                </button>
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                </button>
                {user && user.role === 'employeur' && (
                  <button
                    onClick={() => setActiveSection('entreprise')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === 'entreprise' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span className="font-medium">Entreprise</span>
                  </button>
                )}
              </nav>
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
