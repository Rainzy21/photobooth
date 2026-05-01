"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadTemplates } from "@/lib/templateStore";

/* ── mock helpers ── */
function getStats() {
  const templates = loadTemplates();
  const users = JSON.parse(localStorage.getItem("pb_mock_users") || "[]");
  const results = JSON.parse(localStorage.getItem("pb_mock_results") || "[]");
  return {
    templates: templates.length,
    users: users.length || 248,
    results: results.length || 1043,
    storageKb: results.reduce((a: number, r: { size?: number }) => a + (r.size || 280), 0) || 89240,
  };
}

const RECENT_ACTIVITY = [
  { icon: "📸", text: "Foto baru digenerate dengan template \"Aesthetic Pastel\"", time: "2 menit lalu", color: "#2BADD4" },
  { icon: "👤", text: "Pengguna baru bergabung dari sesi booth", time: "12 menit lalu", color: "#16a34a" },
  { icon: "🖼️", text: "Template \"Retro Film\" dipakai 5x hari ini", time: "25 menit lalu", color: "#E8722A" },
  { icon: "📥", text: "Hasil foto diunduh oleh pengguna", time: "1 jam lalu", color: "#7c3aed" },
  { icon: "🖼️", text: "Template baru \"Birthday Bash\" ditambahkan", time: "3 jam lalu", color: "#E8722A" },
  { icon: "👤", text: "12 pengguna aktif dalam 1 jam terakhir", time: "1 jam lalu", color: "#16a34a" },
];

const TOP_TEMPLATES = [
  { name: "Aesthetic Pastel", uses: 412, color: "#2BADD4" },
  { name: "Retro Film", uses: 318 },
  { name: "Birthday Bash", uses: 201, color: "#E8722A" },
  { name: "Minimalist Dark", uses: 89 },
  { name: "Duo Frame", uses: 23 },
];
const MAX_USES = TOP_TEMPLATES[0].uses;

interface StatCard {
  label: string;
  value: string | number;
  sub: string;
  icon: string;
  color: string;
  bg: string;
  href: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ templates: 0, users: 248, results: 1043, storageKb: 89240 });

  useEffect(() => {
    setStats(getStats());
  }, []);

  const STAT_CARDS: StatCard[] = [
    { label: "Total Template", value: stats.templates, sub: "Template aktif", icon: "🖼️", color: "#2563EB", bg: "#EEF2FF", href: "/admin/templates" },
    { label: "Pengguna", value: stats.users.toLocaleString(), sub: "Total sesi booth", icon: "👥", color: "#16a34a", bg: "#f0fdf4", href: "/admin/users" },
    { label: "Foto Dihasilkan", value: stats.results.toLocaleString(), sub: "Total foto didownload", icon: "📸", color: "#7c3aed", bg: "#f5f3ff", href: "/admin/results" },
    { label: "Storage", value: `${(stats.storageKb / 1024).toFixed(1)} MB`, sub: "Digunakan oleh hasil foto", icon: "💾", color: "#0891b2", bg: "#ecfeff", href: "/admin/settings" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#3D2B1F", marginBottom: 4 }}>
          Selamat datang kembali 👋
        </h2>
        <p style={{ fontSize: 13, color: "#7a6558" }}>
          Berikut ringkasan aktivitas Photobooth hari ini.
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {STAT_CARDS.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div
              className="card-hover"
              style={{
                background: "#FAFBFF",
                border: "1.5px solid #E8EEFF",
                borderRadius: 14,
                padding: "18px 20px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: s.bg,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  {s.icon}
                </div>
                <span style={{ fontSize: 10, color: s.color, background: s.bg, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>
                  ↗ Live
                </span>
              </div>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#3D2B1F", letterSpacing: "-0.5px", lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ fontSize: 12, color: "#7a6558", marginTop: 4 }}>{s.label}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent activity */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #E8D8C4",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #E8D8C4",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#3D2B1F" }}>Aktivitas Terbaru</h3>
            <span style={{ fontSize: 11, color: "#2BADD4", fontWeight: 600 }}>Live</span>
          </div>
          <div>
            {RECENT_ACTIVITY.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 20px",
                  borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid #F4F6FF" : "none",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: (a.color ?? "#2BADD4") + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: "#3D2B1F", lineHeight: 1.4 }}>{a.text}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top templates */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #E8EEFF",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #E8EEFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#3D2B1F" }}>Template Terpopuler</h3>
            <Link href="/admin/templates" style={{ fontSize: 11, color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              Lihat Semua →
            </Link>
          </div>
          <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {TOP_TEMPLATES.map((t, i) => (
              <div key={t.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? "#2563EB" : "#9ca3af", width: 16 }}>
                      #{i + 1}
                    </span>
                    <span style={{ fontSize: 13, color: "#3D2B1F", fontWeight: i === 0 ? 600 : 400 }}>{t.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#7a6558", fontWeight: 600 }}>{t.uses.toLocaleString()}×</span>
                </div>
                <div style={{ height: 5, background: "#EEF2FF", borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(t.uses / MAX_USES) * 100}%`,
                      background: i === 0
                        ? "linear-gradient(90deg, #2563EB, #7c3aed)"
                        : "#E8EEFF",
                      borderRadius: 999,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid #E8EEFF", display: "flex", gap: 8 }}>
            <Link
              href="/admin/templates"
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                color: "#fff",
                background: "#2563EB",
                padding: "8px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              + Template Baru
            </Link>
            <Link
              href="/admin/results"
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                color: "#2563EB",
                background: "#EEF2FF",
                border: "1.5px solid #c7d2fe",
                padding: "8px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Lihat Hasil Foto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
