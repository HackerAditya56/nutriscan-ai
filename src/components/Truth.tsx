import { AlertTriangle, Activity, HeartPulse, Brain, Bone, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';

export const Truth = () => {
    return (
        <div className="min-h-screen bg-black text-white p-6 pt-10 pb-28">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-900/20 rounded-2xl border border-red-500/20 text-red-500">
                    <AlertOctagon size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">The Truth</h1>
                    <p className="text-zinc-500 text-sm">AI Prediction based on current habits</p>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                {/* Main Warning */}
                <Card className="bg-gradient-to-br from-red-950 to-black border-red-900/50 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity size={100} className="text-red-500" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-red-500 mb-2">High Risk Detected</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Continuing your current high-sugar, low-fiber diet increases your probability of chronic issues by <span className="text-white font-bold">65%</span> within the next 5 years.
                        </p>
                    </div>
                </Card>

                {/* Future Diseases */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <HeartPulse size={20} className="text-red-500" /> Projected Health Issues
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-xl">
                                🩸
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Type 2 Diabetes</h4>
                                <p className="text-xs text-zinc-500">High probability due to insulin resistance.</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xl">
                                🫀
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Hypertension</h4>
                                <p className="text-xs text-zinc-500">Excess sodium intake detected.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consequences */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Brain size={20} className="text-amber-500" /> Daily Consequences
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-4 p-4 bg-zinc-900 rounded-2xl">
                            <div className="mt-1">
                                <AlertTriangle size={18} className="text-amber-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Chronic Fatigue</h4>
                                <p className="text-xs text-zinc-400 mt-1">Energy crashes after meals will become frequent, affecting productivity.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-zinc-900 rounded-2xl">
                            <div className="mt-1">
                                <Bone size={18} className="text-zinc-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Joint Inflammation</h4>
                                <p className="text-xs text-zinc-400 mt-1">Increased sugar intake may lead to stiffer joints and reduced mobility.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Stark Reality Quote */}
                <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-900 text-center">
                    <p className="text-zinc-500 italic text-sm">
                        "Your health is an investment, not an expense. The bill comes due sooner than you think."
                    </p>
                </div>

            </motion.div>
        </div>
    );
};
