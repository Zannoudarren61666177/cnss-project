import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Bell, LogOut, Settings } from 'lucide-react';
import { CNSSLogo } from '../../CNSSLogo';
import { useUser } from '../../../hooks/useUser';
import { getNotifications } from '../../../api';
import { ROLES, type RoleId } from './roles';

interface AgentLayoutProps {
  role: RoleId;
  userName?: string;
  children: ReactNode;
}

export function AgentLayout({ role: userRole, userName = 'Agent CNSS', children }: AgentLayoutProps) {
  const role = ROLES.find(r => r.id === userRole)!;
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadUnread() {
    try {
      const notifs = await getNotifications();
      setUnreadCount((notifs as any[]).filter(n => !n.read_at).length);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadUnread();
  }, []);

  useEffect(() => {
    const onUserUpdated = () => loadUnread();
    window.addEventListener('cnss:user-updated', onUserUpdated);
    return () => window.removeEventListener('cnss:user-updated', onUserUpdated);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <CNSSLogo size="medium" />
            <div>
              <p className="font-bold text-gray-900 text-sm">CNSS Bénin</p>
              <p className="text-xs text-gray-500">
                {user ? `${user.name} · ${user.email}` : 'Espace Agent'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-2 rounded-lg text-xs font-semibold ${role.color}`}>
            {role.badge}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Mon espace</p>
          <p className="text-sm text-gray-600 px-4 py-3">
            Vous êtes connecté en tant que <span className="font-semibold">{role.label}</span>
          </p>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          <Link
            to="/agent/parametres"
            className="w-full inline-flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Paramètres</span>
          </Link>
          <Link
            to="/agent/notifications"
            className="w-full inline-flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium text-sm">Notifications</span>
            <span className="ml-auto min-w-[1.25rem] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          </Link>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Déconnexion</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{userName}</h1>
            <p className="text-xs text-gray-500">{role.label} · CNSS Siège Cotonou</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold ${role.color}`}>
              {role.badge}
            </span>
            <button
              onClick={() => { window.location.href = '/agent/notifications'; }}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}