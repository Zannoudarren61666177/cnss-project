import { useNavigate } from 'react-router';
import { getStoredUser, clearAuth } from '../api';
import { AgentLayout } from './agent/shared/AgentLayout';
import { AgentImmatriculation } from './agent/AgentImmatriculation';
import { AgentEmployeur } from './agent/AgentEmployeur';
import { AgentCotisation } from './agent/AgentCotisation';
import { AgentPrestations } from './agent/AgentPrestations';
import { AgentSupport } from './agent/AgentSupport';
import { AdminDashboard } from './agent/AdminDashboard';

type RoleId = 'immatriculation' | 'employeur' | 'cotisation' | 'prestations' | 'support' | 'admin';

interface AgentDashboardProps {
  role: RoleId;
}

export function AgentDashboard({ role: userRole }: AgentDashboardProps) {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const userName = (storedUser?.name as string) ?? 'Agent CNSS';

  const handleLogout = () => {
    clearAuth();
    navigate('/connexion');
  };

  const content = () => {
    switch (userRole) {
      case 'immatriculation': return <AgentImmatriculation />;
      case 'employeur':       return <AgentEmployeur />;
      case 'cotisation':      return <AgentCotisation />;
      case 'prestations':     return <AgentPrestations />;
      case 'support':         return <AgentSupport />;
      case 'admin':           return <AdminDashboard />;
      default:                return null;
    }
  };

  return (
    <AgentLayout role={userRole} userName={userName} onLogout={handleLogout}>
      {content()}
    </AgentLayout>
  );
}

// ─── Wrappers par profil ──────────────────────────────────────────────────────
export function AgentImmatriculationDashboard() {
  return <AgentDashboard role="immatriculation" />;
}

export function AgentEmployeurDashboard() {
  return <AgentDashboard role="employeur" />;
}

export function AgentCotisationDashboard() {
  return <AgentDashboard role="cotisation" />;
}

export function AgentPrestationsDashboard() {
  return <AgentDashboard role="prestations" />;
}

export function AgentSupportDashboard() {
  return <AgentDashboard role="support" />;
}

export function AdminDashboardPage() {
  return <AgentDashboard role="admin" />;
}