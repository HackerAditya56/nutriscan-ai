import { Activity, HeartPulse, AlertOctagon, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import type { UserProfile } from '../types/api';

interface TruthProps {
    user: UserProfile | null;
}

export const Truth = ({ user }: TruthProps) => {
    // Determine risk level based on user data
    // Default to "Safe" for new users
    const hasConditions = user?.conditions && user.conditions.length > 0;
    const isNewUser = !user || (user.conditions.length === 0 && user.age === 0);

    if (isNewUser) {
        return (
            <div className="min-h-screen bg-black text-white p-6 pt-10 pb-28 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-emerald-900/20 rounded-full border border-emerald-500/20 text-emerald-500 mb-6">
                    <ShieldCheck size={48} />
                </div>
                <h1 className="text-2xl font-bold mb-2">No Risks Detected Yet</h1>
                <p className="text-zinc-500 max-w-xs">
                    Start scanning food and logging your meals to get AI-powered health insights here.
                </p>
            </div>
        );
    }

    // Dynamic Content
    const conditionsList = user.conditions.join(", ");
    const riskTitle = hasConditions ? "Health Risks Detected" : "Moderate Health Profile";
    const riskColor = hasConditions ? "text-red-500" : "text-amber-500";
    const bgGradient = hasConditions ? "from-red-950" : "from-amber-950";

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-10 pb-28">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 bg-opacity-20 rounded-2xl border border-opacity-20 ${hasConditions ? 'bg-red-900 border-red-500 text-red-500' : 'bg-amber-900 border-amber-500 text-amber-500'}`}>
                    <AlertOctagon size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">The Truth</h1>
                    <p className="text-zinc-500 text-sm">AI Analysis for {user.name}</p>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                {/* Main Warning */}
                <Card className={`bg-gradient-to-br ${bgGradient} to-black border-opacity-50 border-zinc-800 p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity size={100} className={hasConditions ? "text-red-500" : "text-amber-500"} />
                    </div>
                    <div className="relative z-10">
                        <h2 className={`text-2xl font-bold ${riskColor} mb-2`}>{riskTitle}</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Based on your profile ({conditionsList}), our AI has identified potential long-term risks if dietary guidelines are not followed.
                        </p>
                    </div>
                </Card>

                {/* Future Diseases */}
                {hasConditions && (
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <HeartPulse size={20} className="text-red-500" /> Specific Concerns
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {user.conditions.includes('Diabetes') && (
                                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-xl">🩸</div>
                                    <div>
                                        <h4 className="font-bold text-white">Blood Sugar Spikes</h4>
                                        <p className="text-xs text-zinc-500">Immediate risk from high GI foods.</p>
                                    </div>
                                </div>
                            )}
                            {user.conditions.includes('Hypertension') && (
                                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xl">🫀</div>
                                    <div>
                                        <h4 className="font-bold text-white">Cardiovascular Strain</h4>
                                        <p className="text-xs text-zinc-500">Monitor sodium intake strictly.</p>
                                    </div>
                                </div>
                            )}
                            {/* Generic Fallback */}
                            {!user.conditions.includes('Diabetes') && !user.conditions.includes('Hypertension') && (
                                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-xl">⚠️</div>
                                    <div>
                                        <h4 className="font-bold text-white">General Inflammation</h4>
                                        <p className="text-xs text-zinc-500">Risk aggravated by processed foods.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

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
