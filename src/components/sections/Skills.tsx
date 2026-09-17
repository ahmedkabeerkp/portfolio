import type { Skill } from "@/lib/types";
import Reveal from "@/components/motion/Reveal";

export default function Skills({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  const groups = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="relative w-full px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto py-28 md:py-36">
      <Reveal>
        <span className="text-xs font-mono tracking-[0.3em] text-accent uppercase">Core Expertise</span>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mt-4 mb-16">
          Precision craft, <span className="text-muted italic font-light">without the noise.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
        {Object.entries(groups).map(([category, items]) => (
          <Reveal key={category}>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">{category}</h3>
            <div className="flex flex-wrap gap-2.5">
              {items.map((skill) => (
                <span
                  key={skill.id}
                  title={skill.detail_bullets?.join(" · ")}
                  className="px-4 py-2 rounded-full border border-border text-sm hover:border-accent hover:text-accent transition-colors duration-300 cursor-default"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
