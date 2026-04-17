import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '../api/CompanyApi';

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: companyApi.getCompanies,
    select: (response) => response.data,
  });
};

export const useCompany = (id?: number) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => companyApi.getCompanyById(id!),
    select: (response) => response.data,
    enabled: typeof id === 'number' && !Number.isNaN(id),
  });
};

export const useBlockCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.blockCompany,
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', companyId] });
    },
  });
};

export const useActivateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.activateCompany,
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', companyId] });
    },
  });
};