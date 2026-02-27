import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, ...props }, ref) => {
        // Generate a unique ID for this specific input instance
        const id = useId();

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={id} // Links to the input ID
                        className="text-xs font-black uppercase tracking-widest text-text-main opacity-50 ml-1"
                    >
                        {label}
                    </label>
                )}
                <input
                    {...props}
                    id={id} // The actual ID
                    ref={ref}
                    className="px-4 py-3 rounded-xl border transition-all duration-200 outline-none
                             border-surface-border bg-surface text-text-main focus:border-brand
                             focus:ring-4 focus:ring-brand/10 placeholder:text-text-main/20"
                />
            </div>
        );
    }
);