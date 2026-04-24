import { apiFetch } from '@/shared/api/baseApi';

export type SettingsLanguage = 'ru';

export interface GeneralSettingsPayload {
  timezone: string;
  language: SettingsLanguage;
  idleThresholdSeconds: number;
  lateToleranceMinutes: number;
  batchIntervalSeconds: number;
}

export interface GeneralSettingsResponse {
  success?: boolean;
  data?: GeneralSettingsPayload;
  error?: unknown;
}

export const settingsApi = {
  getGeneralSettings: () =>
    apiFetch<GeneralSettingsResponse | GeneralSettingsPayload>('settings/general', {
      method: 'GET',
    }),

  updateGeneralSettings: (payload: GeneralSettingsPayload) =>
    apiFetch<GeneralSettingsResponse | GeneralSettingsPayload>('settings/general', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
