import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentsApi } from '../api/DepartmentsApi';

export const useCompanyDepartments = (companyId?: number) => {
  return useQuery({
    queryKey: ['company-departments', companyId],
    queryFn: () => departmentsApi.getCompanyDepartments(companyId as number),
    select: (response) => response.data,
    enabled: Number.isFinite(companyId),
  });
};

export const useCreateDepartment = (companyId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; companyId: number }) =>
      departmentsApi.createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-departments', companyId],
      });
    },
  });
};

export const useDeleteDepartment = (companyId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: number) => departmentsApi.deleteDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-departments', companyId],
      });
    },
  });
};