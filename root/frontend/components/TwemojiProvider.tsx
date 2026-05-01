"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    twemoji: any;
  }
}

export default function TwemojiProvider() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js";
    script.crossOrigin = "anonymous";
    script.onload = () => {
      if (window.twemoji) {
        window.twemoji.parse(document.body, {
          folder: "svg",
          ext: ".svg",
        });

        // Re-parse on DOM mutations (for dynamic content)
        const observer = new MutationObserver(() => {
          window.twemoji.parse(document.body, { folder: "svg", ext: ".svg" });
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    };
    document.head.appendChild(script);
  }, []);

  return null;
}
