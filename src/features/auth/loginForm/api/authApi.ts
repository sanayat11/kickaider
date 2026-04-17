import { apiFetch } from '@/shared/api/baseApi';
import type { LoginRequest, LoginResponse } from '@/shared/types/types';

export const authApi = {
  login: async (payload: LoginRequest) => {
    return apiFetch<LoginResponse>('auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout: async (payload: { refreshToken: string }) => {
    return apiFetch<{ success: boolean; timestamp: string }>('auth/logout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};