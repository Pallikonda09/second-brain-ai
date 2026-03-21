"use client";
import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

type SummaryLength = "short" | "medium" | "long";

const lengthOptions: { value: SummaryLength; label: string; desc: string; icon: string }[] = [
  { value: "short", label: "Short", desc: "2-3 sentences", icon: "⚡" },
  { value: "medium", label: "Medium", desc: "2-3 paragraphs", icon: "📝" },
  { value: "long", label: "Detailed", desc: "5-6 paragraphs", icon: "📖" },
];

export default function CapturePage() {
  const [form, setForm] = useState({ title: "", content: "", source: "" });
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, summaryLength }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Topbar ── */}
      <nav style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,10,15,0.9)", backdropFilter: "blur(16px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 13 }}>
            ← Back
          </Link>
          <span style={{ width: 1, height: 16, background: "var(--border)", display: "inline-block" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            Capture Knowledge
          </span>
        </div>
        <ThemeToggle />
      </nav>

      {/* ── Main ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
            Add to your Second Brain
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Paste any text, article or idea. Choose how detailed you want the AI summary.
          </p>
        </div>

        {/* AI badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)",
          borderRadius: 999, padding: "6px 14px", fontSize: 12,
          color: "var(--brand-light)", marginBottom: 28,
        }}>
          ⚡ Powered by Groq · llama-3.3-70b · Auto summarize + tag
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 28 }}>
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 10, padding: "10px 14px", fontSize: 13,
              color: "var(--danger)", marginBottom: 20,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Title */}
            <div>
              <label className="label">Title *</label>
              <input
                type="text" className="input"
                placeholder="What is this about?" required
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            {/* Content */}
            <div>
              <label className="label">Content *</label>
              <textarea
                className="input"
                placeholder="Paste your article, notes, or any text here…"
                required rows={10}
                value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                style={{ resize: "vertical", minHeight: 200, fontFamily: "inherit", lineHeight: 1.6 }}
              />
            </div>

            {/* ── Summary Length Selector ── */}
            <div>
              <label className="label">AI Summary Length</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {lengthOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSummaryLength(opt.value)}
                    style={{
                      padding: "14px 10px", borderRadius: 12, cursor: "pointer",
                      border: `2px solid ${summaryLength === opt.value ? "var(--brand)" : "var(--border)"}`,
                      background: summaryLength === opt.value
                        ? "rgba(108,99,255,0.1)"
                        : "var(--surface-2)",
                      transition: "all 0.2s", textAlign: "center",
                      boxShadow: summaryLength === opt.value
                        ? "0 0 16px rgba(108,99,255,0.15)"
                        : "none",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.icon}</div>
                    <div style={{
                      fontSize: 13, fontWeight: 600, marginBottom: 3,
                      color: summaryLength === opt.value
                        ? "var(--brand-light)"
                        : "var(--text-primary)",
                    }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="label">
                Source URL{" "}
                <span style={{ color: "var(--text-muted)", textTransform: "none", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <input
                type="url" className="input"
                placeholder="https://…"
                value={form.source}
                onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
              <button
                type="submit" className="btn-primary"
                style={{ padding: "11px 24px", fontSize: 14 }}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner" /> AI is processing…</>
                ) : (
                  "Save & let AI process →"
                )}
              </button>
              <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 14 }}>
                Cancel
              </Link>
            </div>

            {/* Processing hint */}
            {loading && (
              <div style={{
                background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.15)",
                borderRadius: 10, padding: "12px 16px", fontSize: 13,
                color: "var(--text-secondary)", lineHeight: 1.6,
              }}>
                ✨ Groq AI is generating a{" "}
                <strong style={{ color: "var(--brand-light)" }}>
                  {summaryLength === "short" ? "short" : summaryLength === "medium" ? "medium" : "detailed"}
                </strong>{" "}
                summary and creating tags… This usually takes 2–5 seconds.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}