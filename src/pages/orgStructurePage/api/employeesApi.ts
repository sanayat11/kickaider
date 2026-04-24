import { apiFetch } from '@/shared/api/baseApi';
import type { EmployeeApiResponse } from '../model/types';

export interface UpdateEmployeeRequest {
  departmentId: number;
  position: string;
  employeeNumber: string;
}

export interface CreateEmployeeWithUserRequest {
  email: string;
  password: string;
  name: string;
  departmentId: number;
  position: string;
  hireDate: string;
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

  createEmployeeWithUser: async (payload: CreateEmployeeWithUserRequest) => {
    return apiFetch<EmployeeApiResponse>(`employees/with-user`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  changePassword: async (id: number, newPassword: string) => {
    return apiFetch<void>(`employees/${id}/change-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  },
};