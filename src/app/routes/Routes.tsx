import { paths } from '@/shared/constants/constants';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/app/layout/Layout';
import { HomePage } from '@/pages/home/view/HomePage';
import { NotFoundPage } from '@/pages/notFoundPage/view/NotFoundPage';

export const Router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: paths.HOME,
        element: <HomePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
