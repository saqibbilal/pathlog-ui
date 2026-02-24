import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/features/auth/services/authApi';
import { useAuthStore } from '@/store/useAuthStore';

export const useLogin = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        // 1. The actual API call
        mutationFn: authApi.login,

        // 2. What happens if it works?
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            navigate('/dashboard');
        },

        // 3. Error handling is centralized here if we want,
        // or handled in the component via the 'error' object.
    });
};

export const useRegister = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: authApi.register,
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            navigate('/dashboard');
        },
    });
};