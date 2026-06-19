import { Copy, Download, Pencil, Trash2 } from "lucide-react";
import { calculateAtsScore } from "@/lib/ats/score-resume";
import { defaultResumeData, mockResumes } from "@/lib/resume/mock-data";
import { A4Preview } from "./A4Preview";
import { AppButton } from "./AppButton";

type Resume = (typeof mockResumes)[number];

export function ResumeCard({ resume, view = "grid" }: { resume: Resume; view?: "grid" | "list" }) {
  const isList = view === "list";
  const atsScore = calculateAtsScore(defaultResumeData);

  return (
    <article className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${isList ? "grid gap-4 md:grid-cols-[180px_1fr_auto]" : ""}`}>
      <A4Preview templateId={resume.templateId} />
      <div className={isList ? "self-center" : "mt-4"}>
        <h3 className="font-bold text-slate-950">{resume.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{resume.templateName}</p>
        <p className="mt-1 text-xs font-semibold text-slate-400">Last edited {resume.lastEdited}</p>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
          <span className="text-xs font-bold text-blue-700">ATS Score</span>
          <span className="text-sm font-bold text-slate-950">{atsScore.percentage}%</span>
        </div>
      </div>
      <div className={`grid gap-2 ${isList ? "self-center" : "mt-4 grid-cols-2"}`}>
        <AppButton href={`/builder/${resume.id}`}><Pencil size={15} aria-hidden="true" /> Edit</AppButton>
        <AppButton variant="secondary"><Copy size={15} aria-hidden="true" /> Duplicate</AppButton>
        <AppButton variant="secondary"><Download size={15} aria-hidden="true" /> Download</AppButton>
        <AppButton variant="danger"><Trash2 size={15} aria-hidden="true" /> Delete</AppButton>
      </div>
    </article>
  );
}
