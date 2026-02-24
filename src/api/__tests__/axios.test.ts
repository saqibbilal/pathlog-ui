import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import api from '../axios';
import { useToastStore } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';

// We mock the Zustand stores so we can spy on their actions
vi.mock('../../store/useToastStore', () => ({
    useToastStore: {
        getState: vi.fn(() => ({
            showToast: vi.fn(),
        })),
    },
}));

vi.mock('../../store/useAuthStore', () => ({
    useAuthStore: {
        getState: vi.fn(() => ({
            logout: vi.fn(),
            token: 'test-token',
        })),
    },
}));

describe('Axios Interceptors', () => {
    let mockShowToast: ReturnType<typeof vi.fn>;
    let mockLogout: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockShowToast = vi.fn();
        (useToastStore.getState as any).mockReturnValue({
            showToast: mockShowToast,
        });

        mockLogout = vi.fn();
        (useAuthStore.getState as any).mockReturnValue({
            logout: mockLogout,
            token: 'mocked-token',
        });

        // Mock window.location for 401 redirect testing
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true,
        });
    });

    it('attaches the auth token to requests', async () => {
        const config = { headers: {} as any } as any;

        // Grab the request interceptor
        const requestInterceptor = (api.interceptors.request as any).handlers[0].fulfilled;
        const result = await requestInterceptor(config);

        expect(result.headers.Authorization).toBe('Bearer mocked-token');
    });

    it('silently ignores canceled requests (AbortController)', async () => {
        const interceptor = (api.interceptors.response as any).handlers[0].rejected;

        const cancelError = new axios.Cancel('Canceled');

        await expect(interceptor(cancelError)).rejects.toThrow('Canceled');
        expect(mockShowToast).not.toHaveBeenCalled();
    });

    it('shows a generic network error if response is undefined', async () => {
        const interceptor = (api.interceptors.response as any).handlers[0].rejected;

        const networkError = new Error('Network Error') as any;

        await expect(interceptor(networkError)).rejects.toThrow('Network Error');
        expect(mockShowToast).toHaveBeenCalledWith('Network error or server is down.', 'error');
    });

    it('logs user out on 401 response', async () => {
        const interceptor = (api.interceptors.response as any).handlers[0].rejected;

        const error401 = {
            response: { status: 401 },
        } as any;

        await expect(interceptor(error401)).rejects.toMatchObject({ response: { status: 401 } });
        expect(mockLogout).toHaveBeenCalled();
        expect(window.location.href).toBe('/login');
    });

    it('extracts deep validation message on 422 response', async () => {
        const interceptor = (api.interceptors.response as any).handlers[0].rejected;

        const error422 = {
            response: {
                status: 422,
                data: {
                    message: "Generic missing message",
                    errors: {
                        email: ['The email field is required.'],
                    }
                }
            }
        } as any;

        await expect(interceptor(error422)).rejects.toBeTruthy();
        expect(mockShowToast).toHaveBeenCalledWith('The email field is required.', 'error');
    });

    it('shows general server error message on 500 response', async () => {
        const interceptor = (api.interceptors.response as any).handlers[0].rejected;

        const error500 = {
            response: {
                status: 500,
                data: {}
            }
        } as any;

        await expect(interceptor(error500)).rejects.toBeTruthy();
        expect(mockShowToast).toHaveBeenCalledWith('A server error occurred.', 'error');
    });
});
