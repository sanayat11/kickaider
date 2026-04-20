import { create } from 'zustand';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'EMPLOYEE';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  companyId: number | null;
  createdAt: string;
  twoFactorEnabled: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;

  setAuth: (payload: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;

  setTokens: (accessToken: string, refreshToken: string) => void;

  clearTokens: () => void;
  loadTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  setAuth: ({ accessToken, refreshToken, user }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('authUser', JSON.stringify(user));

    set({
      accessToken,
      refreshToken,
      user,
    });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    set({
      accessToken,
      refreshToken,
    });
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },

  loadTokens: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const rawUser = localStorage.getItem('authUser');

    let user: AuthUser | null = null;

    try {
      user = rawUser ? JSON.parse(rawUser) : null;
    } catch {
      user = null;
    }

    set({
      accessToken: accessToken && accessToken !== 'undefined' ? accessToken : null,
      refreshToken: refreshToken && refreshToken !== 'undefined' ? refreshToken : null,
      user,
    });
  },
}));