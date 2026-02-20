import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/features/auth/services/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/Input';
import type { AuthError } from '@/features/auth/types';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const data = await authApi.login({ email, password });
            setAuth(data.user, data.token);
            navigate('/dashboard');
        } catch (err: any) {
            const authError = err.response?.data as AuthError;
            setErrorMessage(authError?.message || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
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
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-brand/20 disabled:opacity-50"
                >
                    {isLoading ? 'Verifying...' : 'Sign In'}
                </button>
            </form>

            <p className="text-center mt-8 text-text-main opacity-50 text-sm font-medium">
                Don't have an account? <a href="/register" className="text-brand font-bold hover:underline">Sign up</a>
            </p>
        </div>
    );
};