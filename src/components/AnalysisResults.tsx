import { useState } from 'react';
import type { FoodItem } from '../constants';
// import { Card } from './ui/Card';
// import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';
import {
    RefreshCw, Droplet, Flame, Bookmark, Info, Dumbbell,
    Leaf, Zap, Activity, CheckCircle
} from 'lucide-react';
import { cn } from '../lib/utils';;

interface AnalysisResultsProps {
    item: FoodItem | null;
}

// Nutrient Grid Card
const NutrientCard = ({ label, value, unit, icon: Icon, colorClass }: any) => (
    <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                <Icon size={16} className={cn(colorClass)} />
            </div>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{label}</p>
            <p className="text-xl font-bold text-white mt-0.5">{value} <span className="text-xs font-medium text-zinc-600">{unit}</span></p>
        </div>
        <div className={cn("absolute right-0 bottom-0 top-0 w-1/3 opacity-5 bg-gradient-to-l from-current to-transparent", colorClass)}></div>
    </div>
);

// Micro Nutrient Row
const MicroRow = ({ label, amount, icon, color }: any) => (
    <div className="bg-zinc-900/50 rounded-xl p-3 flex items-center gap-4 border border-zinc-800/50">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-zinc-900 border border-zinc-800", color)}>
            {icon || label.charAt(0)}
        </div>
        <div>
            <p className="font-bold text-white text-sm">{label}</p>
            <p className="text-xs text-zinc-500">{amount}</p>
        </div>
    </div>
);

// Swap Item Row
const SwapRow = ({ name, icon, percent }: any) => (
    <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between border border-zinc-800">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">
                {icon}
            </div>
            <div>
                <p className="font-bold text-white">{name}</p>
                <div className="h-1.5 w-24 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        </div>
        <button className="p-2 rounded-full border border-orange-500/30 text-orange-500 hover:bg-orange-900/20">
            <RefreshCw size={16} />
        </button>
    </div>
);

export const AnalysisResults = ({ item }: AnalysisResultsProps) => {
    if (!item) return null;
    const [activeTab, setActiveTab] = useState<'swaps' | 'nutrients' | 'summary'>('summary');

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-10 pb-28">
            {/* Header Identity */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img src={item.image} className="w-16 h-16 rounded-full border-2 border-zinc-800 object-cover" alt="Scan" />
                        <div className="absolute -bottom-1 -right-1 bg-zinc-900 p-1 rounded-full border border-zinc-800">
                            {/* Original image icon if provided */}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-0.5">FRUIT</p>
                        <h1 className="text-3xl font-bold text-white leading-tight">{item.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-20 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-3/4 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            </div>
                            <span className="text-xs font-bold text-zinc-400">75%</span>
                        </div>
                    </div>
                </div>
                <button className="w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <Bookmark size={20} fill="currentColor" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setActiveTab('swaps')}
                    className={cn("flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                        activeTab === 'swaps' ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" : "bg-zinc-900 text-zinc-400"
                    )}
                >
                    <RefreshCw size={18} /> Swaps
                </button>
                <button
                    onClick={() => setActiveTab('summary')}
                    className={cn("flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                        activeTab === 'summary' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-zinc-900 text-zinc-400"
                    )}
                >
                    <Activity size={18} /> Summary
                </button>
                <button
                    onClick={() => setActiveTab('nutrients')}
                    className={cn("flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                        activeTab === 'nutrients' ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-zinc-900 text-zinc-400"
                    )}
                >
                    <Leaf size={18} /> Nutrients
                </button>
            </div>

            {activeTab === 'summary' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Key Insights */}
                    <div>
                        <h3 className="text-zinc-400 font-bold mb-3 text-sm">Key Insights</h3>
                        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
                                    <Flame size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">High Sugar Content</h4>
                                    <p className="text-zinc-400 text-sm mt-1">This item contains <span className="text-rose-500 font-bold">14g of sugar</span> per serving, which is 40% of your daily limit.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Health Risks */}
                    <div>
                        <h3 className="text-zinc-400 font-bold mb-3 text-sm flex items-center gap-2">
                            <Activity size={16} className="text-rose-500" /> Health Risks
                        </h3>
                        <div className="bg-rose-900/10 rounded-2xl p-5 border border-rose-500/20">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                                    <p className="text-zinc-300 text-sm"><strong className="text-white">Insulin Spike:</strong> Rapid absorption of simple sugars can cause energy crashes.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                                    <p className="text-zinc-300 text-sm"><strong className="text-white">Inflammation:</strong> Excess sugar intake is linked to chronic inflammation.</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h3 className="text-zinc-400 font-bold mb-3 text-sm flex items-center gap-2">
                            <CheckCircle size={16} className="text-emerald-500" /> Better Alternative
                        </h3>
                        <div className="bg-emerald-900/10 rounded-2xl p-4 border border-emerald-500/20 flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-2xl">
                                🍏
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Green Apple</h4>
                                <p className="text-xs text-zinc-400 mt-0.5">Lower glycemic index and higher fiber.</p>
                            </div>
                            <Button size="sm" className="ml-auto bg-emerald-500 text-black hover:bg-emerald-400">
                                Swap
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'nutrients' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 className="text-zinc-400 font-bold mb-3 text-sm">Nutrition <span className="float-right text-xs bg-zinc-900 px-2 py-1 rounded text-zinc-600">Per: 118 g</span></h3>

                    {/* Macro Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <NutrientCard label="CALORIES" value={item.calories} unit="Kcal" icon={Flame} colorClass="text-orange-500" />
                        <NutrientCard label="PROTEIN" value={item.protein} unit="g" icon={Dumbbell} colorClass="text-rose-500" />
                        <NutrientCard label="CARBS" value={27.1} unit="g" icon={Zap} colorClass="text-amber-400" />
                        <NutrientCard label="FATS" value={0.3} unit="g" icon={Activity} colorClass="text-orange-400" />
                        <NutrientCard label="WATER" value={88.9} unit="ml" icon={Droplet} colorClass="text-blue-400" />
                        <NutrientCard label="FIBER" value={item.fiber} unit="g" icon={Leaf} colorClass="text-emerald-500" />
                    </div>

                    <h3 className="text-zinc-400 font-bold mb-3 text-sm">Micronutrients (milligrams) <span className="float-right text-xs bg-zinc-900 px-2 py-1 rounded text-zinc-600">Per: 118 g</span></h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <MicroRow label="Vitamin C" amount="14.5 mg" color="text-orange-500" />
                        <MicroRow label="Thiamin" amount="0.1 mg" color="text-yellow-500" />
                        <MicroRow label="Niacin" amount="0.8 mg" color="text-blue-400" />
                        <MicroRow label="Vitamin B6" amount="0.2 mg" color="text-purple-500" />
                    </div>

                    <h3 className="text-zinc-400 font-bold mb-3 text-sm">Micronutrients (micrograms) <span className="float-right text-xs bg-zinc-900 px-2 py-1 rounded text-zinc-600">Per: 118 g</span></h3>
                    <div className="grid grid-cols-2 gap-3">
                        <MicroRow label="Folate" amount="16.5 µg" color="text-emerald-500" icon="Fol" />
                        <MicroRow label="Vitamin K" amount="0.1 µg" color="text-green-500" icon="K" />
                    </div>
                </motion.div>
            )}

            {activeTab === 'swaps' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <h3 className="text-zinc-400 font-bold mb-1 text-sm flex items-center gap-2">
                        <Activity size={16} /> Vision Results
                    </h3>

                    <SwapRow name="Water" icon="💧" percent={30} />
                    <SwapRow name="Red Apple" icon="🍎" percent={0} />
                    <SwapRow name="Mandarins" icon="🍊" percent={0} />
                    <SwapRow name="Passionfruit" icon="🍊" percent={0} />
                    <SwapRow name="Eggplant" icon="🍆" percent={0} />

                    <div className="mt-6">
                        <h3 className="text-zinc-400 font-bold mb-2 text-sm flex items-center gap-2">
                            Custom
                        </h3>
                        <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between border border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
                                    <Info size={20} />
                                </div>
                                <span className="font-bold text-white">Custom Food</span>
                            </div>
                            <button className="p-2 rounded-full border border-orange-500/30 text-orange-500 hover:bg-orange-900/20">
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
            {/* Scan Again Button */}
            {/* Scan Again Button Removed */}
            <div className="h-4"></div>
        </div>
    );
};
