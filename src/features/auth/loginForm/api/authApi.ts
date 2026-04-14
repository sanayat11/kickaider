import { baseApi } from '@/shared/api/baseApi';

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    companyId: number;
    createdAt: string;
    twoFactorEnabled: boolean;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation } = authApi;
