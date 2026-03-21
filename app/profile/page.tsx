"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface ProfileData {
  user: { name: string; email: string; createdAt: string };
  totalItems: number;
  recentItems: { _id: string; title: string; tags: string[]; createdAt: string }[];
  topTags: { tag: string; count: number }[];
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/user");
      if (res.status === 401) { window.location.href = "/login"; return; }
      const json = await res.json();
      setData(json);
      setName(json.user.name);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); return; }
      setData(prev => prev ? { ...prev, user: { ...prev.user, name: json.user.name } } : prev);
      setSuccess("Name updated successfully!");
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)",
    }}>
      <span className="spinner" style={{ width: 24, height: 24 }} />
    </div>
  );

  if (!data) return null;

  const joinedDate = new Date(data.user.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Topbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(10,10,15,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 13 }}>
            ← Dashboard
          </Link>
          <span style={{ width: 1, height: 16, background: "var(--border)", display: "inline-block" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            Profile
          </span>
        </div>
  
        <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 13 }}>
            
        <ThemeToggle/>
          Sign out
        </button>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── Profile Header ── */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>

            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: 20, flexShrink: 0,
              background: "linear-gradient(135deg, var(--brand), #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, boxShadow: "0 8px 32px rgba(108,99,255,0.3)",
            }}>
              {data.user.name.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              {editing ? (
                <form onSubmit={handleSaveName} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    className="input" value={name} autoFocus
                    onChange={e => setName(e.target.value)}
                    style={{ maxWidth: 240 }}
                  />
                  <button type="submit" className="btn-primary"
                    style={{ padding: "8px 16px", fontSize: 13 }} disabled={saving}>
                    {saving ? "…" : "Save"}
                  </button>
                  <button type="button" className="btn-ghost"
                    style={{ fontSize: 13 }} onClick={() => { setEditing(false); setName(data.user.name); }}>
                    Cancel
                  </button>
                </form>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
                    {data.user.name}
                  </h1>
                  <button onClick={() => setEditing(true)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted)", fontSize: 12, padding: "2px 8px",
                      borderRadius: 6, transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "var(--brand-light)";
                      e.currentTarget.style.background = "rgba(108,99,255,0.1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    ✏️ Edit
                  </button>
                </div>
              )}
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                {data.user.email}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                Joined {joinedDate}
              </p>
            </div>
          </div>

          {/* Success / Error */}
          {success && (
            <div style={{
              background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)",
              borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--success)",
            }}>
              ✓ {success}
            </div>
          )}
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--danger)",
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
          {[
            { label: "Knowledge Items", value: data.totalItems, icon: "🧠" },
            { label: "Unique Tags", value: data.topTags.length, icon: "🏷️" },
            { label: "Days Active", value: Math.floor((Date.now() - new Date(data.user.createdAt).getTime()) / 86400000) + 1, icon: "📅" },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Top Tags ── */}
        {data.topTags.length > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>
              🏷️ Your top tags
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {data.topTags.map(({ tag, count }) => (
                <div key={tag} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)",
                  borderRadius: 999, padding: "4px 12px",
                }}>
                  <span style={{ fontSize: 13, color: "var(--brand-light)" }}>{tag}</span>
                  <span style={{
                    fontSize: 11, color: "var(--text-muted)",
                    background: "var(--surface-3)", borderRadius: 999,
                    padding: "1px 6px",
                  }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent Items ── */}
        {data.recentItems.length > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                🕒 Recently added
              </h2>
              <Link href="/dashboard" style={{ fontSize: 13, color: "var(--brand-light)", textDecoration: "none" }}>
                View all →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.recentItems.map(item => (
                <div key={item._id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", background: "var(--surface-2)",
                  borderRadius: 10, border: "1px solid var(--border)",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 500, color: "var(--text-primary)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      marginBottom: 4,
                    }}>
                      {item.title}
                    </p>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag" style={{ fontSize: 10 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, marginLeft: 12 }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Danger Zone ── */}
        <div className="card" style={{ padding: 24, borderColor: "rgba(248,113,113,0.2)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--danger)", marginBottom: 8 }}>
            ⚠️ Account
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
            Sign out from your Second Brain account.
          </p>
          <button onClick={handleLogout} style={{
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
            borderRadius: 10, padding: "8px 18px", fontSize: 13,
            color: "var(--danger)", cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
          >
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}