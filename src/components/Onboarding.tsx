import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Upload, Scan, ChevronRight, Plus,
    Check, AlertCircle, X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { api } from '../services/api';
import type { OnboardResponse, AIFindings } from '../types/api';

// Types
interface OnboardingProfile {
    name: string;
    age: number;
    gender: 'M' | 'F' | 'Other'; // Updated from Male/Female
    height: number; // cm
    weight: number; // kg
    activityLevel: number; // 1-5
    medicalFiles: File[];
    conditions: string[];
    diet: 'Veg' | 'Non-Veg' | 'Vegan';
    allergies: string[];
    waterTDS?: number;
}

const INITIAL_DATA: OnboardingProfile = {
    name: '',
    age: 28,
    gender: 'M',
    height: 175,
    weight: 70,
    activityLevel: 3,
    medicalFiles: [],
    conditions: [],
    diet: 'Veg',
    allergies: [],
    waterTDS: 150
};

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingProfile>(INITIAL_DATA);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [currentAllergy, setCurrentAllergy] = useState(''); // New State
    const [userId] = useState(() => {
        // Generate or retrieve userId
        const stored = localStorage.getItem('userId');
        return stored || crypto.randomUUID();
    });
    const [profileBlob, setProfileBlob] = useState<AIFindings | null>(null);

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const updateData = (key: keyof OnboardingProfile, value: any) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            // Append to existing files, limit to 10 total
            const updatedFiles = [...data.medicalFiles, ...newFiles].slice(0, 10);
            updateData('medicalFiles', updatedFiles);
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = data.medicalFiles.filter((_, i) => i !== index);
        updateData('medicalFiles', updatedFiles);
    };

    const handleAnalyze = async () => {
        if (data.medicalFiles.length === 0) return;

        setIsProcessing(true);

        try {
            // Send all files
            const response: OnboardResponse = await api.onboard(data.medicalFiles, userId);

            // Store the AI findings for later confirmation
            setProfileBlob(response.ai_findings);

            // Auto-populate conditions from AI findings (Merge with existing)
            if (response.ai_findings.conditions) {
                const uniqueConditions = new Set([...data.conditions, ...response.ai_findings.conditions]);
                updateData('conditions', Array.from(uniqueConditions));
            }

            setIsProcessing(false);
            nextStep();
        } catch (error) {
            console.error('Onboarding error:', error);
            alert('Failed to analyze medical reports. Please try again.');
            setIsProcessing(false);
        }
    };
    const toggleCondition = (condition: string) => {
        const current = data.conditions;
        if (current.includes(condition)) {
            updateData('conditions', current.filter(c => c !== condition));
        } else {
            updateData('conditions', [...current, condition]);
        }
    };

    const handleAddAllergy = () => {
        if (currentAllergy.trim() && !data.allergies.includes(currentAllergy.trim())) {
            updateData('allergies', [...data.allergies, currentAllergy.trim()]);
            setCurrentAllergy('');
        }
    };

    const handleInitialize = async () => {
        setIsInitializing(true);

        try {
            // Convert activity level number (1-5) to string
            const activityLevels = ['sedentary', 'light', 'moderate', 'active', 'athlete'];
            const activityLevel = activityLevels[data.activityLevel - 1] || 'moderate';

            // Calculate BMI
            const heightM = data.height / 100;
            const bmi = heightM > 0 ? parseFloat((data.weight / (heightM * heightM)).toFixed(1)) : 0;

            // Create fallback profile if no medical report was uploaded
            // IMPORTANT: Ensure structure matches what backend expects for "profile" field
            const safeAge = isNaN(data.age) ? 25 : data.age;
            const safeWeight = isNaN(data.weight) ? 70 : data.weight;
            const safeHeight = isNaN(data.height) ? 170 : data.height;

            const finalProfile: AIFindings = profileBlob || {
                age: safeAge,
                gender: data.gender, // Now M/F
                weight_kg: safeWeight,
                height_cm: safeHeight,
                // Robustness: Add legacy keys just in case backend mapping needs them inside the blob too
                ...({ weight: safeWeight, height: safeHeight } as any),

                bmi: bmi, // Added BMI
                conditions: data.conditions,
                allergies: data.allergies,
                activity_level_inference: activityLevel,
                dietary_type: data.diet,
                summary: 'User profile created from manual input',
                verified_allergy_guide: data.allergies.length > 0 ? `Avoid: ${data.allergies.join(', ')}` : 'No known allergies',
                recommended_limits: {
                    daily_calories: 2000,
                    daily_sugar_g: 25
                }
            };

            // Payload with redundant root fields for fail-safety
            const payload: any = {
                user_id: userId,
                name: data.name,
                profile: finalProfile,
                water_tds: data.waterTDS || 0,
                activity_level: activityLevel,
                dietary_preferences: {
                    type: data.diet
                },
                // Redundant Root Fields for Backend robustness
                age: safeAge,
                gender: data.gender,
                weight: safeWeight,
                height: safeHeight,
                // Extra redunduncy for mobile issue
                weight_kg: safeWeight,
                height_cm: safeHeight
            };

            await api.confirmProfile(payload);

            // Save userId to localStorage
            localStorage.setItem('userId', userId);
            localStorage.setItem('onboardingCompleted', 'true');

            onComplete();
        } catch (error) {
            console.error('Profile confirmation error:', error);
            alert('Failed to save profile. Please try again.');
            setIsInitializing(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-10 pb-24 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header / Progress */}
            <div className="relative z-10 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={prevStep}
                        className={cn("p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400", step === 1 && "opacity-0 pointer-events-none")}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold tracking-wider text-emerald-500">STEP {step}/4</span>
                    <button
                        onClick={onComplete} // Skip for dev
                        className="text-xs text-zinc-600 font-medium hover:text-zinc-400"
                    >
                        Skip
                    </button>
                </div>
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="relative z-10"
                >
                    {/* step 1: Bio-Metrics */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold">Let's get to know you.</h1>
                            {/* ... Content skipped for brevity by tool logic, but I'm rewriting the container structure anyway if needed. 
                                Actually, I am only replacing the changed parts. 
                                I need to jump to Step 3 end and add Step 4.
                            */}
                            {/* ... Rest of Step 1 ... */}
                            {/* ... */}
                            {/* I will use a larger block to cover the structure changes accurately */}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-zinc-400 block mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => updateData('name', e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xl font-bold outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-400 block mb-2">Gender</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Male', value: 'M' },
                                            { label: 'Female', value: 'F' },
                                            { label: 'Other', value: 'Other' }
                                        ].map((g) => (
                                            <button
                                                key={g.value}
                                                onClick={() => updateData('gender', g.value)}
                                                className={cn(
                                                    "py-3 rounded-2xl border font-medium transition-all",
                                                    data.gender === g.value
                                                        ? "bg-emerald-500 text-black border-emerald-500"
                                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                                                )}
                                            >
                                                {g.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-zinc-400 block mb-2">Age</label>
                                        <input
                                            type="number"
                                            value={data.age}
                                            onChange={(e) => updateData('age', parseInt(e.target.value))}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xl font-bold outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-zinc-400 block mb-2">Weight <span className="text-xs text-zinc-600">(kg)</span></label>
                                        <input
                                            type="number"
                                            value={data.weight}
                                            onChange={(e) => updateData('weight', parseInt(e.target.value))}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xl font-bold outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-zinc-400 block mb-2">Height <span className="text-xs text-zinc-600">(cm)</span></label>
                                        <input
                                            type="number"
                                            value={data.height}
                                            onChange={(e) => updateData('height', parseInt(e.target.value))}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xl font-bold outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-400 block mb-2">Activity Level</label>
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                        <input
                                            type="range"
                                            min="1" max="5"
                                            value={data.activityLevel}
                                            onChange={(e) => updateData('activityLevel', parseInt(e.target.value))}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                        <div className="flex justify-between mt-4 text-xs font-bold text-zinc-500 uppercase">
                                            <span>Sedentary</span>
                                            <span className={data.activityLevel >= 3 ? "text-white" : ""}>Moderate</span>
                                            <span className={data.activityLevel === 5 ? "text-emerald-500" : ""}>Athlete</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Medical History */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold">Health Scan</h1>
                            <p className="text-zinc-400">Upload your recent medical reports and let our AI analyze them.</p>

                            <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-zinc-900/30 min-h-[200px]">
                                {isProcessing ? (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <Scan size={48} className="text-emerald-500 animate-pulse mb-4" />
                                        <p className="text-emerald-500 font-bold">Analyzing Medical Records...</p>
                                        <p className="text-xs text-zinc-500 mt-2">Processing {data.medicalFiles.length} file(s)</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        {data.medicalFiles.length > 0 ? (
                                            <div className="w-full space-y-3">
                                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto mb-4">
                                                    {data.medicalFiles.map((file, idx) => (
                                                        <div key={idx} className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-500">
                                                                    <Check size={14} />
                                                                </div>
                                                                <p className="text-sm text-zinc-300 truncate">{file.name}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFile(idx)}
                                                                className="p-1.5 hover:bg-zinc-700 rounded-full text-zinc-500 hover:text-rose-500 transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex gap-3">
                                                    <label
                                                        htmlFor="medical-report-add"
                                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                                                    >
                                                        <Plus size={16} /> Add More
                                                    </label>
                                                    <Button
                                                        onClick={handleAnalyze}
                                                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                                                    >
                                                        Analyze & Next <ChevronRight size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                                                    <Upload size={24} />
                                                </div>
                                                <h3 className="text-white font-bold mb-1">Upload Reports</h3>
                                                <p className="text-xs text-zinc-500 mb-6">PDF, JPG, PNG (Max 10 files)</p>
                                                <label
                                                    htmlFor="medical-report"
                                                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                                                >
                                                    Select Files
                                                </label>
                                            </>
                                        )}

                                        <input
                                            type="file"
                                            id={data.medicalFiles.length > 0 ? "medical-report-add" : "medical-report"}
                                            multiple
                                            accept="image/*,.pdf"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400 block mb-3">Detected Conditions</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Diabetes', 'Hypertension', 'PCOS', 'Thyroid', 'None'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => toggleCondition(c)}
                                            className={cn(
                                                "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                                                data.conditions.includes(c)
                                                    ? "bg-rose-500/10 border-rose-500 text-rose-500"
                                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                                            )}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Food Preferences */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold">Diet Preferences</h1>

                            <div className="grid grid-cols-1 gap-3">
                                {['Veg', 'Non-Veg', 'Vegan'].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => updateData('diet', d)}
                                        className={cn(
                                            "p-4 rounded-2xl border text-left flex items-center justify-between transition-all",
                                            data.diet === d
                                                ? "bg-emerald-500 text-black border-emerald-500"
                                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                                        )}
                                    >
                                        <span className="font-bold">{d}</span>
                                        {data.diet === d && <Check size={20} />}
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">Allergies</label>
                                <div className="space-y-3">
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
                                        <AlertCircle size={20} className="text-zinc-600" />
                                        <input
                                            type="text"
                                            value={currentAllergy}
                                            onChange={(e) => setCurrentAllergy(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddAllergy();
                                                }
                                            }}
                                            placeholder="e.g. Peanuts, Shellfish... (Press Enter)"
                                            className="bg-transparent w-full text-white outline-none placeholder:text-zinc-600"
                                        />
                                        <button
                                            onClick={handleAddAllergy}
                                            disabled={!currentAllergy.trim()}
                                            className="p-1.5 bg-zinc-800 rounded-lg text-emerald-500 disabled:opacity-50 disabled:text-zinc-500"
                                        >
                                            <Check size={16} />
                                        </button>
                                    </div>

                                    {data.allergies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {data.allergies.map((allergy, i) => (
                                                <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-sm flex items-center gap-2">
                                                    {allergy}
                                                    <button onClick={() => updateData('allergies', data.allergies.filter((_, idx) => idx !== i))}>
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="space-y-6">
                            {isInitializing ? (
                                <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
                                        />
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            className="w-24 h-24 rounded-full border-2 border-zinc-800 border-t-emerald-500 border-r-emerald-500/50"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Scan size={32} className="text-emerald-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mt-8">
                                        Initializing Brain...
                                    </h2>
                                    <p className="text-zinc-500 mt-2">Encrypting health profiles</p>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold">Review Profile</h1>

                                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-3xl border border-zinc-800">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                                                <span className="text-zinc-500">BMI Factor</span>
                                                <span className="font-mono text-white">
                                                    {(data.weight / Math.pow(data.height / 100, 2)).toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                                                <div>
                                                    <span className="text-zinc-500 block">Water TDS</span>
                                                    <span className="text-[10px] text-zinc-600">Mg/L (Optional)</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={data.waterTDS || ''}
                                                    placeholder="150"
                                                    onChange={(e) => updateData('waterTDS', parseInt(e.target.value))}
                                                    className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-right font-mono text-white outline-none focus:border-emerald-500 transition-colors"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                                                <span className="text-zinc-500">Conditions</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-medium text-right">
                                                        {data.conditions.length > 0 ? data.conditions.join(', ') : 'None'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-3">
                                                <span className="text-zinc-500">Diet</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-emerald-500 font-bold">{data.diet}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {profileBlob?.summary && (
                                        <div className="bg-emerald-900/10 p-5 rounded-2xl border border-emerald-500/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Scan size={18} className="text-emerald-500" />
                                                <span className="text-emerald-500 font-bold text-xs uppercase tracking-wider">AI Analysis</span>
                                            </div>
                                            <p className="text-zinc-300 text-sm leading-relaxed italic">
                                                "{profileBlob.summary}"
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Bottom Buttons - Updated for 4 steps */}
            {!isInitializing && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-black z-20 flex flex-col gap-3">
                    <div className="flex gap-3">
                        {step > 1 && (
                            <Button
                                onClick={prevStep}
                                className="flex-1 h-14 text-lg rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={step === 4 ? handleInitialize : nextStep}
                            className="flex-1 h-14 text-lg rounded-2xl bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                        >
                            {step === 4 ? 'Initialize Medical Brain' : 'Continue'}
                        </Button>
                    </div>

                    {step === 1 && (
                        <button
                            onClick={() => {
                                const existingId = prompt("Enter your User ID from your other device:");
                                if (existingId && existingId.trim().length > 10) {
                                    localStorage.setItem('userId', existingId.trim());
                                    localStorage.setItem('onboardingCompleted', 'true');
                                    window.location.reload();
                                }
                            }}
                            className="text-zinc-500 text-sm font-medium hover:text-white transition-colors py-2"
                        >
                            Already have an account? <span className="underline decoration-zinc-700">Recover Profile</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
