"use client";

import { useEffect, useRef, ReactNode, CSSProperties } from "react";

/* ─────────────────────────────────────────────────────────────
   Global singleton loop — ONE rAF for ALL ParallaxReveal
   elements. Prevents unsynchronised per-component loops that
   cause jitter.
───────────────────────────────────────────────────────────── */
type Entry = {
  wrap: HTMLElement;
  inner: HTMLElement;
  depth: number;
  direction: "up" | "down" | "left" | "right";
  ease: number;
  current: number;
};

const registry = new Set<Entry>();
let loopId: number | null = null;

function startGlobalLoop() {
  if (loopId !== null) return;

  const tick = () => {
    registry.forEach((e) => {
      const rect = e.wrap.getBoundingClientRect();
      const vh   = window.innerHeight;
      const prog = (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2);
      const tgt  = Math.max(-1.5, Math.min(1.5, prog)) * e.depth;

      // lerp — runs inside the same rAF tick for every element
      e.current += (tgt - e.current) * e.ease;

      let tx = 0, ty = 0;
      switch (e.direction) {
        case "down":  ty = -e.current; break;
        case "left":  tx =  e.current; break;
        case "right": tx = -e.current; break;
        default:      ty =  e.current; break;
      }
      e.inner.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    });

    loopId = registry.size > 0 ? requestAnimationFrame(tick) : null;
  };

  loopId = requestAnimationFrame(tick);
}

function register(entry: Entry) {
  registry.add(entry);
  startGlobalLoop();
}

function unregister(entry: Entry) {
  registry.delete(entry);
}

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
interface ParallaxRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Parallax travel distance px. Default 36 */
  depth?: number;
  /** Default "up" */
  direction?: "up" | "down" | "left" | "right";
  /**
   * Lerp smoothness 0–1.
   * 0.06 = buttery, 0.12 = responsive, 0.25 = snappy
   * Default 0.06
   */
  ease?: number;
  threshold?: number;
}

export default function ParallaxReveal({
  children,
  delay     = 0,
  className = "",
  style,
  depth     = 36,
  direction = "up",
  ease      = 0.06,
  threshold = 0.12,
}: ParallaxRevealProps) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<Entry | null>(null);

  /* ── Register in global loop on mount ─── */
  useEffect(() => {
    const wrap  = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const entry: Entry = { wrap, inner, depth, direction, ease, current: 0 };
    entryRef.current = entry;
    register(entry);

    return () => {
      if (entryRef.current) unregister(entryRef.current);
    };
  }, [depth, direction, ease]);

  /* ── Reveal fade-in via IntersectionObserver ─── */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => wrap.classList.add("pr-visible"), delay);
          obs.unobserve(wrap);
        }
      },
      { threshold }
    );
    obs.observe(wrap);
    return () => obs.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={wrapRef} className={`pr-wrap ${className}`} style={style}>
      <div ref={innerRef} style={{ willChange: "transform" }}>
        {children}
      </div>

      <style>{`
        .pr-wrap {
          opacity: 0;
          transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pr-wrap.pr-visible {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
