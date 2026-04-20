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

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  companyId: number | null;
  createdAt: string;
  twoFactorEnabled: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = ApiResponse<AuthTokens>;

export interface ResetPasswordRequest {
  userId: number;
  email: string;
}

export interface ResetPasswordResponse {
  userId: number;
  email: string;
  message: string;
}

export interface SetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface SetPasswordResponse {
  message: string;
}