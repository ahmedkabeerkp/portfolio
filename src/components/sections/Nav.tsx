export default function Nav({ name }: { name: string }) {
  return (
    <nav className="fixed top-0 w-full z-50 mix-blend-difference pointer-events-none">
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
