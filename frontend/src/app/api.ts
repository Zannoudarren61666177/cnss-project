const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1';

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('cnss_token');

  const defaultHeaders: Record<string, string> = {};
  if (options.body && !(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Erreur API');
  }

  return data;
}

// ─── Utilisateur stocké localement ────────────────────────────────────────────
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
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  user: Record<string, unknown>;
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getUser(): Promise<Record<string, unknown>> {
  return apiFetch('/auth/user');
}

export async function logout(): Promise<void> {
  return apiFetch('/auth/logout', { method: 'POST' });
}

export async function activerCompteEmployeur(numeroCnss: string, email: string, password: string): Promise<any> {
  return apiFetch('/employeurs/activer-compte', {
    method: 'POST',
    body: JSON.stringify({ numero_cnss: numeroCnss, email, password }),
  });
}

// ─── Slides & Actualités (public) ────────────────────────────────────────────
export async function getSlides(): Promise<any[]> {
  return apiFetch('/slides');
}

export async function getActualites(): Promise<any[]> {
  return apiFetch('/actualites');
}

export async function getPrestationsPubliques(): Promise<any[]> {
  return apiFetch('/prestations/publiques');
}

// ─── Employeurs ───────────────────────────────────────────────────────────────
export async function getEmployeurs(): Promise<any[]> {
  return apiFetch('/employeurs');
}

export async function validerEmployeur(id: number): Promise<any> {
  return apiFetch(`/employeurs/${id}/valider`, { method: 'POST' });
}

export async function rejeterEmployeur(id: number): Promise<any> {
  return apiFetch(`/employeurs/${id}/rejeter`, { method: 'POST' });
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
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value);
    }
  });
  if (file) {
    formData.append('piece_identite', file);
  }

  return apiFetch('/travailleurs', {
    method: 'POST',
    body: formData,
  });
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
  return apiFetch(`/agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ type: role }),
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function getNotifications(): Promise<any[]> {
  return apiFetch('/notifications');
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export async function getFaqs(): Promise<any[]> {
  return apiFetch('/faqs');
}

export async function createFaq(data: any): Promise<any> {
  return apiFetch('/faqs', { method: 'POST', body: JSON.stringify(data) });
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
  return apiFetch('/chatbot', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function getCotisationsParEmployeur(employeurId: number): Promise<any[]> {
  return apiFetch(`/cotisations/par-employeur/${employeurId}`);
}