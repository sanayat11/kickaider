import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/shared/lib/model/AuthStore';
import { startTokenAutoRefresh, stopTokenAutoRefresh } from '@/shared/api/baseApi';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setTokens(response.data.accessToken, response.data.refreshToken);
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
