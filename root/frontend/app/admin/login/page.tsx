"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simulate slight delay for UX feedback
    await new Promise((r) => setTimeout(r, 400));

    const ok = loginAdmin(password);
    if (ok) {
      router.replace("/admin");
    } else {
      setError(true);
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #E0F4FA 0%, #FAF4EC 60%, #fff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          border: "1.5px solid #E8D8C4",
          borderRadius: 20,
          padding: "36px 32px",
          boxShadow: "0 8px 40px rgba(61,43,31,0.1)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "linear-gradient(135deg, #2BADD4, #E8722A)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              margin: "0 auto 12px",
            }}
          >
            🔐
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#3D2B1F",
              marginBottom: 4,
            }}
          >
            Admin Panel
          </h1>
          <p style={{ fontSize: 13, color: "#7a6558" }}>
            Masukkan password untuk melanjutkan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: "#7a6558",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Masukkan password admin"
                autoComplete="current-password"
                autoFocus
                style={{
                  width: "100%",
                  padding: "11px 40px 11px 14px",
                  border: `1.5px solid ${error ? "#E8722A" : "#E8D8C4"}`,
                  borderRadius: 10,
                  fontSize: 14,
                  color: "#3D2B1F",
                  outline: "none",
                  background: error ? "#fff8f5" : "#fff",
                  transition: "border-color 0.15s",
                  boxSizing: "border-box",
                }}
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#7a6558",
                  padding: "4px",
                }}
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p
                style={{
                  fontSize: 12,
                  color: "#E8722A",
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                ⚠️ Password salah. Coba lagi.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || loading}
            style={{
              width: "100%",
              padding: "12px",
              background:
                !password || loading
                  ? "#E8D8C4"
                  : "linear-gradient(135deg, #2BADD4, #1e9abc)",
              color: !password || loading ? "#7a6558" : "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              cursor: !password || loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Memeriksa…
              </>
            ) : (
              "Masuk ke Admin"
            )}
          </button>
        </form>

        <p
          style={{
            marginTop: 20,
            fontSize: 11,
            color: "#9ca3af",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Halaman ini hanya untuk admin.
          <br />
          Sesi akan berakhir saat tab ditutup.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
