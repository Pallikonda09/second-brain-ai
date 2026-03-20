import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import KnowledgeItem from "@/models/KnowledgeItem"
import { getAuthUser } from "@/lib/auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const item = await KnowledgeItem.findOne({ _id: id, userId: user.userId });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const updates = await req.json();
  const item = await KnowledgeItem.findOneAndUpdate(
    { _id: id, userId: user.userId },
    updates,
    { new: true }
  );
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  await KnowledgeItem.findOneAndDelete({ _id: id, userId: user.userId });
  return NextResponse.json({ message: "Deleted" });
}