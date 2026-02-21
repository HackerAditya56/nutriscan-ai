// API Request/Response Types - Based on Real Backend Documentation

// ========== ONBOARDING ==========

export interface AIFindings {
    age: number;
    gender: string;
    weight_kg: number;
    height_cm: number;
    bmi?: number;
    conditions: string[];
    allergies: string[];
    activity_level_inference: string;
    dietary_type: string;
    summary: string;
    verified_allergy_guide: string;
    recommended_limits: {
        daily_calories: number;
        daily_sugar_g: number;
        daily_protein_g?: number;
        daily_carbs_g?: number;
        daily_fat_g?: number;
        bmr?: number;
    };
}

export interface OnboardResponse {
    success: boolean;
    user_id: string;
    ai_findings: AIFindings;
    next_step: string;
}

export interface ConfirmProfileRequest {
    user_id: string;
    name: string;
    profile: AIFindings;
    water_tds?: number;
    activity_level: string;
    dietary_preferences?: {
        type: string;
    };
    custom_goals?: {
        daily_calories: number;
        daily_protein_g: number;
        daily_carbs_g: number;
        daily_fat_g: number;
        daily_sugar_g: number;
    };
}

export interface ConfirmProfileResponse {
    success: boolean;
    message: string;
}

// ========== SCANNING ==========

export interface ScanRequest {
    user_id: string;
    barcode?: string;
    image_base64?: string;
    latitude?: number;
    longitude?: number;
    persona?: 'witty' | 'mom' | 'scientific';
}

export interface ManualEntryRequest {
    user_id: string;
    query: string;
}

export interface SummaryGridItem {
    emoji: string;
    label: string;
    value: string;
    color: string;
}

export interface ScanResult {
    food_name: string;
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    micronutrients: {
        [key: string]: number;
    };
    vision_breakdown_list: string[];
    comparison_note?: string; // e.g. "recommended: <5g"
    summary_grid?: SummaryGridItem[];
}

export interface TruthCard {
    status: 'safe' | 'warning' | 'danger' | 'allergy';
    title: string;
    subtitle: string;
    risks: string[]; // List of strings describing risks
}

export interface SwapCard {
    name: string;
    reason: string;
}

export interface HealthAlertCard {
    status: 'SAFE' | 'DANGER' | 'WARNING';
    color_code: string;
    title: string;
    subtitle: string;
    icon: string;
}

export interface UICards {
    truth: TruthCard;
    fun_summary: string;
    ai_analysis?: string;
    swaps: SwapCard[];
    health_alert?: HealthAlertCard;
}

export interface ScanResponse {
    error?: string; // For errors like 'barcode_not_found'
    scan_result: ScanResult;
    ui_cards: {
        truth: TruthCard;
        fun_summary: string;
        ai_analysis?: string;
        swaps: string[]; // Updated to string array
        health_alert?: HealthAlertCard;
    };
    user_state: {
        daily_progress: {
            sugar_percent: number;
            calories_percent: number;
        };
    };
    env_data: {
        aqi: number;
        water_tds: number;
    };
}

export interface VerifyScanRequest {
    user_id: string;
    image_base64: string;
    is_correct: boolean;
    user_correction?: string;
}

export interface VerifyScanResponse {
    success: boolean;
    message: string;
    // Optionally key data if the server re-analyzes immediately
    corrected_data?: ScanResult;
}

// ========== LOGGING ==========

export interface LogFoodRequest {
    user_id: string;
    food_data: ScanResult;
}

export interface LogFoodResponse {
    success: boolean;
    daily_totals: {
        calories: number;
    };
}

// ========== DASHBOARD ==========

export interface MacroRing {
    consumed: number;
    limit: number;
}

export interface DashboardResponse {
    user_id: string;
    nutridex_score?: number; // 0-100
    macro_rings: {
        calories: MacroRing;
        sugar: MacroRing;
        protein?: MacroRing;
        fat?: MacroRing;
        carbs?: MacroRing;
    };
    history: Array<{
        time: string;
        timestamp?: string; // Fallback from some backend versions
        food: string;
        calories?: number;
        tags?: string[]; // New: Tags like "High Protein", "Spicy"
        macros?: {
            p: number; // Protein
            c: number; // Carbs
            f: number; // Fat
            s?: number; // Sugar
        };
    }>;
}

export interface UserProfile {
    name: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    bloodType?: string;
    conditions: string[];
    medical_summary?: string;
    activity_level_inference?: string;
    recommended_limits?: {
        daily_calories: number;
        daily_sugar_g: number;
        daily_protein_g?: number;
        daily_carbs_g?: number;
        daily_fat_g?: number;
        bmr?: number;
    };
    custom_goals?: {
        daily_calories: number;
        daily_protein_g: number;
        daily_carbs_g: number;
        daily_fat_g: number;
        daily_sugar_g: number;
    };
}

export interface ProfileResponse {
    name: string;
    age: number;
    weight_kg: number;
    conditions: string[];
    medical_summary: string;
    recommended_limits: {
        daily_calories: number;
        daily_sugar_g: number;
        daily_protein_g?: number;
        daily_carbs_g?: number;
        daily_fat_g?: number;
    };
    // Additional optional fields that might come back
    gender?: string;
    height_cm?: number;
    allergies?: string[];
    dietary_type?: string;
    verified_allergy_guide?: string;
    activity_level_inference?: string;
    dietary_preferences?: {
        type: string;
    };
    // Restoring fields used by Settings
    water_tds?: number;
    activity_level?: string;
    // Legacy fields for robust mapping
    weight?: number;
    height?: number;
}

export interface UpdateProfileRequest {
    user_id: string;
    name?: string;
    profile?: AIFindings; // Made optional for partial updates like custom_goals
    water_tds?: number;
    activity_level?: string;
    dietary_preferences?: {
        type: string;
    };
    custom_goals?: {
        daily_calories: number;
        daily_protein_g: number;
        daily_carbs_g: number;
        daily_fat_g: number;
        daily_sugar_g: number;
    };
}

// ========== PING ==========

export interface PingResponse {
    status: string;
    message: string;
}
