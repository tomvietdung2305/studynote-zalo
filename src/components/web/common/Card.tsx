import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    title,
    subtitle,
    action,
    padding = 'md',
    children,
    className = '',
    ...props
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
            {...props}
        >
            {(title || subtitle || action) && (
                <div className={`flex items-start justify-between ${padding !== 'none' ? 'border-b border-gray-100 pb-4' : ''} ${paddingClasses[padding]}`}>
                    <div className="flex-1">
                        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    {action && <div className="ml-4">{action}</div>}
                </div>
            )}
            <div className={padding !== 'none' && (title || subtitle || action) ? paddingClasses[padding] + ' pt-4' : paddingClasses[padding]}>
                {children}
            </div>
        </div>
    );
};
