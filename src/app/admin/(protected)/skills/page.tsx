"use client";
import SimpleListEditor from "@/components/admin/SimpleListEditor";

export default function SkillsPage() {
  return (
    <SimpleListEditor
      table="skills"
      titleField="name"
      fields={[
        { key: "category", label: "Category" },
        { key: "name", label: "Name" },
        { key: "detail_bullets", label: "Detail bullets", type: "tags" },
        { key: "order_index", label: "Order index", type: "number" },
      ]}
    />
  );
}
