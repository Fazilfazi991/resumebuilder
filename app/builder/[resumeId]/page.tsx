import { BuilderClient } from "@/components/builder/BuilderClient";
import { BuilderErrorBoundary } from "@/components/builder/BuilderErrorBoundary";
import { BuilderLoadError } from "@/components/builder/BuilderLoadError";
import { getCurrentProfile } from "@/lib/auth/get-current-user";
import { requireUser } from "@/lib/auth/require-user";
import { authorizeResumeDownload, getResumeById, recordDownload, selectTemplateForResume, updateResume } from "@/lib/resume/server";
import type { ResumeData } from "@/types/resume";
import { redirect } from "next/navigation";

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

  let resume;
  try {
    resume = await getResumeById(resumeId);
  } catch {
    return (
      <BuilderErrorBoundary>
        <BuilderLoadError />
      </BuilderErrorBoundary>
    );
  }

  const profile = await getCurrentProfile();
  const hasPremiumAccess = profile?.plan === "premium" || profile?.plan === "lifetime" || profile?.plan === "admin";

  async function saveResume(payload: { title: string; templateId: string; resumeData: ResumeData; sectionOrder: string[] }) {
    "use server";
    await updateResume(resumeId, payload);
  }

  async function saveTemplateId(templateId: string) {
    "use server";
    await selectTemplateForResume(resumeId, templateId);
  }

  async function authorizeDownload(templateId: string) {
    "use server";
    return authorizeResumeDownload(resumeId, templateId);
  }

  async function trackDownload(templateId: string) {
    "use server";
    await recordDownload(resumeId, templateId);
  }

  return (
    <BuilderErrorBoundary>
      <BuilderClient
        resumeId={resume.id}
        initialTitle={resume.title}
        initialTemplateId={resume.template_id}
        initialData={resume.resume_data}
        initialSectionOrder={resume.section_order}
        initialUpdatedAt={resume.updated_at}
        hasPremiumAccess={hasPremiumAccess}
        saveResume={saveResume}
        saveTemplateId={saveTemplateId}
        authorizeDownload={authorizeDownload}
        trackDownload={trackDownload}
      />
    </BuilderErrorBoundary>
  );
}
