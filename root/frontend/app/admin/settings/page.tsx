"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, logoutAdmin } from "@/lib/adminAuth";

export default function SettingsPage() {
  const router = useRouter();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [maintenance, setMaintenance] = useState(false);
  const [appName, setAppName] = useState("Photobooth");
  const [appTagline, setAppTagline] = useState("Abadikan momen seru bersama teman");
  const [infoSaved, setInfoSaved] = useState(false);

  const handleChangePw = () => {
    if (!loginAdmin(currentPw)) {
      setPwMsg({ type: "err", text: "Password saat ini salah." });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({ type: "err", text: "Password baru minimal 6 karakter." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: "err", text: "Konfirmasi password tidak cocok." });
      return;
    }
    // In real app: call API. Here we just show success.
    setPwMsg({ type: "ok", text: "Password berhasil diubah! Silakan login ulang." });
    setTimeout(() => { logoutAdmin(); router.replace("/admin/login"); }, 2000);
  };

  const handleInfoSave = () => {
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2000);
  };

  const S = {
    section: { background: "#fff", border: "1.5px solid #E8D8C4", borderRadius: 14, overflow: "hidden" as const, marginBottom: 20 },
    header: { padding: "14px 20px", borderBottom: "1px solid #E8D8C4", display: "flex" as const, alignItems: "center" as const, gap: 10 },
    body: { padding: "20px" },
    label: { fontSize: 11, fontWeight: 600, color: "#7a6558", letterSpacing: "0.05em", textTransform: "uppercase" as const, marginBottom: 5, display: "block" as const },
    input: { width: "100%", padding: "9px 12px", border: "1.5px solid #E8D8C4", borderRadius: 8, fontSize: 13, color: "#3D2B1F", outline: "none", boxSizing: "border-box" as const },
  };

  return (
    <div style={{ maxWidth: 660, margin: "0 auto" }}>

      {/* App Info */}
      <div style={S.section}>
        <div style={S.header}>
          <span style={{ fontSize: 18 }}>🏷️</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#3D2B1F" }}>Informasi Aplikasi</p>
            <p style={{ fontSize: 11, color: "#9ca3af" }}>Nama dan tagline yang tampil di landing page</p>
          </div>
        </div>
        <div style={{ ...S.body, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={S.label}>Nama Aplikasi</label>
            <input style={S.input} value={appName} onChange={(e) => setAppName(e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Tagline</label>
            <input style={S.input} value={appTagline} onChange={(e) => setAppTagline(e.target.value)} />
          </div>
          <button
            onClick={handleInfoSave}
            style={{ alignSelf: "flex-start", padding: "9px 20px", background: infoSaved ? "#16a34a" : "#2BADD4", color: "#fff", border: "none", borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "background 0.2s" }}
          >
            {infoSaved ? "✓ Tersimpan!" : "Simpan"}
          </button>
        </div>
      </div>

      {/* Maintenance mode */}
      <div style={S.section}>
        <div style={S.header}>
          <span style={{ fontSize: 18 }}>🔧</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#3D2B1F" }}>Mode Maintenance</p>
            <p style={{ fontSize: 11, color: "#9ca3af" }}>Nonaktifkan akses publik sementara</p>
          </div>
        </div>
        <div style={{ ...S.body, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 13, color: "#3D2B1F", fontWeight: 500 }}>Mode Pemeliharaan</p>
            <p style={{ fontSize: 12, color: "#7a6558", marginTop: 2 }}>
              {maintenance ? "Website tidak bisa diakses pengguna biasa." : "Website aktif dan dapat diakses publik."}
            </p>
          </div>
          <button
            onClick={() => setMaintenance((p) => !p)}
            style={{
              width: 48,
              height: 26,
              borderRadius: 999,
              background: maintenance ? "#E8722A" : "#E8D8C4",
              border: "none",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: maintenance ? 24 : 3,
                width: 20,
                height: 20,
                background: "#fff",
                borderRadius: "50%",
                transition: "left 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
            />
          </button>
        </div>
        {maintenance && (
          <div style={{ margin: "0 20px 16px", padding: "10px 14px", background: "#FFF3E8", border: "1.5px solid #E8722A44", borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: "#E8722A", fontWeight: 500 }}>⚠️ Mode maintenance aktif. Pengguna tidak dapat mengakses halaman booth.</p>
          </div>
        )}
      </div>

      {/* Change password */}
      <div style={S.section}>
        <div style={S.header}>
          <span style={{ fontSize: 18 }}>🔐</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#3D2B1F" }}>Ubah Password Admin</p>
            <p style={{ fontSize: 11, color: "#9ca3af" }}>Minimal 6 karakter. Kamu akan logout setelah mengubah.</p>
          </div>
        </div>
        <div style={{ ...S.body, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={S.label}>Password Saat Ini</label>
            <input type="password" style={S.input} value={currentPw} onChange={(e) => { setCurrentPw(e.target.value); setPwMsg(null); }} placeholder="••••••••" />
          </div>
          <div>
            <label style={S.label}>Password Baru</label>
            <input type="password" style={S.input} value={newPw} onChange={(e) => { setNewPw(e.target.value); setPwMsg(null); }} placeholder="Minimal 6 karakter" />
          </div>
          <div>
            <label style={S.label}>Konfirmasi Password Baru</label>
            <input type="password" style={S.input} value={confirmPw} onChange={(e) => { setConfirmPw(e.target.value); setPwMsg(null); }} placeholder="Ulangi password baru" />
          </div>

          {pwMsg && (
            <div style={{ padding: "10px 14px", background: pwMsg.type === "ok" ? "#dcfce7" : "#FFF3E8", border: `1.5px solid ${pwMsg.type === "ok" ? "#16a34a44" : "#E8722A44"}`, borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: pwMsg.type === "ok" ? "#16a34a" : "#E8722A", fontWeight: 500 }}>{pwMsg.type === "ok" ? "✓" : "⚠️"} {pwMsg.text}</p>
            </div>
          )}

          <button
            onClick={handleChangePw}
            disabled={!currentPw || !newPw || !confirmPw}
            style={{ alignSelf: "flex-start", padding: "9px 20px", background: !currentPw || !newPw || !confirmPw ? "#E8D8C4" : "#3D2B1F", color: !currentPw || !newPw || !confirmPw ? "#7a6558" : "#fff", border: "none", borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: !currentPw || !newPw || !confirmPw ? "not-allowed" : "pointer" }}
          >
            Ubah Password
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ ...S.section, border: "1.5px solid #fca5a5" }}>
        <div style={{ ...S.header, background: "#fff5f5" }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Zona Berbahaya</p>
            <p style={{ fontSize: 11, color: "#9ca3af" }}>Tindakan ini tidak bisa dibatalkan</p>
          </div>
        </div>
        <div style={{ ...S.body, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1.5px solid #fca5a544", borderRadius: 10, background: "#fff5f5" }}>
            <div>
              <p style={{ fontSize: 13, color: "#3D2B1F", fontWeight: 500 }}>Hapus Semua Hasil Foto</p>
              <p style={{ fontSize: 11, color: "#7a6558", marginTop: 2 }}>Menghapus semua file foto yang tersimpan.</p>
            </div>
            <button onClick={() => confirm("Yakin hapus semua hasil foto?") && alert("Terhapus! (belum ada backend)")} style={{ padding: "7px 14px", background: "#fff", border: "1.5px solid #fca5a5", borderRadius: 8, fontSize: 12, color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>
              Hapus Semua
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1.5px solid #fca5a544", borderRadius: 10, background: "#fff5f5" }}>
            <div>
              <p style={{ fontSize: 13, color: "#3D2B1F", fontWeight: 500 }}>Reset Template Custom</p>
              <p style={{ fontSize: 11, color: "#7a6558", marginTop: 2 }}>Menghapus template yang dibuat admin (default tetap ada).</p>
            </div>
            <button onClick={() => { if (confirm("Reset template custom?")) { localStorage.removeItem("photobooth_templates"); window.location.reload(); } }} style={{ padding: "7px 14px", background: "#fff", border: "1.5px solid #fca5a5", borderRadius: 8, fontSize: 12, color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
