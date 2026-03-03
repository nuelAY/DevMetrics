import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GitHubService } from "@/services/github";
import { NextResponse } from "next/server";
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
    
    // Transform to a cleaner format for the UI
    const projects = repos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        homepage: repo.homepage,
        updatedAt: repo.updated_at,
        private: repo.private,
        openIssues: repo.open_issues_count,
        topics: repo.topics || [],
    }));

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("GitHub Projects Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
