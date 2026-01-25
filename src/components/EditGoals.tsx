import { useState } from 'react';
import { X, Check, Calculator, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DAILY_MACRO_TARGETS } from '../constants';
import { api } from '../services/api';

interface EditGoalsProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSaveSuccess: () => void;
}

export const EditGoals = ({ isOpen, onClose, userId, onSaveSuccess }: EditGoalsProps) => {
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [targets, setTargets] = useState({ ...DAILY_MACRO_TARGETS });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (key: keyof typeof targets, value: string) => {
        setTargets(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
    };

    const handleSave = async () => {
        if (!userId) return;
        setIsSaving(true);
        try {
            await api.updateProfile({
                user_id: userId,
                custom_goals: {
                    daily_calories: targets.calories,
                    daily_protein_g: targets.protein,
                    daily_carbs_g: targets.carbs,
                    daily_fat_g: targets.fat,
                    daily_sugar_g: targets.sugar || 25
                }
            });
            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save goals:", error);
            alert("Failed to save goals. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        className="fixed bottom-0 left-0 right-0 bg-zinc-900 rounded-t-[2rem] z-[70] h-[85vh] overflow-hidden flex flex-col border-t border-zinc-800"
                    >
                        {/* Header */}
                        <div className="p-6 pb-2 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Edit Goals</h2>
                            <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 mb-6">
                            <div className="flex bg-zinc-800/50 p-1 rounded-2xl">
                                {['daily', 'weekly', 'monthly'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab
                                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6">
                            <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-500/20 text-orange-500 rounded-xl">
                                        <Calculator size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Calories</h3>
                                        <p className="text-xs text-zinc-500">Total energy target</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={targets.calories}
                                        onChange={(e) => handleChange('calories', e.target.value)}
                                        className="flex-1 bg-black text-2xl font-bold text-center text-white py-4 rounded-xl border border-zinc-700 focus:border-emerald-500 outline-none"
                                    />
                                    <span className="text-zinc-500 font-bold min-w-[3rem]">kcal</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-1">Macro Nutrients</h3>

                                <div className="grid grid-cols-1 gap-3">
                                    {/* Protein */}
                                    <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-800 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-white text-emerald-500">Protein</p>
                                            <p className="text-xs text-zinc-500">4 kcal/g</p>
                                        </div>
                                        <div className="flex items-center gap-2 w-32">
                                            <input
                                                type="number"
                                                value={targets.protein}
                                                onChange={(e) => handleChange('protein', e.target.value)}
                                                className="w-full bg-black text-lg font-bold text-center text-white py-2 rounded-lg border border-zinc-700 outline-none focus:border-emerald-500"
                                            />
                                            <span className="text-zinc-500 text-sm font-bold">g</span>
                                        </div>
                                    </div>

                                    {/* Carbs */}
                                    <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-800 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-white text-blue-500">Carbs</p>
                                            <p className="text-xs text-zinc-500">4 kcal/g</p>
                                        </div>
                                        <div className="flex items-center gap-2 w-32">
                                            <input
                                                type="number"
                                                value={targets.carbs}
                                                onChange={(e) => handleChange('carbs', e.target.value)}
                                                className="w-full bg-black text-lg font-bold text-center text-white py-2 rounded-lg border border-zinc-700 outline-none focus:border-blue-500"
                                            />
                                            <span className="text-zinc-500 text-sm font-bold">g</span>
                                        </div>
                                    </div>

                                    {/* Fats */}
                                    <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-800 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-white text-amber-500">Fats</p>
                                            <p className="text-xs text-zinc-500">9 kcal/g</p>
                                        </div>
                                        <div className="flex items-center gap-2 w-32">
                                            <input
                                                type="number"
                                                value={targets.fat}
                                                onChange={(e) => handleChange('fat', e.target.value)}
                                                className="w-full bg-black text-lg font-bold text-center text-white py-2 rounded-lg border border-zinc-700 outline-none focus:border-amber-500"
                                            />
                                            <span className="text-zinc-500 text-sm font-bold">g</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="p-6 border-t border-zinc-800 bg-zinc-900 absolute bottom-0 left-0 right-0">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
