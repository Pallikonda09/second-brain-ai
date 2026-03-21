// "use client";
// import { useState } from "react";
// import Link from "next/link";

// function getPasswordStrength(password: string): { score: number; label: string; color: string } {
//   let score = 0;
//   if (password.length >= 8) score++;
//   if (password.length >= 12) score++;
//   if (/[A-Z]/.test(password)) score++;
//   if (/[0-9]/.test(password)) score++;
//   if (/[^A-Za-z0-9]/.test(password)) score++;

//   if (score <= 1) return { score, label: "Weak", color: "#f87171" };
//   if (score <= 2) return { score, label: "Fair", color: "#fbbf24" };
//   if (score <= 3) return { score, label: "Good", color: "#60a5fa" };
//   return { score, label: "Strong", color: "#4ade80" };
// }

// export default function RegisterPage() {
//   const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const strength = getPasswordStrength(form.password);
//   const passwordsMatch = form.password === form.confirm;

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     if (form.password.length < 8) {
//       setError("Password must be at least 8 characters");
//       return;
//     }
//     if (!passwordsMatch) {
//       setError("Passwords do not match");
//       return;
//     }
//     if (strength.score < 2) {
//       setError("Password is too weak. Add uppercase, numbers or symbols.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
//       });
//       const data = await res.json();
//       if (!res.ok) { setError(data.error); return; }
//       window.location.href = "/dashboard";
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{
//       minHeight: "100vh", display: "flex", alignItems: "center",
//       justifyContent: "center", padding: "24px", background: "var(--bg)",
//     }}>
//       {/* Background glows */}
//       <div style={{
//         position: "fixed", top: "20%", left: "30%",
//         width: 500, height: 500, borderRadius: "50%",
//         background: "radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)",
//         pointerEvents: "none",
//       }} />

// <div style={{minHeight: "100vh", display: "flex", alignItems: "center",justifyContent: "center", padding: "16px", background: "var(--bg)",}}>

//         {/* Logo */}
//         <div style={{ textAlign: "center", marginBottom: 36 }}>
//           <Link href="/" style={{ textDecoration: "none" }}>
//             <div style={{
//               width: 56, height: 56, borderRadius: 16,
//               background: "linear-gradient(135deg, var(--brand), #a78bfa)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: 28, margin: "0 auto 16px",
//               boxShadow: "0 8px 32px rgba(108,99,255,0.3)",
//             }}>🧠</div>
//           </Link>
//           <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
//             Create your account
//           </h1>
//           <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
//             Start building your Second Brain — free forever
//           </p>
//         </div>

//         {/* Google Button */}
//         <button
//           type="button"
//           style={{
//             width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
//             gap: 10, padding: "11px 20px", borderRadius: 12, marginBottom: 20,
//             background: "var(--surface-2)", border: "1px solid var(--border)",
//             color: "var(--text-primary)", fontSize: 14, fontWeight: 500,
//             cursor: "pointer", transition: "all 0.2s",
//           }}
//           onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
//           onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
//           onClick={() => alert("Google OAuth — connect next-auth or your OAuth provider!")}
//         >
//           <svg width="18" height="18" viewBox="0 0 24 24">
//             <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//             <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//             <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//             <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//           </svg>
//           Sign up with Google
//         </button>

//         {/* Divider */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
//           <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
//           <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or sign up with email</span>
//           <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
//         </div>

//         {/* Card */}
//         <div className="card" style={{ padding: 28 }}>
//           {error && (
//             <div style={{
//               background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
//               borderRadius: 10, padding: "10px 14px", fontSize: 13,
//               color: "var(--danger)", marginBottom: 18,
//             }}>
//               ⚠️ {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 18 }}>

//             {/* Name */}
//             <div>
//               <label className="label">Full name</label>
//               <input
//                 type="text" className="input" placeholder="John Doe" required
//                 autoComplete="off"
//                 value={form.name}
//                 onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="label">Email address</label>
//               <input
//                 type="email" className="input" placeholder="you@example.com" required
//                 autoComplete="off"
//                 value={form.email}
//                 onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="label">Password</label>
//               <div style={{ position: "relative" }}>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="input" placeholder="Min 8 characters" required
//                   autoComplete="new-password"
//                   value={form.password}
//                   onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
//                   style={{ paddingRight: 44 }}
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)}
//                   style={{
//                     position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
//                     background: "none", border: "none", cursor: "pointer",
//                     color: "var(--text-muted)", fontSize: 16, padding: 2,
//                   }}>
//                   {showPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>

//               {/* Password strength bar */}
//               {form.password.length > 0 && (
//                 <div style={{ marginTop: 8 }}>
//                   <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
//                     {[1, 2, 3, 4].map(i => (
//                       <div key={i} style={{
//                         flex: 1, height: 3, borderRadius: 999,
//                         background: i <= strength.score ? strength.color : "var(--border)",
//                         transition: "background 0.3s",
//                       }} />
//                     ))}
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
//                     <span style={{ color: "var(--text-muted)" }}>
//                       Use 8+ chars, uppercase, numbers & symbols
//                     </span>
//                     <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="label">Confirm password</label>
//               <div style={{ position: "relative" }}>
//                 <input
//                   type={showConfirm ? "text" : "password"}
//                   className="input" placeholder="Repeat your password" required
//                   autoComplete="new-password"
//                   value={form.confirm}
//                   onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
//                   style={{
//                     paddingRight: 44,
//                     borderColor: form.confirm.length > 0
//                       ? passwordsMatch ? "#4ade80" : "#f87171"
//                       : undefined,
//                   }}
//                 />
//                 <button type="button" onClick={() => setShowConfirm(!showConfirm)}
//                   style={{
//                     position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
//                     background: "none", border: "none", cursor: "pointer",
//                     color: "var(--text-muted)", fontSize: 16, padding: 2,
//                   }}>
//                   {showConfirm ? "🙈" : "👁️"}
//                 </button>
//               </div>
//               {form.confirm.length > 0 && !passwordsMatch && (
//                 <p style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>
//                   Passwords do not match
//                 </p>
//               )}
//               {form.confirm.length > 0 && passwordsMatch && (
//                 <p style={{ fontSize: 11, color: "#4ade80", marginTop: 4 }}>
//                   ✓ Passwords match
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit" className="btn-primary"
//               style={{ width: "100%", padding: "12px", fontSize: 15 }}
//               disabled={loading}
//             >
//               {loading ? <><span className="spinner" /> Creating account…</> : "Create account →"}
//             </button>
//           </form>
//         </div>

//         <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)", marginTop: 20 }}>
//           Already have an account?{" "}
//           <Link href="/login" style={{ color: "var(--brand-light)", textDecoration: "none", fontWeight: 600 }}>
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }











"use client";
import { useState } from "react";
import Link from "next/link";

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#f87171" };
  if (score <= 2) return { score, label: "Fair", color: "#fbbf24" };
  if (score <= 3) return { score, label: "Good", color: "#60a5fa" };
  return { score, label: "Strong", color: "#4ade80" };
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getPasswordStrength(form.password);
  const passwordsMatch = form.password === form.confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (!passwordsMatch) { setError("Passwords do not match"); return; }
    if (strength.score < 2) { setError("Password is too weak. Add uppercase, numbers or symbols."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
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
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)",
      }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, var(--brand), #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, margin: "0 auto 16px",
              boxShadow: "0 8px 32px rgba(108,99,255,0.3)",
            }}>🧠</div>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Start building your Second Brain — free forever
          </p>
        </div>

        {/* Google Button */}
        <button type="button"
          onClick={() => alert("Google OAuth — coming soon!")}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, padding: "11px 20px", borderRadius: 12, marginBottom: 16,
            background: "var(--surface-2)", border: "1px solid var(--border)",
            color: "var(--text-primary)", fontSize: 14, fontWeight: 500,
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or sign up with email</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 24 }}>
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 10, padding: "10px 14px", fontSize: 13,
              color: "var(--danger)", marginBottom: 16,
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off"
            style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Name */}
            <div>
              <label className="label">Full name</label>
              <input type="text" className="input" placeholder="John Doe" required
                autoComplete="off" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>

            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="you@example.com" required
                autoComplete="off" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input" placeholder="Min 8 characters" required
                  autoComplete="new-password" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", fontSize: 16, padding: 2,
                  }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 999,
                        background: i <= strength.score ? strength.color : "var(--border)",
                        transition: "background 0.3s",
                      }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                    <span style={{ color: "var(--text-muted)" }}>Use 8+ chars, uppercase, numbers & symbols</span>
                    <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="input" placeholder="Repeat your password" required
                  autoComplete="new-password" value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  style={{
                    paddingRight: 44,
                    borderColor: form.confirm.length > 0
                      ? passwordsMatch ? "#4ade80" : "#f87171"
                      : undefined,
                  }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", fontSize: 16, padding: 2,
                  }}>
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {form.confirm.length > 0 && !passwordsMatch && (
                <p style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>Passwords do not match</p>
              )}
              {form.confirm.length > 0 && passwordsMatch && (
                <p style={{ fontSize: 11, color: "#4ade80", marginTop: 4 }}>✓ Passwords match</p>
              )}
            </div>

            <button type="submit" className="btn-primary"
              style={{ width: "100%", padding: "12px", fontSize: 15, marginTop: 4 }}
              disabled={loading}>
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