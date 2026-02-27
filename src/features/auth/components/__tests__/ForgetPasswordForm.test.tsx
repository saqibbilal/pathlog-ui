import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ForgetPasswordForm } from '@/features/auth/components/ForgetPasswordForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import * as authHooks from '@/features/auth/hooks/useAuth';
import userEvent from '@testing-library/user-event'; // Add this import at the top

// 1. Mock the hook so we don't hit the real API
vi.mock('../../hooks/useAuth', () => ({
    useForgotPassword: vi.fn()
}));

const queryClient = new QueryClient();

const renderComponent = () => render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <ForgetPasswordForm />
        </BrowserRouter>
    </QueryClientProvider>
);

describe('ForgetPasswordForm', () => {
    it('renders the email input and submit button', () => {
        (authHooks.useForgotPassword as any).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isSuccess: false,
            error: null
        });

        renderComponent();

        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    });

    it('shows loading state when the form is submitting', () => {
        (authHooks.useForgotPassword as any).mockReturnValue({
            mutate: vi.fn(),
            isPending: true,
            isSuccess: false,
            error: null
        });

        renderComponent();

        expect(screen.getByRole('button')).toHaveTextContent(/sending.../i);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('displays success message upon successful submission', () => {
        (authHooks.useForgotPassword as any).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isSuccess: true,
            error: null
        });

        renderComponent();

        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
        expect(screen.getByText(/back to login/i)).toBeInTheDocument();
    });

    it('calls the mutate function with the email when form is submitted', async () => {
        // 1. Setup the spy function
        const mockMutate = vi.fn();
        (authHooks.useForgotPassword as any).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
            isSuccess: false,
            error: null
        });

        const user = userEvent.setup();
        renderComponent();

        // 2. Act: Type in the email and click submit
        const emailInput = screen.getByLabelText(/email address/i);
        const submitButton = screen.getByRole('button', { name: /send reset link/i });

        await user.type(emailInput, 'dev@example.com');
        await user.click(submitButton);

        // 3. Assert: Verify the hook was called correctly
        expect(mockMutate).toHaveBeenCalledWith('dev@example.com');
    });
});