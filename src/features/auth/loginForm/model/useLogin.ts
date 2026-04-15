import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/shared/lib/model/AuthStore';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setTokens(response.data.accessToken, response.data.refreshToken);
    },
  });
};

export const useLogout = () => {
  const clearTokens = useAuthStore((state) => state.clearTokens);

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearTokens();
    },
  });
};