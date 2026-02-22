import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Lightbulb, Sparkles, ChevronRight, Zap, Target, Flame, Leaf, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

import type { UserProfile, InsightsResponse } from '../types/api';

interface TipsProps {
    user: UserProfile | null;
    insights: InsightsResponse | null;
    loading: boolean;
}

const containerVars: any = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 } // Slower stagger for dramatic effect
    }
};

const itemVars: any = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

const ICONS = [Sparkles, Target, Leaf, Activity, Flame, Lightbulb];
const COLORS = [
    { bg: 'bg-indigo-500/10', iconBg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/20', hoverBorder: 'hover:border-indigo-500/50', gradient: 'from-indigo-500' },
    { bg: 'bg-emerald-500/10', iconBg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/20', hoverBorder: 'hover:border-emerald-500/50', gradient: 'from-emerald-500' },
    { bg: 'bg-rose-500/10', iconBg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/20', hoverBorder: 'hover:border-rose-500/50', gradient: 'from-rose-500' },
    { bg: 'bg-amber-500/10', iconBg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/20', hoverBorder: 'hover:border-amber-500/50', gradient: 'from-amber-500' },
    { bg: 'bg-blue-500/10', iconBg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20', hoverBorder: 'hover:border-blue-500/50', gradient: 'from-blue-500' }
];

export const Tips = ({ user, insights, loading }: TipsProps) => {
    // Generate tips based on conditions
    const hasConditions = user?.conditions && user.conditions.length > 0;
    const isNewUser = !user || (!hasConditions && user.age === 0 && user.weight === 0);

    return (
        <div className="p-6 pt-10 pb-24 min-h-screen bg-black relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

            <header className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Daily Insights</h1>
                    <p className="text-sm text-zinc-400">Personalized AI recommendations</p>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Zap size={24} className="text-indigo-400" fill="currentColor" />
                </div>
            </header>

            <div className="space-y-4 relative z-10">
                {isNewUser ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-500/10 rounded-xl">
                                    <Lightbulb className="text-emerald-500" size={20} />
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Starter Guide</Badge>
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-white">Welcome to NutriScan!</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">Start by creating your profile and scanning your first meal to unlock personalized, AI-driven medical and dietary advice.</p>
                            <button className="flex items-center text-emerald-500 text-sm font-bold hover:text-emerald-400 transition-colors">
                                Complete Profile <ChevronRight size={16} className="ml-1" />
                            </button>
                        </Card>
                    </motion.div>
                ) : (
                    <>
                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <Card key={i} className="h-28 bg-zinc-900/50 border-zinc-800/50 flex items-start gap-4 p-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-800 shrink-0" />
                                        <div className="space-y-2 w-full pt-1">
                                            <div className="h-3 w-24 bg-zinc-800 rounded-full" />
                                            <div className="h-3 w-full bg-zinc-800 rounded-full" />
                                            <div className="h-3 w-4/5 bg-zinc-800 rounded-full" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : insights?.data?.tips?.length ? (
                            <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-5">
                                {insights.data.tips.map((tip, idx) => {
                                    const isHero = idx === 0;
                                    const isMedicalWarning = tip.toLowerCase().includes('hypertension') || tip.toLowerCase().includes('missed') || tip.toLowerCase().includes('hit 160 grams');

                                    // Default styling vs Medical Warning styling
                                    const baseColor = COLORS[idx % COLORS.length];
                                    const color = isMedicalWarning ? {
                                        bg: 'bg-red-500/10',
                                        text: 'text-red-500',
                                        iconBg: 'bg-red-500/20',
                                        border: 'border-red-500/30',
                                        hoverBorder: 'hover:border-red-500/50',
                                        gradient: 'from-red-500/20'
                                    } : baseColor;

                                    const Icon = isMedicalWarning ? Lightbulb : ICONS[idx % ICONS.length];

                                    return (
                                        <motion.div key={idx} variants={itemVars}>
                                            <Card className={`relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 ${isHero
                                                    ? `bg-gradient-to-br ${isMedicalWarning ? 'from-red-950/80' : 'from-indigo-950/60'} to-black ${isMedicalWarning ? 'border-red-500/50' : 'border-indigo-500/30'} shadow-[0_0_30px_rgba(${isMedicalWarning ? '239,68,68' : '99,102,241'},0.15)] p-6`
                                                    : `bg-zinc-900/40 backdrop-blur-xl border-zinc-800/60 ${color.hoverBorder} p-5 hover:bg-zinc-900/60`
                                                }`}>

                                                {/* Decorative Background Effects */}
                                                {isHero && <div className={`absolute top-0 right-0 w-64 h-64 ${isMedicalWarning ? 'bg-red-500/10' : 'bg-indigo-500/10'} blur-[80px] pointer-events-none rounded-full`} />}
                                                <div className={`absolute -right-8 -top-8 transition-transform duration-700 rotate-12 transform group-hover:rotate-0 scale-150 ${isHero ? `opacity-10 ${color.text}` : 'opacity-0 group-hover:opacity-5 text-current'
                                                    }`}>
                                                    <Icon size={140} />
                                                </div>

                                                <div className={`flex gap-4 relative z-10 ${isHero ? 'flex-col sm:flex-row items-start' : 'items-start'}`}>
                                                    <div className={`p-3.5 rounded-2xl shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg ${isHero ? color.iconBg : color.bg}`}>
                                                        <Icon size={isHero ? 28 : 22} className={color.text} />
                                                    </div>

                                                    <div className="flex-1 w-full">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${color.text}`}>
                                                                {isMedicalWarning ? "Medical Alert" : (isHero ? "Priority Insight" : "Daily Recommendation")}
                                                            </span>
                                                            {isHero && (
                                                                <span className={`px-2.5 py-1 rounded-full ${isMedicalWarning ? 'bg-red-500/20 border-red-500/30 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.3)]'} border text-[9px] font-bold uppercase tracking-widest animate-pulse flex items-center gap-1`}>
                                                                    <Sparkles size={10} /> Action Required
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={`font-medium leading-relaxed ${isHero ? 'text-white text-lg' : 'text-zinc-300 text-sm'} ${isMedicalWarning && !isHero ? 'text-red-100' : ''}`}>
                                                            {tip}
                                                        </p>

                                                        {/* Visual UI Bars for Impact */}
                                                        {isMedicalWarning && tip.includes('160 grams') && (
                                                            <div className="mt-4 bg-zinc-950 rounded-full h-2 w-full overflow-hidden border border-zinc-800">
                                                                <div className="bg-red-500 h-full rounded-full w-[86%]" />
                                                            </div>
                                                        )}
                                                        {isMedicalWarning && tip.includes('water goal') && (
                                                            <div className="mt-4 bg-zinc-950 rounded-full h-2 w-full overflow-hidden border border-zinc-800">
                                                                <div className="bg-cyan-500 bg-opacity-50 h-full rounded-full w-[60%] border-r-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                                            </div>
                                                        )}
                                                        {isMedicalWarning && tip.includes('hypertension') && (
                                                            <div className="mt-4 flex gap-1 h-3 w-full">
                                                                <div className="bg-emerald-500 w-1/4 rounded-sm" />
                                                                <div className="bg-amber-500 w-1/4 rounded-sm" />
                                                                <div className="bg-orange-500 w-1/4 rounded-sm" />
                                                                <div className="bg-red-600 w-1/4 rounded-sm animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Subtle left border gradient for non-hero items */}
                                                {!isHero && (
                                                    <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-100 transition-opacity duration-300 bg-gradient-to-b ${color.gradient} to-transparent`} />
                                                )}
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <Card className="bg-zinc-900/30 border-zinc-800/50 text-center py-16 flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/50" />
                                    <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 text-zinc-500 relative z-10 shadow-inner border border-zinc-800/80">
                                        <Lightbulb size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">Insights Loading...</h3>
                                    <p className="text-zinc-400 text-sm max-w-xs relative z-10 leading-relaxed text-center">
                                        Track more meals to help the AI generate highly customized health tips for you.
                                    </p>
                                </Card>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
