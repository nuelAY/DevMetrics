import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      settings: user.settings,
      bio: user.bio,
      publicEmail: user.publicEmail,
      name: user.name,
    });
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { settings, bio, publicEmail, name } = body;

    await dbConnect();

    // Construct update object
    const update: any = {};
    if (name) update.name = name;
    if (bio !== undefined) update.bio = bio;
    if (publicEmail !== undefined) update.publicEmail = publicEmail;
    
    // Handle nested settings updates
    if (settings) {
      for (const [key, value] of Object.entries(settings)) {
        if (typeof value === 'object' && value !== null) {
          for (const [subKey, subValue] of Object.entries(value)) {
            update[`settings.${key}.${subKey}`] = subValue;
          }
        } else {
          update[`settings.${key}`] = value;
        }
      }
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: update },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      settings: user.settings,
      bio: user.bio,
      publicEmail: user.publicEmail,
    });
  } catch (error) {
    console.error("Settings PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // "Purge Data" logic
    await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          stats: {
            totalCommits: 0,
            prVelocity: 0,
            consistencyScore: 0,
            lastUpdated: new Date()
          },
          aiSummary: ""
        } 
      }
    );

    return NextResponse.json({ success: true, message: "Neural data purged" });
  } catch (error) {
    console.error("Settings DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
