import { A4Preview } from "@/components/app/A4Preview";
import { AppButton } from "@/components/app/AppButton";
import { AppHeader } from "@/components/app/AppHeader";
import { StatCard } from "@/components/app/StatCard";
import { calculateAtsScore } from "@/lib/ats/score-resume";
import { requireUser } from "@/lib/auth/require-user";
import { deleteResume, duplicateResume, getUserResumes } from "@/lib/resume/server";
import { resumeTemplates } from "@/lib/resume/template-registry";
import { Copy, Download, FileText, LayoutTemplate, Pencil, Plus, Trash2, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const { user, profile } = await requireUser("/dashboard");
  const resumes = await getUserResumes();
  const firstName = (profile?.full_name || user.user_metadata?.full_name || user.email || "there").split(" ")[0];

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-700">Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">Welcome back, {firstName}</h1>
              <p className="mt-2 text-slate-600">Manage resumes, switch templates, and keep applications moving.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <AppButton href="/cover-letter"><FileText size={18} aria-hidden="true" /> Create Cover Letter</AppButton>
              <AppButton href="/builder/new"><Plus size={18} aria-hidden="true" /> Create New Resume</AppButton>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FileText} label="Resumes Created" value={String(resumes.length)} helper="Saved to your account" />
            <StatCard icon={Download} label="Downloads" value="0" helper="Tracked after PDF export" />
            <StatCard icon={TrendingUp} label="Current Plan" value={profile?.plan ?? "Free"} helper="Upgrade for premium templates" />
            <StatCard icon={LayoutTemplate} label="Templates Used" value={String(new Set(resumes.map((resume) => resume.template_id)).size)} helper="Across saved resumes" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">My Resumes</h2>
                  <p className="mt-1 text-sm text-slate-500">Recent resumes and quick actions.</p>
                </div>
                <AppButton href="/templates" variant="secondary">Browse Templates</AppButton>
              </div>

              {resumes.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-3">
                  {resumes.map((resume) => {
                    const atsScore = calculateAtsScore(resume.resume_data);
                    const templateName = resumeTemplates.find((template) => template.id === resume.template_id)?.name ?? resume.template_id;
                    return (
                      <article key={resume.id} className="rounded-lg border border-slate-200 p-4">
                        <A4Preview data={resume.resume_data} sectionOrder={resume.section_order} templateId={resume.template_id} />
                        <h3 className="mt-4 font-bold text-slate-950">{resume.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{templateName}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">Last edited {formatDate(resume.updated_at)}</p>
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
                          <span className="text-xs font-bold text-blue-700">ATS Score</span>
                          <span className="text-sm font-bold text-slate-950">{atsScore.percentage}%</span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <AppButton href={`/builder/${resume.id}`}><Pencil size={15} aria-hidden="true" /> Edit</AppButton>
                          <form action={async () => { "use server"; await duplicateResume(resume.id); }}>
                            <AppButton type="submit" variant="secondary"><Copy size={15} aria-hidden="true" /> Duplicate</AppButton>
                          </form>
                          <AppButton href={`/builder/${resume.id}`} variant="secondary"><Download size={15} aria-hidden="true" /> Download</AppButton>
                          <form action={async () => { "use server"; await deleteResume(resume.id); }}>
                            <AppButton type="submit" variant="danger"><Trash2 size={15} aria-hidden="true" /> Delete</AppButton>
                          </form>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <h3 className="text-lg font-bold text-slate-950">Create your first resume</h3>
                  <p className="mt-2 text-sm text-slate-600">Start with a polished template and your drafts will appear here.</p>
                  <div className="mt-5"><AppButton href="/builder/new">Create New Resume</AppButton></div>
                </div>
              )}
            </section>

            <aside className="space-y-5">
              <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-blue-700">Current plan</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">{profile?.plan ?? "Free"}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Use free templates and preview premium designs before upgrading.</p>
                <div className="mt-5"><AppButton href="/account">Manage Account</AppButton></div>
              </section>
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-slate-950">Recommended templates</h2>
                <div className="mt-4 space-y-3">
                  {resumeTemplates.slice(0, 3).map((template) => (
                    <a key={template.id} href={`/builder/new?template=${template.id}`} className="block rounded-lg border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50">
                      <p className="font-bold text-slate-900">{template.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{template.category}</p>
                    </a>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}
