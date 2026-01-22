import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Lightbulb } from 'lucide-react';

export const Tips = () => {
    return (
        <div className="p-6 pt-10 pb-24 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Daily Tips</h1>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
                    <Lightbulb size={24} />
                </div>
            </header>

            <div className="space-y-4">
                <Card className="bg-gradient-to-br from-lime-50 to-white dark:from-lime-900/10 dark:to-zinc-900 border-lime-200 dark:border-lime-800">
                    <Badge variant="success" className="mb-2">Nutrition</Badge>
                    <h3 className="font-bold text-lg mb-2">Fiber is your friend</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Target 30g of fiber daily to improve digestion and stabilize blood sugar. Try adding chia seeds to your morning yogurt.</p>
                </Card>

                <Card>
                    <Badge variant="warning" className="mb-2">Hydration</Badge>
                    <h3 className="font-bold text-lg mb-2">Drink before you eat</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Drinking a glass of water 30 minutes before a meal can help digestion and prevent overeating.</p>
                </Card>

                <Card>
                    <Badge className="mb-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Sleep</Badge>
                    <h3 className="font-bold text-lg mb-2">The 8-hour rule</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Quality sleep is just as important as diet. Avoid caffeine after 2 PM for better rest.</p>
                </Card>
            </div>
        </div>
    );
}
