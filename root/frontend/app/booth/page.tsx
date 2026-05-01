"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BoothTemplate, loadTemplates } from "@/lib/templateStore";

/* ─── types ─── */
type Step = "select" | "capture" | "result";

/* ─── helpers ─── */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function SlotBadge({ n, done }: { n: number; done: boolean }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: done ? "#2BADD4" : "#E8D8C4",
        color: done ? "#fff" : "#7a6558",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        transition: "all 0.3s",
        flexShrink: 0,
      }}
    >
      {done ? "✓" : n}
    </div>
  );
}

/* ─── main ─── */
export default function BoothPage() {
  /* ── state ── */
  const [step, setStep] = useState<Step>("select");
  const [templates, setTemplates] = useState<BoothTemplate[]>([]);
  const [selected, setSelected] = useState<BoothTemplate | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [isBatch, setIsBatch] = useState(false);
  const [stopReq, setStopReq] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── load templates ── */
  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  /* ── camera ── */
  const startCamera = useCallback(async () => {
    setError(null);
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      try { await videoRef.current.play(); } catch { /* autoplay blocked */ }
      videoRef.current.onplaying = () => setCameraReady(true);
      if (videoRef.current.videoWidth) setCameraReady(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Tidak bisa akses kamera";
      setError(msg);
    }
  }, []);

  const stopCamera = useCallback(() => {
    const v = videoRef.current;
    if (v?.srcObject) {
      (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      v.srcObject = null;
    }
    setCameraReady(false);
  }, []);

  useEffect(() => {
    if (step === "capture") startCamera();
    return () => { if (step === "capture") stopCamera(); };
  }, [step, startCamera, stopCamera]);

  /* ── capture ── */
  const doCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    c.getContext("2d")?.drawImage(video, 0, 0);
    setPhotos((p) => [...p, c.toDataURL("image/jpeg", 0.92)]);
  }, []);

  const runCountdown = useCallback(async (secs = 3) => {
    setIsCounting(true);
    for (let t = secs; t > 0; t--) {
      setCountdown(t);
      await wait(1000);
    }
    setCountdown(0);
    setIsCounting(false);
  }, []);

  const runBatch = useCallback(async () => {
    if (!selected || isBatch) return;
    const slotCount = selected.slots.length;
    setStopReq(false);
    setIsBatch(true);
    const startLen = photos.length;
    const need = slotCount - startLen;
    for (let i = 0; i < need; i++) {
      if (stopReq) break;
      await runCountdown(3);
      await wait(150);
      doCapture();
      await wait(500);
    }
    setIsBatch(false);
  }, [selected, isBatch, photos.length, stopReq, runCountdown, doCapture]);

  /* ── composite: photos + overlay → final ── */
  const generateFinal = useCallback(() => {
    if (!selected) return;
    const { slots, canvasWidth: W, canvasHeight: H, bgColor, overlayUrl } = selected;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor || "#ffffff";
    ctx.fillRect(0, 0, W, H);

    let loaded = 0;
    const total = slots.length + (overlayUrl ? 1 : 0);

    const finish = () => {
      if (overlayUrl) {
        const ov = new Image();
        ov.onload = () => {
          ctx.drawImage(ov, 0, 0, W, H);
          setFinalImage(canvas.toDataURL("image/png"));
          setStep("result");
          stopCamera();
        };
        ov.src = overlayUrl;
      } else {
        setFinalImage(canvas.toDataURL("image/png"));
        setStep("result");
        stopCamera();
      }
    };

    photos.forEach((photoSrc, i) => {
      const slot = slots[i];
      if (!slot) return;
      const img = new Image();
      img.onload = () => {
        // cover-fit into slot
        const sw = slot.w * W;
        const sh = slot.h * H;
        const sx = slot.x * W;
        const sy = slot.y * H;
        const scale = Math.max(sw / img.width, sh / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const ox = (sw - dw) / 2;
        const oy = (sh - dh) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(sx, sy, sw, sh);
        ctx.clip();
        // mirror the photo (un-mirror the front cam)
        ctx.translate(sx + sw / 2, sy + sh / 2);
        ctx.scale(-1, 1);
        ctx.drawImage(img, ox - sw / 2, oy - sh / 2, dw, dh);
        ctx.restore();
        loaded++;
        if (loaded === (overlayUrl ? total - 1 : total)) finish();
      };
      img.src = photoSrc;
    });
  }, [selected, photos, stopCamera]);

  /* ── auto-generate when all slots filled ── */
  useEffect(() => {
    if (selected && photos.length >= selected.slots.length && step === "capture") {
      setTimeout(() => generateFinal(), 300);
    }
  }, [photos, selected, step, generateFinal]);

  /* ── reset ── */
  const reset = () => {
    setPhotos([]);
    setFinalImage(null);
    setStep("select");
    setSelected(null);
    setError(null);
    setIsBatch(false);
    stopCamera();
  };

  /* ─────────────────── UI ─────────────────── */

  const maxSlots = selected?.slots.length ?? 0;
  const progress = maxSlots > 0 ? photos.length / maxSlots : 0;

  /* ── step: SELECT TEMPLATE ── */
  if (step === "select") {
    return (
      <div style={{ minHeight: "100vh", background: "#FAF4EC" }}>
        {/* Topbar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #E8D8C4",
            padding: "0 24px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{ fontSize: 13, color: "#2BADD4", textDecoration: "none", fontWeight: 500 }}
          >
            ← Kembali
          </Link>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#3D2B1F" }}>
            Pilih Template
          </span>
          <div style={{ width: 60 }} />
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
          <p style={{ fontSize: 13, color: "#7a6558", marginBottom: 24, textAlign: "center" }}>
            Pilih template photostrip favoritmu ✨
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelected(t);
                  setPhotos([]);
                  setStep("capture");
                }}
                style={{
                  background: "#fff",
                  border: `2px solid ${selected?.id === t.id ? "#2BADD4" : "#E8D8C4"}`,
                  borderRadius: 14,
                  overflow: "hidden",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  padding: 0,
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    height: 140,
                    background: t.overlayUrl
                      ? undefined
                      : `linear-gradient(135deg, ${t.bgColor}, #fff)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {t.overlayUrl ? (
                    <img
                      src={t.overlayUrl}
                      alt={t.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ opacity: 0.4, fontSize: 13, color: "#7a6558" }}>
                      {t.slots.map((s, i) => (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            left: `${s.x * 100}%`,
                            top: `${s.y * 100}%`,
                            width: `${s.w * 100}%`,
                            height: `${s.h * 100}%`,
                            background: "#E0F4FA",
                            border: "1px solid #2BADD4",
                            borderRadius: 3,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#3D2B1F" }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: "#7a6558", marginTop: 2 }}>
                    {t.slots.length} foto · {t.canvasWidth}×{t.canvasHeight}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── step: CAPTURE ── */
  if (step === "capture") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f0c08",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            padding: "0 20px",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={reset}
            style={{
              fontSize: 13,
              color: "#2BADD4",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            ← Ganti Template
          </button>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
            {selected?.name}
          </span>
          <div style={{ width: 100 }} />
        </div>

        {/* Main layout */}
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 0,
            overflow: "hidden",
          }}
        >
          {/* Camera area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              position: "relative",
            }}
          >
            {/* Video */}
            <div
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                maxWidth: 480,
                width: "100%",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  display: "block",
                  transform: "scaleX(-1)",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  background: "#111",
                }}
              />

              {/* Countdown overlay */}
              {isCounting && countdown > 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 100,
                      fontWeight: 900,
                      color: "#fff",
                      lineHeight: 1,
                      textShadow: "0 4px 24px rgba(43,173,212,0.8)",
                    }}
                  >
                    {countdown}
                  </div>
                </div>
              )}

              {/* Camera not ready overlay */}
              {!cameraReady && !error && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#111",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      border: "3px solid #2BADD4",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <p style={{ color: "#7a6558", fontSize: 12 }}>Menyalakan kamera…</p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  marginTop: 12,
                  background: "#3f1200",
                  border: "1px solid #E8722A",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#fca683",
                  maxWidth: 480,
                  width: "100%",
                }}
              >
                ⚠️ {error}
                <button
                  onClick={startCamera}
                  style={{
                    marginLeft: 10,
                    fontSize: 11,
                    color: "#2BADD4",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Coba lagi
                </button>
              </div>
            )}

            {/* Progress bar */}
            <div
              style={{
                marginTop: 20,
                width: "100%",
                maxWidth: 480,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 12, color: "#7a6558" }}>
                  Foto {photos.length} dari {maxSlots}
                </span>
                <span style={{ fontSize: 12, color: "#2BADD4", fontWeight: 600 }}>
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <div
                style={{
                  height: 4,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg, #2BADD4, #E8722A)",
                    borderRadius: 999,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>

              {/* Slot badges */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12,
                  justifyContent: "center",
                }}
              >
                {Array.from({ length: maxSlots }).map((_, i) => (
                  <SlotBadge key={i} n={i + 1} done={i < photos.length} />
                ))}
              </div>
            </div>

            {/* Capture button */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {!isBatch && photos.length < maxSlots && (
                <button
                  disabled={!cameraReady || isCounting}
                  onClick={runBatch}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: cameraReady && !isCounting
                      ? "linear-gradient(135deg, #2BADD4, #1e9abc)"
                      : "#333",
                    border: "3px solid rgba(255,255,255,0.2)",
                    cursor: cameraReady && !isCounting ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    boxShadow: cameraReady ? "0 0 24px rgba(43,173,212,0.5)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  📸
                </button>
              )}

              {isBatch && (
                <button
                  onClick={() => setStopReq(true)}
                  style={{
                    padding: "12px 20px",
                    background: "#E8722A",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Batalkan
                </button>
              )}

              {photos.length > 0 && !isBatch && (
                <button
                  onClick={() => setPhotos([])}
                  style={{
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Ulang
                </button>
              )}
            </div>

            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
          </div>

          {/* Right panel: photo strip preview */}
          <div
            style={{
              width: 160,
              background: "rgba(255,255,255,0.04)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              overflowY: "auto",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#7a6558",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Strip Preview
            </p>
            {Array.from({ length: maxSlots }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  borderRadius: 6,
                  overflow: "hidden",
                  border: `1.5px solid ${
                    i < photos.length ? "#2BADD4" : "rgba(255,255,255,0.1)"
                  }`,
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {photos[i] ? (
                  <img
                    src={photos[i]}
                    alt={`foto ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "scaleX(-1)",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 18, opacity: 0.3 }}>📷</span>
                )}
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    color: i < photos.length ? "#2BADD4" : "#7a6558",
                  }}
                >
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    );
  }

  /* ── step: RESULT ── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF4EC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #E8D8C4",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(61,43,31,0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #E8D8C4",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 22 }}>🎉</span>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#3D2B1F" }}>
              Foto siap!
            </p>
            <p style={{ fontSize: 12, color: "#7a6558" }}>{selected?.name}</p>
          </div>
        </div>

        {/* Image */}
        {finalImage && (
          <div style={{ padding: "16px" }}>
            <img
              src={finalImage}
              alt="hasil foto"
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1.5px solid #E8D8C4",
                display: "block",
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            padding: "0 16px 20px",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {finalImage && (
            <a
              href={finalImage}
              download="photobooth.png"
              style={{
                flex: 1,
                display: "block",
                textAlign: "center",
                padding: "12px",
                background: "#2BADD4",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              ⬇️ Unduh
            </a>
          )}
          <button
            onClick={reset}
            style={{
              flex: 1,
              padding: "12px",
              background: "#FAF4EC",
              color: "#3D2B1F",
              border: "1.5px solid #E8D8C4",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            📷 Foto Lagi
          </button>
        </div>
      </div>

      <Link
        href="/"
        style={{
          marginTop: 20,
          fontSize: 13,
          color: "#7a6558",
          textDecoration: "none",
        }}
      >
        ← Kembali ke Home
      </Link>
    </div>
  );
}