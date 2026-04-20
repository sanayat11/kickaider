import { apiFetch } from '@/shared/api/baseApi';
import type { ApiResponse, User, CreateUserRequest } from '../types/CreateOperatorTypes';

export const userApi = {
  createUser: async (payload: CreateUserRequest) => {
    return apiFetch<ApiResponse<User>>('users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};