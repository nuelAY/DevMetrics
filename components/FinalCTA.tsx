"use client";

import { signIn } from "next-auth/react";

export function FinalCTA() {
    return (
        <section className="py-32 px-6 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="max-w-3xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-6xl font-black uppercase italic mb-8">Ready to index your <br /> engineering impact?</h2>
                <p className="text-white/40 font-medium mb-12 text-lg">Join performance-driven developers already using DevMetrics to accelerate their growth.</p>
                <button
                    className="px-12 py-6 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/90 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
                    onClick={() => signIn("github")}
                >
                    Initialize GitHub Integration
                </button>
            </div>
        </section>
    );
}
