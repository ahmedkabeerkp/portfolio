"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "date" | "checkbox" | "tags" | "number";
};

export default function SimpleListEditor({
  table,
  fields,
  orderBy = "order_index",
  titleField,
}: {
  table: string;
  fields: FieldConfig[];
  orderBy?: string;
  titleField: string;
}) {
  const supabase = createClient();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending: true });
    if (error) setError(error.message);
    setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    load();
  }, [table]);

  function blankRow() {
    const row: Record<string, unknown> = {};
    fields.forEach((f) => {
      row[f.key] = f.type === "tags" ? [] : f.type === "checkbox" ? false : f.type === "number" ? 0 : "";
    });
    return row;
  }

  async function save() {
    if (!editing) return;
    setError(null);
    const payload = { ...editing };
    fields.forEach((f) => {
      if (f.type === "tags" && typeof payload[f.key] === "string") {
        payload[f.key] = (payload[f.key] as string)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    });
    const { error } = await supabase.from(table).upsert(payload);
    if (error) {
      setError(error.message);
      return;
    }
    setEditing(null);
    load();
  }

  async function remove(id: unknown) {
    setError(null);
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) setError(error.message);
    load();
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium capitalize">{table}</h1>
          <button
            onClick={() => setEditing(blankRow())}
            className="text-sm border border-white/20 rounded-full px-4 py-2 hover:border-white transition-colors"
          >
            + New
          </button>
        </div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {editing ? (
          <div className="space-y-4 border border-white/10 rounded-xl p-6 mb-8">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm text-white/50 mb-1">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={2}
                    value={(editing[f.key] as string) ?? ""}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
                  />
                ) : f.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={(editing[f.key] as boolean) ?? false}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })}
                  />
                ) : f.type === "tags" ? (
                  <input
                    value={
                      Array.isArray(editing[f.key])
                        ? (editing[f.key] as string[]).join(", ")
                        : (editing[f.key] as string) ?? ""
                    }
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    placeholder="comma, separated, values"
                    className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
                  />
                ) : (
                  <input
                    type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                    value={(editing[f.key] as string | number) ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                      })
                    }
                    className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-white/50"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={save}
                className="px-5 py-2 rounded-full border border-white/20 hover:border-white transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2 rounded-full text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <p className="text-white/40">Loading…</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={String(row.id)}
                className="flex items-center justify-between border border-white/10 rounded-xl px-5 py-4"
              >
                <p className="font-medium">{String(row[titleField] ?? "")}</p>
                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => setEditing(row)}
                    className="text-white/70 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(row.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {!rows.length && <p className="text-white/40">Nothing here yet.</p>}
          </ul>
        )}
      </div>
    </div>
  );
}
