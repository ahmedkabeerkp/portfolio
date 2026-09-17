"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Profile } from "@/lib/types";

export default function Hero({ profile }: { profile: Partial<Profile> }) {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(nameRef.current, { yPercent: 110 }, { yPercent: 0, duration: 1.1 })
      .fromTo(roleRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.55")
      .fromTo(taglineRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.45")
      .fromTo(scrollCueRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, "-=0.3");
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto">
      <div className="overflow-hidden">
        <h1
          ref={nameRef}
          className="font-display font-semibold leading-[0.95] tracking-tight text-[clamp(3rem,9vw,7rem)]"
        >
          {profile.name ?? "Ahmed Kabeer"}
        </h1>
      </div>

      <p
        ref={roleRef}
        className="font-display mt-5 text-xl md:text-2xl text-accent tracking-tight"
      >
        {profile.role ?? "Application Developer"}
      </p>

      <p
        ref={taglineRef}
        className="mt-6 text-muted text-base md:text-lg leading-relaxed max-w-[42ch] font-light"
      >
        {profile.tagline ?? "I build systems that don't just work — they scale, adapt, and perform."}
      </p>

      <div
        ref={scrollCueRef}
        className="absolute bottom-10 left-6 md:left-12 lg:left-24 flex items-center gap-3 text-xs font-mono tracking-widest text-muted uppercase"
      >
        <span className="w-8 h-px bg-muted" />
        Scroll
      </div>
    </section>
  );
}
