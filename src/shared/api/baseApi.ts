import { useAuthStore } from '../lib/model/AuthStore';

const RAW_API_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://85.239.49.208:8080/api/v1/';

const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL : `${RAW_API_URL}/`;
const TOKEN_REFRESH_INTERVAL_MS = 15 * 60 * 1000;

let refreshPromise: Promise<string | null> | null = null;
let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

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
    stopTokenAutoRefresh();
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
      stopTokenAutoRefresh();
      return null;
    }

    const json: RefreshResponse = await response.json();

    if (!json?.data?.accessToken || !json?.data?.refreshToken) {
      clearTokens();
      stopTokenAutoRefresh();
      return null;
    }

    setTokens(json.data.accessToken, json.data.refreshToken);
    return json.data.accessToken;
  } catch {
    clearTokens();
    stopTokenAutoRefresh();
    return null;
  }
};

export const startTokenAutoRefresh = () => {
  if (refreshIntervalId) return;

  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return;

  refreshIntervalId = setInterval(async () => {
    const { refreshToken: currentRefreshToken } = useAuthStore.getState();

    if (!currentRefreshToken) {
      stopTokenAutoRefresh();
      return;
    }

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    await refreshPromise;
  }, TOKEN_REFRESH_INTERVAL_MS);
};

export const stopTokenAutoRefresh = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
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
      stopTokenAutoRefresh();
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