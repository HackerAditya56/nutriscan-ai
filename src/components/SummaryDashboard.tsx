import { useState } from 'react';
import type { UserProfile, FoodItem } from '../constants';
import { Check, Flame, ChevronRight, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { EditGoals } from './EditGoals';
import { Nutridex } from './Nutridex';

interface SummaryDashboardProps {
    user: UserProfile;    // keep for compatibility if needed
    foodLog: FoodItem[];  // keep for compatibility
}

// Circular Macro Widget
const MacroCircle = ({ label, current, total, color, percent }: { label: string, current: number, total: number, color: string, percent: number }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="flex flex-col items-center bg-zinc-900 rounded-3xl p-4 w-full aspect-square justify-center relative">
            <div className="relative w-20 h-20 flex items-center justify-center mb-1">
                <svg className="transform -rotate-90 w-full h-full">
                    <circle cx="50%" cy="50%" r={radius} className="stroke-zinc-800" strokeWidth="6" fill="transparent" />
                    <motion.circle
                        cx="50%" cy="50%" r={radius}
                        className={color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="transparent"
                        initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1 }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-white">{current}</span>
                    <span className="text-[10px] text-zinc-500">{percent}%</span>
                </div>
            </div>
            <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-zinc-400">
                    <span className="font-bold text-white">{current}</span>
                    <span>/{total}</span>
                </div>
                <div className={cn("text-[10px] font-bold uppercase mt-1",
                    label === 'PROTEIN' ? 'text-emerald-500' :
                        label === 'CARBS' ? 'text-amber-500' : 'text-orange-500'
                )}>
                    {label}
                </div>
            </div>
        </div>
    );
};

export const SummaryDashboard = ({ }: SummaryDashboardProps) => {
    const [showEditGoals, setShowEditGoals] = useState(false);
    const [showNutridex, setShowNutridex] = useState(false);

    // Mock Data based on screenshot
    const streakDays = 93;
    const weekDays = [
        { day: 'M', status: 'checked' },
        { day: 'T', status: 'checked' },
        { day: 'W', status: 'checked' },
        { day: 'T', status: 'checked' },
        { day: 'F', status: 'pending' },
        { day: 'S', status: 'pending' },
        { day: 'S', status: 'pending' },
    ];

    const calories = { current: 2062, total: 2705 };
    const progress = (calories.current / calories.total) * 100;

    if (showNutridex) {
        return <Nutridex onBack={() => setShowNutridex(false)} />;
    }

    return (
        <div className="p-6 pt-10 space-y-8 min-h-screen bg-black">
            {/* Header */}
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Summary</h1>
                <button
                    onClick={() => setShowEditGoals(true)}
                    className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 text-orange-500 text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                    <PenLine size={14} />
                    Edit goal
                </button>
            </header>

            {/* Streak Card */}
            <div className="bg-zinc-900/50 rounded-[2rem] p-6 border border-zinc-800/50">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-sm"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-sm"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></div>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white">Streak</h3>
                    </div>
                    <ChevronRight className="text-zinc-600" size={20} />
                </div>

                <div className="mb-6">
                    <span className="text-5xl font-bold text-white">{streakDays}</span>
                    <span className="text-xl text-zinc-500 ml-2">days</span>
                </div>

                <div className="flex justify-between">
                    {weekDays.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            {d.status === 'checked' ? (
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Check size={16} className="text-black font-bold" strokeWidth={4} />
                                </div>
                            ) : (
                                <div className="w-8 h-8 bg-zinc-800 rounded-full"></div>
                            )}
                            <span className="text-xs text-zinc-500 font-medium">{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Overview Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin-slow"></div>
                    <h3 className="text-lg font-bold text-white">Overview</h3>
                    <ChevronRight className="ml-auto text-zinc-600" size={20} />
                </div>

                <div className="space-y-4">
                    {/* Calories Card */}
                    <div className="bg-zinc-900 rounded-[2rem] p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-500">
                                <Flame size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-zinc-400">Calories</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">{calories.current.toLocaleString()}</span>
                                    <span className="text-sm text-zinc-600">/ {calories.total.toLocaleString()} kcal</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden mb-2">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-white">76%</span>
                        </div>
                    </div>

                    {/* Micros Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        <MacroCircle label="PROTEIN" current={46} total={196} percent={23} color="stroke-emerald-500" />
                        <MacroCircle label="CARBS" current={375} total={338} percent={100} color="stroke-amber-400" />
                        <MacroCircle label="FAT" current={42} total={63} percent={67} color="stroke-orange-400" />
                    </div>
                </div>
            </div>

            {/* Nutridex Banner (Optional based on screenshot bottom) */}
            <button
                onClick={() => setShowNutridex(true)}
                className="w-full bg-zinc-900/50 rounded-2xl p-4 flex items-center justify-between border border-zinc-800 hover:bg-zinc-800/80 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-900/30 rounded-lg">
                        <PenLine size={16} className="text-emerald-500" />
                    </div>
                    <span className="font-medium text-white">Nutridex <span className="text-zinc-500">(44.49%)</span></span>
                </div>
                <ChevronRight className="text-zinc-600" size={18} />
            </button>

            <div className="h-20"></div>

            <EditGoals isOpen={showEditGoals} onClose={() => setShowEditGoals(false)} />
        </div>
    );
};
