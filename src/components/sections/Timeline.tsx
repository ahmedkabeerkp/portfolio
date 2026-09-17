import type { Experience, Education } from "@/lib/types";
import Reveal from "@/components/motion/Reveal";

function formatRange(start: string | null, end: string | null, current: boolean) {
  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
  if (current) return `${fmt(start)} — Present`;
  if (start && end) return `${fmt(start)} — ${fmt(end)}`;
  return fmt(start) || fmt(end);
}

export default function Timeline({
  experience,
  education,
}: {
  experience: Experience[];
  education: Education[];
}) {
  if (!experience.length && !education.length) return null;

  return (
    <section id="experience" className="relative w-full px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto py-28 md:py-36">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {!!experience.length && (
          <div>
            <Reveal>
              <span className="text-xs font-mono tracking-[0.3em] text-accent uppercase">Experience</span>
            </Reveal>
            <div className="mt-8 space-y-10">
              {experience.map((e) => (
                <Reveal key={e.id}>
                  <p className="font-mono text-xs text-muted mb-1.5">
                    {formatRange(e.start_date, e.end_date, e.is_current)}
                  </p>
                  <h3 className="font-display text-xl md:text-2xl font-medium">{e.role}</h3>
                  <p className="text-accent text-sm mt-0.5">{e.org}</p>
                  {e.description && (
                    <p className="text-muted text-sm mt-2 leading-relaxed max-w-md">{e.description}</p>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {!!education.length && (
          <div>
            <Reveal>
              <span className="text-xs font-mono tracking-[0.3em] text-accent uppercase">Education</span>
            </Reveal>
            <div className="mt-8 space-y-10">
              {education.map((ed) => (
                <Reveal key={ed.id}>
                  <p className="font-mono text-xs text-muted mb-1.5">
                    {formatRange(ed.start_date, ed.end_date, false)}
                  </p>
                  <h3 className="font-display text-xl md:text-2xl font-medium">{ed.institution}</h3>
                  <p className="text-accent text-sm mt-0.5">
                    {[ed.degree, ed.field].filter(Boolean).join(" · ")}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
