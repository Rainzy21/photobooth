"use client";

import { useState } from "react";

const TEMPLATES = ["Aesthetic Pastel", "Retro Film", "Birthday Bash", "Minimalist Dark", "Duo Frame"];

const MOCK_RESULTS = Array.from({ length: 18 }, (_, i) => ({
  id: `RES-${2000 + i}`,
  template: TEMPLATES[i % TEMPLATES.length],
  date: new Date(Date.now() - i * 7200000).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  size: Math.floor(Math.random() * 400 + 150),
  color: `hsl(${i * 45},65%,88%)`,
  colorB: `hsl(${i * 45 + 30},55%,94%)`,
}));

type View = "grid" | "list";
type Filter = "all" | string;

export default function ResultsPage() {
  const [view, setView] = useState<View>("grid");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_RESULTS.filter((r) =>
    (filter === "all" || r.template === filter) &&
    (r.id.toLowerCase().includes(search.toLowerCase()) || r.template.toLowerCase().includes(search.toLowerCase()))
  );

  const totalSize = filtered.reduce((a, r) => a + r.size, 0);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Hasil Foto", value: MOCK_RESULTS.length, icon: "📸", color: "#2BADD4", bg: "#E0F4FA" },
          { label: "Total Storage", value: `${(MOCK_RESULTS.reduce((a, r) => a + r.size, 0) / 1024).toFixed(1)} MB`, icon: "💾", color: "#7c3aed", bg: "#ede9fe" },
          { label: "Rata-rata Ukuran", value: `${Math.round(MOCK_RESULTS.reduce((a, r) => a + r.size, 0) / MOCK_RESULTS.length)} KB`, icon: "📊", color: "#E8722A", bg: "#FDEEE4" },
        ].map((c) => (
          <div key={c.label} style={{ background: "#fff", border: "1.5px solid #E8D8C4", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, background: c.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.icon}</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: "#3D2B1F", lineHeight: 1 }}>{c.value}</p>
              <p style={{ fontSize: 11, color: "#7a6558", marginTop: 2 }}>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "#fff", border: "1.5px solid #E8D8C4", borderRadius: 14, marginBottom: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Cari ID atau template…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "7px 12px", border: "1.5px solid #E8D8C4", borderRadius: 8, fontSize: 12, outline: "none", width: 200 }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "7px 10px", border: "1.5px solid #E8D8C4", borderRadius: 8, fontSize: 12, background: "#fff", cursor: "pointer" }}>
          <option value="all">Semua Template</option>
          {TEMPLATES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["grid", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "7px 12px", border: "1.5px solid", borderColor: view === v ? "#2BADD4" : "#E8D8C4", borderRadius: 8, background: view === v ? "#E0F4FA" : "#fff", color: view === v ? "#2BADD4" : "#7a6558", cursor: "pointer", fontSize: 14 }}>
              {v === "grid" ? "⊞" : "≡"}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#7a6558" }}>
          {filtered.length} hasil · {(totalSize / 1024).toFixed(1)} MB
        </p>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          {filtered.map((r) => (
            <div key={r.id} className="card-hover" style={{ background: "#fff", border: "1.5px solid #E8D8C4", borderRadius: 12, overflow: "hidden" }}>
              {/* Mock photo strip */}
              <div style={{ height: 150, background: `linear-gradient(135deg, ${r.color}, ${r.colorB})`, display: "flex", flexDirection: "column", gap: 4, padding: 8, justifyContent: "center" }}>
                {[1, 2, 3].map((s) => (
                  <div key={s} style={{ flex: 1, background: "rgba(255,255,255,0.35)", borderRadius: 4 }} />
                ))}
              </div>
              <div style={{ padding: "10px 12px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#2BADD4", fontFamily: "monospace" }}>{r.id}</p>
                <p style={{ fontSize: 12, color: "#3D2B1F", marginTop: 2, fontWeight: 500 }}>{r.template}</p>
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{r.size} KB · {r.date}</p>
                <button style={{ marginTop: 8, width: "100%", padding: "5px", background: "#FAF4EC", border: "1.5px solid #E8D8C4", borderRadius: 6, fontSize: 11, color: "#E8722A", cursor: "pointer", fontWeight: 600 }}>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div style={{ background: "#fff", border: "1.5px solid #E8D8C4", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAF4EC" }}>
                {["ID", "Template", "Ukuran", "Tanggal", "Aksi"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#7a6558", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #E8D8C4" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F5EDE4" : "none" }}>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 42, background: `linear-gradient(135deg, ${r.color}, ${r.colorB})`, borderRadius: 4, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2, padding: 3 }}>
                        {[1, 2, 3].map((s) => <div key={s} style={{ flex: 1, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />)}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#2BADD4", fontFamily: "monospace" }}>{r.id}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px" }}><span style={{ fontSize: 12, color: "#3D2B1F" }}>{r.template}</span></td>
                  <td style={{ padding: "10px 16px" }}><span style={{ fontSize: 12, color: "#7a6558" }}>{r.size} KB</span></td>
                  <td style={{ padding: "10px 16px" }}><span style={{ fontSize: 12, color: "#7a6558" }}>{r.date}</span></td>
                  <td style={{ padding: "10px 16px" }}>
                    <button style={{ fontSize: 11, color: "#E8722A", background: "none", border: "1px solid #E8D8C4", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
