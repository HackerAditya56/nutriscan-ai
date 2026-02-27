import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Shield, Zap, ArrowRight,
    ScanLine, Brain, Terminal, Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';

interface LandingPageProps {
    onStartMagic: () => void;
}

export const LandingPage = ({ onStartMagic }: LandingPageProps) => {
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-hidden font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToTop()}>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Brain size={18} className="text-black" />
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-100 to-white">NutriScan AI</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
                        <button onClick={() => scrollToSection('architecture')} className="hover:text-white transition-colors">Architecture</button>
                        <button onClick={() => scrollToSection('setup')} className="hover:text-white transition-colors">Setup Guide</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={onStartMagic}
                            className="bg-white hover:bg-zinc-200 text-black rounded-full px-5 py-2 text-sm font-semibold shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95"
                        >
                            Open App
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col justify-center items-center">
                {/* Background Textures */}
                <div className="absolute top-[-10%] sm:top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <motion.div
                    style={{ y: yHero, opacity: opacityHero }}
                    className="max-w-5xl mx-auto text-center relative z-10 w-full"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-emerald-300 text-xs sm:text-sm font-medium mb-8"
                    >
                        <Sparkles size={14} className="text-emerald-400" />
                        <span>Kaggle Med-Gemma Impact Challenge</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tighter leading-[1.1]"
                    >
                        Decode Your Diet.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300">
                            Preserve Your Privacy.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        An autonomous, dual-vision AI health agent that turns complex nutrition labels into personalized medical insights entirely on your custom backend.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-6 sm:px-0"
                    >
                        <Button
                            onClick={onStartMagic}
                            className="h-14 px-8 text-lg rounded-full bg-emerald-500 text-black hover:bg-emerald-400 font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] w-full sm:w-auto hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1"
                        >
                            Start Setup Magic ✨
                        </Button>
                        <Button
                            onClick={() => scrollToSection('architecture')}
                            className="h-14 px-8 text-lg rounded-full bg-[#111] border border-white/10 text-white hover:bg-white/5 w-full sm:w-auto transition-all"
                        >
                            View Architecture <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Floating Mockup (Pure CSS/Tailwind) */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.4 }}
                    className="relative mt-20 md:mt-32 w-full max-w-4xl mx-auto perspective-1000"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                    <div className="rounded-[2rem] p-2 bg-white/5 border border-white/10 shadow-2xl overflow-hidden transform rotate-x-12 translate-y-10 hover:rotate-x-0 hover:translate-y-0 transition-transform duration-700 ease-out">
                        <MockupInterface />
                    </div>
                </motion.div>
            </section>

            {/* Bento Grid Features */}
            <section id="features" className="py-32 px-6 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Intelligence at <br /><span className="text-zinc-500">Every Scan.</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,_auto)]">
                        {/* Big Bento 1 */}
                        <div className="md:col-span-2 rounded-[2rem] bg-gradient-to-br from-[#0c1f15] to-black border border-emerald-500/20 p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-150 duration-700" />
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <Brain className="text-emerald-400" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-black mb-3">Powered by <br /><span className="text-emerald-400 text-4xl sm:text-5xl mt-2 block">Med-Gemma 1.5-4b-it</span></h3>
                                    <p className="text-emerald-100/70 text-lg leading-relaxed max-w-md">
                                        Google's cutting-edge open weights medical LLM acts as the core "Health Specialist", dynamically correlating extracted macro data with your exact biometric conditions (like Diabetes or Asthma) for unparalleled, personalized health guidance.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Standard Bento 2 */}
                        <div className="rounded-[2rem] bg-zinc-900/40 border border-white/5 p-8 flex flex-col justify-between group hover:bg-zinc-900/60 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                                <ScanLine className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Dual-Vision Scanning</h3>
                                <p className="text-zinc-400">Powered by Qwen2.5-VL-7B for dense nutrition tables and NutriScan-3B for fresh food visual estimation.</p>
                            </div>
                        </div>

                        {/* Standard Bento 3 */}
                        <div className="rounded-[2rem] bg-zinc-900/40 border border-white/5 p-8 flex flex-col justify-between group hover:bg-zinc-900/60 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                                <Shield className="text-rose-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Zero Tracking</h3>
                                <p className="text-zinc-400">Your health data is stored strictly in your browser's IndexedDB.</p>
                            </div>
                        </div>

                        {/* Big Bento 4 */}
                        <div className="md:col-span-2 rounded-[2rem] bg-zinc-900/40 border border-white/5 p-8 overflow-hidden relative group hover:bg-zinc-900/60 transition-colors">
                            <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                                <div className="flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                                        <Zap className="text-amber-400" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Bring Your Own API</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        You host the intelligence. Run the provided Kaggle Notebook to spawn a secure Ngrok tunnel directly to the AI models.
                                    </p>
                                </div>
                                <div className="flex-1 w-full bg-black/50 rounded-xl border border-white/10 p-4 font-mono text-sm text-zinc-300">
                                    <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <p><span className="text-emerald-400">~/backend</span> $ uvicorn api:app</p>
                                    <p className="text-zinc-500 mt-2">INFO: Started server process</p>
                                    <p className="text-zinc-500">INFO: Waiting for application startup.</p>
                                    <p className="text-blue-400">INFO: Ngrok Tunnel created: https://xyz.ngrok.app</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terminal Setup Section */}
            <section id="setup" className="py-32 px-6 bg-[#0a0a0a] border-y border-white/5 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <Terminal className="mx-auto text-emerald-500 mb-6" size={40} />
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Developer-Grade Setup</h2>
                        <p className="text-zinc-400 text-lg">Four steps to launch your private nutrition analyst.</p>
                    </div>

                    <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Terminal Header */}
                        <div className="bg-[#111] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="text-xs text-zinc-500 font-mono">setup.sh</div>
                            <div className="w-16" />
                        </div>

                        {/* Terminal Body */}
                        <div className="p-8 font-mono text-sm space-y-8 text-zinc-300">
                            {/* Step 1 */}
                            <div>
                                <div className="text-zinc-500 mb-2"># 1. Open the Kaggle Notebook</div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <span className="text-purple-400">open</span>
                                    <a href="https://www.kaggle.com/code/adityausa/backhand" target="_blank" rel="noopener noreferrer" className="text-emerald-400 border-b border-emerald-400/30 hover:border-emerald-400 truncate">https://www.kaggle.com/code/adityausa/backhand</a>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div>
                                <div className="text-zinc-500 mb-2"># 2. Add Secrets to Kaggle Notebook</div>
                                <div><span className="text-yellow-300">export</span> HF_TOKEN=<span className="text-emerald-300">"hf_..."</span> <span className="text-zinc-500"># HuggingFace token</span></div>
                                <div className="mt-1"><span className="text-yellow-300">export</span> NGROK_TOKEN=<span className="text-emerald-300">"..."</span> <span className="text-zinc-500"># Free Ngrok authtoken</span></div>
                                <div className="mt-1"><span className="text-yellow-300">export</span> TAVILY_API_KEY=<span className="text-emerald-300">"tvly_..."</span> <span className="text-zinc-500"># Web Search key</span></div>
                            </div>

                            {/* Step 3 */}
                            <div>
                                <div className="text-zinc-500 mb-2"># 3. Run all cells to spawn the backend</div>
                                <div><span className="text-zinc-500">...</span></div>
                                <div className="text-blue-400 mt-1">✔ Tunnel Active: https://kaylynn-rolland.ngrok-free.dev</div>
                            </div>

                            {/* Step 4 */}
                            <div>
                                <div className="text-zinc-500 mb-2"># 4. Connect frontend</div>
                                <div className="flex items-center gap-4 mt-2">
                                    <Button onClick={onStartMagic} className="bg-white text-black text-xs h-8 px-4 font-sans font-bold hover:scale-105 active:scale-95 transition-transform">Run Front-End Wizard</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#050505] text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <Brain size={12} className="text-black" />
                    </div>
                    <span className="font-bold text-sm">NutriScan AI</span>
                </div>
                <p className="text-zinc-500 text-sm mb-4">Built with ❤️ for the Kaggle Med-Gemma Impact Challenge.</p>
                <div className="flex justify-center gap-6 text-zinc-500 text-sm">
                    <a href="https://github.com/HackerAditya56/nutriscan-ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                    <a href="https://www.kaggle.com/code/adityausa/backhand" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kaggle Backend</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                </div>
            </footer>
        </div>
    );
};

// Pure CSS Mockup representation of the dashboard to look cool without loading real data
const MockupInterface = () => (
    <div className="w-full h-[500px] bg-black rounded-xl overflow-hidden flex flex-col items-center p-6 relative">
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

        {/* Top Bar Mock */}
        <div className="w-full flex justify-between items-center mb-10 z-10">
            <div className="w-10 h-10 rounded-full bg-zinc-800" />
            <div className="h-4 w-32 bg-zinc-800 rounded-full" />
            <div className="w-10 h-10 rounded-full bg-zinc-800" />
        </div>

        {/* Big Ring Mock */}
        <div className="relative w-48 h-48 rounded-full border-[12px] border-zinc-800 flex flex-col justify-center items-center z-10 mb-8">
            {/* Fake progress partial ring using conic-gradient */}
            <div className="absolute inset-[-12px] rounded-full" style={{ background: 'conic-gradient(#10b981 0% 65%, transparent 65% 100%)', padding: '12px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
            <div className="text-3xl font-bold text-white mb-1">1,240</div>
            <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Kcal</div>
        </div>

        {/* Small Rings Grid */}
        <div className="w-full max-w-sm grid grid-cols-4 gap-4 z-10">
            {[
                { c: 'border-emerald-500', t: 'PRO' },
                { c: 'border-blue-500', t: 'CRB' },
                { c: 'border-amber-500', t: 'FAT' },
                { c: 'border-rose-500', t: 'SGR' }
            ].map((v, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full border-4 border-zinc-800 relative mb-2 flex items-center justify-center`}>
                        <div className={`absolute inset-[-4px] rounded-full`} style={{ background: `conic-gradient(var(--tw-gradient-stops))`, padding: '4px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    </div>
                    <div className="text-[10px] text-zinc-500 font-bold">{v.t}</div>
                </div>
            ))}
        </div>
    </div>
);

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
