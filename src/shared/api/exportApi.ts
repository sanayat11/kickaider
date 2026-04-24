import { useAuthStore } from '../lib/model/AuthStore';

const RAW_API_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://85.239.49.208:8080/api/v1/';

const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL : `${RAW_API_URL}/`;

/**
 * Generic XLSX export helper.
 * Sends a POST with JSON body and downloads the binary response as a .xlsx file.
 */
export const downloadXlsxExport = async (
  endpoint: string,
  payload: Record<string, unknown>,
  filename: string,
): Promise<void> => {
  const { accessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Export failed: HTTP ${response.status}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// ── Typed export functions ──────────────────────────────────────────

export type ExportEfficiencyPayload = {
  employeeId?: number;
  departmentId?: number;
  from: string;
  to: string;
  date: string;
  groupBy: string;
  onlyWorkTime: boolean;
  page: number;
  size: number;
};

/** POST /api/v1/reports/efficiency/export */
export const exportEfficiencyReport = (
  payload: ExportEfficiencyPayload,
  filename = 'efficiency_report.xlsx',
) => downloadXlsxExport('reports/efficiency/export', payload, filename);

/** POST /api/v1/reports/activity/export */
export const exportActivityReport = (
  payload: ExportEfficiencyPayload,
  filename = 'activity_report.xlsx',
) => downloadXlsxExport('reports/activity/export', payload, filename);

export type ExportHistoryPayload = {
  employeeId: number;
  date: string;
};

/** POST /api/v1/reports/history/export */
export const exportHistoryReport = (
  payload: ExportHistoryPayload,
  filename = 'history_report.xlsx',
) => downloadXlsxExport('reports/history/export', payload, filename);

export type ExportRatingPayload = {
  employeeId?: number;
  departmentId?: number;
  from: string;
  to: string;
  date: string;
  groupBy: string;
  onlyWorkTime: boolean;
  page: number;
  size: number;
};

/** POST /api/v1/reports/rating/export */
export const exportRatingReport = (
  payload: ExportRatingPayload,
  filename = 'rating_report.xlsx',
) => downloadXlsxExport('reports/rating/export', payload, filename);

export type ExportAttendancePayload = {
  employeeId?: number;
  date: string;
};

/** POST /api/v1/reports/attendance/export */
export const exportAttendanceReport = (
  payload: ExportAttendancePayload,
  filename = 'attendance_report.xlsx',
) => downloadXlsxExport('reports/attendance/export', payload, filename);
