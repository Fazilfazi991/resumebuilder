import { AppHeader } from "@/components/app/AppHeader";
import { CoverLetterClient } from "@/components/cover-letter/CoverLetterClient";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { defaultResumeData } from "@/lib/resume/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { ResumeData } from "@/types/resume";

export default async function CoverLetterPage({
  searchParams,
}: {
  searchParams: Promise<{ resumeId?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  let resumes = [{ id: "default", title: "Sample Resume", data: defaultResumeData }];

  if (user) {
    const supabase = await createClient();
    const { data } = await supabase.from("resumes").select("id,title,resume_data").order("updated_at", { ascending: false });
    if (data?.length) {
      resumes = data.map((resume) => ({ id: resume.id, title: resume.title, data: resume.resume_data as ResumeData }));
    }
  }

  if (params.resumeId) {
    resumes = [...resumes].sort((a, b) => a.id === params.resumeId ? -1 : b.id === params.resumeId ? 1 : 0);
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-blue-700">Cover Letter</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Create a tailored cover letter</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Use your resume data to draft a polished letter, then edit it manually before copying or downloading.</p>
          <div className="mt-6">
            <CoverLetterClient resumes={resumes} />
          </div>
        </section>
      </main>
    </>
  );
}
