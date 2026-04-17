import { useQuery } from '@tanstack/react-query';
import { orgStructureApi } from '../api/orgPageApi';

export const useCompanyEmployees = (companyId?: number) => {
  return useQuery({
    queryKey: ['company-employees', companyId],
    queryFn: () => orgStructureApi.getCompanyEmployees(companyId as number),
    select: (response) => response.data,
    enabled: Number.isFinite(companyId),
  });
};