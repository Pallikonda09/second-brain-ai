import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User"
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.json({
      message: "Logged in",
      user: { id: user._id, name: user.name, email: user.email },
    });
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}