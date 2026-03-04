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
    const userData = await github.getUserData();
    const activity = await github.getDetailedActivity(userData.login);
    
    return NextResponse.json({ activity });
  } catch (error: any) {
    console.error("GitHub Activity Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
