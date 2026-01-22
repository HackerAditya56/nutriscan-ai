import { useState } from 'react';
import { ChevronLeft, BarChart3, TrendingUp, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';
// import { HISTORY_DATA } from '../constants'; // Use if needed

interface NutridexProps {
    onBack: () => void;
}

export const Nutridex = ({ onBack }: NutridexProps) => {
    const [view, setView] = useState<'today' | 'week' | 'month'>('today');

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-10 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Nutridex</h1>
                <div className="w-10"></div>
            </div>

            {/* Time Toggle */}
            <div className="bg-zinc-900 p-1 rounded-2xl flex mb-8">
                {['today', 'week', 'month'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setView(t as any)}
                        className={cn(
                            "flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all",
                            view === t ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500"
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {view === 'today' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-zinc-900 border-zinc-800 p-4">
                            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Consumed</p>
                            <p className="text-2xl font-bold text-white">2,062</p>
                            <p className="text-xs text-zinc-500 mt-1">kcal</p>
                        </Card>
                        <Card className="bg-zinc-900 border-zinc-800 p-4">
                            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Remaining</p>
                            <p className="text-2xl font-bold text-emerald-500">643</p>
                            <p className="text-xs text-zinc-500 mt-1">kcal</p>
                        </Card>
                    </div>

                    <h3 className="text-zinc-400 font-bold text-sm">Today's Log</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Oatmeal & Berries', cal: 320, time: '8:30 AM' },
                            { name: 'Grilled Chicken Salad', cal: 450, time: '1:15 PM' },
                            { name: 'Protein Shake', cal: 180, time: '4:00 PM' },
                            { name: 'Salmon & Rice', cal: 620, time: '7:30 PM' },
                            { name: 'Greek Yogurt', cal: 120, time: '9:45 PM' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                                <div>
                                    <p className="font-bold text-white">{item.name}</p>
                                    <p className="text-xs text-zinc-500">{item.time}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">{item.cal}</p>
                                    <p className="text-xs text-zinc-500">kcal</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {view === 'week' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800 p-6 flex flex-col items-center justify-center min-h-[200px]">
                        <BarChart3 size={48} className="text-zinc-700 mb-4" />
                        <p className="text-zinc-500 font-medium">Weekly Analysis Chart</p>
                        <p className="text-xs text-zinc-600">(Coming Soon)</p>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="font-bold text-white">Avg. Calories</span>
                            </div>
                            <span className="text-xl font-bold">2,150</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                                    <PieChart size={20} />
                                </div>
                                <span className="font-bold text-white">Macro Balance</span>
                            </div>
                            <span className="text-sm font-bold text-zinc-400">Good</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {view === 'month' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-7 gap-2">
                        {/* Mock Calendar Grid */}
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${i % 7 === 0 || i % 5 === 0 ? 'bg-emerald-900/40 text-emerald-500' : 'bg-zinc-900 text-zinc-600'}`}>
                                {i + 1}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-2xl">
                        <h4 className="font-bold text-white mb-2">Monthly Insights</h4>
                        <p className="text-sm text-zinc-500">You met your calorie goal 22 days this month. Keep it up!</p>
                    </div>
                </motion.div>
            )}

        </div>
    );
};
