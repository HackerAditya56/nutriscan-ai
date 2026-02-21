import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, PieChart, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';
// import { HISTORY_DATA } from '../constants'; // Use if needed
import { imageStore } from '../services/imageStore';

interface NutridexProps {
    onBack: () => void;
    consumed: number;
    limit: number;
    log: any[]; // Replace with FoodItem type if available
    onItemClick?: (item: any) => void;
}

export const Nutridex = ({ onBack, consumed, limit, log, onItemClick }: NutridexProps) => {
    const [view, setView] = useState<'today' | 'week' | 'month'>('today');
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [loadedImages, setLoadedImages] = useState<Record<string, string>>({});

    // Load Image Map on Mount
    useEffect(() => {
        const mapStr = localStorage.getItem('food_image_map');
        if (mapStr) {
            setImageMap(JSON.parse(mapStr));
        }
    }, []);

    // Fetch images when log or map changes
    useEffect(() => {
        const loadImages = async () => {
            const newImages: Record<string, string> = {};
            for (const item of log) {
                if (item.time && imageMap[item.time] && !loadedImages[item.time]) {
                    try {
                        const imgData = await imageStore.getImage(imageMap[item.time]);
                        if (imgData) {
                            newImages[item.time] = imgData;
                        }
                    } catch (e) {
                        console.error("Failed to load image for", item.time, e);
                    }
                }
            }
            if (Object.keys(newImages).length > 0) {
                setLoadedImages(prev => ({ ...prev, ...newImages }));
            }
        };

        if (log.length > 0 && Object.keys(imageMap).length > 0) {
            loadImages();
        }
    }, [log, imageMap]);

    // Enhanced Click Handler
    const handleItemClick = (item: any) => {
        if (!onItemClick) return;

        // Reconstruct visual details
        const reconstructedItem = {
            ...item,
            image: loadedImages[item.time] || null, // Pass the real image if we have it
            // Reconstruct type/status based on tags
            type: item.tags?.includes('DANGER') || item.tags?.includes('High Sugar') ? 'WARNING' : 'SAFE'
        };

        onItemClick(reconstructedItem);
    }

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
                            <p className="text-2xl font-bold text-white">{consumed.toLocaleString()}</p>
                            <p className="text-xs text-zinc-500 mt-1">kcal</p>
                        </Card>
                        <Card className="bg-zinc-900 border-zinc-800 p-4">
                            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Remaining</p>
                            <p className={cn("text-2xl font-bold", (limit - consumed) < 0 ? "text-red-500" : "text-emerald-500")}>
                                {(limit - consumed).toLocaleString()}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">kcal</p>
                        </Card>
                    </div>

                    <h3 className="text-zinc-400 font-bold text-sm">Today's Log</h3>
                    <div className="space-y-3">
                        {log.length > 0 ? (
                            log.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleItemClick(item)} // Handle click using enhanced handler
                                    className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 active:scale-[0.98] transition-transform cursor-pointer hover:bg-zinc-800/80"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Image Thumbnail */}
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                                            {loadedImages[item.time] ? (
                                                <img src={loadedImages[item.time]} className="w-full h-full object-cover" alt="Food" />
                                            ) : item.local_image_uri ? (
                                                <img src={item.local_image_uri} className="w-full h-full object-cover" alt="Food" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <p className="font-bold text-white">{item.food || item.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-xs text-zinc-500">{new Date(item.time || item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                {/* Optional Tags */}
                                                {item.tags && item.tags.length > 0 && (
                                                    <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md uppercase tracking-wide truncate max-w-[80px]">
                                                        {item.tags[0]}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Rich History: Macro Badges */}
                                            {item.macros && (
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                        P: {item.macros.p}g
                                                    </span>
                                                    <span className="text-[10px] font-bold bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded border border-blue-500/20">
                                                        C: {item.macros.c}g
                                                    </span>
                                                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20">
                                                        F: {item.macros.f}g
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">{item.calories}</p>
                                        <p className="text-xs text-zinc-500">kcal</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800/30 border-dashed">
                                No food logged today.
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {view === 'week' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800 p-6 flex flex-col items-center justify-center min-h-[220px]">
                        <div className="w-full flex items-end justify-between h-32 mb-4 px-2">
                            {/* Dummy Bar Chart for Demo */}
                            {[60, 85, 40, 75, 90, 50, 80].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="w-8 bg-zinc-800 rounded-t-sm relative group cursor-pointer hover:bg-zinc-700 transition-colors" style={{ height: '100%' }}>
                                        <div className="absolute bottom-0 left-0 w-full bg-emerald-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-zinc-400 font-bold text-sm">Weekly Caloric Intake</p>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="font-bold text-white">Avg. Calories</span>
                            </div>
                            <span className="text-xl font-bold">
                                {/* DEMO OVERRIDE: Hardcode demo average */}
                                {(1840).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                                    <PieChart size={20} />
                                </div>
                                <span className="font-bold text-white">Macro Balance</span>
                            </div>
                            <div className="flex gap-2 text-xs font-bold">
                                <span className="text-emerald-500">40% P</span>
                                <span className="text-amber-500">35% C</span>
                                <span className="text-orange-500">25% F</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {view === 'month' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-7 gap-2">
                        {/* Dynamic Calendar Grid - DEMO OVERRIDE */}
                        {(() => {
                            const daysInMonth = 30;
                            const grid = [];

                            // DEMO: We want exactly 21 days checked, ending on the 21st (today)
                            // This means days 1 through 21 (inclusive) should be checked.

                            for (let i = 1; i <= daysInMonth; i++) {
                                const isDemoLogged = i >= 1 && i <= 21;
                                const isToday = i === 21;

                                grid.push(
                                    <div
                                        key={i}
                                        className={cn(
                                            "aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                                            isToday ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]" :
                                                isDemoLogged ? "bg-emerald-900/40 text-emerald-500" :
                                                    "bg-zinc-900 text-zinc-600"
                                        )}
                                    >
                                        {i}
                                    </div>
                                );
                            }
                            return grid;
                        })()}
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-2xl">
                        <h4 className="font-bold text-white mb-2">Monthly Insights</h4>
                        <p className="text-sm text-zinc-500">
                            You tracked food on 21 days this month. Keep up the amazing work!
                        </p>
                    </div>
                </motion.div>
            )}

        </div>
    );
};
