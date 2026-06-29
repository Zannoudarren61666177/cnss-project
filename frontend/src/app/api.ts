const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1';

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('cnss_token');
  const defaultHeaders: Record<string, string> = {};
  defaultHeaders['Accept'] = 'application/json';
  if (options.body && !(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { ...defaultHeaders, ...(options.headers as Record<string, string>) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Erreur API');
  return data;
}

// ─── Image URL helper ─────────────────────────────────────────────────────────
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1')
    .replace(/\/api\/v1\/?$/i, '');
  return `${base}${path}`;
}

// ─── Utilisateur stocké localement ───────────────────────────────────────────
export function getStoredUser(): Record<string, any> | null {
  const raw = localStorage.getItem('cnss_user');
  return raw ? JSON.parse(raw) : null;
}
export function storeUser(user: Record<string, unknown>): void {
  localStorage.setItem('cnss_user', JSON.stringify(user));
}
export function clearAuth(): void {
  localStorage.removeItem('cnss_token');
  localStorage.removeItem('cnss_user');
  localStorage.removeItem('fedapay_cotisation_id');
  localStorage.removeItem('fedapay_transaction_id');
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  user: Record<string, unknown>;
  token: string;
}
export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}
export async function loginWithNumero(numeroCnss: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ numero_cnss: numeroCnss, password }) });
}
export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}
export async function registerWithCnss(numeroCnss: string, email: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ numero_cnss: numeroCnss, email, password }) });
}
export async function getUser(): Promise<Record<string, unknown>> {
  return apiFetch('/auth/user');
}
export async function logout(): Promise<void> {
  return apiFetch('/auth/logout', { method: 'POST' });
}
export async function changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<{ message: string }> {
  return apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, new_password_confirmation: newPasswordConfirmation }),
  });
}
export async function updateProfile(data: Record<string, unknown>): Promise<{ message: string; user: Record<string, unknown> }> {
  return apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
}
export async function updatePreferences(data: {
  email_notifications?: boolean;
  sms_notifications?: boolean;
  push_notifications?: boolean;
}): Promise<{ message: string; preferences: Record<string, boolean> }> {
  return apiFetch('/auth/preferences', { method: 'PUT', body: JSON.stringify(data) });
}
export async function activerCompteEmployeur(numeroCnss: string, email: string, password: string): Promise<any> {
  return apiFetch('/employeurs/activer-compte', { method: 'POST', body: JSON.stringify({ numero_cnss: numeroCnss, email, password }) });
}

// ─── Slides ───────────────────────────────────────────────────────────────────
export async function getSlides(): Promise<any[]> {
  return apiFetch('/slides');
}

// ─── Actualités ───────────────────────────────────────────────────────────────
export async function getActualites(): Promise<any[]> {
  return apiFetch('/actualites');
}
export async function getActualitesAdmin(): Promise<any[]> {
  return apiFetch('/actualites');
}
export async function createActualite(data: any): Promise<any> {
  return apiFetch('/actualites', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateActualite(id: number | string, data: any): Promise<any> {
  return apiFetch(`/actualites/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function deleteActualite(id: number | string): Promise<any> {
  return apiFetch(`/actualites/${id}`, { method: 'DELETE' });
}

// ─── Prestations publiques ────────────────────────────────────────────────────
export async function getPrestationsPubliques(): Promise<any[]> {
  return apiFetch('/prestations/publiques');
}
export async function submitDemandeAdhesion(formData: FormData): Promise<any> {
  return apiFetch('/employeurs/demander-adhesion', { method: 'POST', body: formData });
}

// ─── Employeurs ───────────────────────────────────────────────────────────────
export async function getEmployeurs(): Promise<any[]> {
  return apiFetch('/employeurs');
}
export async function getEmployeur(id: number | string): Promise<any> {
  return apiFetch(`/employeurs/${id}`);
}
export async function updateEmployeur(id: number | string, data: Record<string, any>): Promise<any> {
  return apiFetch(`/employeurs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function validerEmployeur(id: number): Promise<any> {
  return apiFetch(`/employeurs/${id}/valider`, { method: 'POST' });
}
export async function rejeterEmployeur(id: number, raison?: string): Promise<any> {
  const body = raison ? JSON.stringify({ raison }) : undefined;
  return apiFetch(`/employeurs/${id}/rejeter`, { method: 'POST', body });
}

// ─── Travailleurs ─────────────────────────────────────────────────────────────
export async function getTravailleurs(): Promise<any[]> {
  return apiFetch('/travailleurs');
}
export async function getTravailleursParEmployeur(employeurId: number): Promise<any[]> {
  return apiFetch(`/travailleurs/par-employeur/${employeurId}`);
}
export async function createTravailleur(data: Record<string, any>, file?: File | null): Promise<any> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') formData.append(key, String(value));
  });
  if (file) formData.append('piece_identite', file);
  return apiFetch('/travailleurs', { method: 'POST', body: formData });
}
export async function getTravailleursEnAttente(): Promise<any[]> {
  return apiFetch('/travailleurs/en-attente');
}
export async function validerTravailleur(id: number | string): Promise<any> {
  return apiFetch(`/travailleurs/${id}/valider`, { method: 'POST' });
}
export async function rejeterTravailleur(id: number | string, raison: string): Promise<any> {
  return apiFetch(`/travailleurs/${id}/rejeter`, { method: 'POST', body: JSON.stringify({ raison }) });
}
export async function renvoyerAttestationTravailleur(id: number | string): Promise<any> {
  return apiFetch(`/travailleurs/${id}/renvoyer-attestation`, { method: 'POST' });
}
export async function activerCompteTravailleur(numeroCnss: string, email: string, password: string): Promise<any> {
  return apiFetch('/travailleurs/activer-compte', { method: 'POST', body: JSON.stringify({ numero_cnss: numeroCnss, email, password }) });
}
export async function getTravailleurProfil(): Promise<{ travailleur: Record<string, any>; employeur: Record<string, any> | null }> {
  return apiFetch('/travailleur/profil');
}
export async function getTravailleurCotisations(): Promise<any[]> {
  return apiFetch('/travailleur/cotisations');
}
export async function getTravailleurDroits(): Promise<{
  mois_cotises: number;
  date_affiliation: string;
  droits: Array<{ nom: string; description: string; eligible: boolean; condition: string; mois_cotises: number; mois_requis: number }>;
}> {
  return apiFetch('/travailleur/droits');
}
export async function downloadMonAttestationTravailleur(): Promise<void> {
  const token = localStorage.getItem('cnss_token');
  const base = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1';
  const response = await fetch(`${base}/travailleur/attestation`, {
    headers: { Accept: 'application/pdf', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Erreur lors du téléchargement');
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'attestation-cnss-travailleur.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
export async function downloadTravailleurAttestation(id: number | string): Promise<void> {
  const token = localStorage.getItem('cnss_token');
  const base = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1';
  const response = await fetch(`${base}/travailleurs/${id}/attestation`, {
    headers: { Accept: 'application/pdf', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Erreur lors du téléchargement');
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attestation-travailleur-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// ─── Cotisations ──────────────────────────────────────────────────────────────
export async function getCotisations(): Promise<any[]> {
  return apiFetch('/cotisations');
}
export async function validerDeclaration(id: number): Promise<any> {
  return apiFetch(`/cotisations/${id}/valider`, { method: 'POST' });
}
export async function relancerCotisation(id: number): Promise<any> {
  return apiFetch(`/cotisations/${id}/relancer`, { method: 'POST' });
}
export async function initierPaiementCotisation(id: number): Promise<{ payment_url: string; transaction_id: number }> {
  return apiFetch(`/cotisations/${id}/initier-paiement`, { method: 'POST' });
}
export async function getCotisationsParEmployeur(employeurId: number): Promise<any[]> {
  return apiFetch(`/cotisations/par-employeur/${employeurId}`);
}

// ─── Prestations ─────────────────────────────────────────────────────────────
export async function getPrestations(): Promise<any[]> {
  return apiFetch('/prestations');
}
export async function validerPrestation(id: number): Promise<any> {
  return apiFetch(`/prestations/${id}/valider`, { method: 'POST' });
}
export async function rejeterPrestation(id: number): Promise<any> {
  return apiFetch(`/prestations/${id}/rejeter`, { method: 'POST' });
}

// ─── Agents ───────────────────────────────────────────────────────────────────
export async function getAgents(): Promise<any[]> {
  return apiFetch('/agents');
}
export async function updateAgentRole(id: number, role: string): Promise<any> {
  return apiFetch(`/agents/${id}`, { method: 'PUT', body: JSON.stringify({ type: role }) });
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function getNotifications(): Promise<any[]> {
  return apiFetch('/notifications');
}
export async function markNotificationRead(id: number | string): Promise<any> {
  return apiFetch(`/notifications/${id}/marquer-lue`, { method: 'POST' });
}
export async function markAllNotificationsRead(): Promise<any> {
  return apiFetch('/notifications/marquer-toutes-lues', { method: 'POST' });
}
export async function deleteNotification(id: number | string): Promise<any> {
  return apiFetch(`/notifications/${id}`, { method: 'DELETE' });
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export async function getFaqs(): Promise<any[]> {
  return apiFetch('/faqs');
}
export async function getFaq(id: number | string): Promise<any> {
  return apiFetch(`/faqs/${id}`);
}
export async function createFaq(data: any): Promise<any> {
  return apiFetch('/faqs', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateFaq(id: number | string, data: any): Promise<any> {
  return apiFetch(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function deleteFaq(id: number | string): Promise<any> {
  return apiFetch(`/faqs/${id}`, { method: 'DELETE' });
}

// ─── Activity logs ────────────────────────────────────────────────────────────
export async function getActivityLogs(): Promise<any[]> {
  return apiFetch('/activity-logs');
}

// ─── Stats admin ──────────────────────────────────────────────────────────────
export async function getStatsAdmin(): Promise<any> {
  return apiFetch('/stats');
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────
export async function askChatbot(message: string): Promise<{ reponse: string; source?: string; trouve: boolean }> {
  return apiFetch('/chatbot', { method: 'POST', body: JSON.stringify({ message }) });
}

// ─── Recherche intelligente ───────────────────────────────────────────────────
export async function searchIntelligente(query: string): Promise<any[]> {
  try {
    return await apiFetch(`/recherche?q=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error('Erreur recherche:', error);
    return [];
  }
}

// ─── FedaPay ──────────────────────────────────────────────────────────────────
export async function verifierPaiementFedaPay(
  cotisationId: number | string,
  transactionId: string
): Promise<{ statut: string; message: string }> {
  return apiFetch(`/cotisations/${cotisationId}/verifier-paiement`, {
    method: 'POST',
    body: JSON.stringify({ transaction_id: transactionId }),
  });
}

export { apiFetch };