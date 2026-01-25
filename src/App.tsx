import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SummaryDashboard } from './components/SummaryDashboard';
import { Scanner } from './components/Scanner';
import { AnalysisResults } from './components/AnalysisResults';
import { Profile } from './components/Profile';
import { Tips } from './components/Tips';
import { Truth } from './components/Truth';
import { Onboarding } from './components/Onboarding';
import { Splash } from './components/Splash';
import { Setup } from './components/Setup';
import { LandingPage } from './components/LandingPage';
import { Settings } from './components/Settings';
import { ServerOffline } from './components/ServerOffline';
import type { FoodItem } from './constants';
import { LayoutGrid, Camera, User, Lightbulb, AlertOctagon } from 'lucide-react';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './services/api';
import type { DashboardResponse, UserProfile } from './types/api';


type Tab = 'home' | 'scanner' | 'results' | 'profile' | 'tips' | 'truth' | 'onboard' | 'settings';
type AppView = 'splash' | 'setup' | 'offline' | 'app' | 'landing';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('onboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [foodLog] = useState<FoodItem[]>([]);
  const [lastScan, setLastScan] = useState<FoodItem | null>(null);

  // Data from Backend
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [lastScanResult, setLastScanResult] = useState<any | null>(null);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleScanComplete = (response: any, imageSrc?: string) => {
    console.log("Raw Scan Response:", response);

    // 1. Robust Data Extraction
    // Check multiple locations for nutrition data as requested
    const scanResult = response.scan_result || {};
    const macros = response.nutrition || response.macros || scanResult.macros || {};
    const micros = response.micronutrients || scanResult.micronutrients || {};

    // Helper to extract numeric value from multiple keys case-insensitively
    const getVal = (...keys: string[]) => {
      for (const key of keys) {
        if (macros[key] !== undefined) return parseFloat(String(macros[key])) || 0;
        if (micros[key] !== undefined) return parseFloat(String(micros[key])) || 0;
        // Also check scanResult root for calories
        if (scanResult[key] !== undefined) return parseFloat(String(scanResult[key])) || 0;
      }
      return 0;
    };

    const safeTruth = response.ui_cards?.truth || { status: 'safe', title: 'Scanned', subtitle: 'Analyzing...', risks: [] };
    const safeSwaps = response.ui_cards?.swaps || [];

    // Map backend response to frontend FoodItem format
    const mappedItem: FoodItem = {
      name: scanResult.food_name || "Unknown Food",
      calories: getVal('Calories', 'calories'),
      sugar: getVal('Sugar', 'sugar'), // Sugar is often in micronutrients or top level
      fiber: getVal('Fiber', 'fiber'),
      protein: getVal('Protein', 'protein'),
      image: imageSrc || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000', // Use real capture or placeholder
      type: (safeTruth.status?.toUpperCase() as 'SAFE' | 'WARNING' | 'DANGER' | 'ALLERGY') || 'SAFE',
      message: response.ui_cards?.fun_summary || "Analysis complete.",
      subtitle: safeTruth.subtitle,
      risks: Array.isArray(safeTruth.risks) ? safeTruth.risks : [], // Now string[]
      swaps: Array.isArray(safeSwaps) ? safeSwaps : [], // Now string[]
      summaryGrid: scanResult.summary_grid || [], // New summary grid
      dailySugarPercent: response.user_state?.daily_progress?.sugar_percent || 0, // NEW: Sugar Progress
      subIngredients: (scanResult.vision_breakdown_list || []).map((name: string) => ({
        name,
        calories: 0,
        qty: '-',
        iconName: 'Circle',
        iconColor: 'gray'
      })),
      benefits: safeTruth.status === 'safe' ? [safeTruth.title] : [],
      comparison_note: scanResult.comparison_note, // Ensure this is passed
      tags: scanResult.vision_breakdown_list,
      aiAnalysis: response.ui_cards?.ai_analysis
    };

    setLastScan(mappedItem);
    setLastScanResult(scanResult);
    console.log('Processed Scan Item:', mappedItem);
    setActiveTab('results');
  };

  const handleLogFood = async () => {
    if (!lastScanResult) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      await api.logFood({
        user_id: userId,
        food_data: lastScanResult
      });

      // Refresh dashboard
      const data = await api.getDashboard(userId);
      setDashboardData(data);

      // Go to home to see updated rings
      setActiveTab('home');
    } catch (e) {
      console.error("Failed to log food", e);
      alert("Failed to log food. Please try again.");
    }
  };

  const handleSplashReady = async () => {
    // Check if onboarding is completed
    const isOnboarded = localStorage.getItem('onboardingCompleted');
    const userId = localStorage.getItem('userId');

    if (isOnboarded && userId) {
      try {
        const data = await api.getDashboard(userId);
        setDashboardData(data);

        // Fetch full profile data
        const profileData = await api.getProfile(userId);

        const fullProfile: UserProfile = {
          name: profileData.name || 'User',
          age: profileData.age || 0,
          gender: profileData.gender || 'M',
          height: profileData.height_cm || 0,
          weight: profileData.weight_kg || 0,
          conditions: profileData.conditions || [],
          medical_summary: profileData.medical_summary,
          activity_level_inference: profileData.activity_level_inference
        };
        setUserProfile(fullProfile);
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
        // Could fallback to onboarding or offline?
        // Proceeding for now
      }
      setActiveTab('home');
    } else {
      setActiveTab('onboard');
    }
    setCurrentView('app');
  };

  const handleSetupNeeded = () => {
    // If setup is needed (no API URL), show Landing Page first
    setCurrentView('landing');
  };

  const handleStartMagic = async () => {
    // Check if we have credentials to try verifying first
    const apiUrl = localStorage.getItem('apiBaseUrl');
    const userId = localStorage.getItem('userId');
    const isOnboarded = localStorage.getItem('onboardingCompleted');

    if (apiUrl && userId && isOnboarded) {
      // Try to ping
      const isOnline = await api.ping();
      if (isOnline) {
        // Re-fetch dashboard data if needed, or just go home
        // Ideally we should call handleSplashReady logic here
        handleSplashReady();
        return;
      }
    }

    // Fallback to setup if checks fail
    setCurrentView('setup');
  };

  const handleServerOffline = () => {
    // If server is offline, also show Landing Page so user can "Do Magic" (reconfigure/retry)
    setCurrentView('landing');
  };

  const handleSetupSuccess = () => {
    setCurrentView('splash'); // Restart flow after setup
  };

  const handleRetryConnection = () => {
    setCurrentView('splash'); // Restart flow
  };

  // Render appropriate view
  if (currentView === 'landing') {
    return <LandingPage onStartMagic={handleStartMagic} />;
  }

  if (currentView === 'splash') {
    return (
      <Splash
        onReady={handleSplashReady}
        onSetupNeeded={handleSetupNeeded}
        onServerOffline={handleServerOffline}
      />
    );
  }

  if (currentView === 'setup') {
    return <Setup onSuccess={handleSetupSuccess} />;
  }

  if (currentView === 'offline') {
    return (
      <ServerOffline
        onRetry={handleRetryConnection}
        onChangeServer={handleSetupNeeded}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <SummaryDashboard
            user={userProfile}
            foodLog={foodLog}
            dashboardData={dashboardData}
          />
        );
      case 'scanner':
        return <Scanner onScanComplete={handleScanComplete} />;
      case 'results':
        return <AnalysisResults item={lastScan} onLog={handleLogFood} onRetake={() => setActiveTab('scanner')} />;
      case 'profile':
        return (
          <Profile
            user={userProfile}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
            onSettingsClick={() => setActiveTab('settings')}
          />
        );
      case 'tips':
        return <Tips user={userProfile} />;
      case 'truth':
        return <Truth user={userProfile} />;
      case 'onboard':
        return <Onboarding onComplete={() => handleSplashReady()} />;
      case 'settings':
        return (
          <Settings
            userId={localStorage.getItem('userId') || ''}
            onBack={() => setActiveTab('profile')}
          />
        );
      default:
        return (
          <SummaryDashboard
            user={userProfile}
            foodLog={foodLog}
            dashboardData={dashboardData}
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



      {/* Bottom Navigation Dock - Integrated */}
      {activeTab !== 'onboard' && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="h-[4.5rem] bg-zinc-950 rounded-[2rem] shadow-2xl flex items-center justify-between px-2 border border-zinc-900/50 z-50 relative">

            <div className="flex items-center gap-1">
              <button onClick={() => setActiveTab('profile')} className="w-16 flex flex-col items-center gap-1 group">
                <User size={22} className={cn("transition-colors", activeTab === 'profile' ? "text-white" : "text-zinc-500 group-hover:text-zinc-400")} />
                <span className={cn("text-[10px] font-medium transition-colors", activeTab === 'profile' ? "text-white" : "text-zinc-600")}>Profile</span>
              </button>

              <button onClick={() => setActiveTab('home')} className="w-16 flex flex-col items-center gap-1 group">
                <LayoutGrid size={22} className={cn("transition-colors", activeTab === 'home' ? "text-white" : "text-zinc-500 group-hover:text-zinc-400")} />
                <span className={cn("text-[10px] font-medium transition-colors", activeTab === 'home' ? "text-white" : "text-zinc-600")}>Summary</span>
              </button>
            </div>

            {/* Central Integrated Camera Button */}
            <div className="relative -top-1">
              <button
                onClick={() => setActiveTab('scanner')}
                className="w-14 h-14 bg-emerald-500 rounded-[1.2rem] shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center transition-transform active:scale-95 border-4 border-black group"
              >
                <Camera size={26} className="text-black group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              </button>
              {/* Glow effect behind */}
              <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full -z-10 mt-2"></div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setActiveTab('tips')} className="w-16 flex flex-col items-center gap-1 group">
                <Lightbulb size={22} className={cn("transition-colors", activeTab === 'tips' ? "text-white" : "text-zinc-500 group-hover:text-zinc-400")} />
                <span className={cn("text-[10px] font-medium transition-colors", activeTab === 'tips' ? "text-white" : "text-zinc-600")}>Tips</span>
              </button>

              <button onClick={() => setActiveTab('truth')} className="w-16 flex flex-col items-center gap-1 group">
                <AlertOctagon size={22} className={cn("transition-colors", activeTab === 'truth' ? "text-white" : "text-zinc-500 group-hover:text-zinc-400")} />
                <span className={cn("text-[10px] font-medium transition-colors", activeTab === 'truth' ? "text-white" : "text-zinc-600")}>Truth</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

export default App;
