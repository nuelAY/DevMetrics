"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
    User,
    Settings,
    Bell,
    Shield,
    Palette,
    Github,
    Smartphone,
    Zap,
    Check,
    ChevronRight,
    Lock
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsPage() {
    const { data: session, update: updateSession } = useSession();
    const { settings, updateSettings, isLoading: settingsLoading } = useSettings();
    const [activeTab, setActiveTab] = useState("profile");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: "",
        bio: "",
        publicEmail: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isPurging, setIsPurging] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setProfileData({
                name: session.user.name || "",
                bio: "", // Will be fetched from API
                publicEmail: session.user.email || ""
            });

            // Initial fetch for extended profile data
            fetch('/api/user/settings')
                .then(res => res.json())
                .then(data => {
                    setProfileData(prev => ({
                        ...prev,
                        bio: data.bio || "",
                        publicEmail: data.publicEmail || prev.publicEmail
                    }));
                });
        }
    }, [session]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });
            if (response.ok) {
                // Update session if name changed
                await updateSession({ name: profileData.name });
                alert("Profile updated successfully");
            }
        } catch (error) {
            console.error("Save profile error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePurgeData = async () => {
        if (!confirm("Are you sure you want to purge all neural data? This cannot be undone.")) return;
        setIsPurging(true);
        try {
            const response = await fetch('/api/user/settings', { method: 'DELETE' });
            if (response.ok) {
                alert("Neural data successfully purged.");
            }
        } catch (error) {
            console.error("Purge error:", error);
        } finally {
            setIsPurging(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile Intelligence", icon: User },
        { id: "appearance", label: "Appearance Engine", icon: Palette },
        { id: "integrations", label: "Integration Matrix", icon: Github },
        { id: "notifications", label: "Neural Notifications", icon: Bell },
        { id: "security", label: "Security & Shield", icon: Shield },
    ];

    if (settingsLoading) {
        return <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
            <Zap className="w-8 h-8 text-blue-500 animate-pulse" />
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white overflow-hidden">
            <Sidebar />
            <Header />

            <main className="lg:ml-64 pt-28 p-4 md:p-10 lg:p-20 transition-all duration-300">
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-5 mb-4">
                            <div className="p-4 rounded-[20px] bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                                <Settings className="w-7 h-7 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">System Configuration</h1>
                                <p className="text-white/40 mt-1 font-medium">Adjust your neural workspace and integration parameters.</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-12 pb-20 items-start">
                        {/* Sidebar Tabs - Sticky on Desktop */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="lg:col-span-1 space-y-2 lg:sticky lg:top-32"
                        >
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                        activeTab === tab.id
                                            ? "bg-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_0_10px_rgba(255,255,255,0.05)] border border-white/10"
                                            : "text-white/40 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <tab.icon className={cn("w-5 h-5 transition-colors duration-300", activeTab === tab.id ? "text-blue-400" : "text-white/40 group-hover:text-white")} />
                                    <span className="font-semibold text-sm tracking-wide">{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 -z-10" />
                                </button>
                            ))}
                        </motion.div>

                        {/* Content Area */}
                        <div className="lg:col-span-3 xl:col-span-4">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="glass p-8 md:p-12 rounded-[40px] border-white/5 min-h-[600px] shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] -z-10" />

                                {activeTab === "profile" && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-[2px]">
                                                <div className="w-full h-full rounded-full bg-[#0a0a0b] flex items-center justify-center overflow-hidden">
                                                    {avatarPreview ? (
                                                        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                                    ) : session?.user?.image ? (
                                                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-10 h-10 text-white/20" />
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{session?.user?.name || "Developer"}</h3>
                                                <p className="text-white/40 text-sm mb-4">{session?.user?.email}</p>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleAvatarChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                                >
                                                    Change Avatar
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Public Email</label>
                                                <input
                                                    type="email"
                                                    value={profileData.publicEmail}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, publicEmail: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Professional Bio</label>
                                            <textarea
                                                rows={4}
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                                placeholder="Briefly describe your technical expertise..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm resize-none"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                                            >
                                                {isSaving ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "appearance" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-bold mb-4">Neural Theme Selection</h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                {["Dark Neural", "Cyber Ghost", "Deep Void"].map((theme, i) => (
                                                    <div
                                                        key={theme}
                                                        onClick={() => updateSettings({ theme: theme as any })}
                                                        className={cn(
                                                            "p-4 rounded-2xl border transition-all cursor-pointer group",
                                                            settings.theme === theme ? "bg-white/10 border-blue-500/50 shadow-lg shadow-blue-500/10" : "bg-white/5 border-white/5 hover:border-white/20"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-full aspect-video rounded-lg mb-3 overflow-hidden relative",
                                                            theme === "Dark Neural" ? "bg-[#0a0a0b]" :
                                                                theme === "Cyber Ghost" ? "bg-[#0c0c1e]" : "bg-black"
                                                        )}>
                                                            <div className={cn(
                                                                "absolute inset-0 opacity-20",
                                                                theme === "Dark Neural" ? "bg-gradient-to-br from-blue-500/40 to-transparent" :
                                                                    theme === "Cyber Ghost" ? "bg-gradient-to-br from-purple-500/40 to-transparent" : ""
                                                            )} />
                                                            <div className="absolute bottom-2 left-2 right-2 h-4 rounded-full bg-white/5" />
                                                            <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/10" />
                                                        </div>
                                                        <span className="text-xs font-bold uppercase tracking-wider">{theme}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold">Glassmorphism Intensity</p>
                                                    <p className="text-xs text-white/40">Adjust the transparency of the UI elements.</p>
                                                </div>
                                                <input
                                                    type="range"
                                                    className="w-32 accent-blue-500"
                                                    value={settings.glassIntensity}
                                                    onChange={(e) => updateSettings({ glassIntensity: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold">Neon Accents</p>
                                                    <p className="text-xs text-white/40">Enable glowing effects on active elements.</p>
                                                </div>
                                                <div
                                                    onClick={() => updateSettings({ neonAccents: !settings.neonAccents })}
                                                    className={cn(
                                                        "w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors",
                                                        settings.neonAccents ? "bg-blue-500 justify-end" : "bg-white/10 justify-start"
                                                    )}
                                                >
                                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "integrations" && (
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-white/5">
                                                    <Github className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold">GitHub Connection</p>
                                                    <p className="text-xs text-green-400">Connected as {session?.user?.name}</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                                                Disconnect
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Advanced Config</h4>
                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-medium text-white/60 px-1">Personal Access Token (Scoped)</label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        defaultValue="ghp_************************"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                    />
                                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white">
                                                        <Lock className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-blue-400" />
                                                    <span className="text-sm font-medium">Real-time Webhook Sync</span>
                                                </div>
                                                <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center justify-end px-1 cursor-pointer">
                                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "notifications" && (
                                    <div className="space-y-6 text-left">
                                        {[
                                            { id: "velocityAlerts", title: "Velocity Alerts", desc: "Notify when development velocity drops or spikes unexpectedly.", icon: Zap },
                                            { id: "metricMilestones", title: "Metric Milestones", desc: "Get alerted when reaching repository star or commit milestones.", icon: Check },
                                            { id: "neuralSummaries", title: "Neural Summaries", desc: "Weekly AI-generated summary of your engineering impact.", icon: Smartphone },
                                            { id: "systemAnomalies", title: "System Anomalies", desc: "Security and system status notifications.", icon: Shield },
                                        ].map((item) => (
                                            <div key={item.title} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 rounded-xl bg-white/5 text-blue-400 group-hover:scale-110 transition-transform">
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{item.title}</p>
                                                        <p className="text-xs text-white/40">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={() => updateSettings({
                                                        notifications: {
                                                            ...settings.notifications,
                                                            [item.id as keyof typeof settings.notifications]: !((settings.notifications as any)[item.id])
                                                        }
                                                    })}
                                                    className={cn(
                                                        "w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors",
                                                        (settings.notifications as any)[item.id] ? "bg-blue-500 justify-end" : "bg-white/10 justify-start"
                                                    )}
                                                >
                                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === "security" && (
                                    <div className="space-y-6 text-left">
                                        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Shield className="w-5 h-5 text-amber-500" />
                                                <h4 className="font-bold text-amber-500">Enhanced Security Protocol</h4>
                                            </div>
                                            <p className="text-sm text-white/60 mb-4">You are currently using 2FA via GitHub. Security settings are managed at the provider level.</p>
                                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 hover:underline">
                                                Manage GitHub Security <ChevronRight className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div>
                                                    <p className="font-bold text-sm">Session Timeout</p>
                                                    <p className="text-xs text-white/40">Automatically log out after inactivity.</p>
                                                </div>
                                                <select
                                                    value={settings.security.sessionTimeout}
                                                    onChange={(e) => updateSettings({
                                                        security: { ...settings.security, sessionTimeout: e.target.value }
                                                    })}
                                                    className="bg-transparent border-none text-sm font-bold text-blue-400 focus:outline-none appearance-none cursor-pointer"
                                                >
                                                    <option className="bg-[#0a0a0b]" value="24 Hours">24 Hours</option>
                                                    <option className="bg-[#0a0a0b]" value="7 Days">7 Days</option>
                                                    <option className="bg-[#0a0a0b]" value="30 Days">30 Days</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div>
                                                    <p className="font-bold text-sm text-red-400">Purge Neural Data</p>
                                                    <p className="text-xs text-white/40">Permanently delete all indexed activity data.</p>
                                                </div>
                                                <button
                                                    onClick={handlePurgeData}
                                                    disabled={isPurging}
                                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all"
                                                >
                                                    {isPurging ? "Purging..." : "Execute Purge"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
