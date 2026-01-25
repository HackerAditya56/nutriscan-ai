import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Lightbulb } from 'lucide-react';
import type { UserProfile } from '../types/api';

interface TipsProps {
    user: UserProfile | null;
}

export const Tips = ({ user }: TipsProps) => {
    // Generate tips based on conditions
    const isNewUser = !user || (user.conditions.length === 0 && user.age === 0);

    return (
        <div className="p-6 pt-10 pb-24 space-y-6 bg-black min-h-screen">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Daily Tips</h1>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
                    <Lightbulb size={24} />
                </div>
            </header>

            <div className="space-y-4">
                {isNewUser ? (
                    <Card>
                        <Badge variant="default" className="mb-2">Starter Tip</Badge>
                        <h3 className="font-bold text-lg mb-2 text-white">Welcome to NutriScan!</h3>
                        <p className="text-zinc-400 text-sm">Start by creating your profile and scanning your first meal to get personalized advice.</p>
                    </Card>
                ) : (
                    <>
                        {(user.conditions.includes('Diabetes') || user.conditions.includes('PCOS')) && (
                            <Card className="bg-gradient-to-br from-lime-50 to-white dark:from-lime-900/10 dark:to-zinc-900 border-lime-200 dark:border-lime-800">
                                <Badge variant="success" className="mb-2">Sugar Control</Badge>
                                <h3 className="font-bold text-lg mb-2 text-white">Fiber is your friend</h3>
                                <p className="text-zinc-400 text-sm">Target 30g of fiber daily to improve digestion and stabilize blood sugar (insulin sensitivity).</p>
                            </Card>
                        )}

                        {user.conditions.includes('Hypertension') && (
                            <Card>
                                <Badge variant="warning" className="mb-2">Heart Health</Badge>
                                <h3 className="font-bold text-lg mb-2 text-white">Watch the Hidden Salt</h3>
                                <p className="text-zinc-400 text-sm">Many packaged "healthy" snacks are loaded with sodium. Check labels carefully.</p>
                            </Card>
                        )}

                        {/* Generic Tips for everyone */}
                        <Card>
                            <Badge className="mb-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Hydration</Badge>
                            <h3 className="font-bold text-lg mb-2 text-white">Drink before you eat</h3>
                            <p className="text-zinc-400 text-sm">Drinking a glass of water 30 minutes before a meal can help digestion and prevent overeating.</p>
                        </Card>

                        <Card>
                            <Badge className="mb-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Sleep</Badge>
                            <h3 className="font-bold text-lg mb-2 text-white">The 8-hour rule</h3>
                            <p className="text-zinc-400 text-sm">Quality sleep is just as important as diet for {user.name ? user.name : 'you'}. Avoid caffeine after 2 PM.</p>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
