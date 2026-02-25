import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { useLogin } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // We pull everything from our custom hook
    const { mutate: login, isPending, error } = useLogin();

    // Safely extract error message from the TanStack error object
    const axiosError = error as any;
    const errorMessage = axiosError?.response?.data?.message || null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger the mutation defined in our hook
        login({ email, password });
    };

    return (
        <div className="w-full max-w-md p-10 bg-surface rounded-3xl shadow-2xl border border-surface-border transition-colors duration-500">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-text-main tracking-tighter">
                    Path<span className="text-brand">Log</span>
                </h2>
                <p className="text-text-main opacity-60 mt-3 font-medium text-lg">Your career journey, logged.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                    <div className="p-4 text-sm font-bold text-rose-600 bg-rose-500/10 rounded-2xl border border-rose-200 animate-in fade-in slide-in-from-top-2">
                        {errorMessage}
                    </div>
                )}

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 px-6 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-brand/20 disabled:opacity-50"
                >
                    {isPending ? 'Verifying...' : 'Sign In'}
                </button>
            </form>

            <p className="text-center mt-8 text-text-main opacity-50 text-sm font-medium">
                Don't have an account? <a href="/register" className="text-brand font-bold hover:underline">Sign up</a>
            </p>

            <p className="text-center mt-8 text-text-main opacity-50 text-sm font-medium">
                Forgot your password?
                <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
            >
                Reset Password
            </Link>
            </p>

        </div>
    );
};