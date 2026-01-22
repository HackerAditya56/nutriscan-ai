import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
    value: number;
    max: number;
    color?: string;
    className?: string;
}

export const ProgressBar = ({ value, max, color = "bg-primary", className }: ProgressBarProps) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={cn("h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden", className)}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("h-full rounded-full", color)}
            />
        </div>
    );
};
