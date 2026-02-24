import type { ReactNode } from 'react';

interface FormSectionProps {
    title?: string;
    description?: string;
    children: ReactNode;
    hasTopBorder?: boolean;
}

export const FormSection = ({ title, description, children, hasTopBorder = true }: FormSectionProps) => {
    return (
        <div className={`${hasTopBorder ? 'pt-6 border-t border-border-main' : ''} space-y-6`}>
            {(title || description) && (
                <div>
                    {title && <h3 className="text-sm font-semibold text-text-main mb-1">{title}</h3>}
                    {description && <p className="text-xs opacity-60 mb-4">{description}</p>}
                </div>
            )}
            <div>
                {children}
            </div>
        </div>
    );
};
