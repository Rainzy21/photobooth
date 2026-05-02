import Link from "next/link";

const FOOTER_LINKS = {
  Produk: [
    { label: "Photobooth Online", href: "/booth" },
    { label: "Template", href: "/templates" },
  ],
  Dukungan: [
    { label: "Hubungi Kami", href: "mailto:[fashahervino@gmail.com]" },
    { label: "Kebijakan Privasi", href: "/" },
    { label: "Syarat Layanan", href: "/" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(200,215,235,0.6)",
        background: "rgba(255,255,255,0.50)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        padding: "48px 24px 32px",
        marginTop: "auto",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 40,
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "linear-gradient(135deg, #2BADD4, #E8722A)",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
              }}
            ></div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1f2e" }}>
              Photobooth
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#6b7a90",
              lineHeight: 1.6,
              maxWidth: 220,
            }}
          >
            Platform photo booth digital. Buat dan bagikan momen spesialmu
            dengan mudah.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
          <div key={section}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1a1f2e",
                marginBottom: 14,
                letterSpacing: "0.02em",
              }}
            >
              {section}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {links.map((l) => (
                <li key={l.label} style={{ marginBottom: 10 }}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "32px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(200,215,235,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ fontSize: 12, color: "#8a97aa" }}>
          © {new Date().getFullYear()} Photobooth. Hak cipta dilindungi.
        </p>
        <p style={{ fontSize: 12, color: "#8a97aa" }}>
          Made by Rainzy21. | All rights reserved.
        </p>
      </div>
      <style>{`
        .footer-link {
          font-size: 13px;
          color: #6b7a90;
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover { color: #1a1f2e; }
      `}</style>
    </footer>
  );
}
