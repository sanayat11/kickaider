export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
  path: string;
  errors?: Record<string, string[]>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError | null;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = ApiResponse<AuthTokens>;
