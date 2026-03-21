import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

const features = [
  {
    icon: "⚡",
    title: "Instant AI Summarization",
    desc: "Paste any article, note, or idea. Groq AI summarizes it into crisp key points in under a second.",
  },
  {
    icon: "🏷️",
    title: "Smart Auto-Tagging",
    desc: "AI reads your content and generates relevant tags automatically. Zero manual organization needed.",
  },
  {
    icon: "💬",
    title: "Conversational Query",
    desc: "Ask questions in plain English. Get answers synthesized from your entire knowledge base instantly.",
  },
  {
    icon: "🔍",
    title: "Full-Text Search",
    desc: "Find anything across all your notes, summaries and tags with powerful MongoDB text search.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your knowledge is encrypted and stored privately. JWT auth with httpOnly cookies.",
  },
  {
    icon: "🆓",
    title: "100% Free AI",
    desc: "Powered by Groq's free tier — llama3-70b model. No OpenAI bills, ever.",
  },
];

const stack = ["Next.js", "React", "TypeScript", "MongoDB", "Groq AI", "Tailwind CSS", "JWT Auth"];

export default async function LandingPage() {

  // ── Auto redirect if already logged in ──
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (token && verifyToken(token)) {
    redirect("/dashboard");
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(10,10,15,0.8)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "var(--brand)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 16,
          }}>🧠</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
            Second Brain AI
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/login" className="btn-ghost">Sign in</Link>
          <Link href="/register" className="btn-primary" style={{ padding: "8px 18px" }}>
            Get started free →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: "140px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 999, padding: "6px 14px", fontSize: 12,
            color: "var(--text-secondary)", marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
            Free Groq AI · llama-3.3-70b · No credit card required
          </div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            Your second brain,{" "}
            <span className="glow-text">powered by AI</span>
          </h1>

          <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 36px" }}>
            Capture knowledge from anywhere. Groq AI automatically summarizes, tags, and organizes it.
            Ask questions and get instant answers from your own knowledge base.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
              Start building for free →
            </Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize: 15, padding: "12px 28px" }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Demo preview ── */}
      <section style={{ padding: "0 24px 80px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          border: "1px solid var(--border)", borderRadius: 20,
          background: "var(--surface-1)", overflow: "hidden",
          boxShadow: "0 0 80px rgba(108,99,255,0.08)",
        }}>
          <div style={{
            background: "var(--surface-2)", borderBottom: "1px solid var(--border)",
            padding: "10px 16px", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f87171", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            <span style={{
              flex: 1, background: "var(--surface-3)", borderRadius: 6, padding: "3px 12px",
              fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginLeft: 12,
            }}>
              second-brain-ai.vercel.app/dashboard
            </span>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 36, background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border)" }} />
              <div style={{ width: 120, height: 36, background: "var(--brand)", borderRadius: 10, opacity: 0.8 }} />
            </div>
            {[
              { title: "How React Server Components work", tags: ["react", "next.js", "architecture"] },
              { title: "Notes on LLM context windows", tags: ["ai", "llm", "memory"] },
              { title: "MongoDB indexing best practices", tags: ["mongodb", "performance", "database"] },
            ].map((item, i) => (
              <div key={i} style={{
                background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 16px", marginBottom: 10,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
                  {item.title}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {item.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
          Everything you need
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 48, fontSize: 15 }}>
          Built with the best free tools available
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {features.map((f) => (
            <div key={f.title} className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: "var(--text-primary)" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "0 24px 80px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 48 }}>How it works</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { step: "01", title: "Capture", desc: "Paste any text, article, or idea into the capture form." },
            { step: "02", title: "AI Processes", desc: "Groq AI instantly generates a summary and tags for your content." },
            { step: "03", title: "Query", desc: "Ask anything. Get answers synthesized from your knowledge base." },
          ].map((s, i) => (
            <div key={s.step} style={{ display: "flex", gap: 20, alignItems: "flex-start", textAlign: "left", paddingBottom: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: "var(--brand-light)", fontFamily: "monospace",
                }}>
                  {s.step}
                </div>
                {i < 2 && <div style={{ width: 1, flex: 1, background: "var(--border)", marginTop: 8, minHeight: 24 }} />}
              </div>
              <div style={{ paddingTop: 10 }}>
                <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{s.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section style={{ padding: "0 24px 80px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 16, textTransform: "uppercase" }}>
          Built with
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {stack.map((t) => (
            <span key={t} style={{
              background: "var(--surface-1)", border: "1px solid var(--border)",
              borderRadius: 999, padding: "5px 14px", fontSize: 12, color: "var(--text-secondary)",
            }}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "0 24px 80px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          background: "var(--surface-1)", border: "1px solid var(--border)",
          borderRadius: 24, padding: "48px 32px",
          boxShadow: "0 0 60px rgba(108,99,255,0.06)",
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Ready to build your second brain?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 28, fontSize: 14 }}>
            Free forever. No credit card. Powered by Groq.
          </p>
          <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "12px 32px" }}>
            Create free account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "20px 24px",
        textAlign: "center", fontSize: 12, color: "var(--text-muted)",
      }}>
        © {new Date().getFullYear()} Second Brain AI — Powered by Groq · Built with Next.js
      </footer>
    </div>
  );
}