import { apiFetch } from '@/shared/api/baseApi';
import type {
  LoginRequest,
  LoginResponse,
  ApiResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SetPasswordRequest,
  SetPasswordResponse,
} from '@/shared/types/types';

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

  resetPassword: async (payload: ResetPasswordRequest) => {
    return apiFetch<ApiResponse<ResetPasswordResponse>>('auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  setPassword: async (payload: SetPasswordRequest) => {
    return apiFetch<ApiResponse<SetPasswordResponse>>('auth/set-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};