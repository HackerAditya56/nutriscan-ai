import { useState, useEffect } from 'react';
import { ArrowLeft, User2, Activity, Droplets, Heart, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { api } from '../services/api';
import type { ProfileResponse, AIFindings } from '../types/api';

interface SettingsProps {
    userId: string;
    onBack: () => void;
}

export const Settings = ({ userId, onBack }: SettingsProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [profileData, setProfileData] = useState<ProfileResponse | null>(null);

    // Local editable state
    // Local editable state - Init with undefined to show placeholders/empty
    const [age, setAge] = useState<number | undefined>(undefined);
    const [gender, setGender] = useState('M');
    const [height, setHeight] = useState<number | undefined>(undefined);
    const [weight, setWeight] = useState<number | undefined>(undefined);
    const [dietaryType, setDietaryType] = useState('Veg');
    const [waterTDS, setWaterTDS] = useState<number | undefined>(undefined);
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [allergies, setAllergies] = useState<string[]>([]);
    const [newAllergy, setNewAllergy] = useState('');

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const response: ProfileResponse = await api.getProfile(userId);

            // Validation Helper: Ensure we never return NaN
            const cleanVal = (val: any) => {
                if (val === undefined || val === null || val === '') return undefined;
                const num = Number(val);
                return isNaN(num) ? undefined : num;
            };

            // CRITICAL: Log raw response for debugging
            console.log("RAW PROFILE FETCH:", response, "Has Weight:", response.weight_kg);
            if (response) console.log("Rendering Profile Data...");

            const summary = response.medical_summary || (response as any).profile?.friendly_summary || "No AI Summary generated yet.";

            setProfileData(prev => ({
                ...(prev || {}),
                ...response,
                name: response.name || (prev?.name) || "User",
                recommended_limits: response.recommended_limits || prev?.recommended_limits,
                conditions: response.conditions || [],
                allergies: response.allergies || [],
                medical_summary: summary
            } as ProfileResponse));

            // Map standard keys with fallbacks
            if (response.age !== undefined) setAge(cleanVal(response.age));
            if (response.gender) setGender(response.gender);

            // Robust check for height/weight
            setHeight(cleanVal(response.height_cm !== undefined ? response.height_cm : response.height));
            setWeight(cleanVal(response.weight_kg !== undefined ? response.weight_kg : response.weight));
            setWaterTDS(cleanVal(response.water_tds));

            // Handle nested or mapped fields
            const diet = response.dietary_preferences?.type || response.dietary_type;
            if (diet) setDietaryType(diet);

            if (response.activity_level) setActivityLevel(response.activity_level);

            setAllergies(response.allergies || []);

        } catch (error: any) {
            console.error('Failed to load profile:', error);

            if (error.response?.status === 404 || error.message?.includes('404')) {
                setNotFound(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ... existing handleSave ...

    const handleSave = async () => {
        if (!profileData) return;

        try {
            setIsSaving(true);

            // ... existing save logic ...
            // Build AIFindings structure for update
            const updatedProfile: AIFindings = {
                age: age || 0,
                gender,
                weight_kg: weight || 0,
                height_cm: height || 0,
                conditions: profileData.conditions || [],
                allergies: allergies,
                activity_level_inference: activityLevel,
                dietary_type: dietaryType,
                // Use medical_summary as the main summary source if available
                summary: profileData.medical_summary || '',
                verified_allergy_guide: profileData.verified_allergy_guide || '',
                recommended_limits: profileData.recommended_limits
            };

            await api.updateProfile({
                user_id: userId,
                profile: updatedProfile,
                water_tds: waterTDS || 0,
                activity_level: activityLevel,
                dietary_preferences: {
                    type: dietaryType
                }
            });

            alert('Health summary updated! The AI has processed your changes.');
            onBack();
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // ... existing handleNewUser ...

    const handleNewUser = () => {
        localStorage.removeItem('onboardingCompleted');
        window.location.reload();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-pulse text-zinc-400">Loading profile...</div>
            </div>
        );
    }

    // ... existing notFound and !profileData checks ...
    if (notFound) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <User2 size={40} className="text-emerald-500" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                    <p className="text-zinc-400">It looks like you haven't set up your profile yet.</p>
                </div>
                <Button onClick={handleNewUser} className="bg-emerald-500 text-black px-8 py-3 rounded-full font-bold">
                    Complete Your Profile
                </Button>
                <Button onClick={onBack} className="bg-transparent border border-zinc-800 hover:bg-zinc-800">
                    Go Back
                </Button>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <p className="text-zinc-400 mb-4">Failed to load profile data.</p>
                <Button onClick={onBack} className="bg-zinc-800 hover:bg-zinc-700">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            {/* ... Header ... */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center justify-between p-6">
                    <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">Settings</h1>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 rounded-full flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                <span>AI Updating...</span>
                            </>
                        ) : 'Save'}
                    </Button>
                </div>
            </div>

            <div className="p-6 space-y-6 max-w-2xl mx-auto">
                {/* Personal Information */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <User2 size={20} className="text-emerald-500" />
                        <h2 className="text-lg font-bold">Personal Information</h2>
                    </div>
                    <Card className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-zinc-400 block mb-2">Age</label>
                                <input type="number" value={age ?? ''} onChange={(e) => setAge(parseInt(e.target.value) || undefined)} placeholder="Not Set" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500 placeholder:text-zinc-600" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 block mb-2">Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 block mb-2">Height (cm)</label>
                                <input type="number" value={height ?? ''} onChange={(e) => setHeight(parseInt(e.target.value) || undefined)} placeholder="Not Set" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500 placeholder:text-zinc-600" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 block mb-2">Weight (kg)</label>
                                <input type="number" value={weight !== undefined ? weight : ''} onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Not Set" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500 placeholder:text-zinc-600" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 block mb-2">Dietary Type</label>
                            <select value={dietaryType} onChange={(e) => setDietaryType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500">
                                <option value="Veg">Vegetarian</option>
                                <option value="Non-Veg">Non-Vegetarian</option>
                                <option value="Vegan">Vegan</option>
                            </select>
                        </div>
                    </Card>
                </section>

                {/* AI Health Context (Read-Only) */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Activity size={20} className="text-emerald-500" />
                        <h2 className="text-lg font-bold">AI Health Context (Read-Only)</h2>
                    </div>
                    <Card className="space-y-4">
                        <div className="p-4 bg-zinc-900 border-l-4 border-emerald-500 rounded-r-xl">
                            <p className="text-sm text-zinc-300 font-mono leading-relaxed">
                                {profileData.medical_summary}
                            </p>
                        </div>
                    </Card>
                </section>


                {/* Activity Level */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Activity size={20} className="text-emerald-500" />
                        <h2 className="text-lg font-bold">Activity Level</h2>
                    </div>
                    <Card>
                        <select
                            value={activityLevel}
                            onChange={(e) => setActivityLevel(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                        >
                            <option value="sedentary">Sedentary (little to no exercise)</option>
                            <option value="light">Light (exercise 1-3 days/week)</option>
                            <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                            <option value="active">Active (exercise 6-7 days/week)</option>
                            <option value="athlete">Athlete (intense training)</option>
                        </select>
                    </Card>
                </section>

                {/* Water Quality */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Droplets size={20} className="text-emerald-500" />
                        <h2 className="text-lg font-bold">Water Quality</h2>
                    </div>
                    <Card>
                        <label className="text-xs text-zinc-400 block mb-2">TDS (ppm)</label>
                        <input
                            type="number"
                            value={waterTDS ?? ''}
                            onChange={(e) => setWaterTDS(parseInt(e.target.value) || undefined)}
                            placeholder="Not Set"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                        />
                        <p className="text-xs text-zinc-500 mt-2">
                            Total Dissolved Solids in your drinking water
                        </p>
                    </Card>
                </section>

                {/* ... existing sections ... */}
                {/* Re-insert sections that were skipped in summary */}
                {/* Actually I should rely on replace keeping surrounding or careful edit */}

                {/* Safe Rendering for Arrays */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Heart size={20} className="text-emerald-500" />
                        <h2 className="text-lg font-bold">Medical Summary</h2>
                    </div>
                    <Card className="space-y-4">
                        {/* Conditions */}
                        {(profileData.conditions && profileData.conditions.length > 0) && (
                            <div>
                                <label className="text-xs text-zinc-400 block mb-2">Health Conditions</label>
                                <div className="flex flex-wrap gap-2">
                                    {(profileData.conditions || []).map((condition, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full text-sm text-rose-400">
                                            {condition}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Allergies */}
                        {/* Allergies */}
                        <div>
                            <label className="text-xs text-zinc-400 block mb-2">Allergies</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {allergies.map((allergy, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-400 flex items-center gap-2">
                                        {allergy}
                                        <button
                                            onClick={() => setAllergies(prev => prev.filter((_, i) => i !== idx))}
                                            className="hover:text-orange-200 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newAllergy}
                                    onChange={(e) => setNewAllergy(e.target.value)}
                                    placeholder="Add allergy (e.g. Peanuts)"
                                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500 text-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (newAllergy.trim()) {
                                                setAllergies([...allergies, newAllergy.trim()]);
                                                setNewAllergy('');
                                            }
                                        }
                                    }}
                                />
                                <Button
                                    onClick={() => {
                                        if (newAllergy.trim()) {
                                            setAllergies([...allergies, newAllergy.trim()]);
                                            setNewAllergy('');
                                        }
                                    }}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 rounded-xl"
                                >
                                    Add
                                </Button>
                            </div>
                        </div>

                        {/* AI Summary - REMOVED LEGACY, using Medical Summary */}

                        {/* Allergy Guide */}
                        {profileData.verified_allergy_guide && (
                            <div>
                                <label className="text-xs text-zinc-400 block mb-2">Allergy Guide</label>
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                    <p className="text-sm text-zinc-300 leading-relaxed">{profileData.verified_allergy_guide}</p>
                                </div>
                            </div>
                        )}

                        {/* Medical Summary (New) */}
                        {profileData.medical_summary && (
                            <div>
                                <label className="text-xs text-zinc-400 block mb-2">Medical Report Summary</label>
                                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <p className="text-sm text-blue-200 leading-relaxed">{profileData.medical_summary}</p>
                                </div>
                            </div>
                        )}

                        {/* Activity Inference (New) */}
                        {profileData.activity_level_inference && (
                            <div>
                                <label className="text-xs text-zinc-400 block mb-2">AI Inferred Activity</label>
                                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center gap-2">
                                    <Activity size={16} className="text-emerald-500" />
                                    <span className="text-sm text-zinc-300">{profileData.activity_level_inference}</span>
                                </div>
                            </div>
                        )}

                        {/* Recommended Limits */}
                        <div>
                            <label className="text-xs text-zinc-400 block mb-3">Daily Recommended Limits</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                    <p className="text-xs text-zinc-500 mb-1">Calories</p>
                                    <p className="text-xl font-bold text-emerald-400">{profileData.recommended_limits.daily_calories}</p>
                                </div>
                                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                    <p className="text-xs text-zinc-500 mb-1">Sugar</p>
                                    <p className="text-xl font-bold text-rose-400">{profileData.recommended_limits.daily_sugar_g}g</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
};
