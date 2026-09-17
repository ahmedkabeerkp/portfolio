import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "Profile" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/achievements", label: "Achievements" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex gap-6 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-white/60 hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <LogoutButton />
      </nav>
      {children}
    </div>
  );
}
