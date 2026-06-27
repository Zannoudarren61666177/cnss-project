import React from 'react';
import AgentLayout from './agent/shared/AgentLayout';
import {
  AgentImmatriculation,
  AgentEmployeur,
  AgentCotisation,
  AgentPrestations,
  AgentSupport,
  AdminDashboard,
} from './agent';

type RoleId =
  | 'immatriculation'
  | 'employeur'
  | 'cotisation'
  | 'prestations'
  | 'support'
  | 'admin';

interface AgentDashboardProps {
  role: RoleId;
  userName?: string;
}

export function AgentDashboard({ role, userName = 'Agent CNSS' }: AgentDashboardProps) {
  const roleMap: Record<RoleId, React.ComponentType<any>> = {
    immatriculation: AgentImmatriculation,
    employeur: AgentEmployeur,
    cotisation: AgentCotisation,
    prestations: AgentPrestations,
    support: AgentSupport,
    admin: AdminDashboard,
  };

  const Component = roleMap[role] ?? AgentImmatriculation;

  return (
    <AgentLayout role={role} userName={userName}>
      <Component />
    </AgentLayout>
  );
}

function getConnectedUserName(): string {
  try {
    // reuse existing helper if available
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getStoredUser } = require('../api') as any;
    const user = typeof getStoredUser === 'function' ? getStoredUser() : null;
    return (user?.name as string) ?? 'Agent CNSS';
  } catch (e) {
    return 'Agent CNSS';
  }
}

export function AgentImmatriculationDashboard() {
  return <AgentDashboard role="immatriculation" userName={getConnectedUserName()} />;
}

export function AgentEmployeurDashboard() {
  return <AgentDashboard role="employeur" userName={getConnectedUserName()} />;
}

export function AgentCotisationDashboard() {
  return <AgentDashboard role="cotisation" userName={getConnectedUserName()} />;
}

export function AgentPrestationsDashboard() {
  return <AgentDashboard role="prestations" userName={getConnectedUserName()} />;
}

export function AgentSupportDashboard() {
  return <AgentDashboard role="support" userName={getConnectedUserName()} />;
}

export function AdminDashboardPage() {
  return <AgentDashboard role="admin" userName={getConnectedUserName()} />;
}

export default AgentDashboard;
