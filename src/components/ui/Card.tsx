import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    gradient?: boolean;
}

export const Card = ({ children, className, gradient, ...props }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "rounded-2xl p-5 shadow-sm border border-white/40 dark:border-white/5 backdrop-blur-md",
                gradient ? "bg-gradient-to-br from-white/90 to-white/50 dark:from-zinc-800/90 dark:to-zinc-900/50" : "bg-white dark:bg-zinc-900",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
