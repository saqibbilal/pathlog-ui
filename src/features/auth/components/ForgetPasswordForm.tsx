import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { useForgotPassword } from '../hooks/useAuth'; // Import our new hook
import axios from 'axios';

export const ForgetPasswordForm = () => {
    // 1. Initialize the hook
    const { mutate, isPending, isSuccess, error } = useForgotPassword();

    const { register, handleSubmit } = useForm<{ email: string }>();

    // 2. Simple onSubmit - just trigger the mutation
    const onSubmit = (data: { email: string }) => {
        mutate(data.email);
    };

    // 3. Extract error message safely using the helper we discussed
    const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;

    // 4. Use the hook's 'isSuccess' state to show the success message
    if (isSuccess) {
        return (
            <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="p-6 bg-brand/10 rounded-3xl border border-brand/20 mb-6">
                    <h2 className="text-2xl font-black text-text-main">Check your email</h2>
                    <p className="mt-3 text-text-main opacity-70 font-medium">
                        If an account exists, we've sent a recovery link.
                    </p>
                </div>
                <Link to="/login" className="text-brand font-bold hover:underline transition-all">
                    Back to Login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMessage && (
                <div className="p-4 text-sm font-bold text-rose-600 bg-rose-500/10 rounded-2xl border border-rose-200 animate-in fade-in slide-in-from-top-2">
                    {errorMessage}
                </div>
            )}

            <div className="space-y-2">
                <Input
                    {...register('email', { required: true })}
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                />
            </div>

            <button
                type="submit"
                disabled={isPending} // Use isPending from hook
                className="w-full py-4 px-6 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-brand/20 disabled:opacity-50"
            >
                {isPending ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center mt-6">
                <p className="text-text-main opacity-50 text-sm font-medium">
                    Remembered it?{' '}
                    <Link to="/login" className="text-brand font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </form>
    );
};