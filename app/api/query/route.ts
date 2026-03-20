import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import KnowledgeItem from "@/models/KnowledgeItem";
import { getAuthUser } from "@/lib/auth";
import { queryKnowledge, GroqMessage } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { query, history = [] } = await req.json();

  if (!query)
    return NextResponse.json({ error: "Query is required" }, { status: 400 });

  const items = await KnowledgeItem.find({ userId: user.userId })
    .select("title summary content tags")
    .lean();

  if (!items.length) {
    return NextResponse.json({
      answer: "Your knowledge base is empty! Go to the dashboard and add some knowledge items first, then I can answer questions about them.",
    });
  }

  const context = items
    .map((item, i) =>
      `[${i + 1}] Title: ${item.title}\nSummary: ${item.summary || item.content.slice(0, 200)}\nTags: ${item.tags.join(", ")}`
    )
    .join("\n\n");

  const answer = await queryKnowledge(query, context, history as GroqMessage[]);

  return NextResponse.json({ answer });
}