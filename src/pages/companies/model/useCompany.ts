import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '../api/CompanyApi';

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: companyApi.getCompanies,
    select: (response) => response.data,
  });
};

export const useBlockCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.blockCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useActivateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.activateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};