import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Lightbulb, Sparkles, ChevronRight, Zap } from 'lucide-react';
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
        transition: { staggerChildren: 0.1 }
    }
};

const itemVars: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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
                            <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-4">
                                {insights.data.tips.map((tip, idx) => (
                                    <motion.div key={idx} variants={itemVars}>
                                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-zinc-800/60 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.05)] hover:-translate-y-0.5">
                                            {/* Decorative Background Icon */}
                                            <div className="absolute -right-6 -top-6 opacity-0 group-hover:opacity-5 transition-transform duration-500 rotate-12 transform group-hover:rotate-0">
                                                <Sparkles size={120} />
                                            </div>

                                            <div className="flex items-start gap-4 relative z-10 p-1">
                                                <div className="p-2.5 bg-indigo-500/10 rounded-xl shrink-0 mt-0.5 group-hover:bg-indigo-500/20 transition-colors">
                                                    <Sparkles size={20} className="text-indigo-400" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400/80">AI Suggestion</span>
                                                    </div>
                                                    <p className="text-zinc-300 text-sm leading-relaxed font-medium">{tip}</p>
                                                </div>
                                            </div>

                                            {/* Subtle left border gradient */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Card className="bg-zinc-900/30 border-zinc-800/50 text-center py-12 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                                        <Lightbulb size={24} />
                                    </div>
                                    <p className="text-zinc-400 text-sm max-w-[200px]">Log more meals to generate personalized insights.</p>
                                </Card>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
