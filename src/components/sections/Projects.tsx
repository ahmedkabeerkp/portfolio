import type { Project } from "@/lib/types";
import Reveal from "@/components/motion/Reveal";
import Image from "next/image";

export default function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section id="work" className="relative w-full px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto py-28 md:py-36">
      <Reveal>
        <span className="text-xs font-mono tracking-[0.3em] text-accent uppercase">Selected Work</span>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mt-4 mb-20">
          Things I&apos;ve built.
        </h2>
      </Reveal>

      <div className="flex flex-col">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={0.05}>
            <a
              href={p.live_url || p.repo_url || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10 py-8 md:py-10 border-t border-border last:border-b"
            >
              <span className="font-mono text-sm text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <h3 className="font-display text-2xl md:text-4xl font-medium tracking-tight group-hover:text-accent transition-colors duration-300">
                  {p.title}
                </h3>
                {p.problem && (
                  <p className="text-muted mt-2 text-sm md:text-base max-w-xl leading-relaxed line-clamp-2">
                    {p.problem}
                  </p>
                )}
                {!!p.tech_tags?.length && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {p.tech_tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full border border-border text-[11px] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {p.thumbnail_url ? (
                <div className="relative w-full md:w-40 h-28 rounded-xl overflow-hidden border border-border shrink-0">
                  <Image
                    src={p.thumbnail_url}
                    alt={p.title}
                    fill
                    sizes="160px"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              ) : (
                <span className="hidden md:flex w-9 h-9 rounded-full border border-border items-center justify-center text-sm group-hover:bg-accent group-hover:border-accent group-hover:text-black transition-all duration-300">
                  ↗
                </span>
              )}
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
