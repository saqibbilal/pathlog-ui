import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { useResetPassword } from '../hooks/useAuth';
import axios from 'axios';
import type { ResetPasswordData } from '@/features/auth/types';

export const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();

    // 1. Initialize our new hook
    const { mutate, isPending, isSuccess, error } = useResetPassword();

    const { register, handleSubmit } = useForm<ResetPasswordData>({
        defaultValues: {
            email: searchParams.get('email') || '',
            token: searchParams.get('token') || '',
            password: '',
            password_confirmation: '',
        }
    });

    // 2. The cleaner onSubmit
    const onSubmit = (data: ResetPasswordData) => {
        mutate(data);
    };

    // 3. Status Handling
    const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error ? 'An unexpected error occurred.' : null;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Logic-driven Alerts */}
            {isSuccess && (
                <div className="p-4 text-sm font-bold rounded-2xl border border-brand/20 text-brand bg-brand/10 animate-in fade-in slide-in-from-top-2">
                    Password reset successful! Redirecting to login...
                </div>
            )}

            {errorMessage && (
                <div className="p-4 text-sm font-bold rounded-2xl border border-rose-200 text-rose-600 bg-rose-500/10 animate-in fade-in slide-in-from-top-2">
                    {errorMessage}
                </div>
            )}

            <input type="hidden" {...register('email')} />
            <input type="hidden" {...register('token')} />

            <div className="space-y-2">
                <Input
                    {...register('password', { required: true, minLength: 8 })}
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                />
            </div>

            <div className="space-y-2">
                <Input
                    {...register('password_confirmation', { required: true })}
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 px-6 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-brand/20 disabled:opacity-50"
            >
                {isPending ? 'Updating Password...' : 'Reset Password'}
            </button>
        </form>
    );
};