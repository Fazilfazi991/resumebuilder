import { A4Preview } from "@/components/app/A4Preview";
import { AppButton } from "@/components/app/AppButton";
import { AppHeader } from "@/components/app/AppHeader";
import { StatCard } from "@/components/app/StatCard";
import { mockResumes } from "@/lib/resume/mock-data";
import { resumeTemplates } from "@/lib/resume/template-registry";
import { Copy, Download, FileText, LayoutTemplate, Pencil, Plus, Trash2, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-teal-700">Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">Welcome back</h1>
              <p className="mt-2 text-slate-600">Manage resumes, switch templates, and keep applications moving.</p>
            </div>
            <AppButton href="/builder/new"><Plus size={18} aria-hidden="true" /> Create New Resume</AppButton>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FileText} label="Resumes Created" value="3" helper="2 updated this week" />
            <StatCard icon={Download} label="Downloads" value="10" helper="PDF exports tracked locally" />
            <StatCard icon={TrendingUp} label="Current Plan" value="Free" helper="Upgrade for premium templates" />
            <StatCard icon={LayoutTemplate} label="Templates Used" value="3" helper="Modern, ATS, UAE" />
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

              {mockResumes.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-3">
                  {mockResumes.map((resume) => (
                    <article key={resume.id} className="rounded-lg border border-slate-200 p-4">
                      <A4Preview templateId={resume.templateId} />
                      <h3 className="mt-4 font-bold text-slate-950">{resume.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{resume.templateName}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">Last edited {resume.lastEdited}</p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <AppButton href={`/builder/${resume.id}`}><Pencil size={15} aria-hidden="true" /> Edit</AppButton>
                        <AppButton variant="secondary"><Copy size={15} aria-hidden="true" /> Duplicate</AppButton>
                        <AppButton variant="secondary"><Download size={15} aria-hidden="true" /> Download</AppButton>
                        <AppButton variant="danger"><Trash2 size={15} aria-hidden="true" /> Delete</AppButton>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <h3 className="text-lg font-bold text-slate-950">No resumes yet</h3>
                  <p className="mt-2 text-sm text-slate-600">Create your first resume and your drafts will appear here.</p>
                  <div className="mt-5"><AppButton href="/builder/new">Create New Resume</AppButton></div>
                </div>
              )}
            </section>

            <aside className="space-y-5">
              <section className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-teal-700">Current plan</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Free</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Use free templates and preview premium designs before upgrading.</p>
                <div className="mt-5"><AppButton href="/account">Upgrade Plan</AppButton></div>
              </section>
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-slate-950">Recommended templates</h2>
                <div className="mt-4 space-y-3">
                  {resumeTemplates.slice(0, 3).map((template) => (
                    <a key={template.id} href={`/builder/sample-resume?template=${template.id}`} className="block rounded-lg border border-slate-200 p-3 transition hover:border-teal-200 hover:bg-teal-50">
                      <p className="font-bold text-slate-900">{template.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{template.category}</p>
                    </a>
                  ))}
                </div>
              </section>
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-slate-950">Resume tips</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>Use measurable outcomes in your first three bullets.</li>
                  <li>Keep the top third focused on the target role.</li>
                  <li>Switch templates without rewriting your content.</li>
                </ul>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
