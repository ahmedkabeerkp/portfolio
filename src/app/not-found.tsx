import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase mb-6">404</span>
      <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="text-muted mt-5 max-w-md font-light">
        It may have been moved, removed, or never built in the first place.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border font-medium hover:border-accent hover:text-accent transition-colors duration-300"
      >
        Back to home
      </Link>
    </main>
  );
}
