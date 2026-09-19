import type { Skill } from "@/lib/types";
import Reveal from "@/components/motion/Reveal";

export default function Skills({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  const bullets = skills.flatMap((s) => s.detail_bullets ?? []);
  const track = [...bullets, ...bullets]; // duplicated for seamless loop

  return (
    <section id="skills" className="relative w-full py-28 md:py-36 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto">
        <Reveal>
          <span className="text-xs font-mono tracking-[0.3em] text-accent uppercase">Core Expertise</span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mt-4 mb-16">
            Precision craft, <span className="text-muted italic font-light">without the noise.</span>
          </h2>
        </Reveal>
      </div>

      <div className="marquee-row mb-4">
        <div className="marquee-track">
          {track.map((b, i) => (
            <span key={i} className="skill-tile">{b}</span>
          ))}
        </div>
      </div>
      <div className="marquee-row marquee-row--reverse">
        <div className="marquee-track marquee-track--reverse">
          {[...track].reverse().map((b, i) => (
            <span key={i} className="skill-tile">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}