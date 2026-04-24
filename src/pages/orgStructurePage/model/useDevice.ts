import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { devicesApi } from '../api/DeviceApi';
import type { DeviceApiItem, PendingDevicesApiResponse, PendingDevicesData } from './types';

const normalizePendingDevices = (response: PendingDevicesApiResponse): PendingDevicesData => {
  if (response.success === false) {
    throw new Error(response.error?.message ?? 'Failed to load pending devices');
  }

  const devices =
    response.data?.devices ??
    response.devices ??
    [];

  const total =
    response.data?.total ??
    response.total ??
    devices.length;

  return {
    devices,
    total,
  };
};

export const usePendingDevices = () => {
  return useQuery({
    queryKey: ['pending-devices'],
    queryFn: () => devicesApi.getPendingDevices(),
    select: normalizePendingDevices,
  });
};

export const useApproveDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, alias }: { id: number; alias: string }) =>
      devicesApi.approveDevice(id, { alias }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-devices'] });
      queryClient.invalidateQueries({ queryKey: ['company-devices'] });
    },
  });
};

export const useCompanyDevices = () => {
  return useQuery({
    queryKey: ['company-devices'],
    queryFn: () => devicesApi.getCompanyDevices(),
    select: (response): DeviceApiItem[] => {
      if (Array.isArray(response)) return response as DeviceApiItem[];
      const r = response as Record<string, unknown>;
      const d = r.data;
      if (Array.isArray(d)) return d as DeviceApiItem[];
      if (d && typeof d === 'object') {
        const nested = d as Record<string, unknown>;
        if (Array.isArray(nested.devices)) return nested.devices as DeviceApiItem[];
        if (Array.isArray(nested.content)) return nested.content as DeviceApiItem[];
      }
      if (Array.isArray(r.devices)) return r.devices as DeviceApiItem[];
      return [];
    },
  });
};

export const useBlockDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      devicesApi.blockDevice(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-devices'] });
      queryClient.invalidateQueries({ queryKey: ['pending-devices'] });
    },
  });
};

export const useUnblockDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => devicesApi.unblockDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-devices'] });
      queryClient.invalidateQueries({ queryKey: ['pending-devices'] });
    },
  });
};

export const useUpdateDeviceAlias = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, alias }: { id: number; alias: string }) =>
      devicesApi.updateDeviceAlias(id, alias),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-devices'] });
    },
  });
};
