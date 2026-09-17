"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

// Every action re-checks auth server-side before writing. RLS would block
// an unauthenticated write anyway, but failing fast with a clear message
// is better UX than a silent Postgres permission error.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return supabase;
}

export async function upsertProject(project: Partial<Project>) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("projects").upsert(project);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function uploadProjectImage(formData: FormData) {
  const supabase = await requireAdmin();
  const file = formData.get("file") as File;
  const path = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("project-media")
    .upload(path, file);
  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("project-media").getPublicUrl(path);

  return publicUrl;
}
