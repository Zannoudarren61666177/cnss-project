import { ArrowLeft, Bell, FileText, AlertCircle, CheckCircle, Info, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useUser } from '../hooks/useUser';
import { CNSSLogo } from './CNSSLogo';
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, downloadTravailleurAttestation } from '../api';

interface Notification {
  id: number;
  type: 'declaration' | 'paiement' | 'info' | 'success';
  titre: string;
  message: string;
  date: string;
  lue: boolean;
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<'toutes' | 'non-lues'>('toutes');
  const [notificationsList, setNotificationsList] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getNotifications();
        if (mounted) {
          // Map backend notification shape to frontend UI model
          const mapped = (data as any[]).map(n => {
            let parsed: any = null;
            try {
              parsed = n.content && n.content.startsWith('{') ? JSON.parse(n.content) : null;
            } catch { /* ignore */ }

            const typeTitles: Record<string, string> = {
              immatriculation_request: 'Nouvelle demande d\'immatriculation',
              declaration_travailleur: 'Nouvelle déclaration travailleur',
              travailleur_valide: 'Travailleur immatriculé',
              travailleur_rejete: 'Déclaration travailleur rejetée',
            };

            return {
              id: n.id,
              type: n.type || 'info',
              titre: typeTitles[n.type] || 'Notification',
              message: parsed?.message ?? n.content ?? '',
              travailleurId: parsed?.travailleur_id ?? null,
              numeroCnss: parsed?.numero_cnss ?? null,
              date: n.created_at ? new Date(n.created_at).toLocaleString('fr-FR') : '',
              lue: !!n.read_at,
              raw: n,
            };
          });
          setNotificationsList(mapped);
        }
      } catch (err) {
        console.error('Erreur chargement notifications', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredNotifications = filter === 'non-lues'
    ? notificationsList.filter(n => !n.lue)
    : notificationsList;

  const marquerCommeLue = async (id: number) => {
    try {
      const updated = await markNotificationRead(id);
      setNotificationsList(prev => prev.map(n => n.id === id ? ({ ...n, lue: true, raw: updated }) : n));
    } catch (err) {
      console.error(err);
    }
  };

  const marquerToutesCommeLues = async () => {
    try {
      await markAllNotificationsRead();
      setNotificationsList(prev => prev.map(n => ({ ...n, lue: true, raw: { ...(n.raw || {}), read_at: new Date().toISOString() } })));
    } catch (err) {
      console.error(err);
    }
  };

  const supprimerNotification = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotificationsList(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'declaration':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'paiement':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-orange-600" />;
      case 'travailleur_valide':
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'travailleur_rejete':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'declaration_travailleur':
        return <FileText className="w-6 h-6 text-blue-600" />;
      default:
        return <Bell className="w-6 h-6 text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'declaration':
        return 'bg-blue-100';
      case 'paiement':
        return 'bg-green-100';
      case 'info':
        return 'bg-orange-100';
      case 'success':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const { user } = useUser();
  const dashboardRoute = user
    ? (user.role === 'admin' ? '/admin'
      : user.role === 'agent' ? '/agent/immatriculation'
        : user.role === 'travailleur' ? '/travailleur/tableau-de-bord' : '/employeur/tableau-de-bord')
    : '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={dashboardRoute}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour au tableau de bord
            </Link>
          </div>
          <CNSSLogo size="medium" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                {notificationsList.filter(n => !n.lue).length} notification(s) non lue(s)
              </p>
            </div>
            <button
              onClick={marquerToutesCommeLues}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold"
            >
              Tout marquer comme lu
            </button>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex gap-3">
              <button
                onClick={() => setFilter('toutes')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'toutes'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes ({notificationsList.length})
              </button>
              <button
                onClick={() => setFilter('non-lues')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'non-lues'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Non lues ({notificationsList.filter(n => !n.lue).length})
              </button>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Aucune notification</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-all ${
                    !notification.lue ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 ${getBgColor(notification.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{notification.titre}</h3>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          {notification.numeroCnss && (
                            <p className="text-sm font-mono font-semibold text-blue-700 mt-1">N° CNSS : {notification.numeroCnss}</p>
                          )}
                        </div>
                        {!notification.lue && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-gray-500">{notification.date}</p>
                        <div className="flex gap-2">
                          {notification.type === 'travailleur_valide' && notification.travailleurId && (
                            <button
                              onClick={() => downloadTravailleurAttestation(notification.travailleurId)}
                              className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              Télécharger l'attestation
                            </button>
                          )}
                          {!notification.lue && (
                            <button
                              onClick={() => marquerCommeLue(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                            >
                              Marquer comme lu
                            </button>
                          )}
                          <button
                            onClick={() => supprimerNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
