import { AgentLayout } from './agent/shared/AgentLayout';
import { type RoleId } from './agent/shared/roles';
import { AgentImmatriculation } from './agent/AgentImmatriculation';
import { AgentCotisation } from './agent/AgentCotisation';
import { AgentPrestations } from './agent/AgentPrestations';
import { AgentSupport } from './agent/AgentSupport';
import { AdminDashboard } from './agent/AdminDashboard';
import { useUser } from '../hooks/useUser';

interface AgentDashboardProps {
  role: RoleId;
  userName?: string;
}

export function AgentDashboard({ role: userRole, userName = 'Agent CNSS' }: AgentDashboardProps) {
  return (
    <AgentLayout role={userRole} userName={userName}>
      {userRole === 'immatriculation' && <AgentImmatriculation />}
      {userRole === 'cotisation'      && <AgentCotisation />}
      {userRole === 'prestations'     && <AgentPrestations />}
      {userRole === 'support'         && <AgentSupport />}
      {userRole === 'admin'           && <AdminDashboard />}
    </AgentLayout>
  );
}

// ─── Wrappers par profil ──────────────────────────────────────────────────────

function useAgentName(defaultName: string) {
  const { user, loading } = useUser();
  if (loading) return defaultName;
  if (!user) return defaultName;
  const profileName =
    (user as any)?.agent?.display_name ??
    (user as any)?.agent?.name ??
    (user as any)?.profile?.company_name ??
    (user as any)?.name;
  return profileName || defaultName;
}

export function AgentImmatriculationDashboard() {
  const name = useAgentName('Agent immatriculation');
  return <AgentDashboard role="immatriculation" userName={name} />;
}

export function AgentCotisationDashboard() {
  const name = useAgentName('Agent cotisation');
  return <AgentDashboard role="cotisation" userName={name} />;
}

export function AgentPrestationsDashboard() {
  const name = useAgentName('Agent prestations');
  return <AgentDashboard role="prestations" userName={name} />;
}

export function AgentSupportDashboard() {
  const name = useAgentName('Agent support');
  return <AgentDashboard role="support" userName={name} />;
}

export function AdminDashboardPage() {
  const name = useAgentName('Administrateur');
  return <AgentDashboard role="admin" userName={name} />;
}