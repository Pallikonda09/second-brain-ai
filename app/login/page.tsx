"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px", background: "var(--bg)",
    }}>
      {/* Background glows */}
      <div style={{
        position: "fixed", top: "20%", left: "30%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "20%", right: "30%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,179,255,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, var(--brand), #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, margin: "0 auto 16px",
              boxShadow: "0 8px 32px rgba(108,99,255,0.3)",
            }}>🧠</div>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Sign in to your Second Brain
          </p>
        </div>

        {/* Google Button */}
        <button
          type="button"
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, padding: "11px 20px", borderRadius: 12, marginBottom: 20,
            background: "var(--surface-2)", border: "1px solid var(--border)",
            color: "var(--text-primary)", fontSize: 14, fontWeight: 500,
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          onClick={() => alert("Google OAuth — connect next-auth or your OAuth provider!")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or continue with email</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 28 }}>
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 10, padding: "10px 14px", fontSize: 13,
              color: "var(--danger)", marginBottom: 18,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label className="label">Email address</label>
              <input
                type="email" className="input"
                placeholder="you@example.com"
                autoComplete="off"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", fontSize: 16, padding: 2,
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit" className="btn-primary"
              style={{ width: "100%", padding: "12px", fontSize: 15 }}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Signing in…</> : "Sign in →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)", marginTop: 20 }}>
          No account?{" "}
          <Link href="/register" style={{ color: "var(--brand-light)", textDecoration: "none", fontWeight: 600 }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}