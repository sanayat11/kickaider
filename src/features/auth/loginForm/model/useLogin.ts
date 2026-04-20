import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/shared/lib/model/AuthStore';
import { startTokenAutoRefresh, stopTokenAutoRefresh } from '@/shared/api/baseApi';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setAuth({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      });

      startTokenAutoRefresh();
    },
  });
};

export const useLogout = () => {
  const clearTokens = useAuthStore((state) => state.clearTokens);

  return useMutation({
    mutationFn: authApi.logout,
    onError: (error) => {
      console.error('Logout API failed:', error);
    },
    onSettled: () => {
      stopTokenAutoRefresh();
      clearTokens();
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
};

export const useSetPassword = () => {
  return useMutation({
    mutationFn: authApi.setPassword,
  });
};