"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { GitCommit, Star, Archive, TrendingUp } from "lucide-react";
import { ActivityChart } from "@/components/ActivityChart";
import { Share2, Check } from "lucide-react";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [aiSummary, setAiSummary] = useState("");
    const [score, setScore] = useState(0);
    const [username, setUsername] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/user/stats");
                if (!res.ok) throw new Error("Failed to fetch stats");

                const data = await res.json();
                if (data.error) throw new Error(data.error);

                setStats(data.stats);
                setAiSummary(data.aiSummary);
                setScore(data.productivityScore);
                if (data.user?.login) {
                    setUsername(data.user.login);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);


    const handleShare = () => {
        const url = `${window.location.origin}/${username}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statCards = [
        { label: "Total Repositories", value: stats?.totalRepos || 0, icon: Archive, color: "text-blue-400" },
        { label: "Public Repositories", value: stats?.publicRepos || 0, icon: GitCommit, color: "text-purple-400" },
        { label: "Total Stars", value: stats?.stars || 0, icon: Star, color: "text-yellow-400" },
        { label: "Productivity Score", value: `${score}/100`, icon: TrendingUp, color: "text-green-400" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white">
            <Sidebar />
            <Header />

            <main className="ml-64 pt-28 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Action */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">Performance Analytics</h2>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                            {copied ? "Link Copied" : "Share Profile"}
                        </button>
                    </div>

                    {/* AI Insights Banner */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 glass"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                AI Insights
                            </div>
                            <div className="h-[1px] flex-1 bg-white/5" />
                        </div>
                        <p className="text-lg font-medium leading-relaxed">
                            {loading ? "Analyzing your GitHub activity..." : aiSummary}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
                    >
                        {statCards.map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-6 rounded-2xl group hover:border-white/20 transition-all hover:translate-y-[-4px]"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("p-2 rounded-lg bg-white/5", card.color)}>
                                        <card.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-white/30 uppercase tracking-wider">Metrics</span>
                                </div>
                                {loading ? (
                                    <div className="h-8 w-24 bg-white/5 animate-pulse rounded" />
                                ) : (
                                    <h3 className="text-3xl font-bold">{card.value}</h3>
                                )}
                                <p className="text-sm text-white/50 mt-1">{card.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 glass p-8 rounded-3xl min-h-[400px] flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Contribution Activity</h3>
                                <p className="text-white/50 text-sm">Your coding frequency over the last 7 days.</p>
                            </div>
                            <div className="flex-1 mt-8">
                                {loading ? (
                                    <div className="w-full h-full animate-pulse bg-white/5 rounded-xl" />
                                ) : (
                                    <ActivityChart data={stats?.activity} />
                                )}
                            </div>
                        </div>

                        <div className="glass p-8 rounded-3xl min-h-[400px]">
                            <h3 className="text-xl font-bold mb-6">Top Languages</h3>
                            <div className="space-y-6">
                                {loading ? (
                                    Array(4).fill(0).map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="h-4 w-24 bg-white/5 animate-pulse rounded" />
                                            <div className="h-2 w-full bg-white/5 animate-pulse rounded" />
                                        </div>
                                    ))
                                ) : (
                                    stats?.languages?.slice(0, 6).map((lang: any, i: number) => (
                                        <div key={lang.name}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-white/70">{lang.name}</span>
                                                <span className="text-white/40">{lang.percent}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${lang.percent}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className={cn("h-full",
                                                        i === 0 ? "bg-blue-500" :
                                                            i === 1 ? "bg-purple-500" :
                                                                i === 2 ? "bg-teal-500" : "bg-white/20"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Helper for cn (already defined in lib/utils but just to be safe in this file scope if needed during copy)
import { cn } from "@/lib/utils";
