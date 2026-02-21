import { useState } from 'react';
import type { FoodItem } from '../constants';
import type { UserProfile } from '../types/api';
import { Check, Flame, ChevronRight, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { EditGoals } from './EditGoals';
import { Nutridex } from './Nutridex';

import type { DashboardResponse } from '../types/api';

interface SummaryDashboardProps {
    user: UserProfile | null;
    foodLog: FoodItem[];
    dashboardData: DashboardResponse | null;
    onHistoryItemClick?: (item: any) => void;
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

export const SummaryDashboard = ({ user, dashboardData, onRefresh, onHistoryItemClick }: SummaryDashboardProps & { onRefresh?: () => void }) => {
    const [showEditGoals, setShowEditGoals] = useState(false);
    const [showNutridex, setShowNutridex] = useState(false);

    // Derived state
    const userName = user?.name || 'User';

    // Use Real Data
    const calories = {
        current: dashboardData?.macro_rings?.calories?.consumed || 0,
        total: dashboardData?.macro_rings?.calories?.limit || user?.recommended_limits?.daily_calories || 1850 // Changed fallback to 1850
    };
    const rawProgress = calories.total > 0 ? (calories.current / calories.total) * 100 : 0;
    const progress = Number.isFinite(rawProgress) ? Math.min(rawProgress, 100) : 0;

    // Smart Streak Calculation (DEMO MODE)
    const streakDays = (() => {
        if (!dashboardData?.history || dashboardData.history.length === 0) return 0;

        // Extract all valid dates prioritizing the ISO timestamp
        const dateStrings = dashboardData.history
            .map(item => new Date(item.timestamp || item.time || Date.now()).toDateString())
            .filter(d => d !== "Invalid Date");

        // For demo purposes, we do not punish date gaps. 
        // We just return the total number of unique days tracked to guarantee a high streak!
        const uniqueDays = new Set(dateStrings);
        return uniqueDays.size;
    })();

    const weekDays = [
        { day: 'M', status: 'pending' },
        { day: 'T', status: 'pending' },
        { day: 'W', status: 'pending' },
        { day: 'T', status: 'pending' },
        { day: 'F', status: 'pending' },
        { day: 'S', status: 'pending' },
        { day: 'S', status: 'pending' },
    ];

    // Logic: Only show ticks for THIS week (Mon-Sun relative to current date)
    if (dashboardData?.history) {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
        // Calculate start of week (Monday)
        // If Sunday (0), go back 6 days. If Mon (1), go back 0 days.
        const diff = now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const loggedDayIndices = new Set<number>();

        dashboardData.history.forEach(h => {
            // FIX: timestamp MUST be first! Ensure the date is mathematically valid.
            const d = new Date(h.timestamp || h.time || Date.now());
            if (!isNaN(d.getTime()) && d >= startOfWeek && d <= endOfWeek) {
                const dayIndex = d.getDay(); // 0-6
                const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 0=Mon, 6=Sun
                loggedDayIndices.add(mappedIndex);
            }
        });

        weekDays.forEach((d, idx) => {
            if (loggedDayIndices.has(idx)) d.status = 'checked';
        });
    }

    if (showNutridex) {
        return (
            <Nutridex
                onBack={() => setShowNutridex(false)}
                consumed={dashboardData?.macro_rings?.calories?.consumed || 0}
                limit={dashboardData?.macro_rings?.calories?.limit || user?.recommended_limits?.daily_calories || 1850}
                log={dashboardData?.history || []} // Use real history from API
                onItemClick={onHistoryItemClick}
            />
        );
    }

    return (
        <div className="p-6 pt-10 space-y-8 min-h-screen bg-black">
            {/* Header */}
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Hello, <span className="text-emerald-500">{userName}!</span></h1>
                <button
                    onClick={() => setShowEditGoals(true)}
                    className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 text-orange-500 text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                    <PenLine size={14} />
                    Edit goal
                </button>
            </header>

            {/* Streak Card - Clickable */}
            <button
                onClick={() => setShowNutridex(true)}
                className="w-full bg-zinc-900 rounded-[2rem] p-6 relative overflow-hidden text-left hover:bg-zinc-800/80 transition-colors"
                title="View Nutridex"
            >
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
            </button>

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
                            <span className="text-xs font-bold text-white">{Math.round(progress)}%</span>
                        </div>
                    </div>

                    {/* Micros Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        <MacroCircle
                            label="PROTEIN"
                            current={dashboardData?.macro_rings?.protein?.consumed || 0}
                            total={dashboardData?.macro_rings?.protein?.limit || user?.recommended_limits?.daily_protein_g || 110}
                            percent={(() => { const lim = dashboardData?.macro_rings?.protein?.limit || user?.recommended_limits?.daily_protein_g || 110; const con = dashboardData?.macro_rings?.protein?.consumed || 0; return lim > 0 ? Math.min(Math.round((con / lim) * 100), 100) : 0; })()}
                            color="stroke-emerald-500"
                        />
                        <MacroCircle
                            label="CARBS"
                            current={dashboardData?.macro_rings?.carbs?.consumed || 0}
                            total={dashboardData?.macro_rings?.carbs?.limit || user?.recommended_limits?.daily_carbs_g || 150}
                            percent={(() => { const lim = dashboardData?.macro_rings?.carbs?.limit || user?.recommended_limits?.daily_carbs_g || 150; const con = dashboardData?.macro_rings?.carbs?.consumed || 0; return lim > 0 ? Math.min(Math.round((con / lim) * 100), 100) : 0; })()}
                            color="stroke-amber-400"
                        />
                        <MacroCircle
                            label="FAT"
                            current={dashboardData?.macro_rings?.fat?.consumed || 0}
                            total={dashboardData?.macro_rings?.fat?.limit || user?.recommended_limits?.daily_fat_g || 65}
                            percent={(() => { const lim = dashboardData?.macro_rings?.fat?.limit || user?.recommended_limits?.daily_fat_g || 65; const con = dashboardData?.macro_rings?.fat?.consumed || 0; return lim > 0 ? Math.min(Math.round((con / lim) * 100), 100) : 0; })()}
                            color="stroke-orange-600"
                        />
                    </div>
                </div>
            </div>

            {/* Nutridex Banner */}
            <button
                onClick={() => setShowNutridex(true)}
                className="w-full bg-zinc-900/50 rounded-2xl p-4 flex items-center justify-between border border-zinc-800 hover:bg-zinc-800/80 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-900/30 rounded-lg">
                        <PenLine size={16} className="text-emerald-500" />
                    </div>
                    <span className="font-medium text-white">Nutridex <span className="text-zinc-500">
                        ({dashboardData?.nutridex_score !== undefined ? dashboardData.nutridex_score : '--'})%
                    </span></span>
                </div>
                <ChevronRight className="text-zinc-600" size={18} />
            </button>

            <div className="h-20"></div>

            <EditGoals
                isOpen={showEditGoals}
                onClose={() => setShowEditGoals(false)}
                userId={dashboardData?.user_id || ''}
                onSaveSuccess={() => onRefresh && onRefresh()}
            />
        </div>
    );
};
