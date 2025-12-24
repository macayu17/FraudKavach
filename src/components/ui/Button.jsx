import React from 'react';
import { cn } from '@/lib/utils'; // Will create utils later or inline it. Actually inline is safer if I miss files.

// Simple inline merge for now if clsx/tailwind-merge not setup fully or just use template literals.
// But I installed clsx and tailwind-merge in package.json.
// I should create src/lib/utils.js first or inline.
// I'll inline for velocity or assume I create utils next.
// I'll create utils next.

export const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200",
        ghost: "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};
