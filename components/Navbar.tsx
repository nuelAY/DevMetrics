"use client";

import { motion } from "framer-motion";
import { Github, Zap } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                isScrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="font-black text-xl tracking-tighter uppercase italic">DevMetrics</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {["Features", "Engineering"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* <div className="flex items-center gap-4">
                    <button
                        onClick={() => signIn("github")}
                        className="px-6 py-2.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/90 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
                    >
                        Get Started
                    </button>
                </div> */}
            </div>
        </motion.nav>
    );
}
