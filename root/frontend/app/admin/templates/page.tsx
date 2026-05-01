"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  BoothTemplate,
  loadTemplates,
  saveTemplate,
  deleteTemplate,
  DEFAULT_TEMPLATES,
  PhotoSlot,
} from "@/lib/templateStore";

function uid() {
  return "tpl-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

const SLOT_COLORS = ["#2BADD4", "#E8722A", "#7c3aed", "#16a34a"];

const C = {
  label: { fontSize: 11, fontWeight: 600, color: "#7a6558", letterSpacing: "0.05em", textTransform: "uppercase" as const, marginBottom: 4, display: "block" },
  input: { width: "100%", padding: "8px 10px", border: "1.5px solid #E8D8C4", borderRadius: 8, fontSize: 13, color: "#3D2B1F", background: "#fff", outline: "none", boxSizing: "border-box" as const },
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<BoothTemplate[]>([]);
  const [editing, setEditing] = useState<BoothTemplate | null>(null);
  const [saved, setSaved] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTemplates(loadTemplates()); }, []);

  const drawPreview = useCallback(() => {
    if (!editing || !previewRef.current) return;
    const canvas = previewRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const PW = canvas.width, PH = canvas.height;
    ctx.clearRect(0, 0, PW, PH);
    ctx.fillStyle = editing.bgColor || "#fff";
    ctx.fillRect(0, 0, PW, PH);

    const drawSlots = (c: CanvasRenderingContext2D) => {
      editing.slots.forEach((s, i) => {
        c.strokeStyle = SLOT_COLORS[i % SLOT_COLORS.length];
        c.lineWidth = 2; c.setLineDash([6, 3]);
        c.strokeRect(s.x * PW, s.y * PH, s.w * PW, s.h * PH);
        c.fillStyle = SLOT_COLORS[i % SLOT_COLORS.length] + "22";
        c.fillRect(s.x * PW, s.y * PH, s.w * PW, s.h * PH);
        c.fillStyle = SLOT_COLORS[i % SLOT_COLORS.length];
        c.font = `bold ${Math.max(10, PW * 0.07)}px sans-serif`;
        c.fillText(`📷 ${i + 1}`, s.x * PW + 6, s.y * PH + Math.max(14, PW * 0.08));
      });
    };

    if (editing.overlayUrl) {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, PW, PH); drawSlots(ctx); };
      img.src = editing.overlayUrl;
    } else drawSlots(ctx);
  }, [editing]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  const startNew = () => {
    setEditing({ id: uid(), name: "Template Baru", overlayUrl: null, thumbnailUrl: null, slots: [{ x: 0.05, y: 0.05, w: 0.9, h: 0.28 }], canvasWidth: 600, canvasHeight: 1800, bgColor: "#ffffff", createdAt: Date.now() });
    setSaved(false);
  };

  const handleOverlayUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const b64 = await fileToBase64(file);
    setEditing((p) => p && { ...p, overlayUrl: b64, thumbnailUrl: b64 });
  };

  const updateSlot = (i: number, field: keyof PhotoSlot, val: string) => {
    const num = Math.min(1, Math.max(0, parseFloat(val) || 0));
    setEditing((p) => { if (!p) return p; return { ...p, slots: p.slots.map((s, idx) => idx === i ? { ...s, [field]: num } : s) }; });
  };

  const handleSave = () => {
    if (!editing) return;
    saveTemplate(editing);
    setTemplates(loadTemplates());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    if (DEFAULT_TEMPLATES.some((t) => t.id === id)) return;
    if (!confirm("Hapus template ini?")) return;
    deleteTemplate(id);
    setTemplates(loadTemplates());
    if (editing?.id === id) setEditing(null);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: editing ? "260px 1fr" : "1fr", gap: 20, alignItems: "start" }}>

        {/* List */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: "#7a6558" }}>{templates.length} template</p>
            <button onClick={startNew} style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: "#2BADD4", border: "none", padding: "7px 16px", borderRadius: 8, cursor: "pointer" }}>
              + Buat Baru
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {templates.map((t) => {
              const isDefault = DEFAULT_TEMPLATES.some((d) => d.id === t.id);
              const isActive = editing?.id === t.id;
              return (
                <div key={t.id} onClick={() => { setEditing({ ...t, slots: t.slots.map((s) => ({ ...s })) }); setSaved(false); }}
                  style={{ background: isActive ? "#E0F4FA" : "#fff", border: `1.5px solid ${isActive ? "#2BADD4" : "#E8D8C4"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#3D2B1F" }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: "#7a6558", marginTop: 2 }}>{t.slots.length} slot · {t.canvasWidth}×{t.canvasHeight}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {isDefault ? (
                        <span style={{ fontSize: 10, background: "#E0F4FA", color: "#2BADD4", padding: "2px 6px", borderRadius: 999, fontWeight: 600 }}>DEFAULT</span>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} style={{ fontSize: 11, color: "#E8722A", background: "none", border: "none", cursor: "pointer" }}>Hapus</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        {editing && (
          <div style={{ background: "#fff", border: "1.5px solid #E8D8C4", borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#3D2B1F" }}>Edit Template</h3>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={C.label}>Nama</label>
                  <input style={C.input} value={editing.name} onChange={(e) => setEditing((p) => p && { ...p, name: e.target.value })} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={C.label}>Lebar (px)</label>
                    <input type="number" style={C.input} value={editing.canvasWidth} onChange={(e) => setEditing((p) => p && { ...p, canvasWidth: parseInt(e.target.value) || 600 })} />
                  </div>
                  <div>
                    <label style={C.label}>Tinggi (px)</label>
                    <input type="number" style={C.input} value={editing.canvasHeight} onChange={(e) => setEditing((p) => p && { ...p, canvasHeight: parseInt(e.target.value) || 1800 })} />
                  </div>
                </div>

                <div>
                  <label style={C.label}>Background</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="color" value={editing.bgColor} onChange={(e) => setEditing((p) => p && { ...p, bgColor: e.target.value })} style={{ width: 40, height: 36, border: "1.5px solid #E8D8C4", borderRadius: 6, cursor: "pointer" }} />
                    <input style={{ ...C.input, flex: 1 }} value={editing.bgColor} onChange={(e) => setEditing((p) => p && { ...p, bgColor: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label style={C.label}>Overlay PNG</label>
                  <div onClick={() => overlayInputRef.current?.click()} style={{ border: "2px dashed #E8D8C4", borderRadius: 10, padding: 12, textAlign: "center", cursor: "pointer", background: "#FAF4EC" }}>
                    {editing.overlayUrl
                      ? <img src={editing.overlayUrl} style={{ maxHeight: 60, objectFit: "contain" }} alt="overlay" />
                      : <p style={{ fontSize: 12, color: "#7a6558" }}>🖼️ Upload PNG (opsional)</p>}
                    <input ref={overlayInputRef} type="file" accept="image/png" style={{ display: "none" }} onChange={handleOverlayUpload} />
                  </div>
                  {editing.overlayUrl && <button onClick={() => setEditing((p) => p && { ...p, overlayUrl: null, thumbnailUrl: null })} style={{ fontSize: 11, color: "#E8722A", background: "none", border: "none", cursor: "pointer", marginTop: 4 }}>Hapus overlay</button>}
                </div>

                {/* Slots */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ ...C.label, marginBottom: 0 }}>Slot Foto (0–1)</label>
                    <button onClick={() => setEditing((p) => p && { ...p, slots: [...p.slots, { x: 0.05, y: 0.05 + p.slots.length * 0.3, w: 0.9, h: 0.25 }] })} style={{ fontSize: 11, color: "#2BADD4", background: "#E0F4FA", border: "none", padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>+ Slot</button>
                  </div>
                  {editing.slots.map((s, i) => (
                    <div key={i} style={{ background: "#FAF4EC", border: `1.5px solid ${SLOT_COLORS[i % SLOT_COLORS.length]}44`, borderRadius: 8, padding: "8px 10px", marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: SLOT_COLORS[i % SLOT_COLORS.length] }}>Slot {i + 1}</span>
                        <button onClick={() => setEditing((p) => p && { ...p, slots: p.slots.filter((_, idx) => idx !== i) })} style={{ fontSize: 11, color: "#E8722A", background: "none", border: "none", cursor: "pointer" }}>×</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
                        {(["x", "y", "w", "h"] as const).map((f) => (
                          <div key={f}>
                            <label style={{ ...C.label, fontSize: 10, marginBottom: 2 }}>{f.toUpperCase()}</label>
                            <input type="number" step="0.01" min="0" max="1" style={{ ...C.input, padding: "4px 6px" }} value={s[f]} onChange={(e) => updateSlot(i, f, e.target.value)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleSave} style={{ padding: "11px", background: saved ? "#16a34a" : "#2BADD4", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background 0.2s" }}>
                  {saved ? "✓ Tersimpan!" : "Simpan Template"}
                </button>
              </div>

              {/* Preview canvas */}
              <div>
                <label style={C.label}>Preview</label>
                <canvas ref={previewRef} width={240} height={Math.round(240 * (editing.canvasHeight / editing.canvasWidth))} style={{ width: "100%", border: "1.5px solid #E8D8C4", borderRadius: 10, background: editing.bgColor }} />
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6, textAlign: "center" }}>Garis putus = posisi foto</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
