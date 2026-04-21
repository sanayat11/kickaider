import { apiFetch } from '@/shared/api/baseApi';
import type { EmployeeApiResponse } from '../model/types';

export interface UpdateEmployeeRequest {
  departmentId: number;
  position: string;
  employeeNumber: string;
}

export const employeesApi = {
  updateEmployee: async (id: number, payload: UpdateEmployeeRequest) => {
    return apiFetch<EmployeeApiResponse>(`employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  blockEmployee: async (id: number) => {
    return apiFetch<EmployeeApiResponse>(`employees/${id}/block`, {
      method: 'POST',
    });
  },
};