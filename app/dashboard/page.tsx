"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";

interface KnowledgeItem {
  _id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  source?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchItems = useCallback(async (q = "") => {
    setLoading(true);
    const res = await fetch(`/api/knowledge?search=${encodeURIComponent(q)}&limit=20`);
    if (res.status === 401) { router.push("/login"); return; }
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchItems(search);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    setDeleting(id);
    await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchItems(search);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  function toggleExpand(id: string) {
    setExpanded(prev => prev === id ? null : id);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Topbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(10,10,15,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 16px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(135deg, var(--brand), #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🧠</div>
            <span className="nav-brand-text" style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
              Second Brain
            </span>
          </Link>
          <div style={{
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 999, padding: "2px 8px", fontSize: 11,
            color: "var(--text-muted)", whiteSpace: "nowrap",
          }}>
            {total} items
          </div>
        </div>

        {/* Right — Desktop */}
      {/* Right — Desktop only */}
<div className="desktop-nav-items" style={{ display: "flex", alignItems: "center", gap: 6 }}>
  <Link href="/query" className="btn-ghost" style={{ fontSize: 13 }}>💬 Ask AI</Link>
  <Link href="/profile" className="btn-ghost" style={{ fontSize: 13 }}>👤 Profile</Link>
  <Link href="/capture" className="btn-primary" style={{ fontSize: 13, padding: "7px 14px" }}>+ Add</Link>
  <ThemeToggle />
  <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 13 }}>Sign out</button>
</div>

{/* Right — Mobile only */}
<div className="hamburger-btn" style={{ display: "flex", alignItems: "center", gap: 6 }}>
  <ThemeToggle />
  <MobileMenu items={[
    { href: "/capture", label: "Add Knowledge", icon: "➕", primary: true },
    { href: "/query", label: "Ask AI", icon: "💬" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/dashboard", label: "Dashboard", icon: "🧠" },
    { label: "Sign out", icon: "↩️", onClick: handleLogout, danger: true },
  ]} />
</div>
      </nav>

      {/* ── Main ── */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px" }}>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <input
            className="input" placeholder="Search your knowledge base…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-secondary">Search</button>
          {search && (
            <button type="button" className="btn-ghost"
              onClick={() => { setSearch(""); fetchItems(); }}>
              Clear
            </button>
          )}
        </form>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <div className="spinner" style={{ margin: "0 auto 12px", width: 20, height: 20 }} />
            Loading…
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
              Your knowledge base is empty
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
              Start capturing knowledge and let AI organize it for you
            </p>
            <Link href="/capture" className="btn-primary">+ Add your first item</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item) => {
              const isExpanded = expanded === item._id;
              return (
                <div key={item._id} className="card" style={{
                  transition: "all 0.2s",
                  borderColor: isExpanded ? "var(--border-hover)" : "var(--border)",
                  boxShadow: isExpanded ? "0 4px 24px rgba(0,0,0,0.2)" : "none",
                }}>

                  {/* ── Card Header (always visible) ── */}
                  <div
                    onClick={() => toggleExpand(item._id)}
                    style={{ padding: "20px 24px", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>

                        {/* Title row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: "linear-gradient(135deg, var(--brand), #a78bfa)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, boxShadow: "0 2px 8px rgba(108,99,255,0.3)",
                          }}>🧠</div>
                          <h3 style={{
                            fontSize: 15, fontWeight: 600, color: "var(--text-primary)",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1,
                          }}>
                            {item.title}
                          </h3>
                        </div>

                        {/* Summary */}
                        {item.summary && !isExpanded && (
                          <p style={{
                            fontSize: 13, color: "var(--text-secondary)",
                            lineHeight: 1.6, marginBottom: 12, paddingLeft: 46,
                            display: "-webkit-box", WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical", overflow: "hidden",
                          }}>
                            {item.summary}
                          </p>
                        )}

                        {/* Tags + date */}
                        <div style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between", paddingLeft: 46,
                          flexWrap: "wrap", gap: 8,
                        }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {item.tags.map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                              {new Date(item.createdAt).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric",
                              })}
                            </span>
                            <span style={{
                              fontSize: 11, color: "var(--brand-light)",
                              background: "rgba(108,99,255,0.1)",
                              border: "1px solid rgba(108,99,255,0.2)",
                              borderRadius: 999, padding: "2px 8px",
                            }}>
                              {isExpanded ? "▲ Collapse" : "▼ Read more"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                        <Link
                          href={`/edit/${item._id}`}
                          onClick={e => e.stopPropagation()}
                          style={{
                            color: "var(--text-muted)", fontSize: 12, padding: "5px 10px",
                            borderRadius: 6, transition: "all 0.2s",
                            textDecoration: "none", display: "inline-block",
                            border: "1px solid transparent", textAlign: "center",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = "var(--brand-light)";
                            e.currentTarget.style.background = "rgba(108,99,255,0.1)";
                            e.currentTarget.style.borderColor = "rgba(108,99,255,0.2)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = "var(--text-muted)";
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.borderColor = "transparent";
                          }}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(item._id); }}
                          disabled={deleting === item._id}
                          style={{
                            background: "none", border: "1px solid transparent",
                            cursor: "pointer", color: "var(--text-muted)",
                            fontSize: 12, padding: "5px 10px",
                            borderRadius: 6, transition: "all 0.2s",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = "var(--danger)";
                            e.currentTarget.style.background = "rgba(248,113,113,0.1)";
                            e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = "var(--text-muted)";
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.borderColor = "transparent";
                          }}
                        >
                          {deleting === item._id ? "…" : "🗑️ Delete"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Expanded Content ── */}
                  {isExpanded && (
                    <div style={{
                      borderTop: "1px solid var(--border)",
                      padding: "20px 24px 20px 70px",
                    }}>

                      {/* Summary box */}
                      {item.summary && (
                        <div style={{
                          background: "rgba(108,99,255,0.06)",
                          border: "1px solid rgba(108,99,255,0.15)",
                          borderRadius: 10, padding: "12px 16px", marginBottom: 16,
                        }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--brand-light)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            AI Summary
                          </p>
                          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            {item.summary}
                          </p>
                        </div>
                      )}

                      {/* Full content */}
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Full Content
                        </p>
                        <p style={{
                          fontSize: 14, color: "var(--text-primary)",
                          lineHeight: 1.8, whiteSpace: "pre-wrap",
                        }}>
                          {item.content}
                        </p>
                      </div>

                      {/* Source */}
                      {item.source && (
                        <div style={{ marginTop: 16 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Source
                          </p>
                          <a href={item.source} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 13, color: "var(--brand-light)", wordBreak: "break-all" }}>
                            {item.source}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}