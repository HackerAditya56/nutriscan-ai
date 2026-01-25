import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { api } from '../services/api';

interface SplashProps {
    onReady: () => void;
    onSetupNeeded: () => void;
    onServerOffline: () => void;
}

export const Splash = ({ onReady, onSetupNeeded, onServerOffline }: SplashProps) => {
    const [status, setStatus] = useState('Initializing...');

    useEffect(() => {
        checkServerHealth();
    }, []);

    const checkServerHealth = async () => {
        // Check if API URL is configured
        const apiUrl = localStorage.getItem('apiBaseUrl');

        if (!apiUrl) {
            setStatus('Server configuration needed');
            setTimeout(() => onSetupNeeded(), 1500);
            return;
        }

        // Ping the server
        setStatus('Connecting to server...');
        const isOnline = await api.ping();

        if (isOnline) {
            setStatus('Connected! Loading...');
            setTimeout(() => onReady(), 800);
        } else {
            setStatus('Server offline');
            setTimeout(() => onServerOffline(), 1500);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="w-32 h-32 mx-auto mb-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <Brain size={64} className="text-emerald-500" />
                </div>

                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                    NutriScan AI
                </h1>
                <p className="text-zinc-500 mb-8">Medical Intelligence for Your Food</p>

                <div className="flex items-center justify-center gap-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"
                    />
                    <span className="text-sm text-zinc-400">{status}</span>
                </div>
            </motion.div>
        </div>
    );
};
