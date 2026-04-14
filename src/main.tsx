import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store/store';
import { Router } from '@/app/routes/Routes';
import '@/app/styles/global.scss';
import '@/shared/lib/i18n';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={Router} />
  </Provider>
);
