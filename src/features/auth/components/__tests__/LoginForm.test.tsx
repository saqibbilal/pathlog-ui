import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Import the hook using the alias
import { useLogin } from '@/features/auth/hooks/useAuth';

// 2. Mock using the EXACT same alias string
vi.mock('@/features/auth/hooks/useAuth', () => ({
    useLogin: vi.fn(),
    useRegister: vi.fn(),
    useForgotPassword: vi.fn(),
    useResetPassword: vi.fn(),
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const renderComponent = () => {
    return render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        </QueryClientProvider>
    );
};

describe('LoginForm', () => {
    it('calls the login mutate function with credentials on submit', async () => {
        const mockMutate = vi.fn();

        // 3. Use mockImplementation for hooks (more stable in Vitest)
        vi.mocked(useLogin).mockImplementation(() => ({
            mutate: mockMutate,
            isPending: false,
        } as any));

        const user = userEvent.setup();
        renderComponent();

        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        expect(mockMutate).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123',
        });
    });

    it('disables the submit button while login is pending', () => {
        vi.mocked(useLogin).mockImplementation(() => ({
            mutate: vi.fn(),
            isPending: true,
        } as any));

        renderComponent();

        // Check for "Signing in..." or "Sign in" depending on your component logic
        const submitButton = screen.getByRole('button');
        expect(submitButton).toBeDisabled();
    });
});