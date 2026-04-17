import type { ReactNode, FC } from 'react';
import { Navigate } from 'react-router-dom';
import { paths } from '@/shared/constants/constants';
import { useAuthStore } from '@/shared/lib/model/AuthStore';

interface Props {
  children: ReactNode;
}

export const AuthorizationGuard: FC<Props> = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuth = Boolean(accessToken);

  return isAuth ? <>{children}</> : <Navigate to={paths.AUTH} replace />;
};
