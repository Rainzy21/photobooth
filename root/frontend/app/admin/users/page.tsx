"use client";

import { useState } from "react";

/* mock data */
const MOCK_USERS = Array.from({ length: 24 }, (_, i) => ({
  id: `USR-${1000 + i}`,
  session: `Sesi Booth #${1000 + i}`,
  template: ["Aesthetic Pastel", "Retro Film", "Birthday Bash", "Minimalist Dark", "Duo Frame"][i % 5],
  photos: Math.floor(Math.random() * 8) + 1,
  date: new Date(Date.now() - i * 3600000 * 6).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
  downloaded: Math.random() > 0.3,
}));

type SortKey = "date" | "photos";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = MOCK_USERS
    .filter((u) => u.id.toLowerCase().includes(search.toLowerCase()) || u.template.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "photos" ? b.photos - a.photos : 0);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Sesi", value: MOCK_USERS.length, icon: "👥", color: "#2BADD4", bg: "#E0F4FA" },
          { label: "Foto Didownload", value: MOCK_USERS.filter((u) => u.downloaded).length, icon: "📥", color: "#16a34a", bg: "#dcfce7" },
          { label: "Rata-rata Foto/Sesi", value: (MOCK_USERS.reduce((a, u) => a + u.photos, 0) / MOCK_USERS.length).toFixed(1), icon: "📸", color: "#E8722A", bg: "#FDEEE4" },
        ].map((c) => (
          <div key={c.label} style={{ background: "#fff", border: "1.5px solid #E8D8C4", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, background: c.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.icon}</div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#3D2B1F", lineHeight: 1 }}>{c.value}</p>
              <p style={{ fontSize: 12, color: "#7a6558", marginTop: 3 }}>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{ background: "#fff", border: "1.5px solid #E8D8C4", borderRadius: 14, overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #E8D8C4", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#3D2B1F" }}>Semua Sesi Pengguna</h3>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              placeholder="Cari ID atau template…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ padding: "7px 12px", border: "1.5px solid #E8D8C4", borderRadius: 8, fontSize: 12, color: "#3D2B1F", outline: "none", width: 200 }}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} style={{ padding: "7px 10px", border: "1.5px solid #E8D8C4", borderRadius: 8, fontSize: 12, color: "#3D2B1F", background: "#fff", cursor: "pointer" }}>
              <option value="date">Terbaru</option>
              <option value="photos">Foto Terbanyak</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAF4EC" }}>
                {["ID Sesi", "Template Dipilih", "Jumlah Foto", "Tanggal", "Download", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#7a6558", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #E8D8C4", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < paged.length - 1 ? "1px solid #F5EDE4" : "none" }}>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#2BADD4", fontFamily: "monospace" }}>{u.id}</span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: 12, color: "#3D2B1F" }}>{u.template}</span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "#3D2B1F", fontWeight: 600 }}>{u.photos}</span>
                      <div style={{ height: 4, width: 50, background: "#FAF4EC", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(u.photos / 8) * 100}%`, background: "#2BADD4", borderRadius: 999 }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: 12, color: "#7a6558" }}>{u.date}</span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: u.downloaded ? "#16a34a" : "#9ca3af", background: u.downloaded ? "#dcfce7" : "#f3f4f6", padding: "3px 8px", borderRadius: 999 }}>
                      {u.downloaded ? "✓ Ya" : "Tidak"}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: 11, color: "#16a34a", background: "#dcfce7", padding: "3px 8px", borderRadius: 999, fontWeight: 600 }}>Selesai</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #E8D8C4", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 12, color: "#7a6558" }}>
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} sesi
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "5px 12px", border: "1.5px solid #E8D8C4", borderRadius: 7, background: "#fff", color: page === 1 ? "#9ca3af" : "#3D2B1F", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: 12 }}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{ padding: "5px 10px", border: "1.5px solid", borderColor: p === page ? "#2BADD4" : "#E8D8C4", borderRadius: 7, background: p === page ? "#E0F4FA" : "#fff", color: p === page ? "#2BADD4" : "#3D2B1F", cursor: "pointer", fontSize: 12, fontWeight: p === page ? 700 : 400 }}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "5px 12px", border: "1.5px solid #E8D8C4", borderRadius: 7, background: "#fff", color: page === totalPages ? "#9ca3af" : "#3D2B1F", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: 12 }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
