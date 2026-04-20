import { paths } from '@/shared/constants/constants';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/app/layout/Layout';
import { HomePage } from '@/pages/home/view/HomePage';
import { DashboardPage, DashboardReportsPage } from '@/pages/dashboard';
import { DayDetailsPage } from '@/pages/dayDetailsPage/view/DayDetailsPage';
import { EmployeeRatingPage } from '@/pages/employeeRatingPage';
import { WorkSchedulesPage } from '@/pages/workSchedulesPage';
import { OrgStructurePage } from '@/pages/orgStructurePage';
import { WorkTimePage } from '@/pages/work-time';
import { NotFoundPage } from '@/pages/notFoundPage/view/NotFoundPage';
import { AuthPage } from '@/pages/auth';
import { ActivityPage } from '@/pages/activity';
import { ActivityDetailsPage } from '@/pages/activityDetail';
import { CategorizationPage } from '@/pages/categorization';
import { ProductionCalendarPage } from '@/pages/calendar/view/ProductionCalendarPage';
import { SettingsPage } from '@/pages/settings';
import { CompaniesPage } from '@/pages/companies/view/CompaniesPage';
import { CompanyDetailsPage } from '@/pages/companyDetails/view/CompanyDetailsPage';
import { CreateOperatorPage } from '@/pages/createOperator/view/CreateOperatorPage';
import { AuthorizationGuard } from '@/app/guard/AuthorizationGuard';
import { RoleGuard } from '@/app/guard/RoleGuard';

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
    path: paths.DASHBOARD,
    element: (
      <AuthorizationGuard>
        <RoleGuard allowedRoles={['ADMIN', 'OPERATOR']}>
          <DashboardPage />
        </RoleGuard>
      </AuthorizationGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={paths.DASHBOARD_REPORTS} replace />,
      },
      {
        path: paths.DASHBOARD_REPORTS,
        element: <DashboardReportsPage />,
      },
      {
        path: paths.DASHBOARD_DAY_DETAILS,
        element: <DayDetailsPage />,
      },
      {
        path: paths.DASHBOARD_EMPLOYEE_RATING,
        element: <EmployeeRatingPage />,
      },
      {
        path: paths.DASHBOARD_WORK_SCHEDULES,
        element: (
          <RoleGuard allowedRoles={['OPERATOR']}>
            <WorkSchedulesPage />
          </RoleGuard>
        ),
      },
      {
        path: paths.DASHBOARD_ORG_STRUCTURE,
        element: (
          <RoleGuard allowedRoles={['OPERATOR']}>
            <OrgStructurePage />
          </RoleGuard>
        ),
      },
    ],
  },
  {
    path: paths.WORK_TIME,
    element: (
      <AuthorizationGuard>
        <RoleGuard allowedRoles={['ADMIN', 'OPERATOR']}>
          <DashboardPage />
        </RoleGuard>
      </AuthorizationGuard>
    ),
    children: [
      {
        index: true,
        element: <WorkTimePage />,
      },
    ],
  },
  {
    path: paths.ACTIVITY,
    element: (
      <AuthorizationGuard>
        <RoleGuard allowedRoles={['ADMIN', 'OPERATOR']}>
          <DashboardPage />
        </RoleGuard>
      </AuthorizationGuard>
    ),
    children: [
      {
        index: true,
        element: <ActivityPage />,
      },
      {
        path: ':employeeId',
        element: <ActivityDetailsPage />,
      },
    ],
  },
  {
    path: paths.AUTH,
    element: <AuthPage />,
  },
  {
    path: paths.CATEGORIZATION,
    element: (
      <AuthorizationGuard>
        <RoleGuard allowedRoles={['OPERATOR']}>
          <DashboardPage />
        </RoleGuard>
      </AuthorizationGuard>
    ),
    children: [
      {
        index: true,
        element: <CategorizationPage />,
      },
    ],
  },
  {
    path: paths.CALENDAR,
    element: (
      <AuthorizationGuard>
        <RoleGuard allowedRoles={['OPERATOR']}>
          <DashboardPage />
        </RoleGuard>
      </AuthorizationGuard>
    ),
    children: [
      {
        index: true,
        element: <ProductionCalendarPage />,
      },
    ],
  },
  {
    path: paths.SETTINGS,
    element: (
      <AuthorizationGuard>
        <RoleGuard allowedRoles={['OPERATOR']}>
          <DashboardPage />
        </RoleGuard>
      </AuthorizationGuard>
    ),
    children: [
      {
        index: true,
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: paths.COMPANIES,
    element: (
      <AuthorizationGuard>
        <RoleGuard allowedRoles={['SUPER_ADMIN']}>
          <DashboardPage />
        </RoleGuard>
      </AuthorizationGuard>
    ),
    children: [
      {
        index: true,
        element: <CompaniesPage />,
      },
      {
        path: ':companyId',
        element: <CompanyDetailsPage />,
      },
    ],
  },
  {
    path: paths.CREATE_OPERATOR,
    element: (
      <AuthorizationGuard>
        <RoleGuard allowedRoles={['ADMIN']}>
          <DashboardPage />
        </RoleGuard>
      </AuthorizationGuard>
    ),
    children: [
      {
        index: true,
        element: <CreateOperatorPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);