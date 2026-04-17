export const baseURL = import.meta.env.VITE_API_URL;

export const Tokens = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export type TokenKeys = keyof typeof Tokens;

export const paths = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_REPORTS: '/dashboard/reports',
  DASHBOARD_DAY_DETAILS: '/dashboard/day-details',
  DASHBOARD_EMPLOYEE_RATING: '/dashboard/employee-rating',
  DASHBOARD_WORK_SCHEDULES: '/dashboard/settings/work-schedules',
  DASHBOARD_ORG_STRUCTURE: '/dashboard/settings/org-structure',
  WORK_TIME: '/work-time',
  ACTIVITY: '/activity',
  CATEGORIZATION: '/categorization',
  CALENDAR: '/calendar',
  SETTINGS: '/settings',
  COMPANIES: '/companies',
  COMPANY_DETAILS: '/companies/:companyId',
  CREATE_OPERATOR: '/create-operator',
  AUTH: '/auth',
};


