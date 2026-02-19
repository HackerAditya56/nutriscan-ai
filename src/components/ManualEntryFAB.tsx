import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Zap, Sparkles, Loader2 } from 'lucide-react';

interface ManualEntryFABProps {
    onSubmit: (query: string) => void;
    isLoading?: boolean;
}

export const ManualEntryFAB = ({ onSubmit, isLoading = false }: ManualEntryFABProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragStartTime = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const wasLoading = useRef(false);

    // Initialize position (bottom-right area, above nav)
    useEffect(() => {
        setPosition({
            x: window.innerWidth - 76,
            y: window.innerHeight - 180,
        });
    }, []);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current && !isLoading) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, isLoading]);

    // Auto-close when loading finishes (was loading → now not loading)
    useEffect(() => {
        if (wasLoading.current && !isLoading) {
            // Loading just finished — close the modal
            setIsOpen(false);
            setQuery('');
            setSubmittedQuery('');
        }
        wasLoading.current = isLoading;
    }, [isLoading]);

    // --- Drag Logic (Touch + Mouse) ---
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (isOpen) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartPos.current = { x: clientX - position.x, y: clientY - position.y };
        dragStartTime.current = Date.now();
        setIsDragging(true);
    };

    const handleDragMove = (e: TouchEvent | MouseEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const newX = Math.max(16, Math.min(window.innerWidth - 60, clientX - dragStartPos.current.x));
        const newY = Math.max(60, Math.min(window.innerHeight - 100, clientY - dragStartPos.current.y));
        setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        const elapsed = Date.now() - dragStartTime.current;
        setIsDragging(false);
        if (elapsed < 200) {
            setIsOpen(true);
        }
    };

    useEffect(() => {
        if (isDragging) {
            const moveHandler = (e: TouchEvent | MouseEvent) => handleDragMove(e);
            const endHandler = () => handleDragEnd();
            window.addEventListener('touchmove', moveHandler, { passive: false });
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('touchend', endHandler);
            window.addEventListener('mouseup', endHandler);
            return () => {
                window.removeEventListener('touchmove', moveHandler);
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('touchend', endHandler);
                window.removeEventListener('mouseup', endHandler);
            };
        }
    }, [isDragging]);

    const handleSubmit = () => {
        if (!query.trim() || isLoading) return;
        setSubmittedQuery(query.trim());
        onSubmit(query.trim());
        // Don't close modal or clear query — wait for loading to finish
    };

    const suggestions = [
        '2 chapati with dal',
        '1 plate biryani',
        'Greek salad bowl',
        'Banana smoothie',
    ];

    return (
        <>
            {/* ===== Floating Draggable Button ===== */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        ref={dragRef}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="fixed z-[9999] touch-none select-none"
                        style={{ left: position.x, top: position.y }}
                        onTouchStart={handleDragStart}
                        onMouseDown={handleDragStart}
                    >
                        {/* Glow Ring */}
                        <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full scale-150 animate-pulse" />

                        {/* Main Button */}
                        <button
                            className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.5)] flex items-center justify-center transition-all active:scale-90 border border-emerald-300/30"
                        >
                            <Pencil size={22} className="text-white drop-shadow-sm" strokeWidth={2.5} />
                        </button>

                        {/* Label */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-emerald-400 tracking-widest uppercase opacity-80">
                            TYPE
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== Full Screen Modal ===== */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[10000] flex items-end justify-center"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => { if (!isLoading) setIsOpen(false); }}
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-lg bg-zinc-950 rounded-t-[2rem] border-t border-zinc-800 shadow-2xl overflow-hidden"
                        >
                            {/* Handle Bar */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 bg-zinc-700 rounded-full" />
                            </div>

                            {/* ===== LOADING STATE: Full Analyzing Animation ===== */}
                            {isLoading ? (
                                <div className="px-6 py-10 flex flex-col items-center gap-5">
                                    {/* Pulsing Icon */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                                        <div className="relative w-20 h-20 border-2 border-emerald-500/20 rounded-full flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm">
                                            <Zap size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                        </div>
                                        {/* Spinning ring */}
                                        <svg className="absolute inset-0 w-20 h-20 -rotate-90">
                                            <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-emerald-500/10" />
                                            <motion.circle
                                                cx="40" cy="40" r="38"
                                                stroke="currentColor" strokeWidth="2"
                                                fill="transparent"
                                                className="text-emerald-400"
                                                strokeDasharray="238"
                                                strokeDashoffset="238"
                                                animate={{ strokeDashoffset: 0 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                        </svg>
                                    </div>

                                    {/* Text */}
                                    <div className="flex flex-col items-center gap-1.5">
                                        <h3 className="text-xl font-bold text-white tracking-wider uppercase">Analyzing</h3>
                                        <p className="text-emerald-400/70 text-xs font-mono tracking-widest uppercase">Estimating Nutrients</p>
                                    </div>

                                    {/* What's being analyzed */}
                                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl px-4 py-3 max-w-[280px]">
                                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Looking up</p>
                                        <p className="text-white text-sm font-semibold truncate">{submittedQuery}</p>
                                    </div>

                                    {/* Progress dots */}
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-2 h-2 bg-emerald-500 rounded-full"
                                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* ===== NORMAL STATE: Input + Suggestions ===== */
                                <>
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-6 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                                                <Sparkles size={18} className="text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-base tracking-tight">What did you eat?</h3>
                                                <p className="text-zinc-500 text-[10px] font-medium tracking-wide">AI will estimate nutrition instantly</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                                        >
                                            <X size={16} className="text-zinc-400" />
                                        </button>
                                    </div>

                                    {/* Input Area */}
                                    <div className="px-6 pb-3">
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                            <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 group-focus-within:border-emerald-500/40 transition-colors overflow-hidden">
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={query}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                        if (e.key === 'Enter') handleSubmit();
                                                    }}
                                                    placeholder="e.g., 2 slices of pizza with cola..."
                                                    className="w-full bg-transparent text-white placeholder-zinc-600 px-4 py-4 outline-none font-medium text-sm"
                                                />
                                                {/* Submit Button (inside input) */}
                                                {query.trim() && (
                                                    <motion.button
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        onClick={handleSubmit}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-black rounded-xl px-3 py-2 flex items-center gap-1.5 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg"
                                                    >
                                                        <Zap size={14} fill="currentColor" />
                                                        Analyze
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Suggestions */}
                                    <div className="px-6 pb-6">
                                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-2">Quick picks</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((s, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setQuery(s)}
                                                    className="bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-xs text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Safe Area Padding for iOS */}
                            <div className="h-8 bg-zinc-950" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
