import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Heart, Search } from 'lucide-react';

export const Saved = () => {
    return (
        <div className="p-6 pt-10 pb-24 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Saved Items</h1>
                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-full text-rose-600 dark:text-rose-400">
                    <Heart size={24} />
                </div>
            </header>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                <input
                    type="text"
                    placeholder="Search saved foods..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card className="p-0 overflow-hidden relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1565257329-a1b664d4f725?q=80&w=300&auto=format&fit=crop" className="w-full h-32 object-cover" />
                    <div className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-rose-500">
                        <Heart size={14} fill="currentColor" />
                    </div>
                    <div className="p-3">
                        <h4 className="font-bold text-sm truncate">Fruit Salad</h4>
                        <span className="text-xs text-zinc-500">90 kcal</span>
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop" className="w-full h-32 object-cover" />
                    <div className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-rose-500">
                        <Heart size={14} fill="currentColor" />
                    </div>
                    <div className="p-3">
                        <h4 className="font-bold text-sm truncate">Protein Bar</h4>
                        <span className="text-xs text-zinc-500">180 kcal</span>
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden relative group cursor-pointer opacity-80 grayscale">
                    <img src="https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=300&auto=format&fit=crop" className="w-full h-32 object-cover" />
                    <div className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-rose-500">
                        <Heart size={14} fill="currentColor" />
                    </div>
                    <div className="p-3">
                        <h4 className="font-bold text-sm truncate">Mango Juice</h4>
                        <Badge variant="danger" className="text-[10px] px-1.5 py-0">Avoid</Badge>
                    </div>
                </Card>
            </div>
        </div>
    );
}
