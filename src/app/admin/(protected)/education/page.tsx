"use client";
import SimpleListEditor from "@/components/admin/SimpleListEditor";

export default function EducationPage() {
  return (
    <SimpleListEditor
      table="education"
      titleField="institution"
      fields={[
        { key: "institution", label: "Institution" },
        { key: "degree", label: "Degree" },
        { key: "field", label: "Field" },
        { key: "start_date", label: "Start date", type: "date" },
        { key: "end_date", label: "End date", type: "date" },
        { key: "order_index", label: "Order index", type: "number" },
      ]}
    />
  );
}
