import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SummaryDashboard } from './components/SummaryDashboard';
import { Scanner } from './components/Scanner';
import { AnalysisResults } from './components/AnalysisResults';
import { Profile } from './components/Profile';
import { Tips } from './components/Tips';
import { Truth } from './components/Truth'; // Import Truth
import type { FoodItem } from './constants';
import { USER_PROFILE } from './constants';
import { LayoutGrid, Camera, User, Lightbulb, AlertOctagon } from 'lucide-react'; // Add AlertOctagon
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type Tab = 'home' | 'scanner' | 'results' | 'profile' | 'tips' | 'truth'; // Add 'truth'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark as per design
  // const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  // const [hydration, setHydration] = useState(5);
  const [foodLog, setFoodLog] = useState<FoodItem[]>([]);
  const [lastScan, setLastScan] = useState<FoodItem | null>(null);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleScanComplete = (item: FoodItem) => {
    setLastScan(item);
    setFoodLog(prev => [item, ...prev]);
    setActiveTab('results');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <SummaryDashboard
            user={USER_PROFILE}
            foodLog={foodLog}
          />
        );
      case 'scanner':
        return <Scanner onScanComplete={handleScanComplete} />;
      case 'results':
        return <AnalysisResults item={lastScan} />;
      case 'profile':
        return <Profile user={USER_PROFILE} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />;
      case 'tips':
        return <Tips />;
      case 'truth':
        return <Truth />;
      default:
        return (
          <SummaryDashboard
            user={USER_PROFILE}
            foodLog={foodLog}
          />
        );
    }
  };

  return (
    <Layout>
      <div className={cn("h-full overflow-y-auto pb-24 custom-scrollbar", isDarkMode ? "bg-black text-white" : "bg-white text-zinc-900")}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Dock */}
      <div className="absolute bottom-6 left-4 right-4 h-16 bg-zinc-900/90 backdrop-blur-lg rounded-[2rem] shadow-2xl grid grid-cols-5 items-center px-2 border border-zinc-800 z-50">

        <button onClick={() => setActiveTab('profile')} className={cn("p-2 rounded-full transition-all flex flex-col items-center gap-1 justify-self-center", activeTab === 'profile' ? "text-emerald-500" : "text-zinc-500")}>
          <User size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>

        <button onClick={() => setActiveTab('home')} className={cn("p-2 rounded-full transition-all flex flex-col items-center gap-1 justify-self-center", activeTab === 'home' ? "text-emerald-500" : "text-zinc-500")}>
          <LayoutGrid size={24} />
          <span className="text-[10px] font-medium">Summary</span>
        </button>

        {/* Floating Camera Button */}
        <div className="relative -top-8 justify-self-center">
          <button
            onClick={() => setActiveTab('scanner')}
            className="w-16 h-16 bg-emerald-500 rounded-[1.2rem] shadow-xl shadow-emerald-500/20 flex items-center justify-center transition-transform active:scale-95 group"
          >
            <Camera size={28} className="text-black group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <button onClick={() => setActiveTab('tips')} className={cn("p-2 rounded-full transition-all flex flex-col items-center gap-1 justify-self-center", activeTab === 'tips' ? "text-emerald-500" : "text-zinc-500")}>
          <Lightbulb size={24} />
          <span className="text-[10px] font-medium">Tips</span>
        </button>

        <button onClick={() => setActiveTab('truth')} className={cn("p-2 rounded-full transition-all flex flex-col items-center gap-1 justify-self-center", activeTab === 'truth' ? "text-emerald-500" : "text-zinc-500")}>
          <AlertOctagon size={24} />
          <span className="text-[10px] font-medium">Truth</span>
        </button>

      </div>

    </Layout>
  );
}

export default App;
