import { apiFetch } from '@/shared/api/baseApi';
import type {
  DepartmentApiResponse,
  DepartmentsApiResponse,
  EmptyApiResponse,
} from '../model/types';

export const departmentsApi = {
  getCompanyDepartments: async (companyId: number) => {
    return apiFetch<DepartmentsApiResponse>(`departments/company/${companyId}`, {
      method: 'GET',
    });
  },

  createDepartment: async (payload: { name: string; companyId: number }) => {
    return apiFetch<DepartmentApiResponse>('departments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  deleteDepartment: async (id: number) => {
    return apiFetch<EmptyApiResponse>(`departments/${id}`, {
      method: 'DELETE',
    });
  },
};