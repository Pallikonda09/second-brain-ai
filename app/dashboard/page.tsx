"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface KnowledgeItem {
  _id: string;
  title: string;
  summary: string;
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
    router.push("/");
  }

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
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "var(--brand)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🧠</div>
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
              Second Brain
            </span>
          </Link>
          <div style={{
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 999, padding: "2px 10px", fontSize: 11,
            color: "var(--text-muted)",
          }}>
            {total} items
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/query" className="btn-ghost" style={{ fontSize: 13 }}>
            💬 Ask AI
          </Link>
          <Link href="/capture" className="btn-primary" style={{ fontSize: 13, padding: "7px 16px" }}>
            + Add
          </Link>
          <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 13 }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>

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
            <Link href="/capture" className="btn-primary">
              + Add your first item
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item) => (
              <div key={item._id} className="card" style={{
                padding: "18px 20px",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: 15, fontWeight: 600, color: "var(--text-primary)",
                      marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p style={{
                        fontSize: 13, color: "var(--text-secondary)",
                        lineHeight: 1.5, marginBottom: 10,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {item.summary}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {item.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                      <span style={{
                        fontSize: 11, color: "var(--text-muted)", marginLeft: "auto",
                      }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleting === item._id}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted)", fontSize: 13, padding: "4px 8px",
                      borderRadius: 6, transition: "all 0.2s", flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "var(--danger)";
                      e.currentTarget.style.background = "rgba(248,113,113,0.1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    {deleting === item._id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}