"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { Project } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fall back to the single thumbnail if no gallery images were uploaded.
  const images = project.gallery_urls?.length ? project.gallery_urls : project.thumbnail_url ? [project.thumbnail_url] : [];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || images.length < 2) return; // nothing to crossfade with 0-1 images

    const ctx = gsap.context(() => {
      const shots = imgRefs.current.filter(Boolean) as HTMLDivElement[];

      // Start state: only the first shot visible, on top of the stack.
      gsap.set(shots[0], { autoAlpha: 1, y: 0, scale: 1, zIndex: shots.length });
      shots.slice(1).forEach((el, i) => {
        gsap.set(el, { autoAlpha: 0, y: 24, scale: 0.96, zIndex: shots.length - 1 - i });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: `+=${shots.length * 70}%`,
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
        },
      });

      shots.forEach((el, i) => {
        if (i === shots.length - 1) return;
        const next = shots[i + 1];
        const label = `step${i}`;
        tl.addLabel(label)
          // outgoing shot sinks back and dims, staying in the stack behind
          .to(el, { y: -24, scale: 0.94, autoAlpha: 0.35, zIndex: 1, duration: 1 }, label)
          // incoming shot rises from behind and takes the front
          .fromTo(
            next,
            { autoAlpha: 0, y: 24, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, zIndex: shots.length, duration: 1 },
            label
          );
      });
    }, panel);

    return () => ctx.revert();
  }, [images.length]);

  return (
    <div
      ref={panelRef}
      className="project-panel w-full min-h-screen flex items-center px-6 md:px-12 lg:px-24 pt-24 pb-10"
    >
      <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 w-full min-w-0 space-y-4">
          <span className="text-accent font-mono text-sm tracking-widest block">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
            {project.title}
          </h3>
          {project.problem && (
            <p className="text-muted text-base md:text-lg max-w-xl leading-relaxed">
              <span className="text-foreground/80 font-medium">Problem · </span>
              {project.problem}
            </p>
          )}
          {project.focus && (
            <p className="text-muted text-base md:text-lg max-w-xl leading-relaxed">
              <span className="text-foreground/80 font-medium">Focus · </span>
              {project.focus}
            </p>
          )}
          {!!project.tech_tags?.length && (
            <div className="flex flex-wrap gap-2">
              {project.tech_tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full border border-border text-xs md:text-sm text-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {project.approach_body && (
            <div className="pt-2 border-t border-border max-w-xl">
              <p className="text-[11px] font-mono uppercase tracking-widest text-accent/80 mb-1">
                {project.approach_heading || "Approach"}
              </p>
              <p className="text-muted text-sm md:text-base leading-relaxed">{project.approach_body}</p>
            </div>
          )}
          {(project.repo_url || project.live_url) && (
            <a
              href={project.live_url || project.repo_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 font-medium hover:text-accent transition-colors duration-300 pt-2"
            >
              View {project.live_url ? "Project" : "Repository"}
              <span className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-sm group-hover:bg-accent group-hover:border-accent group-hover:text-black transition-all duration-300">
                ↗
              </span>
            </a>
          )}
        </div>

        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <div className="relative w-[240px] h-[500px] md:w-[280px] md:h-[580px]">
            {images.map((src, i) => (
              <div
                key={src + i}
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ opacity: i === 0 ? 1 : images.length > 1 ? 0 : 1 }}
              >
                <Image
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  fill
                  sizes="280px"
                  className="object-contain drop-shadow-2xl"
                  priority={index === 0 && i === 0}
                />
              </div>
            ))}
            {!images.length && (
              <div className="w-full h-full rounded-2xl border border-dashed border-border flex items-center justify-center text-muted text-sm text-center px-6">
                Add a thumbnail in /admin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
