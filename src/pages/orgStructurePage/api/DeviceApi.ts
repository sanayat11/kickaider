import { apiFetch } from '@/shared/api/baseApi';
import type { DeviceApiItem, PendingDevicesApiResponse } from '../model/types';

export const devicesApi = {
  getPendingDevices: async () => {
    return apiFetch<PendingDevicesApiResponse>('devices/pending', {
      method: 'GET',
    });
  },

  approveDevice: async (id: number, payload: { alias: string }) => {
    return apiFetch<DeviceApiItem>(`devices/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  blockDevice: async (id: number, payload: { reason: string }) => {
    return apiFetch<DeviceApiItem>(`devices/${id}/block`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  unblockDevice: async (id: number) => {
    return apiFetch<DeviceApiItem>(`devices/${id}/unblock`, {
      method: 'POST',
    });
  },
};