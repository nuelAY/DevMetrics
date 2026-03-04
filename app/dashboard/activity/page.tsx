"use client";

import { useEffect, useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
    GitPullRequest, GitCommit, GitMerge, MessageSquare,
    Star, Info, Clock, Github, Zap, Activity, Calendar,
    ChevronRight, Bug, Rocket, RefreshCw, FileCode,
    Trophy, Flame, TrendingUp as VelocityIcon, PieChart as PieIcon,
    ChevronDown, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format, isSameDay, startOfDay, subDays, differenceInDays } from "date-fns";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis
} from "recharts";

export default function ActivityPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchActivity() {
            try {
                const res = await fetch("/api/user/activity");
                const data = await res.json();
                if (data.activity) {
                    setEvents(data.activity);
                }
            } catch (error) {
                console.error("Error fetching activity:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchActivity();
    }, []);

    // 1. Velocity & Pulse
    const velocity = useMemo(() => {
        if (!events.length) return { score: 0, trend: "Stable", peak: 0 };
        const now = new Date();
        const recentEvents = events.filter(e => {
            const date = new Date(e.createdAt);
            return (now.getTime() - date.getTime()) < (3 * 24 * 3600 * 1000); // Last 3 days
        });

        // Calculate Peak Velocity
        const dailyCounts: Record<string, number> = {};
        events.forEach(e => {
            const d = format(new Date(e.createdAt), 'yyyy-MM-dd');
            dailyCounts[d] = (dailyCounts[d] || 0) + 1;
        });
        const peak = Math.max(...Object.values(dailyCounts), 0);

        const score = Math.min(100, recentEvents.length * 5);
        const trend = score > 50 ? "Sprinting" : score > 20 ? "Steady" : "Planning";
        return { score, trend, peak };
    }, [events]);

    // 2. Streaks
    const streak = useMemo(() => {
        if (!events.length) return 0;
        const activeDays = new Set(events.map(e => format(new Date(e.createdAt), 'yyyy-MM-dd')));
        const sortedDays = Array.from(activeDays).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        let currentStreak = 0;
        let today = startOfDay(new Date());

        for (let i = 0; i < sortedDays.length; i++) {
            const day = startOfDay(new Date(sortedDays[i]));
            const diff = differenceInDays(today, day);
            if (diff === i || diff === i + 1) {
                currentStreak++;
            } else {
                break;
            }
        }
        return currentStreak;
    }, [events]);

    // 3. Project Distribution
    const projectData = useMemo(() => {
        const counts: Record<string, number> = {};
        events.forEach(e => {
            const name = e.repo.split("/")[1] || e.repo;
            counts[name] = (counts[name] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [events]);

    // 4. Work-Type Classification
    const workTypeData = useMemo(() => {
        const types = {
            Features: 0,
            Fixes: 0,
            Refactors: 0,
            Other: 0
        };
        events.forEach(e => {
            if (e.type === "PushEvent") {
                const msg = (e.payload.commits?.[0]?.message || "").toLowerCase();
                if (msg.includes("feat") || msg.includes("add")) types.Features++;
                else if (msg.includes("fix") || msg.includes("bug")) types.Fixes++;
                else if (msg.includes("refactor")) types.Refactors++;
                else types.Other++;
            } else {
                types.Other++;
            }
        });
        return Object.entries(types).map(([name, value]) => ({ name, value }));
    }, [events]);

    // 2. Heatmap Data (Last 90 days placeholder logic using available events)
    const heatmapDays = useMemo(() => {
        const days = [];
        const now = startOfDay(new Date());
        for (let i = 89; i >= 0; i--) {
            const date = subDays(now, i);
            const count = events.filter(e => isSameDay(new Date(e.createdAt), date)).length;
            days.push({ date, count });
        }
        return days;
    }, [events]);

    // 3. Smart Grouping (Sessions)
    const sessions = useMemo(() => {
        if (!events.length) return [];
        const groups: any[] = [];
        let currentSession: any = null;

        events.forEach((event, i) => {
            const eventTime = new Date(event.createdAt).getTime();

            if (!currentSession || (currentSession.startTime - eventTime) > (2 * 3600 * 1000)) {
                if (currentSession) groups.push(currentSession);
                currentSession = {
                    id: `session-${i}`,
                    startTime: eventTime,
                    endTime: eventTime,
                    events: [event],
                    repo: event.repo,
                    impactCount: 0
                };
            } else {
                currentSession.events.push(event);
                currentSession.endTime = eventTime;
            }
        });
        if (currentSession) groups.push(currentSession);
        return groups;
    }, [events]);

    const getCommitBadge = (message: string) => {
        const m = message.toLowerCase();
        if (m.includes("feat") || m.includes("add")) return { icon: Rocket, label: "Feature", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
        if (m.includes("fix") || m.includes("bug")) return { icon: Bug, label: "Fix", color: "text-red-400 bg-red-500/10 border-red-500/20" };
        if (m.includes("refactor")) return { icon: RefreshCw, label: "Refactor", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
        return { icon: FileCode, label: "Dev", color: "text-white/30 bg-white/5 border-white/10" };
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white">
            <Sidebar />
            <Header />

            <main className="lg:ml-64 pt-28 p-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {/* Header & Records */}
                    <div className="flex flex-col xl:flex-row gap-8 mb-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                                    <Activity className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">Activity Pulse</h2>
                                    <p className="text-white/40">Real-time engineering intelligence and velocity tracking.</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-8">
                                <div className="glass px-6 py-4 rounded-2xl border-white/5 flex items-center gap-4 bg-blue-500/5">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Current Streak</p>
                                        <p className="text-xl font-bold">{streak} Days</p>
                                    </div>
                                </div>
                                <div className="glass px-6 py-4 rounded-2xl border-white/5 flex items-center gap-4 bg-purple-500/5">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Peak Velocity</p>
                                        <p className="text-xl font-bold">{velocity.peak} Ops/Day</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass px-8 py-6 rounded-3xl border-white/5 flex items-center gap-8 min-w-[320px]">
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={176} strokeDashoffset={176 * (1 - velocity.score / 100)} className="text-purple-500 transition-all duration-1000" />
                                </svg>
                                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Velocity Status</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-black">{velocity.trend}</span>
                                    <span className="text-xs text-purple-400/70 font-bold px-2.5 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">{velocity.score}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intelligence Insights Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                        {/* Heatmap (Small) */}
                        <div className="glass p-8 rounded-3xl border-white/5 lg:col-span-2 xl:col-span-1 relative overflow-hidden">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-white/40 uppercase tracking-widest mb-6">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                Contribution Impact
                            </h3>
                            <div className="flex flex-wrap gap-1.5 justify-start">
                                {heatmapDays.map((day, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={cn(
                                            "w-3 h-3 rounded-[3px] transition-all duration-300",
                                            day.count === 0 ? "bg-white/5" :
                                                day.count < 3 ? "bg-blue-500/20" :
                                                    day.count < 6 ? "bg-blue-500/60" : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                        )}
                                        title={`${day.count} activities on ${format(day.date, 'MMM do')}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Project Focus Distribution */}
                        <div className="glass p-8 rounded-3xl border-white/5 group">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-white/40 uppercase tracking-widest mb-2">
                                <PieIcon className="w-4 h-4 text-purple-400" />
                                Project Velocity
                            </h3>
                            <div className="h-48 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={projectData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {projectData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={["#3b82f6", "#a855f7", "#2dd4bf", "#f59e0b", "#94a3b8"][index % 5]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                    <p className="text-[10px] font-bold text-white/20 uppercase">Top Focus</p>
                                    <p className="text-xs font-bold truncate max-w-[80px]">{projectData[0]?.name || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Work Type Classification */}
                        <div className="glass p-8 rounded-3xl border-white/5">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-white/40 uppercase tracking-widest mb-6">
                                <VelocityIcon className="w-4 h-4 text-teal-400" />
                                Work Classification
                            </h3>
                            <div className="space-y-4">
                                {workTypeData.map((item, i) => (
                                    <div key={item.name} className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                            <span className="text-white/50">{item.name}</span>
                                            <span className="text-white/30">{item.value} Ops</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.value > 0 ? (item.value / events.length) * 100 : 0}%` }}
                                                className={cn("h-full",
                                                    i === 0 ? "bg-blue-500" :
                                                        i === 1 ? "bg-red-500" :
                                                            i === 2 ? "bg-purple-500" : "bg-white/20"
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Session Timeline */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-xl font-bold">Session Explorer</h3>
                            <div className="h-[1px] flex-1 bg-white/5" />
                        </div>

                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="glass p-8 rounded-3xl bg-white/5 animate-pulse h-48" />
                            ))
                        ) : (
                            <div className="space-y-8">
                                {sessions.map((session, sIdx) => (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: sIdx * 0.1 }}
                                        className="relative group lg:grid lg:grid-cols-[200px_1fr] gap-8"
                                    >
                                        <div className="mb-4 lg:mb-0">
                                            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">
                                                {format(new Date(session.startTime), 'MMM do, yyyy')}
                                            </p>
                                            <div className="flex items-center gap-2 text-white/60">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[10px] font-medium uppercase">
                                                    {format(new Date(session.startTime), 'HH:mm')} — {format(new Date(session.endTime), 'HH:mm')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="glass p-6 rounded-3xl border-white/5 group-hover:border-purple-500/20 transition-all bg-white/[0.02]">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-purple-500/10">
                                                        <Github className="w-4 h-4 text-purple-400" />
                                                    </div>
                                                    <h4 className="font-bold text-lg">{session.repo}</h4>
                                                </div>
                                                <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded-full text-white/30 group-hover:text-purple-400 transition-colors">
                                                    <p className="px-5">{session.events.length}</p> EVENTS
                                                </span>
                                            </div>

                                            <div className="space-y-4">
                                                {session.events.map((event: any) => {
                                                    const commitMessage = event.payload.commits?.[0]?.message || "";
                                                    const badge = event.type === "PushEvent" ? getCommitBadge(commitMessage) : null;
                                                    const isExpanded = selectedEventId === event.id;

                                                    return (
                                                        <div key={event.id} className="flex flex-col">
                                                            <div
                                                                onClick={() => setSelectedEventId(isExpanded ? null : event.id)}
                                                                className={cn(
                                                                    "flex items-start gap-4 p-3.5 rounded-2xl transition-all cursor-pointer border border-transparent",
                                                                    isExpanded ? "bg-white/10 border-white/10" : "hover:bg-white/5 hover:border-white/5"
                                                                )}
                                                            >
                                                                <div className="mt-1">
                                                                    {event.type === "PushEvent" ? <GitCommit className="w-4 h-4 text-blue-400" /> :
                                                                        event.type === "PullRequestEvent" ? <GitPullRequest className="w-4 h-4 text-purple-400" /> :
                                                                            <Info className="w-4 h-4 text-white/20" />}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between gap-4 mb-1.5 flex-wrap">
                                                                        <div className="text-sm font-bold text-white/80">{
                                                                            event.type === "PushEvent" ? (
                                                                                <div className="flex flex-col gap-0.5">
                                                                                    <span>{event.payload.commits?.[0]?.message || "System push update"}</span>
                                                                                    {event.payload.commits?.length > 1 && (
                                                                                        <span className="text-[10px] text-blue-400/60 font-medium italic">
                                                                                            + {event.payload.commits.length - 1} more {(event.payload.commits.length - 1) === 1 ? 'commit' : 'commits'} in this push
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            ) : event.type === "PullRequestEvent" ? (
                                                                                `${event.payload.action} Pull Request`
                                                                            ) : (
                                                                                `Updated ${event.type.replace("Event", "")}`
                                                                            )
                                                                        }</div>
                                                                        <div className="flex items-center gap-2">
                                                                            {badge && (
                                                                                <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 uppercase tracking-tighter", badge.color)}>
                                                                                    <badge.icon className="w-2.5 h-2.5" />
                                                                                    {badge.label}
                                                                                </span>
                                                                            )}
                                                                            <ChevronDown className={cn("w-3 h-3 text-white/20 transition-transform", isExpanded && "rotate-180")} />
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                                                                        {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <AnimatePresence>
                                                                {isExpanded && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="pl-12 pr-4 pb-4 pt-2">
                                                                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                                                                                {event.type === "PushEvent" ? (
                                                                                    <div className="space-y-2">
                                                                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Commits in this push</p>
                                                                                        {event.payload.commits?.map((commit: any) => (
                                                                                            <div key={commit.sha} className="flex items-center justify-between gap-4 p-2 rounded-lg bg-black/20 text-xs">
                                                                                                <code className="text-blue-400/70 text-[10px]">{commit.sha.substring(0, 7)}</code>
                                                                                                <span className="flex-1 text-white/60 truncate">{commit.message}</span>
                                                                                                <a href={`https://github.com/${event.repo}/commit/${commit.sha}`} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors">
                                                                                                    <ExternalLink className="w-3 h-3" />
                                                                                                </a>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                ) : event.type === "PullRequestEvent" ? (
                                                                                    <div className="space-y-2">
                                                                                        <p className="text-sm font-bold text-white/80">{event.payload.pull_request.title}</p>
                                                                                        <div className="flex items-center gap-4">
                                                                                            <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full font-bold uppercase tracking-widest border border-purple-500/20">
                                                                                                #{event.payload.pull_request.number}
                                                                                            </span>
                                                                                            <a href={event.payload.pull_request.html_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 flex items-center gap-1 hover:underline">
                                                                                                View on GitHub <ExternalLink className="w-3 h-3" />
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <p className="text-xs text-white/40 italic">No additional metadata available for this event type.</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
