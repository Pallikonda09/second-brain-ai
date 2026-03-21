"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({ title: "", content: "", source: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load existing item
  useEffect(() => {
    async function fetchItem() {
      const res = await fetch(`/api/knowledge/${id}`);
      if (res.status === 401) { window.location.href = "/login"; return; }
      if (!res.ok) { setError("Item not found"); setLoading(false); return; }
      const data = await res.json();
      setForm({
        title: data.title ?? "",
        content: data.content ?? "",
        source: data.source ?? "",
      });
      setLoading(false);
    }
    fetchItem();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      window.location.href = "/dashboard";
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)",
    }}>
      <div style={{ textAlign: "center" }}>
        <span className="spinner" style={{ width: 24, height: 24, display: "inline-block", marginBottom: 12 }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading…</p>
      </div>
    </div>
  );

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
        <span style={{ width: 1, height: 16, background: "var(--border)", display: "inline-block" }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
          Edit Knowledge
        </span>
        <ThemeToggle/>
      </nav>

      {/* ── Main ── */}
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
            Edit knowledge item
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Update your content — note that AI summary and tags won't regenerate automatically.
          </p>
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
                placeholder="Your knowledge content…"
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
                disabled={saving}
              >
                {saving ? <><span className="spinner" /> Saving…</> : "Save changes →"}
              </button>
              <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 14 }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}