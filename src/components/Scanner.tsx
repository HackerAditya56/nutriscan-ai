import { useState } from 'react';
import Webcam from 'react-webcam';
import { useZxing } from 'react-zxing';
// Removed unused imageCompression import
import { Camera, Zap, RotateCcw, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { api } from '../services/api';
import type { ScanResponse } from '../types/api';
import { Badge } from './ui/Badge';

interface ScannerProps {
    onScanComplete: (data: ScanResponse, imageSrc?: string) => void;
}

type ScanMode = 'Barcode' | 'Photo' | 'Fresh';

export const Scanner = ({ onScanComplete }: ScannerProps) => {
    const [scanMode, setScanMode] = useState<ScanMode>('Photo');
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Captured Image State for UI Feedback
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    // Barcode Scanner Setup
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

    const { ref: zxingRef } = useZxing({
        onDecodeResult: async (result) => {
            if (!isScanning) {
                handleBarcodeScan(result.getText());
            }
        },
        paused: isScanning || scanMode !== 'Barcode',
        constraints: {
            video: {
                facingMode: 'environment',
                width: { ideal: 2560 },
                height: { ideal: 1440 }
            }
        },

    });

    // Merge refs for video element
    const barcodeRef = (node: HTMLVideoElement) => {
        zxingRef.current = node;
        setVideoElement(node);
    };

    // Photo Scanner Setup
    const [webcamRef, setWebcamRef] = useState<Webcam | null>(null);

    const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (err) => {
                        console.warn("Geolocation error:", err);
                        // Default to New Delhi if perm denied
                        resolve({ latitude: 28.61, longitude: 77.20 });
                    }
                );
            } else {
                resolve({ latitude: 28.61, longitude: 77.20 });
            }
        });
    };

    const handleBarcodeScan = async (barcode: string) => {
        setIsScanning(true);
        setError(null);
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setError("User ID not found. Please restart app.");
            setIsScanning(false);
            return;
        }

        try {
            const loc = await getCurrentLocation();

            const response = await api.scan({
                user_id: userId,
                barcode: barcode,
                latitude: loc.latitude,
                longitude: loc.longitude
            });

            if (response.error === 'barcode_not_found') {
                setError("Barcode not found. Try Photo Mode.");
                setIsScanning(false);
                return;
            }

            onScanComplete(response, undefined); // No image for barcode yet
            setIsScanning(false); // Reset scanning state after complete
        } catch (err) {
            console.error("Scan failed:", err);
            setError("Failed to analyze barcode.");
            setIsScanning(false);
        }
    };

    const handleManualCapture = async () => {
        let imageSrc: string | null | undefined = null;

        // Capture logic depending on mode
        if (scanMode === 'Barcode') {
            if (videoElement) {
                // Capture from video element (Barcode Mode)
                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                canvas.getContext('2d')?.drawImage(videoElement, 0, 0);
                imageSrc = canvas.toDataURL('image/jpeg');
            }
        } else {
            // HIGH-RES CAPTURE: Get direct stream frame, ignore viewport size
            if (webcamRef?.video) {
                const video = webcamRef.video;
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;   // Real Camera HW Resolution (e.g. 3840)
                canvas.height = video.videoHeight; // Real Camera HW Resolution (e.g. 2160)

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(video, 0, 0);
                imageSrc = canvas.toDataURL('image/jpeg', 0.95); // 0.95 Quality (OCR Sweet Spot)
            }
        }

        if (!imageSrc) return;

        // FREEZE FRAME: Show captured image immediately
        setCapturedImage(imageSrc);
        setIsScanning(true);
        setError(null);

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError("User ID not found.");
            setCapturedImage(null);
            setIsScanning(false);
            return;
        }

        try {
            // RAW HIGH-RES CAPTURE - NO COMPRESSION
            // Direct Base64 send for maximum AI clarity
            const rawBase64 = imageSrc.replace(/^data:image\/\w+;base64,/, "");
            console.log("Sending RAW 4K Image (Length):", rawBase64.length);

            const loc = await getCurrentLocation();

            try {
                let response;
                const commonData = {
                    user_id: userId,
                    image_base64: rawBase64,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    persona: 'witty' as const
                };

                if (scanMode === 'Fresh') {
                    response = await api.scanFood(commonData);
                } else {
                    response = await api.scan(commonData);
                }

                onScanComplete(response, imageSrc);
            } catch (apiErr) {
                console.error("API Error:", apiErr);
                setError("Server error. Try again.");
                setCapturedImage(null);
                setIsScanning(false);
            }

        } catch (err) {
            console.error("Capture error:", err);
            setError("Image processing failed.");
            setCapturedImage(null);
            setIsScanning(false);
        }
    };

    return (
        <div className="relative h-full w-full bg-black overflow-hidden flex flex-col font-sans">
            {/* Camera View */}
            <div className="flex-1 relative bg-black rounded-b-[2rem] overflow-hidden shadow-2xl">
                {(capturedImage || (isScanning && scanMode === 'Barcode')) ? (
                    // CAPTURED STATE: Frozen image with optimized overlay
                    <div className="absolute inset-0 z-20 bg-black">
                        {capturedImage && (
                            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover opacity-60" />
                        )}

                        {/* Optimized Scanning Animation (CSS only, no heavy SVG) */}
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none">
                            <motion.div
                                className="absolute inset-x-0 h-1 bg-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.6)]"
                                initial={{ top: '0%' }}
                                animate={{ top: '100%' }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                        </div>

                        {/* Modern HUD Loader */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse-slow"></div>
                                <div className="relative w-20 h-20 border-2 border-emerald-500/20 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                    <Zap size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                </div>
                                <svg className="absolute inset-0 w-20 h-20 -rotate-90">
                                    <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-emerald-500/20" />
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
                            <div className="flex flex-col items-center gap-2">
                                <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Analyzing</h2>
                                <p className="text-emerald-400/80 text-xs font-mono tracking-widest uppercase">Identifying Nutrients</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // LIVE CAMERA STATE
                    <>
                        {scanMode === 'Barcode' ? (
                            <video
                                ref={barcodeRef}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <Webcam
                                    audio={false}
                                    screenshotFormat="image/jpeg"
                                    onUserMediaError={(err) => {
                                        console.error("Webcam Error:", err);
                                        setError("Camera failed to start. Check permissions.");
                                    }}
                                    videoConstraints={{
                                        facingMode: "environment", // Prefer rear, allow desktop fallback
                                        width: { ideal: 2560 },    // OCR Sweet Spot (QHD)
                                        height: { ideal: 1440 },
                                        // @ts-ignore - advanced focus constraints
                                        advanced: [{ focusMode: "continuous" }]
                                    }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    ref={ref => setWebcamRef(ref)}
                                />
                                {/* Focus tip removed for instant capture speed */}
                            </>
                        )}

                        {/* Focus Tip & Brackets */}
                        {scanMode !== 'Barcode' && !capturedImage && (
                            <>
                                {/* Focus Brackets (Center) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-lg pointer-events-none z-10 opacity-60">
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400/50 rounded-full"></div>
                                </div>

                                {/* Text Tip */}
                                <div className="absolute top-24 left-0 right-0 flex justify-center z-10 opacity-80 pointer-events-none">
                                    <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] text-white font-bold uppercase tracking-widest border border-emerald-500/30 animate-pulse shadow-lg">
                                        Tap & Hold Steady
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Modern Viewfinder */}
                        <div className="absolute inset-0 z-10 pointer-events-none p-8">
                            <div className="w-full h-full relative">
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/40 rounded-tl-3xl"></div>
                                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/40 rounded-tr-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white/40 rounded-bl-3xl"></div>
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/40 rounded-br-3xl"></div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white"></div>
                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-white"></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Status Pills */}
                <div className="absolute top-6 w-full flex justify-center z-20 px-4">
                    <AnimatePresence>
                        {error ? (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Badge className="bg-rose-500 text-white border-0 shadow-lg px-4 py-2 flex items-center gap-2">
                                    <X size={14} /> {error}
                                </Badge>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modern Controls Area */}
            {!capturedImage && (
                <div className="bg-black pt-6 pb-28 px-6 flex flex-col items-center gap-8 z-20">

                    {/* Mode Switcher */}
                    <div className="bg-zinc-900/80 backdrop-blur-xl p-1.5 rounded-full border border-zinc-800 flex relative w-max">
                        <motion.div
                            className="absolute top-1.5 bottom-1.5 bg-zinc-700 rounded-full shadow-sm z-0"
                            initial={false}
                            animate={{
                                left: scanMode === 'Barcode' ? '4px' : scanMode === 'Photo' ? '33.3%' : '66.6%',
                                width: '28%', // Approximate for 3 items
                                x: scanMode === 'Barcode' ? 0 : scanMode === 'Photo' ? 10 : 20 // Fine tune alignment
                            }}
                            // Creating a simpler positioning logic for 3 items
                            style={{
                                left: scanMode === 'Barcode' ? '4px'
                                    : scanMode === 'Photo' ? 'calc(33.33% + 4px)'
                                        : 'calc(66.66% + 4px)',
                                width: 'calc(33.33% - 8px)'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => setScanMode('Barcode')}
                            className={cn(
                                "relative z-10 px-4 py-2 rounded-full text-[10px] font-bold tracking-wider transition-colors flex items-center justify-center gap-1 w-24",
                                scanMode === 'Barcode' ? "text-white" : "text-zinc-500"
                            )}
                        >
                            <RotateCcw size={12} /> CODE
                        </button>
                        <button
                            onClick={() => setScanMode('Photo')}
                            className={cn(
                                "relative z-10 px-4 py-2 rounded-full text-[10px] font-bold tracking-wider transition-colors flex items-center justify-center gap-1 w-24",
                                scanMode === 'Photo' ? "text-white" : "text-zinc-500"
                            )}
                        >
                            <Camera size={12} /> PACKAGED
                        </button>
                        <button
                            onClick={() => setScanMode('Fresh')}
                            className={cn(
                                "relative z-10 px-4 py-2 rounded-full text-[10px] font-bold tracking-wider transition-colors flex items-center justify-center gap-1 w-24",
                                scanMode === 'Fresh' ? "text-white" : "text-zinc-500"
                            )}
                        >
                            <Leaf size={12} /> FRESH
                        </button>
                    </div>

                    {/* Shutter Button - Only for Photo/Fresh modes */}
                    {scanMode !== 'Barcode' && (
                        <div className="relative">
                            <button
                                onClick={handleManualCapture}
                                disabled={isScanning}
                                className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center relative active:scale-95 transition-transform"
                            >
                                <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-shadow"></div>
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

