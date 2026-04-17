import { apiFetch } from '@/shared/api/baseApi';
import type { ApiResponse, Company } from '../types/CompaniesTypes';

export const companyApi = {
  getCompanies: async () => {
    return apiFetch<ApiResponse<Company[]>>('companies', {
      method: 'GET',
    });
  },

  getCompanyById: async (id: number) => {
    return apiFetch<ApiResponse<Company>>(`companies/${id}`, {
      method: 'GET',
    });
  },

  blockCompany: async (id: number) => {
    return apiFetch<ApiResponse<Company>>(`companies/${id}/block`, {
      method: 'POST',
    });
  },

  activateCompany: async (id: number) => {
    return apiFetch<ApiResponse<Company>>(`companies/${id}/activate`, {
      method: 'POST',
    });
  },
};