import type { Achievement } from "@/lib/types";
import Reveal from "@/components/motion/Reveal";

export default function Achievements({ achievements }: { achievements: Achievement[] }) {
  if (!achievements.length) return null;

  return (
    <section id="achievements" className="relative w-full px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto py-28 md:py-36">
      <Reveal>
        <span className="text-xs font-mono tracking-[0.3em] text-accent uppercase">Achievements</span>
        <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight mt-4 mb-16">
          Recognition along the way.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        {achievements.map((a) => {
          const content = (
            <>
              {a.date && (
                <p className="font-mono text-xs text-muted mb-1.5">
                  {new Date(a.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
              )}
              <h3 className="font-display text-lg md:text-xl font-medium">{a.title}</h3>
              {a.description && (
                <p className="text-muted text-sm mt-1.5 leading-relaxed">{a.description}</p>
              )}
            </>
          );

          return (
            <Reveal key={a.id} className="border-t border-border pt-6">
              {a.link ? (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group hover:opacity-80 transition-opacity"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
