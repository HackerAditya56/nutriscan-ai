import { useState } from 'react';
import type { UserProfile } from '../constants';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Moon, Sun, Settings, ChevronRight, Activity, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProfileProps {
    user: UserProfile;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const Profile = ({ user, isDarkMode, toggleTheme }: ProfileProps) => {
    // Local state for conditions to verify interactivity
    const [conditions, setConditions] = useState<string[]>(user.conditions);
    const [isAdding, setIsAdding] = useState(false);
    const [newCondition, setNewCondition] = useState("");

    const handleAddCondition = () => {
        if (newCondition.trim()) {
            setConditions([...conditions, newCondition.trim()]);
            setNewCondition("");
            setIsAdding(false);
        }
    };

    const removeCondition = (idx: number) => {
        setConditions(conditions.filter((_, i) => i !== idx));
    };

    return (
        <div className="p-6 pt-10 pb-24 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center">
                <div className="relative mb-4">
                    <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-800 shadow-xl" />
                    <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900">
                        <Activity size={16} className="text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {/* Removed Free Plan Badge */}
            </div>

            {/* Biometrics Card */}
            <Card className="grid grid-cols-2 gap-4 text-center divide-x divide-zinc-100 dark:divide-zinc-800">
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Gender</p>
                        <p className="text-lg font-bold">{user.gender}</p>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Height</p>
                        <p className="text-lg font-bold">{user.height} <span className="text-xs font-normal text-zinc-400">cm</span></p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Age</p>
                        <p className="text-lg font-bold">{user.age}</p>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Weight</p>
                        <p className="text-lg font-bold">{user.weight} <span className="text-xs font-normal text-zinc-400">kg</span></p>
                    </div>
                </div>
            </Card>

            {/* Medical Conditions */}
            <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 px-1">Medical Conditions</h3>
                <div className="flex flex-wrap gap-2">
                    {conditions.map((condition, idx) => (
                        <Badge key={idx} variant="danger" className="py-2 px-3 text-sm flex items-center gap-2 group">
                            {condition}
                            <button onClick={() => removeCondition(idx)} className="opacity-50 hover:opacity-100 ml-1">
                                <X size={12} />
                            </button>
                        </Badge>
                    ))}

                    {isAdding ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                autoFocus
                                value={newCondition}
                                onChange={(e) => setNewCondition(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCondition()}
                                className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-full px-3 py-1.5 text-sm w-32 outline-none focus:border-emerald-500"
                                placeholder="Condition..."
                            />
                            <button onClick={handleAddCondition} className="w-8 h-8 flex items-center justify-center bg-emerald-500 rounded-full text-white">
                                <Plus size={16} />
                            </button>
                            <button onClick={() => setIsAdding(false)} className="w-8 h-8 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded-full text-zinc-500">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-xs border border-dashed border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-full text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex items-center gap-1"
                        >
                            <Plus size={12} /> Add Condition
                        </button>
                    )}
                </div>
            </div>

            {/* Settings & Preferences */}
            <div className="space-y-3 pt-4">
                {/* Theme Toggle */}
                <Card className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors" onClick={toggleTheme}>
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-full", isDarkMode ? "bg-zinc-800 text-white" : "bg-orange-100 text-orange-500")}>
                            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <span className="font-medium">Dark Mode</span>
                    </div>
                    <div className={cn("w-12 h-6 rounded-full p-1 transition-colors relative bg-zinc-200 dark:bg-zinc-700")}>
                        <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-transform", isDarkMode ? "translate-x-6 bg-emerald-500" : "translate-x-0")} />
                    </div>
                </Card>

                {/* Other Static Settings items */}
                <Card className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
                            <Settings size={20} />
                        </div>
                        <span className="font-medium">Settings</span>
                    </div>
                    <ChevronRight size={20} className="text-zinc-400" />
                </Card>
            </div>
        </div>
    );
};
