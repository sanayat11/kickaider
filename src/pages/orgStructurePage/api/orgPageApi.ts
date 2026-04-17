import { apiFetch } from '@/shared/api/baseApi';
import type { EmployeesApiResponse } from '../model/types';

export const orgStructureApi = {
  getCompanyEmployees: async (companyId: number) => {
    return apiFetch<EmployeesApiResponse>(`employees/company/${companyId}`, {
      method: 'GET',
    });
  },
};