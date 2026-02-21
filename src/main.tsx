import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Router } from '@/app/routes/Routes';
import '@/app/styles/global.scss';
import '@/shared/lib/i18n';

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={Router} />
);
