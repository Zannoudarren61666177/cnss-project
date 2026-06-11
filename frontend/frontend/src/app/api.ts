const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1';

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('cnss_token');

  const defaultHeaders: Record<string, string> = {};
  // Only set content-type when body is present and not a FormData
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

export async function getUser(token: string): Promise<Record<string, unknown>> {
  return apiFetch('/auth/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getEmployeurs(): Promise<any[]> {
  return apiFetch('/employeurs');
}

export async function getTravailleurs(): Promise<any[]> {
  return apiFetch('/travailleurs');
}

export async function getPrestations(): Promise<any[]> {
  return apiFetch('/prestations');
}

export async function getCotisations(): Promise<any[]> {
  return apiFetch('/cotisations');
}

export async function getNotifications(): Promise<any[]> {
  return apiFetch('/notifications');
}

export async function getAgents(): Promise<any[]> {
  return apiFetch('/agents');
}

export async function createTravailleur(data: any): Promise<any> {
  return apiFetch('/travailleurs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function getSlides(): Promise<any[]> {
  return apiFetch('/slides');
}

export async function getActualites(): Promise<any[]> {
  return apiFetch('/actualites');
}

export async function getPrestationsPubliques(): Promise<any[]> {
  return apiFetch('/prestations/publiques');
}