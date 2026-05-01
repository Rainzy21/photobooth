"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isAdminAuthenticated, logoutAdmin } from "@/lib/adminAuth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/templates", label: "Templates", icon: "🖼️" },
  { href: "/admin/users", label: "Pengguna", icon: "👥" },
  { href: "/admin/results", label: "Hasil Foto", icon: "📸" },
  { href: "/admin/settings", label: "Pengaturan", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") { setAuthed(true); return; }
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
    } else {
      setAuthed(true);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    logoutAdmin();
    router.replace("/admin/login");
  };

  // Login page — no sidebar
  if (pathname === "/admin/login") return <>{children}</>;

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#EEEEFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #2563EB", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const currentPage = NAV.find((n) => n.exact ? pathname === n.href : pathname.startsWith(n.href));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EAECFF 0%, #F0EFFF 50%, #E8F0FF 100%)",
        padding: "20px",
        display: "flex",
        gap: 16,
        boxSizing: "border-box",
        fontFamily: "var(--font-inter, 'Inter', sans-serif)",
      }}
    >
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════
           SIDEBAR — blue card
         ══════════════════════════════ */}
      <aside
        style={{
          width: 200,
          flexShrink: 0,
          background: "linear-gradient(175deg, #2563EB 0%, #1d4ed8 100%)",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          padding: "24px 12px",
          position: "sticky",
          top: 20,
          height: "calc(100vh - 40px)",
          boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
          zIndex: sidebarOpen ? 50 : "auto",
        }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div style={{ paddingLeft: 8, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              📷
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: "-0.3px" }}>
              Photobooth
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: active ? "#ffffff" : "transparent",
                  color: active ? "#2563EB" : "rgba(255,255,255,0.75)",
                  fontSize: 13,
                  fontWeight: active ? 700 : 400,
                  transition: "all 0.18s ease",
                  boxShadow: active ? "0 2px 10px rgba(0,0,0,0.10)" : "none",
                }}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 4 }}>
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, textDecoration: "none", color: "rgba(255,255,255,0.55)", fontSize: 12 }}
          >
            <span>🏠</span> Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.75)", fontSize: 12, cursor: "pointer", fontWeight: 500 }}
          >
            <span>🚪</span> Keluar
          </button>
          {/* Social links */}
          <div style={{ display: "flex", gap: 8, paddingLeft: 8, marginTop: 8 }}>
            {["IG", "TW", "FB"].map((s) => (
              <span key={s} style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>{s}</span>
            ))}
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════
           MAIN — white card
         ══════════════════════════════ */}
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 40px)",
          boxShadow: "0 4px 24px rgba(37,99,235,0.08)",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* ── Topbar ── */}
        <header
          style={{
            padding: "20px 28px 0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            {/* Mobile hamburger */}
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#1e293b", marginBottom: 8 }}
            >
              ☰
            </button>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1 }}>
              {currentPage?.label ?? "Admin"}
            </h1>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              Photobooth Admin Panel
            </p>
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            {/* Notif */}
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#F1F5FF",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                position: "relative",
              }}
            >
              🔔
              <div
                style={{
                  position: "absolute",
                  top: 7,
                  right: 7,
                  width: 7,
                  height: 7,
                  background: "#E8722A",
                  borderRadius: "50%",
                  border: "1.5px solid #fff",
                }}
              />
            </button>
            {/* Search */}
            <button
              style={{ width: 36, height: 36, borderRadius: 10, background: "#F1F5FF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
            >
              🔍
            </button>
            {/* Avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#F1F5FF",
                borderRadius: 10,
                padding: "4px 10px 4px 4px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: "linear-gradient(135deg, #2563EB, #7c3aed)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                A
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>Admin</span>
              <span style={{ fontSize: 10, color: "#94a3b8" }}>▾</span>
            </div>
          </div>
        </header>

        {/* Divider */}
        <div style={{ height: 1, background: "#F1F5FF", margin: "16px 0 0" }} />

        {/* ── Page content ── */}
        <main
          style={{
            flex: 1,
            padding: "24px 28px",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            border-radius: 0 20px 20px 0;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            height: 100vh !important;
          }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-hamburger { display: flex !important; }
        }
        a:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}
