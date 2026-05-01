"use client";

import { useState, useEffect } from "react";

interface TypingTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number; // ms per character
  startDelay?: number; // ms before typing begins
}

export default function TypingText({
  text,
  className,
  style,
  speed = 60,
  startDelay = 400,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          // keep cursor for 1.5s then hide
          setTimeout(() => setDone(true), 1500);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  return (
    <span className={className} style={style}>
      {displayed}
      {!done && <span className="typing-cursor" aria-hidden="true" />}
    </span>
  );
}
