import { useAuthStore } from '../lib/model/AuthStore';

const API_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://85.239.49.208:8080/api/v1/';

let refreshPromise: Promise<string | null> | null = null;

type RefreshResponse = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
};

const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const response = await fetch(`${API_URL}auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const json: RefreshResponse = await response.json();

    if (!json?.data?.accessToken || !json?.data?.refreshToken) {
      clearTokens();
      return null;
    }

    setTokens(json.data.accessToken, json.data.refreshToken);
    return json.data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
};

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const { accessToken, clearTokens } = useAuthStore.getState();

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      clearTokens();
      throw new Error('Unauthorized');
    }

    const retryHeaders = new Headers(options.headers || {});
    retryHeaders.set('Content-Type', 'application/json');
    retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);

    response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: retryHeaders,
    });
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return undefined as T;
}