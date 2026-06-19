import { BuilderClient } from "@/components/builder/BuilderClient";
import { requireUser } from "@/lib/auth/require-user";
import { createResume, getResumeById, updateResume } from "@/lib/resume/server";
import type { ResumeData } from "@/types/resume";
import { notFound, redirect } from "next/navigation";

export default async function BuilderPage({
  params,
  searchParams,
}: {
  params: Promise<{ resumeId: string }>;
  searchParams: Promise<{ template?: string }>;
}) {
  const { resumeId } = await params;
  const query = await searchParams;

  if (resumeId === "guest" || resumeId === "sample-resume") {
    redirect(query.template ? `/builder/guest?template=${encodeURIComponent(query.template)}` : "/builder/guest");
  }

  await requireUser(`/builder/${resumeId}`);

  if (resumeId === "new") {
    const resume = await createResume({
      title: "Untitled Resume",
      templateId: query.template ?? "modern-minimal",
    });
    redirect(`/builder/${resume.id}`);
  }

  let resume;
  try {
    resume = await getResumeById(resumeId);
  } catch {
    notFound();
  }

  async function saveResume(payload: { title: string; templateId: string; resumeData: ResumeData; sectionOrder: string[] }) {
    "use server";
    await updateResume(resumeId, payload);
  }

  return (
    <BuilderClient
      resumeId={resume.id}
      initialTitle={resume.title}
      initialTemplateId={resume.template_id}
      initialData={resume.resume_data}
      initialSectionOrder={resume.section_order}
      saveResume={saveResume}
    />
  );
}
