import { apiFetch } from '@/shared/api/baseApi';

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
    timestamp?: string;
    path?: string;
    errors?: Record<string, string[]>;
  };
  timestamp?: string;
};

const unwrapResponse = <T,>(response: T | ApiEnvelope<T>): T => {
  if (
    response &&
    typeof response === 'object' &&
    'data' in (response as Record<string, unknown>)
  ) {
    return ((response as ApiEnvelope<T>).data ?? null) as T;
  }

  return response as T;
};

export type RawEmployee = {
  id: number;
  departmentId?: number;
  departmentName?: string;
  employeeNumber?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  hostname?: string;
  user?: {
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export type RawTimelineItem = {
  startTime: string;
  endTime: string;
  type: 'APP' | 'WEB' | 'IDLE';
  title?: string | null;
  details?: string | null;
  durationSeconds: number;
};

export type TimelineResponseRaw = {
  employeeId: number;
  date: string;
  items: RawTimelineItem[];
};

export type TimelineItemNormalized = {
  startTime: string;
  endTime: string;
  startDate: Date;
  endDate: Date;
  type: 'APP' | 'WEB' | 'IDLE';
  state: 'PRODUCTIVE' | 'NEUTRAL' | 'IDLE' | 'UNCATEGORIZED';
  title?: string;
  details?: string | null;
  applicationName?: string;
  windowTitle?: string;
  url?: string;
  durationSeconds: number;
};

export type TimelineResponse = {
  employeeId: number;
  date: string;
  items: TimelineItemNormalized[];
};

export type ActivitySummaryRequest = {
  employeeId?: number;
  departmentId?: number;
  from: string;
  to: string;
  date: string;
  groupBy: 'DAY' | 'WEEK' | 'MONTH';
  onlyWorkTime: boolean;
  page: number;
  size: number;
};

export type TopApplicationItem = {
  applicationName: string;
  processName: string;
  totalSeconds: number;
  productiveSeconds: number;
  neutralSeconds: number;
  nonProductiveSeconds: number;
  uncategorizedSeconds: number;
  productivePercentage: number;
  neutralPercentage: number;
  nonProductivePercentage: number;
  uncategorizedPercentage: number;
};

export type ActivityReportResponse = {
  employeeId: number;
  employeeName?: string;
  from: string;
  to: string;
  totalAppTime: number;
  totalWebTime: number;
  totalIdleTime: number;
  totalActiveTime: number;
  topApplications?: TopApplicationItem[];
};

export type ActivityEvent = {
  timestamp: string;
  duration: string;
  state: 'productive' | 'neutral' | 'unproductive' | 'idle' | 'uncategorized';
  appName: string;
  windowTitle?: string;
  url?: string;
  screenshotUrl?: string;
};

export type ShortViewRow = {
  period: string;
  activityMinutes: string;
  idleMinutes: string;
  apps: string[];
};

export const fetchCompanyEmployees = async (
  companyId: number,
): Promise<RawEmployee[]> => {
  const response = await apiFetch<ApiEnvelope<RawEmployee[]> | RawEmployee[]>(
    `employees/company/${companyId}`,
    { method: 'GET' },
  );

  return unwrapResponse<RawEmployee[]>(response) ?? [];
};

const parseTimelineTime = (date: string, time: string) => {
  const [hhmmss, fraction = '0'] = time.split('.');
  const [hours, minutes, seconds] = hhmmss.split(':').map(Number);

  const ms = Math.round(Number(`0.${fraction}`) * 1000);

  const result = new Date(`${date}T00:00:00`);
  result.setHours(hours || 0, minutes || 0, seconds || 0, ms || 0);

  return result;
};

const normalizeTimelineItems = (
  date: string,
  items: RawTimelineItem[],
): TimelineItemNormalized[] => {
  return items.map((item) => {
    const startDate = parseTimelineTime(date, item.startTime);
    const endDate = parseTimelineTime(date, item.endTime);

    const isUrl =
      typeof item.details === 'string' &&
      /^https?:\/\//i.test(item.details);

    return {
      startTime: item.startTime,
      endTime: item.endTime,
      startDate,
      endDate,
      type: item.type,
      state:
        item.type === 'IDLE'
          ? 'IDLE'
          : item.type === 'WEB'
          ? 'NEUTRAL'
          : 'PRODUCTIVE',
      title: item.title || undefined,
      details: item.details,
      applicationName: item.title || undefined,
      windowTitle:
        item.type === 'APP' ? item.details || undefined : undefined,
      url: item.type === 'WEB' && isUrl ? item.details || undefined : undefined,
      durationSeconds: item.durationSeconds || 0,
    };
  });
};

export const fetchActivityTimeline = async (
  employeeId: number,
  date: string,
): Promise<TimelineResponse> => {
  const response = await apiFetch<
    ApiEnvelope<TimelineResponseRaw> | TimelineResponseRaw
  >('reports/timeline', {
    method: 'POST',
    body: JSON.stringify({ employeeId, date }),
  });

  const raw = unwrapResponse<TimelineResponseRaw>(response);

  return {
    employeeId: raw.employeeId,
    date: raw.date,
    items: normalizeTimelineItems(raw.date, raw.items || []),
  };
};

export const fetchActivityReport = async (
  payload: ActivitySummaryRequest,
): Promise<ActivityReportResponse> => {
  const response = await apiFetch<
    ApiEnvelope<ActivityReportResponse> | ActivityReportResponse
  >('reports/activity', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return unwrapResponse<ActivityReportResponse>(response);
};