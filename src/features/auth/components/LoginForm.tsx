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
        <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">PathLog</h2>
                <p className="text-slate-500 mt-3 font-medium text-lg">Your career journey, logged.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                    <div className="p-4 text-sm font-medium text-red-700 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
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
                    className="w-full py-4 px-6 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Verifying...' : 'Sign In'}
                </button>
            </form>

            <p className="text-center mt-8 text-slate-500 text-sm">
                Don't have an account? <a href="/register" className="text-slate-900 font-bold hover:underline">Sign up</a>
            </p>
        </div>
    );
};