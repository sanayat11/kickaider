import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi, type CreateEmployeeWithUserRequest } from '../api/employeesApi';

export const useUpdateEmployee = (companyId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: {
        departmentId: number;
        position: string;
        employeeNumber: string;
      };
    }) => employeesApi.updateEmployee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-employees', companyId],
      });
    },
  });
};

export const useBlockEmployee = (companyId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: number) => employeesApi.blockEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-employees', companyId],
      });
    },
  });
};

export const useCreateEmployeeWithUser = (companyId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeeWithUserRequest) =>
      employeesApi.createEmployeeWithUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-employees', companyId],
      });
    },
  });
};