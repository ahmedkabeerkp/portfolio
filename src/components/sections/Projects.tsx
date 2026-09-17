import type { Project } from "@/lib/types";
import Reveal from "@/components/motion/Reveal";
import ProjectPanel from "@/components/sections/ProjectPanel";

export default function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section id="work" className="relative w-full bg-background">
      <div className="px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto pt-28 pb-6">
        <Reveal>
          <span className="text-xs font-mono tracking-[0.3em] text-accent uppercase">Selected Work</span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mt-4">
            Things I&apos;ve built.
          </h2>
        </Reveal>
      </div>

      {projects.map((p, i) => (
        <ProjectPanel key={p.id} project={p} index={i} />
      ))}
    </section>
  );
}
