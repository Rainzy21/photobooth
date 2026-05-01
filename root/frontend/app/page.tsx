import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TypingText from "@/components/TypingText";
import ScrollReveal from "@/components/ScrollReveal";

/* ─── Data ──────────────────────────────────────────────────── */

const STATS = [
  { value: "2k+", label: "Total pengguna" },
  { value: "100k+", label: "Template terpakai" },
  { value: "5 ★", label: "Rating pengguna" },
];

const STEPS = [
  {
    icon: "🖼️",
    num: "01",
    title: "Pilih Template",
    desc: "Pilih template favorit dari katalog dan sesuaikan dengan tema acaramu dalam hitungan detik.",
  },
  {
    icon: "📷",
    num: "02",
    title: "Kamera atau Unggah",
    desc: "Ambil foto lewat kamera atau unggah gambar. Antarmuka intuitif tanpa setup yang rumit.",
  },
  {
    icon: "✏️",
    num: "03",
    title: "Edit",
    desc: "Sesuaikan posisi dan tampilan foto agar pas dengan frame template sebelum menyimpan.",
  },
  {
    icon: "⬇️",
    num: "04",
    title: "Unduh",
    desc: "Unduh hasil photostrip berkualitas tinggi, siap dibagikan ke tamu atau media sosial.",
  },
];

const TEMPLATES = [
  { name: "Aesthetic Pastel", emoji: "🌸", uses: "12.4k" },
  { name: "Retro Film", emoji: "🎞️", uses: "9.8k" },
  { name: "Birthday Bash", emoji: "🎂", uses: "8.2k" },
  { name: "Minimalist Dark", emoji: "🖤", uses: "7.5k" },
  { name: "Coquette Vibes", emoji: "🎀", uses: "6.9k" },
  { name: "Zootopia Frame", emoji: "🦊", uses: "5.3k" },
];

const TESTIMONIALS = [
  {
    name: "Raka",
    handle: "@raka",
    text: "Pas kemarin pake buat event kampus, hasilnya rapi bener dan sat-set banget prosesnya. Tamu-tamu langsung paham cara pakainya!",
    avatar: "🧑",
  },
  {
    name: "Melati",
    handle: "@melati",
    text: "Template-nya banyak pilihan dan gampang banget dicocokin sama tema acara. Tampilan booth langsung naik kelas jadi kelihatan premium.",
    avatar: "👩",
  },
  {
    name: "Gilang",
    handle: "@gilang",
    text: "Hasil export-nya bersih dan tajam parah! Begitu kelar sesi foto, file-nya bisa langsung dibagikan detik itu juga.",
    avatar: "🧑‍💻",
  },
];

/* ─── Styles ─────────────────────────────────────────────────── */

const S = {
  section: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
  } as React.CSSProperties,

  sectionLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#2BADD4",
    background: "#E0F4FA",
    padding: "4px 12px",
    borderRadius: 999,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    marginBottom: 16,
  },

  h2: {
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 800,
    color: "#3D2B1F",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
    marginBottom: 12,
  },

  subText: {
    fontSize: 16,
    color: "#7a6558",
    lineHeight: 1.6,
    maxWidth: 500,
  },
};

/* ─── Page ───────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* ── HERO ── */}
        <section
          style={{
            background:
              "linear-gradient(160deg, #E0F4FA 0%, #FAF4EC 50%, #ffffff 100%)",
            padding: "80px 24px 72px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* decorative blobs */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 400,
              height: 400,
              background:
                "radial-gradient(circle, rgba(43,173,212,0.15) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle, rgba(232,114,42,0.12) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              ...S.section,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 48,
              alignItems: "center",
            }}
          >
            {/* Left */}
            <div className="animate-fade-in-up">
              {/* Badge */}
              <div style={S.sectionLabel}>✨ Photobooth Digital Modern</div>

              <h1
                style={{
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 900,
                  color: "#3D2B1F",
                  letterSpacing: "-1px",
                  lineHeight: 1.1,
                  marginBottom: 20,
                  maxWidth: 600,
                }}
              >
                Abadikan momen seru{" "}
                <TypingText
                  text="bersama teman"
                  className="gradient-text"
                  speed={55}
                  startDelay={600}
                />
              </h1>

              <p
                style={{
                  fontSize: "clamp(15px, 2vw, 18px)",
                  color: "#5a4032",
                  lineHeight: 1.7,
                  maxWidth: 480,
                  marginBottom: 36,
                }}
              >
                Photobooth digital yang keren, praktis, dan modern. Pilih
                template, jepret foto, dan unduh hasilnya dalam hitungan detik.
              </p>

              {/* CTA Buttons */}
              <div
                style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}
              >
                <Link
                  href="/booth"
                  id="hero-cta-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#ffffff",
                    background: "#2BADD4",
                    padding: "13px 28px",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "background 0.15s, transform 0.15s",
                    boxShadow: "0 4px 14px rgba(43,173,212,0.35)",
                  }}
                >
                  🎉 Coba Sekarang
                </Link>
                <Link
                  href="/"
                  id="hero-cta-secondary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#3D2B1F",
                    background: "#ffffff",
                    padding: "13px 28px",
                    borderRadius: 10,
                    textDecoration: "none",
                    border: "1.5px solid #E8D8C4",
                    transition: "border-color 0.15s, transform 0.15s",
                  }}
                >
                  Lihat Template →
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#3D2B1F",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: 12, color: "#7a6558", marginTop: 2 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – floating photo strips */}
            <div
              className="animate-fade-in delay-300"
              style={{
                position: "relative",
                width: 240,
                height: 380,
                flexShrink: 0,
              }}
            >
              {/* Strip 1 */}
              <div
                className="animate-float"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 20,
                  width: 90,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                  padding: 6,
                  transform: "rotate(-5deg)",
                }}
              >
                {["🌸", "🌷", "🌼", "✨"].map((e, i) => (
                  <div
                    key={i}
                    style={{
                      height: 70,
                      background:
                        i % 2 === 0
                          ? "linear-gradient(135deg,#E0F4FA,#FAF4EC)"
                          : "linear-gradient(135deg,#2BADD4,#5ec8e5)",
                      borderRadius: 7,
                      marginBottom: i < 3 ? 4 : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>

              {/* Strip 2 */}
              <div
                className="animate-float-2"
                style={{
                  position: "absolute",
                  right: 10,
                  top: 0,
                  width: 90,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                  padding: 6,
                  transform: "rotate(4deg)",
                }}
              >
                {["🎞️", "📸", "🎨", "🦋"].map((e, i) => (
                  <div
                    key={i}
                    style={{
                      height: 70,
                      background:
                        i % 2 === 0
                          ? "linear-gradient(135deg,#E8F6FB,#FDEEE4)"
                          : "linear-gradient(135deg,#FAF4EC,#F5E6D3)",
                      borderRadius: 7,
                      marginBottom: i < 3 ? 4 : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>

              {/* Strip 3 – small */}
              <div
                className="animate-float-3"
                style={{
                  position: "absolute",
                  left: 60,
                  bottom: 0,
                  width: 80,
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
                  padding: 5,
                  transform: "rotate(-2deg)",
                }}
              >
                {["🎀", "🌙", "⭐"].map((e, i) => (
                  <div
                    key={i}
                    style={{
                      height: 62,
                      background:
                        i % 2 === 0
                          ? "linear-gradient(135deg,#E0F4FA,#b8e8f5)"
                          : "linear-gradient(135deg,#FDEEE4,#f9d5ba)",
                      borderRadius: 6,
                      marginBottom: i < 2 ? 4 : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "80px 24px" }}>
          <div style={S.section}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ ...S.sectionLabel, margin: "0 auto 16px" }}>
                🚀 Cara Pakai
              </div>
              <h2 style={{ ...S.h2, textAlign: "center" }}>
                Empat langkah mudah
              </h2>
              <p style={{ ...S.subText, margin: "0 auto", textAlign: "center" }}>
                Dari pilih template hingga unduh hasil, semua beres dalam
                hitungan menit.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              {STEPS.map((step, i) => (
                <ScrollReveal key={step.num} delay={i * 120}>
                  <div
                    className="card-hover"
                    style={{
                      background: "#FAF4EC",
                      border: "1.5px solid #E8D8C4",
                      borderRadius: 16,
                      padding: "28px 24px",
                      position: "relative",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#2BADD4",
                        letterSpacing: "0.08em",
                        marginBottom: 16,
                      }}
                    >
                      {step.num}
                    </div>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>
                      {step.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#3D2B1F",
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "#7a6558", lineHeight: 1.6 }}>
                      {step.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRENDING TEMPLATES ── */}
        <section
          style={{
            padding: "80px 24px",
            background: "#FAF4EC",
            borderTop: "1px solid #E8D8C4",
            borderBottom: "1px solid #E8D8C4",
          }}
        >
          <div style={S.section}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: 36,
              }}
            >
              <div>
                <div style={S.sectionLabel}>🔥 Trending</div>
                <h2 style={{ ...S.h2, marginBottom: 0 }}>Template trending</h2>
              </div>
              <Link
                href="/"
                id="see-all-templates"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2BADD4",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Lihat Semua →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 16,
              }}
            >
              {TEMPLATES.map((t, i) => (
                <ScrollReveal key={t.name} delay={i * 80}>
                  <Link
                    href="/booth"
                    id={`template-card-${i}`}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div
                      className="card-hover"
                      style={{
                        background: "#ffffff",
                        border: "1.5px solid #E8D8C4",
                        borderRadius: 14,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: 140,
                          background: `linear-gradient(135deg,
                            hsl(${i * 55},70%,88%) 0%,
                            hsl(${i * 55 + 30},60%,94%) 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 48,
                        }}
                      >
                        {t.emoji}
                      </div>
                      <div style={{ padding: "12px 14px" }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#3D2B1F",
                            marginBottom: 4,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {t.name}
                        </p>
                        <p style={{ fontSize: 11, color: "#7a6558" }}>
                          {t.uses} penggunaan
                        </p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ padding: "80px 24px" }}>
          <div style={S.section}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ ...S.sectionLabel, margin: "0 auto 16px" }}>
                💬 Testimonial
              </div>
              <h2 style={{ ...S.h2, textAlign: "center" }}>
                Kata pengguna kami
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {TESTIMONIALS.map((t, i) => (
                <ScrollReveal key={t.name} delay={i * 150}>
                  <div
                    className="card-hover"
                    style={{
                      background: "#ffffff",
                      border: "1.5px solid #E8D8C4",
                      borderRadius: 16,
                      padding: "24px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      height: "100%",
                    }}
                  >
                    <div style={{ fontSize: 14, color: "#f59e0b", marginBottom: 12 }}>
                      ★★★★★
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#5a4032",
                        lineHeight: 1.7,
                        marginBottom: 20,
                      }}
                    >
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          background: "linear-gradient(135deg,#E0F4FA,#FAF4EC)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                        }}
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#3D2B1F" }}>
                          {t.name}
                        </p>
                        <p style={{ fontSize: 12, color: "#9ca3af" }}>
                          {t.handle}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section
          style={{
            padding: "72px 24px",
            background: "#3D2B1F",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 40px)",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.5px",
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              Siap abadikan momen spesialmu?
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#9ca3af",
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Gratis tanpa registrasi. Mulai dalam hitungan detik.
            </p>
            <Link
              href="/booth"
              id="bottom-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                fontWeight: 700,
                color: "#3D2B1F",
                background: "#ffffff",
                padding: "14px 32px",
                borderRadius: 10,
                textDecoration: "none",
                transition: "transform 0.15s",
                boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
              }}
            >
              🎉 Coba Sekarang — Gratis
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
