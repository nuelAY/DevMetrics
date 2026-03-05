"use client";

import { useEffect, useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp, BarChart3, PieChart as PieIcon,
    Clock, Cpu, Zap, Activity, Globe,
    Code2, Calendar, Target, Layers,
    ArrowUpRight, ArrowDownRight, Info
} from "lucide-react";
import {
    ResponsiveContainer, AreaChart, Area,
    XAxis, YAxis, Tooltip, BarChart, Bar,
    PieChart, Pie, Cell, RadarChart,
    PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch("/api/user/analytics");
                const nextData = await res.json();
                if (nextData.analytics) {
                    setData(nextData.analytics);
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const COLORS = ["#3b82f6", "#a855f7", "#2dd4bf", "#f59e0b", "#94a3b8", "#ec4899"];

    const stats = useMemo(() => {
        if (!data) return [];
        return [
            { label: "Total Events", value: data.totalEvents, icon: Activity, trend: "+12%", color: "text-blue-400" },
            { label: "Top Hour", value: `${data.activityByHour.sort((a: any, b: any) => b.count - a.count)[0]?.hour}:00`, icon: Clock, trend: "Peak", color: "text-purple-400" },
            { label: "Languages", value: data.languages.length, icon: Code2, trend: "Active", color: "text-teal-400" },
            { label: "Efficiency", value: "84%", icon: Target, trend: "+5%", color: "text-orange-400" },
        ];
    }, [data]);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white">
            <Sidebar />
            <Header />

            <main className="lg:ml-64 pt-28 p-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                    <TrendingUp className="w-6 h-6 text-blue-400" />
                                </div>
                                <h1 className="text-3xl font-bold">Engineering Insights</h1>
                            </div>
                            <p className="text-white/40 max-w-lg">
                                Advanced behavioral analytics and productivity trends derived from your development patterns.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-white/40 uppercase tracking-widest">
                            <Calendar className="w-3.5 h-3.5" />
                            Last 30 Days
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 glass animate-pulse rounded-3xl" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* AI Coach Insights */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                {data.insights.map((insight: any, i: number) => (
                                    <motion.div
                                        key={insight.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass p-6 rounded-3xl border-l-4 border-l-blue-500/50 bg-blue-500/5"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-4 h-4 text-blue-400" />
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400">{insight.title}</h4>
                                        </div>
                                        <p className="text-sm text-white/60 leading-relaxed">{insight.content}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* KPI Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass p-6 rounded-3xl border-white/5 relative overflow-hidden group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={cn("p-2.5 rounded-xl bg-white/5", stat.color)}>
                                                <stat.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                                {stat.trend}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                                            <p className="text-2xl font-black">{stat.value}</p>
                                        </div>
                                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <stat.icon className="w-24 h-24" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Main Intelligence Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                                {/* Tech Evolution Stream */}
                                <div className="lg:col-span-2 glass p-8 rounded-[32px] border-white/5">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <Layers className="w-5 h-5 text-purple-400" />
                                                Stack Evolution
                                            </h3>
                                            <p className="text-xs text-white/30">Language distribution over historical timeline</p>
                                        </div>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={data.evolution}>
                                                <XAxis
                                                    dataKey="date"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
                                                />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#161618', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                                                />
                                                <Area type="monotone" dataKey="TypeScript" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                                <Area type="monotone" dataKey="React" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
                                                <Area type="monotone" dataKey="Node" stackId="1" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Language DNA */}
                                <div className="glass p-8 rounded-[32px] border-white/5">
                                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                        <Globe className="w-5 h-5 text-teal-400" />
                                        Language DNA
                                    </h3>
                                    <p className="text-xs text-white/30 mb-6">Polyglot proficiency index</p>
                                    <div className="h-[280px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.languages}>
                                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                                <PolarAngleAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                                                <Radar
                                                    name="Expertise"
                                                    dataKey="percent"
                                                    stroke="#2dd4bf"
                                                    fill="#2dd4bf"
                                                    fillOpacity={0.5}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Intelligence Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                                {/* Project Momentum */}
                                <div className="glass p-8 rounded-[32px] border-white/5">
                                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                        <Target className="w-5 h-5 text-orange-400" />
                                        Project Momentum
                                    </h3>
                                    <p className="text-xs text-white/30 mb-6">Velocity trends per repository</p>
                                    <div className="space-y-6">
                                        {data.momentum.map((repo: any, i: number) => (
                                            <div key={repo.name} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-sm font-bold text-white/80">{repo.name}</span>
                                                    <span className="text-[10px] font-black text-orange-400">{repo.score}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${repo.score}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Engineering Rhythm */}
                                <div className="glass p-8 rounded-[32px] border-white/5">
                                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                        <Clock className="w-5 h-5 text-teal-400" />
                                        Engineering Rhythm
                                    </h3>
                                    <p className="text-xs text-white/30 mb-8">Activity density by hour</p>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={data.activityByHour}>
                                                <XAxis
                                                    dataKey="hour"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
                                                    tickFormatter={(h) => `${h}h`}
                                                />
                                                <YAxis hide />
                                                <Bar
                                                    dataKey="count"
                                                    fill="#a855f7"
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={20}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Badge Gallery */}
                                <div className="glass p-8 rounded-[32px] border-white/5">
                                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                        <Cpu className="w-5 h-5 text-blue-400" />
                                        Engineering Badges
                                    </h3>
                                    <p className="text-xs text-white/30 mb-6">Unlocked technical milestones</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {data.badges.map((badge: any) => (
                                            <div key={badge.id} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                                <div className={cn("p-2 rounded-xl mb-2 bg-white/5 group-hover:scale-110 transition-transform", badge.color)}>
                                                    <Zap className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-center">{badge.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
