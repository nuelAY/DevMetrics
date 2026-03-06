"use client";

import { motion } from "framer-motion";
import { Zap, Search, Brain, BarChart3, ChevronRight } from "lucide-react";

export function NeuralIndexing() {
    const steps = [
        {
            icon: Search,
            title: "GitHub Webhook Indexing",
            desc: "We securely index every commit, PR, and review through GitHub's API.",
            detail: "Real-time sync ensures your dashboard is always active."
        },
        {
            icon: Zap,
            title: "Neural Activity Mapping",
            desc: "Events are grouped into logical, high-impact 'coding sessions'.",
            detail: "Algorithms detect deep work patterns and technical breakthroughs."
        },
        {
            icon: Brain,
            title: "AI Analysis & Coaching",
            desc: "Llama 3 processes your data to find hidden growth opportunities.",
            detail: "Get feedback on everything from code quality to collaboration."
        },
        {
            icon: BarChart3,
            title: "Intelligent Performance Cockpit",
            desc: "Visualized insights reveal your true engineering velocity.",
            detail: "A premium UI designed for performance-driven professionals."
        }
    ];

    return (
        <section id="engineering" className="py-32 px-6 bg-gradient-to-b from-transparent to-blue-500/5 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest"
                        >
                            <Zap className="w-3 h-3" /> How It Works
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black leading-tight uppercase italic"
                        >
                            Neural Intelligence <br />
                            <span className="text-white/40">Meets Engineering</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 font-medium leading-relaxed max-w-lg"
                        >
                            DevMetrics uses proprietary indexing algorithms to transform raw GitHub event data into a meaningful roadmap for your engineering career.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-500 hover:gap-4 transition-all group">
                                Explore the architecture <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="absolute -inset-10 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="space-y-4 relative">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="glass p-6 rounded-2xl border-white/5 flex items-start gap-6 group hover:border-white/20 transition-all hover:translate-x-4 duration-500"
                                >
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-lg">{step.title}</h4>
                                        <p className="text-sm text-white/40 font-medium">{step.desc}</p>
                                        <p className="text-[11px] text-blue-400 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">{step.detail}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
