import { motion } from 'framer-motion';
import {
    Cpu, Shield, Lock, Zap, ArrowRight,
    ScanLine, Brain, Activity, Check
} from 'lucide-react';
import { Button } from './ui/Button';

interface LandingPageProps {
    onStartMagic: () => void;
}

export const LandingPage = ({ onStartMagic }: LandingPageProps) => {

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                            <Brain size={18} className="text-emerald-500" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">NutriScan AI</span>
                    </div>
                    <Button
                        onClick={onStartMagic}
                        className="bg-zinc-100 hover:bg-white text-black rounded-full px-6 text-sm font-medium"
                    >
                        Start App
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 center w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6">
                            BYO Backend • Privacy Focused • AI Powered
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                            Medical Intelligence for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                                Your Nutrition
                            </span>
                        </h1>
                        <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Stop guessing. Scan your food and get medical-grade analysis based on your unique health profile. You control the AI, you control the data.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                onClick={onStartMagic}
                                className="h-14 px-8 text-lg rounded-full bg-emerald-500 text-black hover:bg-emerald-400 font-bold shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
                            >
                                Do Magic ✨
                            </Button>
                            <Button
                                onClick={() => scrollToSection('features')}
                                className="h-14 px-8 text-lg rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 w-full sm:w-auto"
                            >
                                Learn More <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why NutriScan?</h2>
                        <p className="text-zinc-400">Advanced features tailored for your health</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<ScanLine />}
                            title="AI Food Scanner"
                            desc="Instantly analyze ingredients from barcodes or photos. Detects hidden sugars and allergens."
                        />
                        <FeatureCard
                            icon={<Activity />}
                            title="Medical Profiling"
                            desc="Upload your medical reports. Our AI builds a personalized health profile to guide your diet."
                        />
                        <FeatureCard
                            icon={<Shield />}
                            title="Privacy First"
                            desc="Your data lives on your own backend. We don't store your medical history on our servers."
                        />
                        <FeatureCard
                            icon={<Cpu />}
                            title="Real-time Analysis"
                            desc="Get immediate feedback on whether food fits your specific dietary needs and conditions."
                        />
                        <FeatureCard
                            icon={<Zap />}
                            title="Smart Swaps"
                            desc="Found something unhealthy? Get instant recommendations for healthier alternatives."
                        />
                        <FeatureCard
                            icon={<Lock />}
                            title="BYO Backend"
                            desc="Host your own AI API using Ngrok. Total control over availability and security."
                        />
                    </div>
                </div>
            </section>

            {/* Setup Guide */}
            <section className="py-20 px-6 bg-zinc-900/30 border-y border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How to Setup</h2>
                        <p className="text-zinc-400">Get your personal AI server running in minutes</p>
                    </div>

                    <div className="space-y-12">
                        <Step
                            num="01"
                            title="Open the Colab Notebook"
                            desc="We provide a ready-to-use Google Colab notebook that powers the AI backend."
                        >
                            <div className="mt-4 p-4 bg-black rounded-xl border border-zinc-800 flex items-center justify-between">
                                <span className="text-zinc-500 truncate">https://colab.research.google.com/drive/placeholder...</span>
                                <Button className="text-xs bg-zinc-800 hover:bg-zinc-700 ml-4">Open Link</Button>
                            </div>
                        </Step>

                        <Step
                            num="02"
                            title="Add Your Secrets"
                            desc="You'll need two tokens to secure your backend:"
                        >
                            <ul className="space-y-3 mt-4 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <Check size={16} className="text-emerald-500 mt-0.5" />
                                    <span><strong>HF_TOKEN:</strong> HuggingFace token (Make sure to accept MedGemma permissions)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={16} className="text-emerald-500 mt-0.5" />
                                    <span><strong>NGROK_TOKEN:</strong> Your free Ngrok authtoken for public access</span>
                                </li>
                            </ul>
                        </Step>

                        <Step
                            num="03"
                            title="Run & Copy URL"
                            desc="Run the notebook. Once initialized, it will generate a public URL ending in .ngrok-free.dev"
                        >
                            <div className="mt-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400">
                                https://kaylynn-transthalamic-rolland.ngrok-free.dev
                            </div>
                        </Step>

                        <Step
                            num="04"
                            title="Connect App"
                            desc="Click 'Do Magic' below and paste your Ngrok URL to connect the app to your brain."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Ready to upgrade your diet?</h2>
                    <p className="text-zinc-400 mb-8">
                        Take control of your health with the power of medical-grade AI.
                    </p>
                    <Button
                        onClick={onStartMagic}
                        className="h-16 px-10 text-xl rounded-full bg-emerald-500 text-black hover:bg-emerald-400 font-bold shadow-xl shadow-emerald-500/20"
                    >
                        Start Setup Now
                    </Button>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors group">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-4 text-zinc-400 group-hover:text-emerald-500 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
);

const Step = ({ num, title, desc, children }: { num: string, title: string, desc: string, children?: any }) => (
    <div className="flex gap-6 md:gap-10">
        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center font-mono font-bold text-zinc-500">
            {num}
        </div>
        <div className="flex-1 pt-2">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-zinc-400 leading-relaxed">{desc}</p>
            {children}
        </div>
    </div>
);
