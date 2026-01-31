const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

export interface Deal {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  accessLevel: 'public' | 'locked';
  partnerName: string;
  partnerUrl?: string;
  partnerLogoUrl?: string;
  eligibility: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  deal: Deal;
}

export interface ApiError {
  error: { code: string; message: string };
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' });
  } catch (e) {
    const msg =
      e instanceof TypeError && e.message === 'Failed to fetch'
        ? `Cannot reach the server. Is the backend running at ${API_BASE.replace(/\/api\/?$/, '')}?`
        : e instanceof Error
          ? e.message
          : 'Network error';
    throw new Error(msg);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data as ApiError;
    throw new Error(err?.error?.message || res.statusText || 'Request failed');
  }
  return data as T;
}

export const auth = {
  register: (email: string, password: string, name: string) =>
    api<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  login: (email: string, password: string) =>
    api<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => api<{ user: User }>('/auth/me'),
};

export const deals = {
  list: (params?: { search?: string; category?: string; accessLevel?: string }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set('search', params.search);
    if (params?.category) sp.set('category', params.category);
    if (params?.accessLevel) sp.set('accessLevel', params.accessLevel);
    const q = sp.toString();
    return api<{ deals: Deal[]; total: number }>(`/deals${q ? `?${q}` : ''}`);
  },
  get: (slugOrId: string) => api<Deal>(`/deals/${slugOrId}`),
};

export const claims = {
  list: () => api<{ claims: Claim[] }>('/me/claims'),
  create: (dealId: string) =>
    api<{ claim: { id: string; status: string; dealId: string; userId: string; createdAt: string } }>(
      `/deals/${dealId}/claim`,
      { method: 'POST' }
    ),
};
