import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import Link from "next/link";
import { deleteProject } from "./actions";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true })
    .returns<Project[]>();

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="text-sm border border-white/20 rounded-full px-4 py-2 hover:border-white transition-colors"
        >
          + New project
        </Link>
      </div>

      <ul className="space-y-3">
        {projects?.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between border border-white/10 rounded-xl px-5 py-4"
          >
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-white/50">{p.slug}</p>
            </div>
            <div className="flex gap-4 text-sm">
              <Link
                href={`/admin/projects/${p.id}`}
                className="text-white/70 hover:text-white"
              >
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteProject(p.id);
                }}
              >
                <button className="text-red-400 hover:text-red-300">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
        {!projects?.length && (
          <p className="text-white/40">No projects yet — add your first one.</p>
        )}
      </ul>
    </div>
  );
}
