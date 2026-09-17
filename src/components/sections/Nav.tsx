"use client";

import { useEffect, useRef, useState } from "react";

export default function Nav({ name }: { name: string }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      const pastTop = y > 96; // only start hiding after leaving the very top

      setHidden(goingDown && pastTop);
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 mix-blend-difference pointer-events-none transition-transform duration-500 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-7 flex items-center justify-between text-white">
        <span className="font-display font-semibold text-lg pointer-events-auto">
          {name
            .split(" ")
            .map((w) => w[0])
            .join("")}
          ©
        </span>
        <div className="hidden md:flex gap-8 text-sm font-mono uppercase tracking-widest pointer-events-auto">
          <a href="#work" className="hover:opacity-60 transition-opacity">Work</a>
          <a href="#skills" className="hover:opacity-60 transition-opacity">Skills</a>
          <a href="#experience" className="hover:opacity-60 transition-opacity">Experience</a>
          <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
        </div>
      </div>
    </nav>
  );
}
