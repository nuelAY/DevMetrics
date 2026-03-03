"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white">
            <Sidebar />
            <Header />

            <main className="lg:ml-64 pt-28 p-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
                    </div>

                    <div className="glass p-12 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <TrendingUp className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Data Insights</h3>
                        <p className="text-white/40 max-w-sm">
                            Predictive productivity trends and workload balancing insights are coming soon.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
