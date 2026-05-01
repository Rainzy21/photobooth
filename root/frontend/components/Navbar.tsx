"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Booth", href: "/booth" },
  { label: "Template", href: "/" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #2BADD4, #E8722A)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 16 }}>📷</span>
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#3D2B1F",
              letterSpacing: "-0.3px",
            }}
          >
            Photobooth
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: 32 }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#5a4032",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#2BADD4")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#5a4032")
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/booth"
            id="navbar-cta"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#ffffff",
              background: "#2BADD4",
              padding: "8px 18px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 0.15s, transform 0.15s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1e9abc";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#2BADD4";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Coba Sekarang
          </Link>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#374151",
            }}
            className="show-mobile-flex"
            aria-label="Toggle menu"
          >
            <svg
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid #E8D8C4",
            background: "#FAF4EC",
            padding: "16px 24px 20px",
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "10px 0",
                fontSize: 15,
                fontWeight: 500,
                color: "#5a4032",
                textDecoration: "none",
                borderBottom: "1px solid #E8D8C4",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/booth"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              marginTop: 12,
              textAlign: "center",
              fontSize: 14,
              fontWeight: 600,
              color: "#ffffff",
              background: "#2BADD4",
              padding: "10px 0",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Coba Sekarang
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile-flex { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-desktop { display: inline !important; }
        }
      `}</style>
    </header>
  );
}
