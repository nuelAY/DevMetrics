"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

export function Hero() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center z-10"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                    Understand your <br /> coding impact.
                </h1>
                <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                    DevMetrics analyzes your GitHub activity to provide beautiful,
                    intelligent insights into your productivity and growth.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => signIn("github")}
                        className="flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        <Github className="w-5 h-5" />
                        Connect with GitHub
                    </motion.button>

                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                        View Sample Dashboard
                    </button>
                </div>
            </motion.div>

            {/* Floating Elements (Decorative) */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 w-12 h-12 bg-blue-500/20 rounded-xl border border-white/10 blur-sm"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-10 w-16 h-16 bg-purple-500/20 rounded-full border border-white/10 blur-sm"
            />
        </div>
    );
}
