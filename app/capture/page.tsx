"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CapturePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", source: "" });
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
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push("/dashboard");
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
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(10,10,15,0.9)", backdropFilter: "blur(16px)",
      }}>
        <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 13 }}>
          ← Back
        </Link>
        <span style={{
          width: 1, height: 16, background: "var(--border)", display: "inline-block",
        }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
          Capture Knowledge
        </span>
      </nav>

      {/* ── Main ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
            Add to your Second Brain
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Paste any text, article or idea. Groq AI will automatically
            summarize it and generate tags for you.
          </p>
        </div>

        {/* AI badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)",
          borderRadius: 999, padding: "6px 14px", fontSize: 12,
          color: "var(--brand-light)", marginBottom: 28,
        }}>
          ⚡ Powered by Groq · llama3-70b · Auto summarize + tag
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 28 }}>
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 10, padding: "10px 14px", fontSize: 13,
              color: "var(--danger)", marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Title */}
            <div>
              <label className="label">Title *</label>
              <input
                type="text" className="input"
                placeholder="What is this about?"
                required
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
                required
                rows={10}
                value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                style={{ resize: "vertical", minHeight: 200, fontFamily: "inherit", lineHeight: 1.6 }}
              />
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
                ✨ Groq AI is reading your content, generating a summary and creating relevant tags…
                This usually takes 2–3 seconds.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}