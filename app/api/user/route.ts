import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import KnowledgeItem from "@/models/KnowledgeItem";
import { getAuthUser } from "@/lib/auth";

// GET /api/user — get profile + stats
export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const [user, totalItems, recentItems] = await Promise.all([
    User.findById(auth.userId).select("name email createdAt").lean(),
    KnowledgeItem.countDocuments({ userId: auth.userId }),
    KnowledgeItem.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title tags createdAt")
      .lean(),
  ]);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Get all tags and count them
  const allItems = await KnowledgeItem.find({ userId: auth.userId })
    .select("tags")
    .lean();

  const tagCount: Record<string, number> = {};
  allItems.forEach(item => {
    item.tags.forEach((tag: string) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  return NextResponse.json({ user, totalItems, recentItems, topTags });
}

// PATCH /api/user — update name
export async function PATCH(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { name } = await req.json();

  if (!name || name.trim().length < 2)
    return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });

  const user = await User.findByIdAndUpdate(
    auth.userId,
    { name: name.trim() },
    { new: true }
  ).select("name email createdAt");

  return NextResponse.json({ user });
}