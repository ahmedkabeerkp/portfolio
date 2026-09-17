"use client";
import SimpleListEditor from "@/components/admin/SimpleListEditor";

export default function ExperiencePage() {
  return (
    <SimpleListEditor
      table="experience"
      titleField="role"
      fields={[
        { key: "org", label: "Organization" },
        { key: "role", label: "Role" },
        { key: "start_date", label: "Start date", type: "date" },
        { key: "end_date", label: "End date", type: "date" },
        { key: "is_current", label: "Current role", type: "checkbox" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "order_index", label: "Order index", type: "number" },
      ]}
    />
  );
}
