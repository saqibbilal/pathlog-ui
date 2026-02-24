import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request Interceptor: Automatically attach Token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle Global Errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Silently reject if the request was manually aborted (e.g. by React Query on unmount)
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        if (!error.response) {
            useToastStore.getState().showToast('Network error or server is down.', 'error');
            return Promise.reject(error);
        }

        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
            // Session expired or token invalid
            useAuthStore.getState().logout();
            window.location.href = '/login';
        } else if (status === 422) {
            // Validation errors
            let message = 'Validation Error';
            if (data.errors) {
                // Get the first error message from the Laravel validation bag
                const firstKey = Object.keys(data.errors)[0];
                message = data.errors[firstKey][0];
            } else if (data.message) {
                message = data.message;
            }
            useToastStore.getState().showToast(message, 'error');
        } else if (status === 500) {
            // Server boundaries
            useToastStore.getState().showToast('A server error occurred.', 'error');
        }

        return Promise.reject(error);
    }
);

export default api;