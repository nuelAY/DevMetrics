"use client";

import { motion } from "framer-motion";
import { Github, Zap, MousePointer2, ChevronRight, Activity } from "lucide-react";
import { signIn } from "next-auth/react";

export function Hero() {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-32 overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_50%)]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center z-10 max-w-5xl"
            >
                {/* Micro-badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-8"
                >
                    <Activity className="w-3 h-3" /> System Status: Optimal
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-[0.9] uppercase italic">
                    The Neural <br />
                    Performance Cockpit.
                </h1>

                <p className="text-lg md:text-2xl text-white/40 mb-12 max-w-2xl mx-auto font-medium leading-[1.4] tracking-tight">
                    DevMetrics transforms your raw GitHub activity into high-fidelity
                    velocity insights and AI-driven growth metrics.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => signIn("github")}
                        className="group flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-500 transition-all shadow-[0_15px_40px_rgba(59,130,246,0.3)]"
                    >
                        <Github className="w-4 h-4" />
                        Initialize Integration
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    {/* <button className="px-10 py-5 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md">
                        Explore Demo Vector
                    </button> */}
                </div>

                {/* Social Proof / Mock Metrics */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-20 border-t border-white/5"
                >
                    {[
                        { label: "Neural Indexing", value: "Real-time" },
                        { label: "Growth Coaching", value: "AI-Powered" },
                        { label: "Performance Ops", value: "24/7" },
                        { label: "Security Schema", value: "Encrypted" }
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-blue-500 text-xs font-black uppercase tracking-widest mb-1">{stat.value}</div>
                            <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Sub-visual indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
            >
                <MousePointer2 className="w-5 h-5 opacity-20" />
            </motion.div>
        </section>
    );
}
