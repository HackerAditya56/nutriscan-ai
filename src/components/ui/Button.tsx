
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = ({ children, variant = 'primary', size = 'md', className, ...props }: ButtonProps) => {
    const variants = {
        primary: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90",
        secondary: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700",
        ghost: "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
        danger: "bg-rose-500 text-white hover:bg-rose-600",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10 p-2 flex items-center justify-center rounded-full"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={cn("rounded-xl font-medium transition-colors flex items-center justify-center gap-2", variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};
