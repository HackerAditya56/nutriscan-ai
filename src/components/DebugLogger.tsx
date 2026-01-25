import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface LogEntry {
    timestamp: string;
    type: 'success' | 'error' | 'warning' | 'info';
    endpoint: string;
    message: string;
    data?: any;
}

interface FieldMismatch {
    field: string;
    frontendHas: boolean;
    backendHas: boolean;
    frontendValue?: any;
    backendValue?: any;
}

export const DebugLogger = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [mismatches, setMismatches] = useState<FieldMismatch[]>([]);
    const [isRunningTest, setIsRunningTest] = useState(false);

    const addLog = (type: LogEntry['type'], endpoint: string, message: string, data?: any) => {
        const log: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            type,
            endpoint,
            message,
            data
        };
        setLogs(prev => [log, ...prev].slice(0, 50)); // Keep last 50 logs
        console.log(`[${type.toUpperCase()}] ${endpoint}: ${message}`, data);
    };

    const compareFields = (frontend: any, backend: any, label: string) => {
        const allKeys = new Set([...Object.keys(frontend || {}), ...Object.keys(backend || {})]);
        const mismatches: FieldMismatch[] = [];

        allKeys.forEach(key => {
            const inFrontend = key in (frontend || {});
            const inBackend = key in (backend || {});

            if (inFrontend !== inBackend) {
                mismatches.push({
                    field: `${label}.${key}`,
                    frontendHas: inFrontend,
                    backendHas: inBackend,
                    frontendValue: frontend?.[key],
                    backendValue: backend?.[key]
                });
            }
        });

        return mismatches;
    };

    const runCompleteTest = async () => {
        setIsRunningTest(true);
        setLogs([]);
        setMismatches([]);

        const userId = localStorage.getItem('userId') || 'test-user-' + Date.now();

        try {
            // Step 1: Test Ping
            addLog('info', 'GET /ping', 'Testing server health...');
            const pingResult = await api.ping();
            addLog(pingResult ? 'success' : 'error', 'GET /ping', pingResult ? 'Server online' : 'Server offline');

            if (!pingResult) {
                addLog('error', 'TEST', 'Cannot continue - server is offline');
                setIsRunningTest(false);
                return;
            }

            // Step 2: Test Profile Fetch
            addLog('info', 'GET /profile/{userId}', `Fetching profile for ${userId}...`);
            try {
                const profileResponse = await api.getProfile(userId);
                addLog('success', 'GET /profile/{userId}', 'Profile fetched successfully', profileResponse);

                // Compare profile fields
                const expectedProfileFields = {
                    conditions: [],
                    water_tds: 0,
                    activity_level: '',
                    recommended_limits: { daily_calories: 0, daily_sugar_g: 0 },
                    age: 0,
                    gender: '',
                    weight_kg: 0,
                    height_cm: 0,
                    allergies: [],
                    dietary_type: '',
                    summary: '',
                    verified_allergy_guide: ''
                };

                const profileMismatches = compareFields(expectedProfileFields, profileResponse, 'ProfileResponse');
                if (profileMismatches.length > 0) {
                    addLog('warning', 'GET /profile/{userId}', `Found ${profileMismatches.length} field mismatches`, profileMismatches);
                    setMismatches(prev => [...prev, ...profileMismatches]);
                }
            } catch (error: any) {
                addLog('error', 'GET /profile/{userId}', error.message || 'Failed to fetch profile', error);
            }

            // Step 3: Test Dashboard Fetch
            addLog('info', 'GET /dashboard/{userId}', `Fetching dashboard for ${userId}...`);
            try {
                const dashboardResponse = await api.getDashboard(userId);
                addLog('success', 'GET /dashboard/{userId}', 'Dashboard fetched successfully', dashboardResponse);

                // Compare dashboard fields
                const expectedDashboardFields = {
                    user_id: '',
                    macro_rings: {
                        calories: { consumed: 0, limit: 0 },
                        sugar: { consumed: 0, limit: 0 }
                    },
                    history: []
                };

                const dashboardMismatches = compareFields(expectedDashboardFields, dashboardResponse, 'DashboardResponse');
                if (dashboardMismatches.length > 0) {
                    addLog('warning', 'GET /dashboard/{userId}', `Found ${dashboardMismatches.length} field mismatches`, dashboardMismatches);
                    setMismatches(prev => [...prev, ...dashboardMismatches]);
                }
            } catch (error: any) {
                addLog('error', 'GET /dashboard/{userId}', error.message || 'Failed to fetch dashboard', error);
            }

            // Step 4: Test Scan (Mock)
            addLog('info', 'POST /scan', 'Testing food scan endpoint...');
            try {
                // Create a minimal test payload
                const scanPayload = {
                    user_id: userId,
                    barcode: '8901234567890',
                    latitude: 28.61,
                    longitude: 77.20
                };

                const scanResponse = await api.scan(scanPayload);
                addLog('success', 'POST /scan', 'Scan completed successfully', scanResponse);

                // Compare scan response fields
                const expectedScanFields = {
                    scan_result: {
                        food_name: '',
                        calories: 0,
                        macros: { protein: 0, carbs: 0, fat: 0 },
                        micronutrients: {},
                        vision_breakdown_list: []
                    },
                    ui_cards: {
                        truth: {
                            status: '',
                            title: '',
                            subtitle: '',
                            risks: []
                        },
                        fun_summary: '',
                        swaps: []
                    },
                    user_state: {
                        daily_progress: { sugar_percent: 0, calories_percent: 0 }
                    },
                    env_data: { aqi: 0, water_tds: 0 }
                };

                const scanMismatches = compareFields(expectedScanFields, scanResponse, 'ScanResponse');
                if (scanMismatches.length > 0) {
                    addLog('warning', 'POST /scan', `Found ${scanMismatches.length} field mismatches`, scanMismatches);
                    setMismatches(prev => [...prev, ...scanMismatches]);
                }

                // Step 5: Test Log Food
                if (scanResponse?.scan_result) {
                    addLog('info', 'POST /log-food', 'Testing food logging...');
                    try {
                        const logPayload = {
                            user_id: userId,
                            food_data: scanResponse.scan_result
                        };

                        const logResponse = await api.logFood(logPayload);
                        addLog('success', 'POST /log-food', 'Food logged successfully', logResponse);
                    } catch (error: any) {
                        addLog('error', 'POST /log-food', error.message || 'Failed to log food', error);
                    }
                }
            } catch (error: any) {
                addLog('error', 'POST /scan', error.message || 'Failed to scan food', error);
            }

            // Summary
            const successCount = logs.filter(l => l.type === 'success').length;
            const errorCount = logs.filter(l => l.type === 'error').length;
            const warningCount = logs.filter(l => l.type === 'warning').length;

            addLog('info', 'TEST COMPLETE', `✅ ${successCount} success, ❌ ${errorCount} errors, ⚠️ ${warningCount} warnings`);

        } catch (error: any) {
            addLog('error', 'TEST', 'Test suite failed', error);
        } finally {
            setIsRunningTest(false);
        }
    };

    useEffect(() => {
        // Only auto-run test if user has completed onboarding
        const userId = localStorage.getItem('userId');
        const isOnboarded = localStorage.getItem('onboardingCompleted');

        if (userId && isOnboarded) {
            addLog('info', 'INIT', `Found user account: ${userId}`);
            // Auto-run test after a short delay
            setTimeout(() => runCompleteTest(), 1000);
        } else {
            addLog('warning', 'INIT', 'No account found. Please complete onboarding first.');
        }
    }, []);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 bg-emerald-500 text-black px-4 py-2 rounded-full shadow-lg hover:bg-emerald-400 text-sm font-bold"
            >
                Show Debug Logger
            </button>
        );
    }

    return (
        <div className="fixed top-4 right-4 z-50 w-96 max-h-[80vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h3 className="text-white font-bold text-sm">API Debug Logger</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={runCompleteTest}
                        disabled={isRunningTest}
                        className="px-3 py-1 bg-emerald-500 text-black text-xs rounded-full hover:bg-emerald-400 disabled:opacity-50"
                    >
                        {isRunningTest ? 'Testing...' : 'Run Test'}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Mismatches Section */}
            {mismatches.length > 0 && (
                <div className="p-4 border-b border-zinc-800 bg-orange-500/10">
                    <h4 className="text-orange-400 font-bold text-xs mb-2 flex items-center gap-2">
                        <AlertCircle size={14} />
                        Field Mismatches ({mismatches.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                        {mismatches.map((m, i) => (
                            <div key={i} className="text-zinc-300">
                                <span className="text-orange-400">{m.field}</span>:{' '}
                                {!m.backendHas && (
                                    <span className="text-rose-400">Missing in backend</span>
                                )}
                                {!m.frontendHas && (
                                    <span className="text-yellow-400">Missing in frontend</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Logs Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {logs.length === 0 && (
                    <div className="text-zinc-500 text-xs text-center py-8">
                        No logs yet. Click "Run Test" to start.
                    </div>
                )}
                {logs.map((log, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-lg border text-xs ${log.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : log.type === 'error'
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                : log.type === 'warning'
                                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-mono text-zinc-500">{log.timestamp}</span>
                            <span className="font-bold">{log.endpoint}</span>
                        </div>
                        <div>{log.message}</div>
                        {log.data && (
                            <details className="mt-1">
                                <summary className="cursor-pointer text-zinc-500 hover:text-white">
                                    View data
                                </summary>
                                <pre className="mt-1 p-2 bg-black/50 rounded text-[10px] overflow-x-auto">
                                    {JSON.stringify(log.data, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span>{logs.length} logs</span>
                <button
                    onClick={() => setLogs([])}
                    className="text-rose-400 hover:text-rose-300"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};
