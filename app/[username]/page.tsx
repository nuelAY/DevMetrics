import { User } from "@/models/User";
import { notFound } from "next/navigation";
import { GitCommit, Star, Archive, TrendingUp, Github } from "lucide-react";
import { cn } from "@/lib/utils";

import dbConnect from "@/lib/dbConnect";

async function getProfileData(username: string) {
    await dbConnect();
    return await User.findOne({ githubUsername: username });
}

export default async function PublicProfilePage({ params }: { params: any }) {
    const { username } = await params;
    const user = await getProfileData(username);


    if (!user) {
        notFound();
    }

    const statCards = [
        { label: "Total Repos", value: user.stats?.totalRepos || 0, icon: Archive, color: "text-blue-400" },
        { label: "Commit Velocity", value: user.stats?.totalCommits || 0, icon: GitCommit, color: "text-purple-400" },
        { label: "Stars Earned", value: user.stats?.stars || 0, icon: Star, color: "text-yellow-400" },
        { label: "Dev Score", value: `${user.stats?.consistencyScore || 0}/100`, icon: TrendingUp, color: "text-green-400" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white p-8 md:p-24 flex flex-col items-center">
            <div className="max-w-4xl w-full">
                <header className="flex flex-col items-center text-center mb-16">
                    <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden mb-6 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{user.name}</h1>
                    <p className="text-xl text-white/50 flex items-center gap-2">
                        <Github className="w-5 h-5" />
                        github.com/{user.githubUsername}
                    </p>
                </header>

                <div className="glass p-8 rounded-3xl mb-12 border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                            Verified Performance
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">AI Performance Summary</h3>
                    <p className="text-2xl font-medium leading-relaxed italic">
                        "{user.aiSummary}"
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {statCards.map((card) => (
                        <div key={card.label} className="glass p-6 rounded-2xl flex flex-col items-center text-center">
                            <card.icon className={cn("w-6 h-6 mb-4", card.color)} />
                            <h3 className="text-2xl font-bold">{card.value}</h3>
                            <p className="text-xs text-white/50 uppercase tracking-wider mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                <footer className="mt-24 pt-12 border-t border-white/5 text-center text-white/20 text-sm">
                    Powered by DevMetrics for Builders.
                </footer>
            </div>
        </div>
    );
}
