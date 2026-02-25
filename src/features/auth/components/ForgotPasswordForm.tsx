import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { forgotPassword } from '@/features/auth/services/authApi';
import { Link } from 'react-router-dom';

export const ForgotPasswordForm = () => {
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string }>();

    const onSubmit = async (data: { email: string }) => {
        try {
            setError(null);
            await forgotPassword(data.email);
            setIsSent(true);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Something went wrong.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    if (isSent) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Check your email</h2>
                <p className="mt-2 text-gray-600">We've sent a password reset link to your inbox.</p>
                <Link to="/login" className="mt-4 block text-indigo-600 hover:underline">Back to login</Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                    {...register('email', { required: true })}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="you@example.com"
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>
    );
};