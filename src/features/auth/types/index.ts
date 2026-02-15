export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
    password_confirmation: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface AuthError {
    message: string;
    errors?: Record<string, string[]>;
}