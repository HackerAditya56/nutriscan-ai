import { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

interface SetupProps {
    onSuccess: () => void;
}

export const Setup = ({ onSuccess }: SetupProps) => {
    const [url, setUrl] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState('');

    const handleTestConnection = async () => {
        if (!url.trim()) {
            setError('Please enter a valid URL');
            return;
        }

        setIsChecking(true);
        setError('');

        try {
            // Dynamically import the api to test with new URL
            const { api } = await import('../services/api');
            api.setBaseUrl(url);

            const isOnline = await api.ping();

            if (isOnline) {
                onSuccess();
            } else {
                setError('Server is not responding. Please check the URL.');
            }
        } catch (err) {
            setError('Failed to connect. Please verify the URL and try again.');
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-6"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <Server size={40} className="text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Server Configuration</h1>
                    <p className="text-zinc-400">
                        Enter your backend API URL (Ngrok or custom server)
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-zinc-400 block mb-2">API Base URL</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://your-app.ngrok-free.dev"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-colors"
                        />
                        <p className="text-xs text-zinc-600 mt-2">
                            Example: https://kaylynn-transthalamic-rolland.ngrok-free.dev
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleTestConnection}
                        disabled={isChecking}
                        className="w-full h-14 text-lg rounded-2xl bg-emerald-500 text-black hover:bg-emerald-400"
                    >
                        {isChecking ? (
                            <span className="flex items-center gap-2">
                                <RefreshCw size={20} className="animate-spin" />
                                Testing Connection...
                            </span>
                        ) : (
                            'Test & Save'
                        )}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
