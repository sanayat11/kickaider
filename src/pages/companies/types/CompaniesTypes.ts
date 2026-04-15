export type CompanyStatus = 'ACTIVE' | 'SUSPENDED';

export interface Company {
  id: number;
  name: string;
  taxId: string | null;
  email: string;
  phone: string | null;
  status: CompanyStatus;
  subscriptionEndDate: string | null;
  employeeLimit: number;
  createdAt: string;
  updatedAt: string;
}

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