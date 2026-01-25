import { motion } from 'framer-motion';
import { ServerCrash, RefreshCw, Settings } from 'lucide-react';
import { Button } from './ui/Button';

interface ServerOfflineProps {
    onRetry: () => void;
    onChangeServer: () => void;
}

export const ServerOffline = ({ onRetry, onChangeServer }: ServerOfflineProps) => {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md"
            >
                <div className="w-24 h-24 mx-auto mb-6 bg-rose-500/10 rounded-full flex items-center justify-center">
                    <ServerCrash size={48} className="text-rose-500" />
                </div>

                <h1 className="text-3xl font-bold mb-3">Server Offline</h1>
                <p className="text-zinc-400 mb-8">
                    Unable to connect to the backend server. Please check your connection or try again later.
                </p>

                <div className="space-y-3">
                    <Button
                        onClick={onRetry}
                        className="w-full h-14 text-lg rounded-2xl bg-emerald-500 text-black hover:bg-emerald-400 flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={20} />
                        Retry Connection
                    </Button>

                    <Button
                        onClick={onChangeServer}
                        className="w-full h-14 text-lg rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700 flex items-center justify-center gap-2"
                    >
                        <Settings size={20} />
                        Change Server
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
