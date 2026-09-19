"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = cursorRef.current;
    if (!el) return;

    const pos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    gsap.set(el, { xPercent: -15, yPercent: -10 });

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const ticker = () => {
      pos.x += (mouse.x - pos.x) * 0.25;
      pos.y += (mouse.y - pos.y) * 0.25;
      gsap.set(el, { x: pos.x, y: pos.y });
    };
    gsap.ticker.add(ticker);

    const hoverables = 'a, button, [role="button"], input, textarea';
    const onEnter = () => el.classList.add("cursor-arrow--hover");
    const onLeave = () => el.classList.remove("cursor-arrow--hover");
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(hoverables)) onEnter();
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(hoverables)) onLeave();
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(ticker);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor-arrow" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 3.5 L4 19.5 L8.5 15.8 L11.3 21.5 L14 20.2 L11.2 14.5 L17 14 Z"
          fill="white"
          stroke="black"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}