"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface MenuItem {
  href?: string;
  label: string;
  icon: string;
  onClick?: () => void;
  primary?: boolean;
  danger?: boolean;
}

interface Props {
  items: MenuItem[];
}

export default function MobileMenu({ items }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div ref={ref} className="hamburger-btn" style={{ position: "relative" }}>

      {/* ☰ Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: open ? "var(--surface-2)" : "none",
          border: "1px solid " + (open ? "var(--border)" : "transparent"),
          borderRadius: 10, cursor: "pointer",
          color: "var(--text-primary)", fontSize: 18,
          transition: "all 0.2s",
        }}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Fullscreen overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.7)",
          }}
        />
      )}

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "fixed",
          top: 64, right: 12,
          width: 230,
          zIndex: 50,
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "8px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          animation: "fadeDown 0.15s ease",
        }}>
          {items.map((item, i) => (
            item.href ? (
              <Link
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 10,
                  textDecoration: "none", fontSize: 14, fontWeight: 500,
                  color: item.danger
                    ? "var(--danger)"
                    : item.primary
                    ? "white"
                    : "var(--text-primary)",
                  background: item.primary ? "var(--brand)" : "transparent",
                  marginBottom: 2,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => {
                  if (!item.primary) e.currentTarget.style.background = "var(--surface-2)";
                }}
                onMouseLeave={e => {
                  if (!item.primary) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <button
                key={i}
                onClick={() => { setOpen(false); item.onClick?.(); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 10,
                  fontSize: 14, fontWeight: 500,
                  color: item.danger ? "var(--danger)" : "var(--text-primary)",
                  background: "transparent",
                  border: "none", cursor: "pointer",
                  width: "100%", textAlign: "left",
                  marginBottom: 2,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}