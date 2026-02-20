import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-black uppercase tracking-widest text-text-main opacity-50 ml-1">
                {label}
            </label>
            <input
                {...props}
                className={`
                    px-4 py-3 rounded-xl border transition-all duration-200 outline-none
                    ${error
                    ? 'border-rose-500 bg-rose-500/5 focus:ring-4 focus:ring-rose-500/10 text-rose-700'
                    : 'border-surface-border bg-surface text-text-main focus:border-brand focus:ring-4 focus:ring-brand/10'
                }
                    placeholder:text-text-main/20
                `}
            />
            {error && <p className="text-xs text-rose-500 mt-1 ml-1 font-bold">{error}</p>}
        </div>
    );
};