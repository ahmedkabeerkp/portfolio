export default function Loading() {
  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto flex flex-col justify-center">
      <div className="space-y-5 animate-pulse">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="h-16 md:h-24 w-3/4 rounded bg-white/10" />
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="h-4 w-64 rounded bg-white/10" />
      </div>
    </main>
  );
}
