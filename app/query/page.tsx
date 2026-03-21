"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function formatMessage(text: string) {
  text = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, _lang, code) =>
    `<pre style="background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:14px;overflow-x:auto;margin:8px 0;font-size:12px;line-height:1.6"><code style="color:#e6edf3;font-family:monospace">${code.trim()}</code></pre>`
  );
  text = text.replace(/`([^`]+)`/g,
    '<code style="background:#1c2230;border:1px solid #30363d;border-radius:4px;padding:2px 6px;font-size:12px;font-family:monospace;color:#84a9ff">$1</code>'
  );
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>');
  text = text.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="padding-left:20px;margin:8px 0">$&</ul>');
  text = text.replace(/^\d+\. (.+)$/gm, '<li style="margin:4px 0">$1</li>');
  text = text.replace(/\n/g, '<br/>');
  return text;
}

export default function QueryPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg.content, history }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer || data.error || "Something went wrong.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "Explain React hooks",
    "Write a Python fibonacci function",
    "What is machine learning?",
    "Summarize my knowledge base",
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* ── Topbar ── */}
      <nav style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 16px", height: 56, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,10,15,0.9)", backdropFilter: "blur(16px)",
      }}>

        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 13, padding: "6px 10px" }}>
            ← <span className="hide-mobile">Dashboard</span>
          </Link>
          <span style={{ width: 1, height: 16, background: "var(--border)", display: "inline-block" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            AI Chat
          </span>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Desktop links */}
          <div className="desktop-nav-items" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 13 }}>
              🧠 Dashboard
            </Link>
            <Link href="/capture" className="btn-primary" style={{ fontSize: 13, padding: "7px 14px" }}>
              + Add
            </Link>
          </div>
          <ThemeToggle />
          {/* Mobile menu */}
          <MobileMenu items={[
            { href: "/capture", label: "Add Knowledge", icon: "➕", primary: true },
            { href: "/dashboard", label: "Dashboard", icon: "🧠" },
            { href: "/profile", label: "Profile", icon: "👤" },
          ]} />
        </div>
      </nav>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", maxWidth: 800, width: "100%", margin: "0 auto" }}>

        {messages.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🧠</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              Ask me anything
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 8 }}>
              I can answer general questions, help with coding, explain concepts
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}>
              + search your personal knowledge base
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)} className="btn-secondary" style={{ fontSize: 13 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 10, alignItems: "flex-start",
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: "linear-gradient(135deg, var(--brand), #a78bfa)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0, marginTop: 2,
                }}>🧠</div>
              )}
              <div style={{
                maxWidth: "80%",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "12px 16px", fontSize: 14, lineHeight: 1.7,
                ...(msg.role === "user"
                  ? { background: "var(--brand)", color: "white" }
                  : { background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--text-primary)" }
                ),
              }}
                dangerouslySetInnerHTML={msg.role === "assistant"
                  ? { __html: formatMessage(msg.content) }
                  : undefined}
              >
                {msg.role === "user" ? msg.content : undefined}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: "linear-gradient(135deg, var(--brand), #a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>🧠</div>
              <div style={{
                background: "var(--surface-1)", border: "1px solid var(--border)",
                borderRadius: "18px 18px 18px 4px", padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, color: "var(--text-secondary)",
              }}>
                <span className="spinner" />
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input ── */}
      <div style={{
        borderTop: "1px solid var(--border)", padding: "12px 16px", flexShrink: 0,
        background: "var(--surface-1)",
      }}>
        <form onSubmit={handleSend} style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="Ask anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            style={{ flex: 1 }}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) handleSend(e); }}
          />
          <button
            type="submit" className="btn-primary"
            style={{ padding: "10px 20px", flexShrink: 0 }}
            disabled={loading || !input.trim()}
          >
            {loading ? "…" : "Send →"}
          </button>
        </form>
      </div>
    </div>
  );
}