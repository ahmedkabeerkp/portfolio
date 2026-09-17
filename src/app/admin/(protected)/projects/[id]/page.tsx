import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single<Project>();

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium mb-8">Edit project</h1>
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
