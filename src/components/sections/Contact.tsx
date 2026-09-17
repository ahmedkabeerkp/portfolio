import type { Profile } from "@/lib/types";
import Reveal from "@/components/motion/Reveal";

export default function Contact({ profile }: { profile: Partial<Profile> }) {
  const mailHref = profile.contact_email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.contact_email)}`
    : undefined;

  return (
    <section id="contact" className="relative w-full bg-surface px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto py-28 md:py-40 flex flex-col items-center text-center">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] max-w-3xl">
            Let&apos;s build something that actually matters.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted text-lg mt-8 max-w-xl font-light">
            Clear communication, sharp execution. Reach out with a problem worth solving.
          </p>
        </Reveal>
        {mailHref && (
          <Reveal delay={0.2}>
            <a
              href={mailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex items-center gap-3 px-8 py-4 rounded-full border border-border font-medium hover:border-accent hover:text-accent transition-colors duration-300"
            >
              Send me an email
              <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm">
                ↗
              </span>
            </a>
          </Reveal>
        )}
      </div>

      <footer className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 py-8 border-t border-border text-muted text-sm">
        <p>{profile.name ?? "Ahmed Kabeer"} © {new Date().getFullYear()}</p>
        <div className="flex gap-6">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              LinkedIn
            </a>
          )}
          {profile.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              Resume
            </a>
          )}
        </div>
      </footer>
    </section>
  );
}
