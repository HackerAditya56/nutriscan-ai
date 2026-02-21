import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
    OnboardResponse,
    ConfirmProfileRequest,
    ConfirmProfileResponse,
    ScanRequest,
    ScanResponse,
    LogFoodRequest,
    LogFoodResponse,
    DashboardResponse,
    ProfileResponse,
    UpdateProfileRequest,
    PingResponse,
    VerifyScanRequest,
    VerifyScanResponse,
    ManualEntryRequest,
    InsightsResponse,
} from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
    private client: AxiosInstance;
    private baseUrl: string;

    constructor() {
        // Load base URL from localStorage or use default
        this.baseUrl = localStorage.getItem('apiBaseUrl') || BASE_URL;

        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 300000, // 120s for heavy AI operations
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true', // Required for ngrok free tier
            },
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                console.error('API Error:', error.response?.data || error.message);
                throw error;
            }
        );
    }

    /**
     * Update base URL and reinitialize client
     */
    setBaseUrl(url: string) {
        this.baseUrl = url;
        localStorage.setItem('apiBaseUrl', url);
        this.client = axios.create({
            baseURL: url,
            timeout: 300000,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true', // Required for ngrok free tier
            },
        });
    }

    /**
     * Check server health
     */
    async ping(): Promise<boolean> {
        try {
            const response = await this.client.get<PingResponse>('/ping');
            return response.data.status === 'success';
        } catch (error) {
            return false;
        }
    }

    /**
     * Upload medical report and get AI analysis
     * Expected duration: 5-10 seconds
     */
    async onboard(files: File[], userId: string): Promise<OnboardResponse> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file); // 'files' array key
        });
        formData.append('user_id', userId);

        const response = await this.client.post<OnboardResponse>('/onboard', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }

    /**
     * Confirm and save user profile after review
     */
    async confirmProfile(data: ConfirmProfileRequest): Promise<ConfirmProfileResponse> {
        const response = await this.client.post<ConfirmProfileResponse>('/confirm-profile', data);
        return response.data;
    }

    /**
     * Scan food item (barcode or image)
     * Expected duration: 3-6 seconds
     */
    async scan(data: ScanRequest): Promise<ScanResponse> {
        const response = await this.client.post<ScanResponse>('/scan', data);
        return response.data;
    }

    /**
     * Scan fresh food item (fruits, dishes) using Vision AI
     */
    async scanFood(data: ScanRequest): Promise<ScanResponse> {
        const response = await this.client.post<ScanResponse>('/food', data);
        return response.data;
    }

    /**
     * Log consumed food to user's history
     */
    async logFood(data: LogFoodRequest): Promise<LogFoodResponse> {
        const response = await this.client.post<LogFoodResponse>('/log-food', data);
        return response.data;
    }

    /**
     * Get user dashboard data (macro rings, food log, etc.)
     */
    async getDashboard(userId: string): Promise<DashboardResponse> {
        const response = await this.client.get<DashboardResponse>(`/dashboard/${userId}`);
        return response.data;
    }

    /**
     * Get user profile
     */
    async getProfile(userId: string): Promise<ProfileResponse> {
        const response = await this.client.get<ProfileResponse>(`/profile/${userId}`);
        return response.data;
    }

    /**
     * Update user profile
     */
    async updateProfile(data: UpdateProfileRequest): Promise<ConfirmProfileResponse> {
        const response = await this.client.post<ConfirmProfileResponse>('/confirm-profile', data);
        return response.data;
    }

    /**
     * Submit user verification/correction for a scan
     */
    async verifyScan(data: VerifyScanRequest): Promise<VerifyScanResponse> {
        const response = await this.client.post<VerifyScanResponse>('/verify', data);
        return response.data;
    }

    /**
     * Manual food entry by text
     */
    async manualEntry(data: ManualEntryRequest): Promise<ScanResponse> {
        const response = await this.client.post<ScanResponse>('/manual-entry', data);
        return response.data;
    }

    /**
     * Get AI insights for a user
     */
    async getInsights(userId: string): Promise<InsightsResponse> {
        const response = await this.client.get<InsightsResponse>(`/insights/${userId}`);
        return response.data;
    }

    /**
     * Dev Utility: Inject dummy insights via backdoor endpoint
     */
    async injectDummyInsights(data: { user_id: string, truth: string, tips: string[] }): Promise<any> {
        const response = await this.client.post('/insights/override', data);
        return response.data;
    }
}

export const api = new ApiService();
