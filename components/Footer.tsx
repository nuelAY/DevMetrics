"use client";

import { Github, Twitter, Linkedin, Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black/40 border-t border-white/5 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <Zap className="w-6 h-6 text-blue-500" />
                            <span className="font-black text-xl tracking-tighter uppercase italic">DevMetrics</span>
                        </Link>
                        <p className="text-white/40 max-w-sm font-medium leading-relaxed">
                            The ultimate engineering cockpit for performance-driven developers. Transform your GitHub activity into meaningful growth metrics.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Platform</h4>
                        <ul className="space-y-4">
                            {["Analytics", "Activity Hub", "Growth Coach", "Integrations"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-bold text-white/30 hover:text-white transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Resources</h4>
                        <ul className="space-y-4">
                            {["Documentation", "API Docs", "Changelog", "Security"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-bold text-white/30 hover:text-white transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-6">
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest">
                        © 2026 DEVMETRICS INTELLIGENCE. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </footer>
    );
}
