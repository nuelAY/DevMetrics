import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GitHubService } from "@/services/github";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { AIService } from "@/services/ai";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions) as any;


  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = session.accessToken; 
  if (!token) {
     return NextResponse.json({ error: "No GitHub token found" }, { status: 400 });
  }

  const github = new GitHubService(token);

  try {
    const repos = await github.getRepositories();
    const userData = await github.getUserData();
    const activity = await github.getWeeklyActivity(userData.login);
    const languages = await github.getComprehensiveLanguages();

    const stats = {
      totalRepos: repos.length,
      publicRepos: repos.filter(r => !r.private).length,
      stars: repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0),
      activity,
      languages,
    };

    const aiSummary = AIService.generateSummary(stats, userData);
    const productivityScore = AIService.calculateProductivityScore(stats);

    // Update user in DB with stats
    await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        githubUsername: userData.login,
        aiSummary,
        "stats.lastUpdated": new Date(),
        "stats.totalCommits": activity.reduce((acc, a) => acc + a.count, 0),
        "stats.consistencyScore": productivityScore,
      },
      { upsert: true }
    );

    return NextResponse.json({ stats, user: userData, aiSummary, productivityScore });
  } catch (error: any) {
    console.error("GitHub Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
