"use client";

import { motion } from "framer-motion";
import { Zap, Activity, Brain, Target, Shield, Rocket } from "lucide-react";

const features = [
    {
        title: "Velocity Pulse",
        description: "Real-time dev velocity tracking with millisecond precision. Understand your coding rhythm like never before.",
        icon: Zap,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        title: "Session Explorer",
        description: "Smart event grouping into high-impact 'coding sessions'. Deep dive into every commit, PR, and review with context.",
        icon: Activity,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    },
    {
        title: "AI Growth Coach",
        description: "Personalized engineering insights powered by Llama 3. Get actionable feedback on your technical evolution.",
        icon: Brain,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20"
    },
    {
        title: "Momentum Scoring",
        description: "Project-level impact analysis. Quantify your contribution weight and consistency across repositories.",
        icon: Target,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20"
    },
    {
        title: "Security Shield",
        description: "Enterprise-grade 2FA via GitHub and encrypted session management. Your neural data is protected at every level.",
        icon: Shield,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20"
    },
    {
        title: "Neural Summaries",
        description: "Weekly AI-generated summaries of your engineering impact. Share your progress with beautiful, automated reports.",
        icon: Rocket,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20"
    }
];

export function FeatureShowcase() {
    return (
        <section id="features" className="py-32 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black tracking-tight mb-6 uppercase italic"
                    >
                        Precision Engineering <br />
                        <span className="text-blue-500">For Modern Developers</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 max-w-2xl mx-auto font-medium"
                    >
                        DevMetrics isn't just a dashboard. It's an intelligent workspace designed to quantify your impact and accelerate your career growth.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass p-8 rounded-[32px] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                        >
                            <div className={feature.bgColor + " " + feature.borderColor + " w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"}>
                                <feature.icon className={"w-7 h-7 " + feature.color} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-sm text-white/40 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] -z-10 group-hover:bg-white/10 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
