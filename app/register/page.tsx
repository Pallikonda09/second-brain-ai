"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
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
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px", background: "var(--bg)",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "var(--brand)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 24, margin: "0 auto 12px",
            }}>🧠</div>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Start building your Second Brain — free forever
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 28 }}>
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 10, padding: "10px 14px", fontSize: 13,
              color: "var(--danger)", marginBottom: 18,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="label">Full name</label>
              <input
                type="text" className="input" placeholder="John Doe" required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email" className="input" placeholder="you@example.com" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password" className="input" placeholder="Min 6 characters" required minLength={6}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              />
            </div>

            <button
              type="submit" className="btn-primary"
              style={{ width: "100%", padding: "12px", marginTop: 4, fontSize: 15 }}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Creating account…</> : "Create account →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)", marginTop: 20 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--brand-light)", textDecoration: "none", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}