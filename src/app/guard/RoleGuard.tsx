import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { paths } from '@/shared/constants/constants';
import { useAuthStore, type UserRole } from '@/shared/lib/model/AuthStore';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const getDefaultRouteByRole = (role: UserRole) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return paths.COMPANIES;

    case 'ADMIN':
      return paths.CREATE_OPERATOR;

    case 'OPERATOR':
      return paths.DASHBOARD;

    case 'EMPLOYEE':
    default:
      return paths.HOME;
  }
};

export const RoleGuard: FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  if (!accessToken || !user) {
    return <Navigate to={paths.AUTH} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
  }

  return <>{children}</>;
};