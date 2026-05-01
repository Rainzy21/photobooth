// Shared template store using localStorage
// Templates are saved as JSON and persisted across sessions

export interface PhotoSlot {
  x: number; // 0–1 normalized
  y: number;
  w: number;
  h: number;
}

export interface BoothTemplate {
  id: string;
  name: string;
  overlayUrl: string | null; // base64 PNG overlay (transparent frame)
  thumbnailUrl: string | null; // preview thumbnail
  slots: PhotoSlot[]; // normalized 0–1 coords
  canvasWidth: number;
  canvasHeight: number;
  bgColor: string;
  createdAt: number;
}

const KEY = "photobooth_templates";

export const DEFAULT_TEMPLATES: BoothTemplate[] = [
  {
    id: "default-3slot",
    name: "Classic Strip (3 foto)",
    overlayUrl: null,
    thumbnailUrl: null,
    slots: [
      { x: 0.05, y: 0.03, w: 0.9, h: 0.28 },
      { x: 0.05, y: 0.36, w: 0.9, h: 0.28 },
      { x: 0.05, y: 0.69, w: 0.9, h: 0.28 },
    ],
    canvasWidth: 600,
    canvasHeight: 1800,
    bgColor: "#ffffff",
    createdAt: 0,
  },
  {
    id: "default-4slot",
    name: "Grid Strip (4 foto)",
    overlayUrl: null,
    thumbnailUrl: null,
    slots: [
      { x: 0.04, y: 0.03, w: 0.44, h: 0.44 },
      { x: 0.52, y: 0.03, w: 0.44, h: 0.44 },
      { x: 0.04, y: 0.52, w: 0.44, h: 0.44 },
      { x: 0.52, y: 0.52, w: 0.44, h: 0.44 },
    ],
    canvasWidth: 800,
    canvasHeight: 800,
    bgColor: "#FAF4EC",
    createdAt: 0,
  },
  {
    id: "default-2slot",
    name: "Duo Frame (2 foto)",
    overlayUrl: null,
    thumbnailUrl: null,
    slots: [
      { x: 0.05, y: 0.05, w: 0.9, h: 0.42 },
      { x: 0.05, y: 0.53, w: 0.9, h: 0.42 },
    ],
    canvasWidth: 600,
    canvasHeight: 1000,
    bgColor: "#E0F4FA",
    createdAt: 0,
  },
];

export function loadTemplates(): BoothTemplate[] {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES;
  try {
    const raw = localStorage.getItem(KEY);
    const saved: BoothTemplate[] = raw ? JSON.parse(raw) : [];
    return [...DEFAULT_TEMPLATES, ...saved];
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

export function saveTemplate(t: BoothTemplate): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const saved: BoothTemplate[] = raw ? JSON.parse(raw) : [];
    const existing = saved.findIndex((x) => x.id === t.id);
    if (existing >= 0) saved[existing] = t;
    else saved.push(t);
    localStorage.setItem(KEY, JSON.stringify(saved));
  } catch (e) {
    console.error("Failed to save template", e);
  }
}

export function deleteTemplate(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const saved: BoothTemplate[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(KEY, JSON.stringify(saved.filter((t) => t.id !== id)));
  } catch (e) {
    console.error("Failed to delete template", e);
  }
}
