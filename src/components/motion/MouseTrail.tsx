"use client";

import { useEffect } from "react";

export default function MouseTrail() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768) return;

    const canvas = document.createElement("canvas");
    canvas.id = "mouse-trail-canvas";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const BASE_SIZE = 5;
    const LIFETIME = 420;
    const MIN_DIST = 4;

    let w = 0, h = 0;
    type Point = { x: number; y: number; born: number };
    const points: Point[] = [];
    let prevX = -9999, prevY = -9999;
    let running = true;
    let rafId = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      if (Math.sqrt(dx * dx + dy * dy) >= MIN_DIST) {
        points.unshift({ x: e.clientX, y: e.clientY, born: Date.now() });
        if (points.length > 60) points.length = 60;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const render = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const now = Date.now();

      while (points.length && now - points[points.length - 1].born > LIFETIME) {
        points.pop();
      }

      const len = points.length;
      points.forEach((pt, i) => {
        const age = (now - pt.born) / LIFETIME;
        const t = 1 - age;
        const pos = 1 - i / Math.max(len, 1);
        const alpha = t * pos * 0.82;
        if (alpha < 0.01) return;
        const size = BASE_SIZE * (0.28 + t * 0.72);
        ctx.fillStyle =
          i % 3 !== 0 ? `rgba(186,255,41,${alpha.toFixed(3)})` : `rgba(37,99,235,${alpha.toFixed(3)})`;
        ctx.fillRect(
          Math.round(pt.x - size * 0.5),
          Math.round(pt.y - size * 0.5),
          Math.round(size),
          Math.round(size)
        );
      });

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else {
        running = true;
        rafId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(rafId);
      canvas.remove();
    };
  }, []);

  return null;
}