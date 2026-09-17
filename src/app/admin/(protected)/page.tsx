"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profile").select("*").maybeSingle<Profile>();
      setProfile(data ?? {});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function field<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  async function save() {
    if (!profile) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("profile").upsert(profile);
    setSaving(false);
    if (error) setError(error.message);
  }

  if (!profile) return <div className="px-8 py-12 text-white/40">Loading…</div>;

  const rows: { key: keyof Profile; label: string; textarea?: boolean }[] = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "tagline", label: "Tagline", textarea: true },
    { key: "about", label: "About", textarea: true },
    { key: "resume_url", label: "Resume URL" },
    { key: "contact_email", label: "Contact email" },
    { key: "github_url", label: "GitHub URL" },
    { key: "linkedin_url", label: "LinkedIn URL" },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-medium mb-2">Profile</h1>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {rows.map((r) => (
          <div key={r.key}>
            <label className="block text-sm text-white/50 mb-1">{r.label}</label>
            {r.textarea ? (
              <textarea
                rows={3}
                value={(profile[r.key] as string) ?? ""}
                onChange={(e) => field(r.key, e.target.value)}
                className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
              />
            ) : (
              <input
                value={(profile[r.key] as string) ?? ""}
                onChange={(e) => field(r.key, e.target.value)}
                className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
              />
            )}
          </div>
        ))}
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </div>
  );
}
