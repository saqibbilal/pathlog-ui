import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-semibold text-slate-700 ml-1">
                {label}
            </label>
            <input
                {...props}
                className={`
          px-4 py-3 rounded-xl border transition-all duration-200 outline-hidden
          ${error
                    ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-500/10'
                    : 'border-slate-200 bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5'
                }
          placeholder:text-slate-400
        `}
            />
            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
        </div>
    );
};