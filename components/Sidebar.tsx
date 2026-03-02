"use client";

import { LayoutDashboard, GitPullRequest, Code2, TrendingUp, Settings, LogOut, Github, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useNav } from "@/context/NavContext";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Code2, label: "Projects", href: "/dashboard/projects" },
    { icon: GitPullRequest, label: "Activity", href: "/dashboard/activity" },
    { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isOpen, setIsOpen } = useNav();

    const sidebarContent = (
        <aside className={cn(
            "fixed left-0 top-0 h-full w-64 glass border-r border-white/10 z-[60] flex flex-col pt-8 transition-transform duration-300 lg:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="px-6 mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Github className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">DevMetrics</span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-2 text-white/50 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "group-hover:text-blue-400")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </button>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
                    />
                )}
            </AnimatePresence>
            {sidebarContent}
        </>
    );
}
