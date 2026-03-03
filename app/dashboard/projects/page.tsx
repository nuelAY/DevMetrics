"use client";

import { useEffect, useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Star, GitFork, ExternalLink, Search, Filter, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all"); // all, public, private

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch("/api/user/projects");
                const data = await res.json();
                if (data.projects) {
                    setProjects(data.projects);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesFilter = filter === "all" ||
                (filter === "private" && project.private) ||
                (filter === "public" && !project.private);
            return matchesSearch && matchesFilter;
        });
    }, [projects, searchQuery, filter]);

    const languages = useMemo(() => {
        const counts: Record<string, number> = {};
        projects.forEach(p => {
            if (p.language) counts[p.language] = (counts[p.language] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, [projects]);

    const getProjectStatus = (updatedAt: string) => {
        const lastUpdate = new Date(updatedAt);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24));

        if (diffInDays < 7) return { label: "Active", color: "bg-green-500/10 text-green-400 border-green-500/20" };
        if (diffInDays < 30) return { label: "Recent", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
        if (diffInDays > 180) return { label: "Stale", color: "bg-red-500/10 text-red-400 border-red-500/20" };
        return { label: "Stable", color: "bg-white/5 text-white/40 border-white/10" };
    };

    const calculateImpactScore = (p: any) => {
        const score = (p.stars * 10) + (p.forks * 5) + (Math.max(0, 50 - p.openIssues));
        return Math.min(100, Math.floor(score / 2)); // Dynamic normalized score
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white">
            <Sidebar />
            <Header />

            <main className="lg:ml-64 pt-28 p-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <Code2 className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-bold">Projects</h2>
                            </div>
                            <p className="text-white/40">Intelligent overview of your digital engineering impact.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Search repositories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-64 transition-all text-sm"
                                />
                            </div>
                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                {["all", "public", "private"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all",
                                            filter === f ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white"
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence>
                                {filteredProjects.map((project) => {
                                    const status = getProjectStatus(project.updatedAt);
                                    const impact = calculateImpactScore(project);

                                    return (
                                        <motion.div
                                            key={project.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            whileHover={{ y: -8 }}
                                            className="group glass p-6 rounded-3xl border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between relative overflow-hidden"
                                        >
                                            {/* Top Metadata */}
                                            <div>
                                                <div className="flex items-start justify-between mb-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                                                            {project.private ? <Lock className="w-4 h-4 text-amber-400/70" /> : <Globe className="w-4 h-4 text-blue-400/70" />}
                                                        </div>
                                                        <div className={cn("px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider", status.color)}>
                                                            {status.label}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {project.homepage && (
                                                            <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-all">
                                                                <Globe className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                        <a
                                                            href={project.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </a>
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {project.name}
                                                </h3>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.topics.slice(0, 3).map((topic: string) => (
                                                        <span key={topic} className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                            #{topic}
                                                        </span>
                                                    ))}
                                                </div>

                                                <p className="text-sm text-white/40 line-clamp-2 mb-6 min-h-[40px] leading-relaxed">
                                                    {project.description || "Architecting digital solutions at scale with focused performance."}
                                                </p>
                                            </div>

                                            {/* Indicators Footer */}
                                            <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5" title="Stargazers">
                                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/10" />
                                                        <span className="text-xs font-medium text-white/60">{project.stars}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5" title="Forks">
                                                        <GitFork className="w-3.5 h-3.5 text-blue-400/70" />
                                                        <span className="text-xs font-medium text-white/60">{project.forks}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="text-right">
                                                        <p className="text-[8px] uppercase tracking-tighter text-white/20 font-bold mb-0.5">Impact Score</p>
                                                        <p className={cn(
                                                            "text-sm font-black",
                                                            impact > 50 ? "text-blue-400" : "text-white/40"
                                                        )}>{impact}%</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center relative">
                                                        <svg className="w-full h-full -rotate-90">
                                                            <circle
                                                                cx="16" cy="16" r="14"
                                                                fill="transparent"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                className="text-white/5"
                                                            />
                                                            <circle
                                                                cx="16" cy="16" r="14"
                                                                fill="transparent"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeDasharray={2 * Math.PI * 14}
                                                                strokeDashoffset={2 * Math.PI * 14 * (1 - impact / 100)}
                                                                className="text-blue-500 transition-all duration-1000"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {!loading && filteredProjects.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No projects found</h3>
                            <p className="text-white/40">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
