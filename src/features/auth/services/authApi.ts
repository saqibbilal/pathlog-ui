// src/features/auth/services/authApi.ts
import api from '@/api/axios';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '@/features/auth/types';


export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        // Direct POST to your login route
        const response = await api.post('/login', credentials);

        // We expect Laravel to return { user: {...}, token: "..." }
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await api.post('/register', credentials);
        return response.data;
    },

    logout: async () => {
        // The Axios interceptor will automatically add the Bearer token
        await api.post('/logout');
    }
};