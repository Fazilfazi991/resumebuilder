import { EmptyState } from "@/components/app/EmptyState";
import { PortalShell } from "@/components/app/PortalShell";
import { ResumeCard } from "@/components/app/ResumeCard";
import { mockResumes } from "@/lib/resume/mock-data";
import { FileText, Grid2X2, List, Search } from "lucide-react";

export default function MyResumesPage() {
  const hasResumes = mockResumes.length > 0;

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
          {hasResumes ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {mockResumes.map((resume) => <ResumeCard key={resume.id} resume={resume} />)}
            </div>
          ) : (
            <EmptyState icon={FileText} title="No resumes yet" description="Create your first resume and manage all versions here." actionLabel="Create Resume" actionHref="/builder/new" />
          )}
        </div>
      </section>
    </PortalShell>
  );
}
