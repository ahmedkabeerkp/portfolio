"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { upsertProject } from "@/app/admin/(protected)/projects/actions";
import type { Project } from "@/lib/types";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectForm({
  project,
}: {
  project?: Partial<Project>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Project>>(
    project ?? {
      title: "",
      slug: "",
      problem: "",
      focus: "",
      approach_heading: "",
      approach_body: "",
      tech_tags: [],
      thumbnail_url: "",
      gallery_urls: [],
      repo_url: "",
      live_url: "",
      is_featured: false,
      order_index: 0,
    }
  );
  const [tagsInput, setTagsInput] = useState((project?.tech_tags ?? []).join(", "));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // Uploads directly from the browser using the signed-in admin's
      // session — RLS on storage.objects (see supabase/schema.sql) is what
      // actually permits this, not anything in this component.
      const supabase = createClient();
      const path = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("project-media")
        .upload(path, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from("project-media").getPublicUrl(path);
      field("thumbnail_url", publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("project-media")
          .upload(path, file);
        if (uploadError) throw uploadError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("project-media").getPublicUrl(path);
        uploaded.push(publicUrl);
      }
      setForm((f) => ({ ...f, gallery_urls: [...(f.gallery_urls ?? []), ...uploaded] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryImage(url: string) {
    setForm((f) => ({ ...f, gallery_urls: (f.gallery_urls ?? []).filter((u) => u !== url) }));
  }

  function moveGalleryImage(index: number, dir: -1 | 1) {
    setForm((f) => {
      const arr = [...(f.gallery_urls ?? [])];
      const target = index + dir;
      if (target < 0 || target >= arr.length) return f;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...f, gallery_urls: arr };
    });
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const slug = form.slug?.trim() || slugify(form.title ?? "");
      await upsertProject({
        ...form,
        slug,
        tech_tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div>
        <label className="block text-sm text-white/50 mb-1">Title</label>
        <input
          required
          value={form.title ?? ""}
          onChange={(e) => field("title", e.target.value)}
          className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
        />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1">
          Slug <span className="text-white/30">(auto from title if left blank)</span>
        </label>
        <input
          value={form.slug ?? ""}
          onChange={(e) => field("slug", e.target.value)}
          placeholder={slugify(form.title ?? "")}
          className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
        />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1">Problem</label>
        <textarea
          value={form.problem ?? ""}
          onChange={(e) => field("problem", e.target.value)}
          rows={2}
          className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
        />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1">Focus</label>
        <textarea
          value={form.focus ?? ""}
          onChange={(e) => field("focus", e.target.value)}
          rows={2}
          className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/50 mb-1">Approach heading</label>
          <input
            value={form.approach_heading ?? ""}
            onChange={(e) => field("approach_heading", e.target.value)}
            className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-1">Order index</label>
          <input
            type="number"
            value={form.order_index ?? 0}
            onChange={(e) => field("order_index", Number(e.target.value))}
            className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1">Approach body</label>
        <textarea
          value={form.approach_body ?? ""}
          onChange={(e) => field("approach_body", e.target.value)}
          rows={2}
          className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
        />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1">
          Tech tags <span className="text-white/30">(comma-separated)</span>
        </label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Flutter, Firebase, Tariff / slab logic"
          className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/50 mb-1">Repo URL</label>
          <input
            value={form.repo_url ?? ""}
            onChange={(e) => field("repo_url", e.target.value)}
            className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-1">Live URL</label>
          <input
            value={form.live_url ?? ""}
            onChange={(e) => field("live_url", e.target.value)}
            className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1">Thumbnail</label>
        <div className="flex items-center gap-4">
          {form.thumbnail_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.thumbnail_url}
              alt="Thumbnail preview"
              className="w-20 h-20 object-cover rounded-lg border border-white/15"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            disabled={uploading}
            className="text-sm text-white/70"
          />
          {uploading && <span className="text-sm text-white/40">Uploading…</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1">
          Gallery <span className="text-white/30">(2–3 screenshots — these are what crossfade in a stack as visitors scroll through this project on the live site; the thumbnail above is only used as a fallback if this is empty)</span>
        </label>
        {!!form.gallery_urls?.length && (
          <div className="flex flex-wrap gap-3 mb-3">
            {form.gallery_urls.map((url, i) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-white/15"
                />
                <div className="flex gap-1 mt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => moveGalleryImage(i, -1)}
                    disabled={i === 0}
                    className="text-white/50 hover:text-white disabled:opacity-20"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveGalleryImage(i, 1)}
                    disabled={i === (form.gallery_urls?.length ?? 0) - 1}
                    className="text-white/50 hover:text-white disabled:opacity-20"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    className="text-red-400 hover:text-red-300 ml-auto"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
          disabled={uploading}
          className="text-sm text-white/70"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          checked={form.is_featured ?? false}
          onChange={(e) => field("is_featured", e.target.checked)}
        />
        Featured
      </label>

      <button
        type="submit"
        disabled={saving || uploading}
        className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white transition-colors disabled:opacity-40"
      >
        {saving ? "Saving…" : "Save project"}
      </button>
    </form>
  );
}
