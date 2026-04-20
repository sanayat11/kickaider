export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
  path: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError | null;
  timestamp: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'EMPLOYEE';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  companyId: number | null;
  createdAt: string;
  twoFactorEnabled: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: 'OPERATOR';
  companyId: number;
}