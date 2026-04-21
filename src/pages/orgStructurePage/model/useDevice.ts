import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { devicesApi } from '../api/DeviceApi';

export const usePendingDevices = () => {
  return useQuery({
    queryKey: ['pending-devices'],
    queryFn: () => devicesApi.getPendingDevices(),
    select: (response) => response.data?.devices ?? response.devices ?? [],
  });
};

export const useApproveDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, alias }: { id: number; alias: string }) =>
      devicesApi.approveDevice(id, { alias }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pending-devices'],
      });
    },
  });
};