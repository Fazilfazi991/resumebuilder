import { EmptyState } from "@/components/app/EmptyState";
import { PortalShell } from "@/components/app/PortalShell";
import { A4Preview } from "@/components/app/A4Preview";
import { AppButton } from "@/components/app/AppButton";
import { calculateAtsScore } from "@/lib/ats/score-resume";
import { requireUser } from "@/lib/auth/require-user";
import { deleteResume, duplicateResume, getUserResumes } from "@/lib/resume/server";
import { resumeTemplates } from "@/lib/resume/template-registry";
import { Copy, FileText, Grid2X2, List, Pencil, Search, Trash2 } from "lucide-react";

export default async function MyResumesPage() {
  await requireUser("/my-resumes");
  const resumes = await getUserResumes();

  return (
    <PortalShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-teal-700">Portal</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">My Resumes</h1>
            <p className="mt-2 text-slate-600">Search, sort, and manage all resume versions.</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white" aria-label="Grid view"><Grid2X2 size={18} /></button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600" aria-label="List view"><List size={18} /></button>
          </div>
        </div>
        <div className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <input placeholder="Search resumes" className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-teal-400" />
          </label>
          <select className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600"><option>All templates</option><option>Modern Minimal</option><option>Classic ATS</option></select>
          <select className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600"><option>Recent</option><option>Oldest</option><option>A-Z</option></select>
        </div>
        <div className="mt-6">
          {resumes.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {resumes.map((resume) => {
                const score = calculateAtsScore(resume.resume_data);
                const templateName = resumeTemplates.find((template) => template.id === resume.template_id)?.name ?? resume.template_id;
                return (
                  <article key={resume.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <A4Preview data={resume.resume_data} sectionOrder={resume.section_order} templateId={resume.template_id} />
                    <h3 className="mt-4 font-bold text-slate-950">{resume.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{templateName}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">Last edited {formatDate(resume.updated_at)}</p>
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-teal-50 px-3 py-2">
                      <span className="text-xs font-bold text-teal-700">ATS Score</span>
                      <span className="text-sm font-bold text-slate-950">{score.percentage}%</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <AppButton href={`/builder/${resume.id}`}><Pencil size={15} aria-hidden="true" /> Edit</AppButton>
                      <form action={async () => { "use server"; await duplicateResume(resume.id); }}>
                        <AppButton type="submit" variant="secondary"><Copy size={15} aria-hidden="true" /> Duplicate</AppButton>
                      </form>
                      <form action={async () => { "use server"; await deleteResume(resume.id); }}>
                        <AppButton type="submit" variant="danger"><Trash2 size={15} aria-hidden="true" /> Delete</AppButton>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={FileText} title="Create your first resume" description="Start with a polished template and manage all versions here." actionLabel="Create Resume" actionHref="/builder/new" />
          )}
        </div>
      </section>
    </PortalShell>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}
