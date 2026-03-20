"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
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
    "What do I know about React?",
    "Summarize my notes on AI",
    "What are the key points about databases?",
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* ── Topbar ── */}
      <nav style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: 56, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,10,15,0.9)", backdropFilter: "blur(16px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 13 }}>
            ← Dashboard
          </Link>
          <span style={{ width: 1, height: 16, background: "var(--border)", display: "inline-block" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            Ask your Knowledge Base
          </span>
        </div>
        <div style={{
          fontSize: 11, color: "var(--text-muted)",
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 999, padding: "3px 10px",
        }}>
          ⚡ Groq · llama3-70b
        </div>
      </nav>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", maxWidth: 760, width: "100%", margin: "0 auto" }}>

        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
              Ask anything
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>
              I'll search through your knowledge base and answer using Groq AI
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="btn-secondary"
                  style={{ fontSize: 13 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 10,
              alignItems: "flex-start",
            }}>
              {/* AI avatar */}
              {msg.role === "assistant" && (
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: "var(--brand)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0, marginTop: 2,
                }}>🧠</div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: "78%",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "12px 16px",
                fontSize: 14,
                lineHeight: 1.6,
                ...(msg.role === "user"
                  ? { background: "var(--brand)", color: "white" }
                  : { background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--text-primary)" }
                ),
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading bubble */}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, background: "var(--brand)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
              }}>🧠</div>
              <div style={{
                background: "var(--surface-1)", border: "1px solid var(--border)",
                borderRadius: "18px 18px 18px 4px", padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, color: "var(--text-secondary)",
              }}>
                <span className="spinner" />
                Searching your knowledge base…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input ── */}
      <div style={{
        borderTop: "1px solid var(--border)", padding: "16px 24px", flexShrink: 0,
        background: "var(--surface-1)",
      }}>
        <form onSubmit={handleSend} style={{
          maxWidth: 760, margin: "0 auto", display: "flex", gap: 10,
        }}>
          <input
            className="input"
            placeholder="Ask a question about your knowledge…"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button
            type="submit" className="btn-primary"
            style={{ padding: "10px 24px", flexShrink: 0 }}
            disabled={loading || !input.trim()}
          >
            {loading ? "…" : "Ask →"}
          </button>
        </form>
      </div>
    </div>
  );
}
