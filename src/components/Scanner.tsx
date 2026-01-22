import { useState } from 'react';
import type { FoodItem } from '../constants';
import { FOOD_DATABASE } from '../constants';
import { ChevronDown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Badge } from './ui/Badge';

interface ScannerProps {
    onScanComplete: (item: FoodItem) => void;
}

type ScanMode = 'Label' | 'Meal' | 'Barcode';

export const Scanner = ({ onScanComplete }: ScannerProps) => {
    const [selectedFoodKey, setSelectedFoodKey] = useState<string>('fruit_salad');
    const [isScanning, setIsScanning] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [scanMode, setScanMode] = useState<ScanMode>('Meal');

    const currentFood = FOOD_DATABASE[selectedFoodKey];

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            onScanComplete(currentFood);
        }, 2000);
    };

    return (
        <div className="relative h-full w-full bg-black overflow-hidden flex flex-col">
            {/* Background Image (Viewfinder) */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 opacity-80"
                style={{ backgroundImage: `url(${currentFood.image})` }}
            />

            {/* Overlays */}
            <div className="absolute top-6 left-0 right-0 p-4 flex justify-between items-start z-20">
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/20"
                    >
                        <span className="text-sm font-medium">Demo: {currentFood.name}</span>
                        <ChevronDown size={14} />
                    </button>

                    {showDropdown && (
                        <div className="absolute top-full mt-2 left-0 w-56 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 z-50">
                            {Object.entries(FOOD_DATABASE).map(([key, item]) => (
                                <button
                                    key={key}
                                    onClick={() => { setSelectedFoodKey(key); setShowDropdown(false); }}
                                    className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                                >
                                    {item.name} <span className={cn("text-xs ml-2", item.type === 'DANGER' ? 'text-red-400' : 'text-green-400')}>• {item.type}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Badge variant="outline" className="bg-black/30 backdrop-blur text-white border-white/20">
                    AI Active
                </Badge>
            </div>

            {/* Viewfinder Overlay Graphics */}
            <div className="flex-1 relative z-10 mx-6 my-20 border-2 border-white/30 rounded-3xl overflow-hidden">
                {/* Corner marks */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl opacity-60"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl opacity-60"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl opacity-60"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl opacity-60"></div>

                {/* Laser Scan Animation */}
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ top: '-10%' }}
                            animate={{ top: '110%' }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="absolute left-0 right-0 h-2 bg-gradient-to-b from-primary/50 to-transparent shadow-[0_0_20px_rgba(101,163,13,0.8)]"
                        >
                            <div className="w-full h-[1px] bg-primary"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Thinking State */}
                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-black/60 backdrop-blur-lg px-6 py-3 rounded-full flex items-center gap-3 border border-white/10"
                        >
                            <Zap size={20} className="text-primary animate-pulse" />
                            <span className="text-white font-medium tracking-wide">Analyzing...</span>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="relative z-20 pb-28 pt-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center">
                {/* Mode Switcher */}
                <div className="flex gap-2 mb-8 bg-black/40 p-1.5 rounded-full backdrop-blur-sm border border-white/10">
                    {(['Label', 'Meal', 'Barcode'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setScanMode(mode)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                                scanMode === mode
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-zinc-400 hover:text-white"
                            )}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                {/* Shutter Button */}
                <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group active:scale-95 transition-transform"
                >
                    <div className="w-16 h-16 bg-white rounded-full group-hover:bg-zinc-200 transition-colors"></div>
                </button>
            </div>
        </div>
    );
};
