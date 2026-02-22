import { paths } from '@/shared/constants/constants';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/app/layout/Layout';
import { HomePage } from '@/pages/home/view/HomePage';
import { DashboardPage, DashboardReportsPage, DashboardSettingsPage, DayDetailsPage, EmployeeRatingPage, WorkSchedulesPage, OrgStructurePage } from '@/pages/dashboard';
import { WorkTimePage } from '@/pages/work-time';
import { NotFoundPage } from '@/pages/notFoundPage/view/NotFoundPage';
import { AuthPage } from '@/pages/auth';
import { ActivityPage } from '@/pages/activity';
import { ActivityDetailsPage } from '@/pages/activityDetail';
import { CategorizationPage } from '@/pages/categorization';
import { ProductionCalendarPage } from '@/pages/calendar';
import { SettingsPage } from '@/pages/settings';

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
    element: <DashboardPage />,
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
        path: paths.DASHBOARD_SETTINGS,
        element: <DashboardSettingsPage />,
      },
      {
        path: paths.DASHBOARD_WORK_SCHEDULES,
        element: <WorkSchedulesPage />,
      },
      {
        path: paths.DASHBOARD_ORG_STRUCTURE,
        element: <OrgStructurePage />,
      },
    ],
  },
  {
    path: paths.WORK_TIME,
    element: <DashboardPage />,
    children: [
      {
        index: true,
        element: <WorkTimePage />,
      },
    ],
  },
  {
    path: paths.ACTIVITY,
    element: <DashboardPage />,
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
    element: <DashboardPage />,
    children: [
      {
        index: true,
        element: <CategorizationPage />,
      },
    ],
  },
  {
    path: paths.CALENDAR,
    element: <DashboardPage />,
    children: [
      {
        index: true,
        element: <ProductionCalendarPage />,
      },
    ],
  },
  {
    path: paths.SETTINGS,
    element: <DashboardPage />,
    children: [
      {
        index: true,
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
