import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import KnowledgeItem from "@/models/KnowledgeItem";
import { getAuthUser } from "@/lib/auth";
import { summarizeKnowledge, generateTags, SummaryLength } from "@/lib/groq";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 10));

  const query: Record<string, unknown> = { userId: user.userId };
  if (search) query.$text = { $search: search };

  const [items, total] = await Promise.all([
    KnowledgeItem.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    KnowledgeItem.countDocuments(query),
  ]);

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { title, content, source, summaryLength = "medium" } = await req.json();

  if (!title || !content)
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });

  const [summary, tags] = await Promise.all([
    summarizeKnowledge(content, summaryLength as SummaryLength),
    generateTags(`${title}\n\n${content}`),
  ]);

  const item = await KnowledgeItem.create({
    userId: user.userId,
    title,
    content,
    summary,
    tags,
    source,
  });

  return NextResponse.json(item, { status: 201 });
}