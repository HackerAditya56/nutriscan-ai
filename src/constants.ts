
export interface SubIngredient {
    name: string;
    calories: number;
    qty: string;
    iconName: string;
    iconColor: string;
}

export interface UserProfile {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    height: number; // cm
    weight: number; // kg
    bloodType: string;
    conditions: string[];
}

export interface Goal {
    id: string;
    title: string;
    current: number;
    target: number;
    unit: string;
    color: string;
}

export interface FoodItem {
    name: string;
    type: 'SAFE' | 'WARNING' | 'DANGER' | 'ALLERGY';
    calories: number;
    sugar: number; // g
    fiber: number; // g
    protein: number; // g
    image: string;
    message: string;
    subtitle?: string;
    risks?: string[];
    swaps?: string[]; // Simplified to string array based on new backend
    summaryGrid?: Array<{ emoji: string, label: string, value: string, color: string }>;
    benefits?: string[];
    subIngredients?: SubIngredient[];
    comparison_note?: string; // e.g. "Healthy limit: <5g sugar"
    tags?: string[];
    aiAnalysis?: string;
    dailySugarPercent?: number; // New field for user progress

    // New Fields
    scan_result?: {
        verdict?: string;
        health_implication?: string;
        summary_grid?: any[];
    };
    verdict?: string;
    health_implication?: string;
}

export const USER_PROFILE: UserProfile = {
    name: "Alex",
    age: 28,
    gender: "Male",
    height: 175,
    weight: 70,
    bloodType: "O+",
    conditions: ["Pre-Diabetic", "Asthma Risk"]
};

export const DAILY_MACRO_TARGETS = {
    calories: 2500,
    protein: 120, // g
    carbs: 250, // g
    fat: 70, // g
    sugar: 25, // g
};

export const INITIAL_GOALS: Goal[] = [
    { id: '1', title: 'Green Meals', current: 2, target: 5, unit: 'meals', color: 'bg-primary' },
    { id: '2', title: 'Sugar Limit', current: 15, target: 40, unit: 'g', color: 'bg-danger' },
];

export const HISTORY_DATA = {
    topFoods: [
        { name: "Water", count: 512, iconName: 'Droplet', iconColor: 'blue' },
        { name: "Tea (Black)", count: 431, iconName: 'Coffee', iconColor: 'orange' },
        { name: "Red Apple", count: 303, iconName: 'Apple', iconColor: 'red' },
        { name: "Honey", count: 299, iconName: 'Candy', iconColor: 'yellow' },
    ],
    topCategories: [
        { name: "Drink", count: 2555, iconName: 'CupSoda', iconColor: 'blue' },
        { name: "Fruit", count: 1627, iconName: 'Apple', iconColor: 'green' },
        { name: "Meat", count: 1105, iconName: 'Beef', iconColor: 'red' },
        { name: "Vegetable", count: 935, iconName: 'Carrot', iconColor: 'orange' },
    ]
};

export const STREAK_HISTORY = [
    { date: 'Sun', status: 'active', calories: 2100 },
    { date: 'Mon', status: 'active', calories: 2320 },
    { date: 'Tue', status: 'missed', calories: 1500 },
    { date: 'Wed', status: 'active', calories: 2400 },
    { date: 'Thu', status: 'active', calories: 2200 },
    { date: 'Fri', status: 'active', calories: 2150 },
    { date: 'Sat', status: 'active', calories: 1980 },
];

export const FOOD_DATABASE: Record<string, FoodItem> = {
    'processed_mango_juice': {
        name: "Processed Mango Juice",
        type: 'DANGER',
        calories: 140,
        sugar: 38,
        fiber: 0,
        protein: 1,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=600&auto=format&fit=crop',
        message: "High sugar spike risk! 38g Sugar detected.",
        swaps: [
            "Fresh Coconut Water",
            "Homemade Smoothie"
        ],
        subIngredients: [
            { name: 'Mango Pulp', calories: 80, qty: '200ml', iconName: 'Citrus', iconColor: 'orange' },
            { name: 'Added Sugar', calories: 60, qty: '15g', iconName: 'Candy', iconColor: 'red' },
        ]
    },
    'fruit_salad': {
        name: "Fruit Salad",
        type: 'SAFE',
        calories: 90,
        sugar: 12,
        fiber: 4,
        protein: 2,
        image: 'https://images.unsplash.com/photo-1565257329-a1b664d4f725?q=80&w=600&auto=format&fit=crop',
        message: "Excellent source of fiber and vitamins.",
        benefits: ["High Fiber", "Antioxidants", "Vitamin C"],
        subIngredients: [
            { name: 'Pineapple', calories: 30, qty: '50g', iconName: 'Citrus', iconColor: 'yellow' },
            { name: 'Papaya', calories: 25, qty: '50g', iconName: 'Apple', iconColor: 'orange' },
            { name: 'Grape', calories: 20, qty: '30g', iconName: 'Grape', iconColor: 'purple' },
            { name: 'Mint', calories: 1, qty: '2g', iconName: 'LeafyGreen', iconColor: 'green' },
        ]
    },
    'spicy_chips': {
        name: "Spicy Chips",
        type: 'WARNING',
        calories: 220,
        sugar: 2,
        fiber: 1,
        protein: 2,
        image: 'https://images.unsplash.com/photo-1566478919030-261611d08593?q=80&w=600&auto=format&fit=crop',
        message: "High sodium and processed fats.",
        swaps: [
            "Roasted Chickpeas",
            "Kale Chips"
        ],
        subIngredients: [
            { name: 'Potato', calories: 150, qty: '100g', iconName: 'Egg', iconColor: 'yellow' },
            { name: 'Vegetable Oil', calories: 60, qty: '10ml', iconName: 'Droplet', iconColor: 'yellow' },
            { name: 'Spices', calories: 10, qty: '5g', iconName: 'Candy', iconColor: 'red' },
        ]
    },
    'protein_bar': {
        name: "Protein Bar",
        type: 'SAFE',
        calories: 180,
        sugar: 5,
        fiber: 8,
        protein: 20,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop',
        message: "Great protein source for recovery.",
        benefits: ["High Protein", "Low Sugar"],
        subIngredients: [
            { name: 'Whey Protein', calories: 80, qty: '20g', iconName: 'Milk', iconColor: 'blue' },
            { name: 'Oats', calories: 50, qty: '15g', iconName: 'Wheat', iconColor: 'yellow' },
            { name: 'Peanuts', calories: 50, qty: '10g', iconName: 'Nut', iconColor: 'orange' },
        ]
    }
};
