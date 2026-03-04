"use client";

import { useState, useEffect } from "react";
import { Bell, Search, User, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { useNav } from "@/context/NavContext";
import { cn } from "@/lib/utils";

export function Header() {
    const { data: session } = useSession();
    const { toggle } = useNav();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 right-0 left-0 lg:left-64 h-20 transition-all duration-300 z-40 flex items-center justify-between px-4 md:px-8",
                scrolled
                    ? "bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/10"
                    : "bg-transparent border-b border-transparent"
            )}
        >
            <button
                onClick={toggle}
                className="lg:hidden p-2 mr-2 text-white/60 hover:text-white transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search projects or activity..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6 p-2">
                <button className="relative text-white/60 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0b]" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">{session?.user?.name}</p>
                        <p className="text-xs text-white/40">{session?.user?.email}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-[1px]">
                        <div className="w-full h-full rounded-full bg-[#0a0a0b] flex items-center justify-center overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-white/60" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
