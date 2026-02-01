# 🍎 NutriScan AI

**AI-Powered Food Scanner & Personalized Nutrition Tracker**

NutriScan AI is an intelligent nutrition tracking application that leverages computer vision and AI to instantly analyze food items, provide personalized health insights, and help users achieve their nutritional goals. Scan any food package, ingredient label, or dish to get real-time macro breakdowns, health warnings, and smart alternatives.

---

## ✨ Features

### 🔍 **AI-Powered Food Scanning**
- **Instant Label Recognition**: Scan nutrition labels and ingredient lists with your camera
- **Dish Detection**: AI identifies dishes and estimates macronutrients when no label is present
- **Barcode Support**: Quick lookup via barcode scanning (using react-zxing)
- **Offline Image Compression**: Optimized image handling with browser-image-compression

### 📊 **Real-Time Nutrition Dashboard**
- **Macro Rings**: Beautiful animated circular progress indicators for:
  - Calories
  - Protein
  - Carbs
  - Fat
  - Sugar
- **Live Updates**: Dashboard automatically refreshes after logging food
- **Daily Targets**: Customizable macro goals based on user profile

### 🎯 **Nutridex Score System**
- **Health Score**: 0-100 rating based on your daily nutrition quality
- **Personalized Messages**: Context-aware feedback on your eating habits
- **History Tracking**: View detailed logs with macro breakdowns and tags
- **Interactive Timeline**: Today/Week/Month views with insights

### ⚠️ **Smart Health Alerts**
- **Type-Based Warnings**: `SAFE`, `WARNING`, `DANGER`, `ALLERGY` classifications
- **Personalized Risks**: Tailored alerts for pre-existing conditions (e.g., Pre-Diabetic, Asthma)
- **Ingredient Analysis**: Deep dive into sub-ingredients with health implications
- **Smart Swaps**: AI-suggested healthier alternatives

### 🧬 **Personalized User Profiles**
- **Bio-Tracking**: Age, gender, height, weight, blood type
- **Health Conditions**: Track conditions like diabetes, allergies, asthma
- **Custom Goals**: Set and edit daily macro targets
- **Progress Monitoring**: Visual feedback on goal completion

### 🎨 **Premium UI/UX**
- **Dark Mode Design**: Sleek, modern interface with glassmorphism effects
- **Smooth Animations**: Framer Motion-powered transitions
- **Responsive Layout**: Mobile-first design (works on PWA/web)
- **Onboarding Flow**: Interactive 4-step setup wizard with loading animations

### 📜 **Food Logging & History**
- **One-Click Tracking**: Log scanned food instantly
- **Rich History**: View past meals with:
  - Food name & calories
  - Macro badges (P/C/F/S)
  - Health tags (e.g., "High Protein", "Spicy")
  - Thumbnails (cached in IndexedDB)
- **Details View**: Click any history item to see full analysis

### 🧠 **AI Analysis Engine**
- **RAG-Enhanced**: Uses retrieval-augmented generation for medical context
- **Multi-Model Backend**: Hybrid vision architecture (Qwen2.5-VL + PaliGemma2 + MedGemma)
- **Personalized Insights**: Analysis considers user's health profile
- **Smart Fallbacks**: Switches between label reading and dish estimation automatically

---

## 🚀 Tech Stack

### **Frontend**
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS 3 + Custom CSS
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Camera**: React Webcam
- **Barcode**: React ZXing
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)

### **Backend** (Python - Ngrok Tunnel)
- **Vision Models**:
  - Qwen/Qwen2.5-VL-7B-Instruct (Label Reader)
  - google/paligemma2-3b-mix-224 (Dish Estimator)
  - google/medgemma-1.5-4b-it (Medical Analysis)
- **RAG**: BAAI/bge-m3 embeddings
- **Framework**: FastAPI (assumed based on endpoints)
- **Quantization**: 4-bit for efficiency

### **Storage**
- **Local Storage**: User profiles, settings, image mappings
- **IndexedDB**: Cached food images (via imageStore service)
- **Session State**: React context for active scan results

---

## 📦 Installation

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.9+ (for backend)
- GPU with 18GB+ VRAM recommended for backend models

### **Frontend Setup**

```bash
# Clone the repository
git clone <your-repo-url>
cd nutriscan-ai

# Install dependencies
npm install

# Configure API endpoint
# Edit .env file (default: http://localhost:8000)
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Backend Setup** (Python)

> **Note**: The backend requires a separate Python server. Ensure it's running and accessible via the URL in `.env`.

```bash
# Example backend startup (adjust based on your implementation)
# The backend should expose these endpoints:
# POST /api/scan - Image analysis
# POST /api/log - Food logging
# GET /api/dashboard - Dashboard data
# GET /api/setup - Initial user setup

# If using Ngrok:
ngrok http 8000
# Update VITE_API_BASE_URL in .env with the Ngrok URL
```

---

## 🎮 Usage

### **1. Onboarding**
On first launch, complete the 4-step setup:
1. **Welcome**: Introduction to NutriScan AI
2. **Profile**: Enter age, gender, height, weight
3. **Health**: Add blood type and conditions (e.g., "Pre-Diabetic")
4. **Sync**: Connect to backend and fetch personalized goals

### **2. Scanning Food**
1. Navigate to the **Scan** tab (camera icon)
2. Point camera at:
   - Nutrition label (preferred)
   - Barcode
   - Or take a photo of the dish
3. Review AI analysis with:
   - Health verdict (SAFE/WARNING/DANGER)
   - Macro breakdown
   - Personalized risks
   - Smart swaps

### **3. Logging & Tracking**
1. After scanning, click **"Track Food"**
2. Dashboard automatically updates with new data
3. View updated macro rings on **Home** tab
4. Check **Nutridex** for history and insights

### **4. Managing Goals**
1. Open **Home** tab
2. Click **Edit Goals** (pencil icon)
3. Adjust daily targets for Calories, Protein, Carbs, Fat, Sugar
4. Save to update dashboard rings

### **5. Viewing History**
1. Navigate to **Nutridex** (tap the Nutridex banner on Home or click history icon in app bar)
2. Browse **Today/Week/Month** views
3. Click any food item to see full details
4. Review macro badges and health tags

---

## 🗂️ Project Structure

```
nutriscan-ai/
├── src/
│   ├── components/           # React components
│   │   ├── AnalysisResults.tsx    # Food scan results UI
│   │   ├── SummaryDashboard.tsx   # Main dashboard with macro rings
│   │   ├── Scanner.tsx            # Camera + barcode scanner
│   │   ├── Nutridex.tsx           # History & insights
│   │   ├── Onboarding.tsx         # 4-step setup wizard
│   │   ├── Profile.tsx            # User profile management
│   │   ├── EditGoals.tsx          # Macro target editor
│   │   ├── Layout.tsx             # App shell with navigation
│   │   └── ui/                    # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       └── Progress.tsx
│   ├── services/            # API & storage services
│   │   ├── api.ts               # Backend API client
│   │   └── imageStore.ts        # IndexedDB image cache
│   ├── types/               # TypeScript definitions
│   │   └── api.ts               # API response types
│   ├── lib/                 # Utilities
│   │   └── utils.ts             # Helpers (e.g., cn for classnames)
│   ├── constants.ts         # App constants & mock data
│   ├── App.tsx              # Root component with routing logic
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env                     # Environment variables
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # TailwindCSS config
└── tsconfig.json            # TypeScript config
```

---

## 🔌 API Integration

### **Base URL**
Set in `.env`:
```
VITE_API_BASE_URL=https://your-ngrok-url.ngrok.io
```

### **Endpoints**

#### **POST /api/scan**
Analyze a food image.

**Request:**
```typescript
{
  user_id: string;
  image: string; // Base64-encoded image
  user_profile: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    blood_type: string;
    conditions: string[];
  };
  daily_sugar: number; // Current sugar intake in grams
}
```

**Response:**
```typescript
{
  item_name: string;
  calories: number;
  macros: { p: number; c: number; f: number; s: number };
  verdict: "SAFE" | "WARNING" | "DANGER";
  health_implication: string;
  risks?: string[];
  swaps?: string[];
  tags?: string[];
  summary_grid?: Array<{ emoji: string; label: string; value: string }>;
}
```

#### **POST /api/log**
Log a food item to history.

**Request:**
```typescript
{
  user_id: string;
  food_data: {
    name: string;
    calories: number;
    macros: { p: number; c: number; f: number; s: number };
    tags?: string[];
  };
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

#### **GET /api/dashboard?user_id={userId}**
Fetch dashboard data (totals, history, Nutridex score).

**Response:**
```typescript
{
  macro_rings: {
    calories: { consumed: number; limit: number };
    protein: { consumed: number; limit: number };
    carbs: { consumed: number; limit: number };
    fat: { consumed: number; limit: number };
  };
  totals: { protein: number; carbs: number; fat: number; sugar: number };
  history: Array<{
    time: string;
    food: string;
    calories: number;
    macros?: { p: number; c: number; f: number; s?: number };
    tags?: string[];
  }>;
  nutridex_score: number; // 0-100
  message: string; // Personalized feedback
}
```

#### **POST /api/setup**
Initialize user profile on backend.

**Request:**
```typescript
{
  user_id: string;
  profile: UserProfile;
}
```

---

## 🎨 Design Philosophy

NutriScan AI prioritizes **premium aesthetics** and **user engagement**:

1. **Visual Hierarchy**: Macro rings use vibrant gradients (emerald, blue, amber, rose)
2. **Micro-Animations**: Smooth transitions on load, hover, and state changes
3. **Glassmorphism**: Frosted glass effects for cards and modals
4. **Typography**: Uses system fonts with bold weights for clarity
5. **Color-Coded Feedback**:
   - 🟢 Green: SAFE foods
   - 🟡 Yellow: WARNING (moderate concern)
   - 🔴 Red: DANGER (high risk for user's profile)
   - 🔵 Blue: ALLERGY alert

---

## 🧪 Testing & Validation

### **Type Safety**
- Full TypeScript coverage with strict mode
- ESLint configured for React best practices

### **Build Verification**
```bash
npm run build
# Should complete without errors
```

### **Linting**
```bash
npm run lint
```

---

## 🛣️ Roadmap

- [ ] **Multi-Day Charts**: Weekly/Monthly macro trend graphs
- [ ] **Recipe Scanner**: Detect and log multi-ingredient meals
- [ ] **Export Data**: CSV/PDF reports for nutritionists
- [ ] **Social Features**: Share meals, challenge friends
- [ ] **Meal Planning**: AI-generated daily meal plans
- [ ] **Wearable Integration**: Sync with Fitbit, Apple Health
- [ ] **Offline Mode**: Cache scans for later sync

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**
- Use TypeScript for all new components
- Follow the existing file structure
- Add comments for complex logic
- Test on both mobile and desktop viewports

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## 🙏 Acknowledgments

- **AI Models**: Qwen2.5-VL, PaliGemma2, MedGemma by Alibaba/Google
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Inspiration**: Modern nutrition apps like MyFitnessPal, Yazio

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@nutriscan.ai (if applicable)
- Discord: [Your Server Link]

---

**Built with ❤️ by [Your Name/Team]**

> *Empowering healthier choices, one scan at a time.*
