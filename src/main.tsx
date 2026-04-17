import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Router } from '@/app/routes/Routes';
import { useAuthStore } from '@/shared/lib/model/AuthStore';
import { startTokenAutoRefresh } from '@/shared/api/baseApi';
import '@/app/styles/global.scss';
import '@/shared/lib/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

const authStore = useAuthStore.getState();
authStore.loadTokens();

if (useAuthStore.getState().refreshToken) {
  startTokenAutoRefresh();
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={Router} />
  </QueryClientProvider>
);