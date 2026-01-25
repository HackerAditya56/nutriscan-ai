import { useState } from 'react';
import type { FoodItem } from '../constants';

import { Button } from './ui/Button';
import { motion } from 'framer-motion';
import {
    RefreshCw, Flame, Zap, Activity, Dumbbell, Leaf, AlertTriangle, HelpCircle, Sparkles, AlertOctagon, ThumbsUp, ThumbsDown, X
} from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';;

interface AnalysisResultsProps {
    item: FoodItem | null;
    onLog: () => void;
    onRetake?: () => void;
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



export const AnalysisResults = ({ item, onLog, onRetake }: AnalysisResultsProps) => {
    if (!item) return null;
    const [activeTab, setActiveTab] = useState<'swaps' | 'nutrients' | 'summary'>('summary');
    const [isLogging, setIsLogging] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'correction'>('idle');
    const [correctionInput, setCorrectionInput] = useState('');
    const [showCorrectionModal, setShowCorrectionModal] = useState(false);

    const handleVerifyParams = async (isCorrect: boolean, correction?: string) => {
        const userId = localStorage.getItem('userId');
        if (!userId || !item.image) return;

        try {
            await api.verifyScan({
                user_id: userId,
                image_base64: item.image, // Now real image
                is_correct: isCorrect,
                user_correction: correction
            });
            setVerificationStatus('success');
            setShowCorrectionModal(false);
            // Could trigger a re-analysis here if needed
        } catch (e) {
            console.error("Verification failed", e);
            alert("Failed to send feedback.");
        }
    };

    const handleLog = async () => {
        setIsLogging(true);
        await onLog();
        setIsLogging(false);
    };

    const isError = item.name === "Scan Failed" || item.message.toLowerCase().includes("not recognized");

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-10 pb-28 relative">
            {/* Header Identity */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {item.image ? (
                            <img src={item.image} className="w-16 h-16 rounded-full border-2 border-zinc-800 object-cover" alt="Scan" />
                        ) : (
                            <div className="w-16 h-16 rounded-full border-2 border-zinc-800 bg-zinc-800 flex items-center justify-center">
                                <Flame size={24} className="text-zinc-600" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-zinc-900 p-1 rounded-full border border-zinc-800">
                            {/* Original image icon if provided */}
                        </div>
                    </div>
                </div>
                <div>
                    <p className={cn("text-xs font-bold uppercase tracking-wider mb-0.5", isError ? "text-amber-500" : "text-zinc-500")}>
                        {isError ? "ATTENTION" : "SCANNED"}
                    </p>
                    <h1 className="text-3xl font-bold text-white leading-tight">{item.name}</h1>

                    {/* Verification Loop - Thumbs Up/Down */}
                    {!isError && verificationStatus === 'idle' && (
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] text-zinc-500 font-medium">Did I get this right?</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleVerifyParams(true)}
                                    className="p-1.5 bg-zinc-800 rounded-full hover:bg-emerald-500/20 hover:text-emerald-500 transition-colors text-zinc-400"
                                >
                                    <ThumbsUp size={14} />
                                </button>
                                <button
                                    onClick={() => setShowCorrectionModal(true)}
                                    className="p-1.5 bg-zinc-800 rounded-full hover:bg-rose-500/20 hover:text-rose-500 transition-colors text-zinc-400"
                                >
                                    <ThumbsDown size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                    {verificationStatus === 'success' && (
                        <p className="text-[10px] text-emerald-500 font-bold mt-2 animate-pulse">Thanks! I learned that.</p>
                    )}


                    {/* UNKNOWN FOOD RETAKE FLOW */}
                    {item.name === "Unknown Food" || item.name === "Scan Failed" ? (
                        <div className="mt-4">
                            <Button
                                onClick={onRetake}
                                className="bg-white text-black font-bold py-3 px-8 rounded-full shadow-xl active:scale-95 transition-transform flex items-center gap-2"
                            >
                                <RefreshCw size={18} /> Retake Photo
                            </Button>
                        </div>
                    ) : !isError && (
                        <div className="flex flex-col gap-3 mt-1">
                            <span className="text-xs font-bold text-emerald-500">{item.calories} Kcal</span>
                            <Button
                                onClick={handleLog}
                                disabled={isLogging}
                                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 shadow-lg shadow-emerald-500/20 rounded-xl text-sm w-max"
                            >
                                {isLogging ? 'Saving...' : 'Track This Food'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {/* Tabs - Segmented Style */}
            <div className="flex bg-zinc-900 p-1 rounded-2xl mb-6">
                <button
                    onClick={() => setActiveTab('swaps')}
                    className={cn("flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all",
                        activeTab === 'swaps' ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    <RefreshCw size={16} /> Swaps
                </button>
                <button
                    onClick={() => setActiveTab('summary')}
                    className={cn("flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                        activeTab === 'summary' ? "bg-rose-500 text-white shadow-rose-500/20" : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    {isError ? <AlertTriangle size={16} /> : <Activity size={16} />} Summary
                </button>
                <button
                    onClick={() => setActiveTab('nutrients')}
                    className={cn("flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all",
                        activeTab === 'nutrients' ? "bg-emerald-500 text-black" : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    <Leaf size={16} /> Nutrients
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'summary' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="py-2">
                        <p className="text-zinc-300 text-lg leading-relaxed font-medium">{item.message}</p>
                    </div>
                    {item.benefits && item.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {item.benefits.map((b, i) => (
                                <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-bold border border-emerald-500/20 max-w-full truncate">{b}</span>
                            ))}
                        </div>
                    )}

                    {/* Summary Grid - Vertical List Style */}
                    {item.summaryGrid && item.summaryGrid.length > 0 && (
                        <div className="space-y-2 mt-2">
                            {item.summaryGrid.map((gridItem, i) => (
                                <div key={i} className={cn(
                                    "p-4 rounded-xl border flex items-center justify-between transition-all",
                                    gridItem.color === 'red' ? "bg-rose-900/10 border-rose-500/20" :
                                        gridItem.color === 'green' ? "bg-emerald-900/10 border-emerald-500/20" :
                                            "bg-amber-900/10 border-amber-500/20"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl bg-black/20 w-10 h-10 rounded-full flex items-center justify-center shadow-inner">
                                            {gridItem.emoji}
                                        </div>
                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{gridItem.label}</span>
                                    </div>
                                    <span className="text-lg font-bold text-white">{gridItem.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Dynamic Risk/Truth Card from Backend */}
                    {(item.type === 'DANGER' || item.type === 'WARNING' || item.type === 'ALLERGY' || isError) && (
                        <div className={cn(
                            "relative mt-4 overflow-hidden rounded-3xl p-6 border transition-all",
                            isError ? "bg-amber-950/80 border-amber-900/50" :
                                item.type === 'ALLERGY' ? "bg-gradient-to-br from-violet-950/90 to-black border-violet-900/50" :
                                    item.type === 'DANGER' ? "bg-gradient-to-br from-rose-950/80 to-black border-rose-900/50" :
                                        "bg-gradient-to-br from-amber-950/80 to-black border-amber-900/50",
                            (item.type === 'DANGER' || item.type === 'ALLERGY') && "animate-pulse-slow-border"
                        )}>
                            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full pointer-events-none opacity-20",
                                item.type === 'ALLERGY' ? "bg-violet-600" :
                                    item.type === 'DANGER' ? "bg-rose-600" : "bg-amber-600"
                            )}></div>

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className={cn("p-1.5 rounded-lg",
                                        item.type === 'ALLERGY' ? "bg-violet-500/20 text-violet-500" :
                                            item.type === 'DANGER' ? "bg-rose-500/20 text-rose-500" : "bg-amber-500/20 text-amber-500"
                                    )}>
                                        {isError ? <HelpCircle size={16} /> :
                                            item.type === 'ALLERGY' ? <AlertOctagon size={16} fill="currentColor" fillOpacity={0.2} /> :
                                                <AlertTriangle size={16} fill="currentColor" fillOpacity={0.2} />}
                                    </div>
                                    <h3 className={cn("font-bold text-xs tracking-widest uppercase",
                                        item.type === 'ALLERGY' ? "text-violet-500" :
                                            item.type === 'DANGER' ? "text-rose-500" : "text-amber-500"
                                    )}>
                                        {isError ? "Scan Status" : (item.type === 'ALLERGY' ? "ALLERGY WARNING" : "HEALTH ALERT")}
                                    </h3>
                                </div>
                                {(item.type === 'DANGER' || item.type === 'ALLERGY') && (
                                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                        item.type === 'ALLERGY' ? "bg-violet-500/10 border-violet-500/20 text-violet-500 animate-pulse" :
                                            "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                    )}>
                                        {item.type === 'ALLERGY' ? "Severe Risk" : "High Risk"}
                                    </div>
                                )}
                            </div>

                            {item.subtitle && (
                                <div className="relative z-10">
                                    <div className="flex flex-col gap-1 mb-3">
                                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">THE UNVARNISHED TRUTH</span>
                                        <p className="text-white text-xl font-bold leading-tight">
                                            What your body actually sees.
                                        </p>
                                    </div>
                                    {item.risks && item.risks.length > 0 ? (
                                        <div className="space-y-2">
                                            {item.risks.map((risk, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <div className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                                                        item.type === 'ALLERGY' ? "bg-violet-500" : "bg-rose-500"
                                                    )}></div>
                                                    <p className="text-zinc-400 text-xs font-medium leading-relaxed">{risk}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-zinc-400 text-xs font-medium leading-relaxed">
                                            Potential health impact detected based on your profile.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Daily Sugar Progress Bar */}
                    {item.dailySugarPercent !== undefined && (
                        <div className="mt-6 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Daily Sugar Limit</span>
                                <span className={cn("text-lg font-bold", item.dailySugarPercent > 100 ? "text-rose-500" : "text-white")}>
                                    {Math.round(item.dailySugarPercent)}%
                                </span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(item.dailySugarPercent, 100)}%` }}
                                    className={cn("h-full rounded-full", item.dailySugarPercent > 100 ? "bg-rose-500" : "bg-amber-400")}
                                />
                            </div>
                            {item.dailySugarPercent > 80 && (
                                <p className="text-[10px] text-rose-400 mt-2 font-medium">⚠️ Approaching daily limit!</p>
                            )}
                        </div>
                    )}

                    {item.aiAnalysis && (
                        <div className="mt-4 bg-zinc-900/80 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden">
                            <div className="absolute top-0 left-0 p-2">
                                <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-blue-900/20">
                                    <Sparkles size={10} className="text-blue-200" /> AI ANALYSIS
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm italic leading-relaxed pt-8 font-medium">
                                "{item.aiAnalysis}"
                            </p>
                        </div>
                    )}
                </motion.div>
            )}

            {activeTab === 'nutrients' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {(isError && item.calories === 0) ? (
                        <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
                            <p className="text-zinc-500">Nutritional data unavailable for this scan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {item.summaryGrid && item.summaryGrid.length > 0 ? (
                                item.summaryGrid.map((gridItem, i) => {
                                    const Icon = gridItem.label === 'CALORIES' ? Flame :
                                        gridItem.label === 'PROTEIN' ? Dumbbell :
                                            gridItem.label === 'SUGAR' ? Zap : Leaf;
                                    const colorClass = gridItem.color === 'red' ? 'text-rose-500' :
                                        gridItem.color === 'green' ? 'text-emerald-500' :
                                            gridItem.color === 'orange' ? 'text-orange-500' : 'text-amber-400';

                                    return (
                                        <NutrientCard
                                            key={i}
                                            label={gridItem.label}
                                            value={gridItem.value}
                                            unit=""
                                            icon={Icon}
                                            colorClass={colorClass}
                                        />
                                    );
                                })
                            ) : (
                                <>
                                    <NutrientCard label="CALORIES" value={item.calories} unit="Kcal" icon={Flame} colorClass="text-orange-500" />
                                    <NutrientCard label="PROTEIN" value={item.protein} unit="g" icon={Dumbbell} colorClass="text-rose-500" />
                                    <NutrientCard label="SUGAR" value={item.sugar} unit="g" icon={Zap} colorClass="text-amber-400" />
                                    <NutrientCard label="FIBER" value={item.fiber} unit="g" icon={Leaf} colorClass="text-emerald-500" />
                                </>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {activeTab === 'swaps' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <p className="text-zinc-400 text-sm font-medium">Healthier Alternatives</p>
                    {item.swaps && item.swaps.length > 0 ? (
                        <div className="flex flex-col gap-3 pb-4">
                            {item.swaps.map((swapName, i) => (
                                <div key={i} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 flex items-start gap-4 active:scale-[0.98] transition-all h-auto min-h-[4.5rem]">
                                    {/* Icon Placeholder */}
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Leaf className="text-emerald-500" size={18} />
                                    </div>

                                    {/* Content - Fully fluid height */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-base text-zinc-100 leading-snug break-words whitespace-normal">{swapName}</h4>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                Healthier Choice
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-500 text-center py-8">No specific swaps found.</p>
                    )}
                </motion.div>
            )}

            <div className="h-4"></div>

            {/* Correction Modal */}
            {showCorrectionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Help me learn</h3>
                            <button onClick={() => setShowCorrectionModal(false)}><X size={20} className="text-zinc-500" /></button>
                        </div>
                        <p className="text-zinc-400 text-sm mb-4">What is this item actually? Your input helps improve the AI.</p>

                        <input
                            type="text"
                            placeholder="e.g. Banana"
                            value={correctionInput}
                            onChange={(e) => setCorrectionInput(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 mb-4 font-medium"
                            autoFocus
                        />

                        <Button
                            onClick={() => handleVerifyParams(false, correctionInput)}
                            disabled={!correctionInput.trim()}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl disabled:opacity-50"
                        >
                            Submit Correction
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
