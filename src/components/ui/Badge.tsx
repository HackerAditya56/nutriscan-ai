import React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'outline';

interface BadgeProps {
    children: React.ReactNode;
    variant?: Variant;
    className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
    const variants = {
        default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
        success: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400 border border-lime-200 dark:border-lime-800",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
        danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800",
        outline: "border border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 bg-transparent"
    };

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide", variants[variant], className)}>
            {children}
        </span>
    );
};
