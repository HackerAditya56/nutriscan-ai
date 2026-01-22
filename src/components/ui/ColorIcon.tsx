import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ColorIconProps {
    icon: LucideIcon;
    color: string; // Tailwind color class e.g., "orange"
    className?: string;
    size?: number;
}

export const ColorIcon = ({ icon: Icon, color, className, size = 20 }: ColorIconProps) => {
    // Map simple color names to tailwind classes if needed, or expect full classes
    // Implementing a simple mapping for "premium" feel

    const colorMap: Record<string, { bg: string, text: string }> = {
        orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
        green: { bg: "bg-lime-100 dark:bg-lime-900/30", text: "text-lime-600 dark:text-lime-400" },
        blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
        red: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400" },
        yellow: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
        purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
        zinc: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-600 dark:text-zinc-400" },
    };

    const theme = colorMap[color] || colorMap.zinc;

    return (
        <div className={cn("p-2.5 rounded-xl flex items-center justify-center", theme.bg, className)}>
            <Icon size={size} className={theme.text} />
        </div>
    );
};
