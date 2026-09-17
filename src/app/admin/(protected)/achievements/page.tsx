"use client";
import SimpleListEditor from "@/components/admin/SimpleListEditor";

export default function AchievementsPage() {
  return (
    <SimpleListEditor
      table="achievements"
      titleField="title"
      fields={[
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "date", label: "Date", type: "date" },
        { key: "link", label: "Link" },
        { key: "order_index", label: "Order index", type: "number" },
      ]}
    />
  );
}
