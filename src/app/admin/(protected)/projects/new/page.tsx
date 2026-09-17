import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium mb-8">New project</h1>
        <ProjectForm />
      </div>
    </div>
  );
}
