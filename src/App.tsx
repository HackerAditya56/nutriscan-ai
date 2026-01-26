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
    // Updated to strictly handle numbers and prevent string parsing errors
    const getVal = (...keys: string[]) => {
      for (const key of keys) {
        // 1. Check macros
        if (typeof macros[key] === 'number') return macros[key];
        if (macros[key] !== undefined && !isNaN(parseFloat(String(macros[key])))) return parseFloat(String(macros[key]));

        // 2. Check micros
        if (typeof micros[key] === 'number') return micros[key];
        if (micros[key] !== undefined && !isNaN(parseFloat(String(micros[key])))) return parseFloat(String(micros[key]));

        // 3. Check scanResult root
        if (typeof scanResult[key] === 'number') return scanResult[key];
        if (scanResult[key] !== undefined && !isNaN(parseFloat(String(scanResult[key])))) return parseFloat(String(scanResult[key]));
      }
      return 0;
    };

    const safeTruth = response.ui_cards?.truth || { status: 'safe', title: 'Scanned', subtitle: 'Analyzing...', risks: [] };
    const safeSwaps = response.ui_cards?.swaps || [];

    // Fallback logic: check scanResult -> ai_analysis -> default
    const foodName = scanResult.food_name || response.ui_cards?.ai_analysis?.item_name || "Unknown Food";
    console.log("Determined Food Name:", foodName, "Fallback Logic Triggered Check");

    // Map backend response to frontend FoodItem format
    const mappedItem: FoodItem = {
      name: foodName,
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
      // 1. Save Image Locally (IndexedDB)
      let localImageId = null;
      if (lastScan && lastScan.image && lastScan.image.startsWith('data:image')) {
        const { imageStore } = await import('./services/imageStore');
        localImageId = await imageStore.saveImage(lastScan.image);
        console.log("Image saved locally with ID:", localImageId);
      }

      // 2. Log to Backend
      await api.logFood({
        user_id: userId,
        food_data: lastScanResult
      });

      // 3. Refresh Dashboard & Map Image
      const data = await api.getDashboard(userId);
      setDashboardData(data);

      // Mapping Logic: Find the most recent history item that matches our food name/time
      // Since backend generates the time, we take the top item or find close match
      if (data.history && data.history.length > 0 && localImageId) {
        const latestItem = data.history[0]; // Assuming backend returns sorted desc
        // Safer: search for item with matching food name within last minute
        // But top item is usually correct.

        if (latestItem) {
          const mapStr = localStorage.getItem('food_image_map');
          const map = mapStr ? JSON.parse(mapStr) : {};
          map[latestItem.time] = localImageId; // Map backend timestamp to local ID
          localStorage.setItem('food_image_map', JSON.stringify(map));

          // Also store Swaps if available
          if (lastScanResult.ui_cards?.swaps && lastScanResult.ui_cards.swaps.length > 0) {
            const swapMapStr = localStorage.getItem('food_swaps_map');
            const swapMap = swapMapStr ? JSON.parse(swapMapStr) : {};
            swapMap[latestItem.time] = lastScanResult.ui_cards.swaps;
            localStorage.setItem('food_swaps_map', JSON.stringify(swapMap));
          }

          console.log("Mapped history item", latestItem.time, "to image", localImageId);
        }
      }

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
          gender: (profileData.gender && (profileData.gender.toLowerCase() === 'female' || profileData.gender.toLowerCase() === 'f')) ? 'F' : 'M',
          // Robust mapping for height/weight matching Settings.tsx logic
          height: profileData.height_cm || profileData.height || 0,
          weight: profileData.weight_kg || profileData.weight || 0,
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

  const handleHistoryItemClick = (item: any) => {
    // Convert history item to FoodItem format for AnalysisResults
    const mappedItem: FoodItem = {
      name: item.food,
      calories: item.calories || 0,
      // Use history macros if available, otherwise default
      protein: item.macros?.p || 0,
      sugar: item.macros?.s || 0,
      fiber: item.macros?.c ? Math.round(item.macros.c / 5) : 0, // Estimate or omit if not in history
      // Note: We don't have sub-ingredients or full details, so we fill what we can
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000', // Placeholder or add image URL to backend history
      type: 'SAFE', // Default or infer from tags
      message: "Historical entry.",
      subtitle: item.time ? new Date(item.time).toLocaleString() : '',
      risks: [],
      swaps: [],
      summaryGrid: [
        { label: 'CALORIES', value: String(item.calories || 0), emoji: '🔥', color: 'orange' },
        { label: 'PROTEIN', value: String(item.macros?.p || 0) + 'g', emoji: '💪', color: 'green' },
        { label: 'CARBS', value: String(item.macros?.c || 0) + 'g', emoji: '🍞', color: 'blue' },
        { label: 'FAT', value: String(item.macros?.f || 0) + 'g', emoji: '🥑', color: 'yellow' },
      ],
      tags: item.tags,
      // Pass through verdict info if available in history item (using explicit or fallback logic)
      scan_result: {
        verdict: item.verdict || item.scan_result?.verdict,
        health_implication: item.health_implication || item.scan_result?.health_implication,
        summary_grid: item.summary_grid || [] // ensure grid is passed if available
      }
    };

    setLastScan(mappedItem);
    setActiveTab('results');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <SummaryDashboard
            user={userProfile}
            foodLog={foodLog}
            dashboardData={dashboardData}
            onRefresh={handleSplashReady}
            onHistoryItemClick={handleHistoryItemClick}
          />
        );
      case 'scanner':
        return <Scanner onScanComplete={handleScanComplete} />;
      case 'results':
        // If viewing history, logging might be disabled or hidden
        // Simple heuristic: if we clicked a history item recently, it's history view. 
        // Best way is to assume if lastScan has a 'time' property that is old, but we just set lastScan.
        // Let's rely on the fact that if we are in 'results' but NOT from a fresh scan event immediately (which sets lastScanResult).
        // Actually, handleHistoryItemClick sets lastScan. Fresh scan does too.
        // We can check if lastScanResult matches lastScan? No.
        // Let's just track it via state ideally, but for now, we can check if the mapped item has "Historical entry".
        const isHistory = lastScan?.message === "Historical entry.";
        return <AnalysisResults item={lastScan} onLog={handleLogFood} onRetake={() => setActiveTab('scanner')} isHistoryView={isHistory} />;
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
            onRefresh={handleSplashReady}
            onHistoryItemClick={handleHistoryItemClick}
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
