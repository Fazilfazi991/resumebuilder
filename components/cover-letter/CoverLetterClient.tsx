"use client";

import { AppButton } from "@/components/app/AppButton";
import { generateCoverLetter, type CoverLetterLength, type CoverLetterTone } from "@/lib/cover-letter/generate-cover-letter";
import type { ResumeData } from "@/types/resume";
import { Copy, Download, FileText, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";

type ResumeOption = {
  id: string;
  title: string;
  data: ResumeData;
};

export function CoverLetterClient({ resumes }: { resumes: ResumeOption[] }) {
  const [resumeId, setResumeId] = useState(resumes[0]?.id ?? "default");
  const [companyName, setCompanyName] = useState("");
  const [hiringManagerName, setHiringManagerName] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState(resumes[0]?.data.personal.jobTitle ?? "");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<CoverLetterTone>("Professional");
  const [length, setLength] = useState<CoverLetterLength>("Standard");
  const selectedResume = useMemo(() => resumes.find((resume) => resume.id === resumeId) ?? resumes[0], [resumeId, resumes]);
  const [content, setContent] = useState(() => generateCoverLetter({
    resumeData: resumes[0].data,
    companyName: "the company",
    targetJobTitle: resumes[0].data.personal.jobTitle,
    tone: "Professional",
    length: "Standard",
  }));
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const next = generateCoverLetter({
      resumeData: selectedResume.data,
      companyName,
      hiringManagerName,
      targetJobTitle,
      jobDescription,
      tone,
      length,
    });
    setContent(next);
    setCopied(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
  };

  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(content, 470);
    let y = 64;
    lines.forEach((line: string) => {
      if (y > 780) {
        pdf.addPage();
        y = 64;
      }
      pdf.text(line, 62, y);
      y += 17;
    });
    pdf.save(`${(companyName || "cover-letter").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><FileText size={20} /></span>
          <div>
            <h2 className="font-bold text-slate-950">Cover Letter Details</h2>
            <p className="text-sm text-slate-500">Generate from your resume data.</p>
          </div>
        </div>
        <div className="space-y-4">
          <Field label="Resume">
            <select value={resumeId} onChange={(event) => setResumeId(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600">
              {resumes.map((resume) => <option key={resume.id} value={resume.id}>{resume.title}</option>)}
            </select>
          </Field>
          <Field label="Company name"><input value={companyName} onChange={(event) => setCompanyName(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600" /></Field>
          <Field label="Hiring manager name optional"><input value={hiringManagerName} onChange={(event) => setHiringManagerName(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600" /></Field>
          <Field label="Job title applying for"><input value={targetJobTitle} onChange={(event) => setTargetJobTitle(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tone"><select value={tone} onChange={(event) => setTone(event.target.value as CoverLetterTone)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600">{["Professional", "Friendly", "Confident", "Executive"].map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="Length"><select value={length} onChange={(event) => setLength(event.target.value as CoverLetterLength)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600">{["Short", "Standard", "Detailed"].map((item) => <option key={item}>{item}</option>)}</select></Field>
          </div>
          <Field label="Job description optional"><textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={5} className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-600" /></Field>
          <AppButton onClick={generate}><WandSparkles size={16} /> Generate Draft</AppButton>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-950">Live Cover Letter</h2>
            <p className="text-sm text-slate-500">Edit, copy, or download as PDF.</p>
          </div>
          <div className="flex gap-2">
            <AppButton onClick={copy} variant="secondary"><Copy size={16} />{copied ? "Copied" : "Copy"}</AppButton>
            <AppButton onClick={downloadPdf} variant="secondary"><Download size={16} />Download PDF</AppButton>
          </div>
        </div>
        <textarea value={content} onChange={(event) => setContent(event.target.value)} className="min-h-[620px] w-full rounded-lg border border-blue-100 bg-blue-50/30 px-5 py-5 font-serif text-base leading-8 text-slate-950 outline-none focus:border-blue-600" />
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>{children}</label>;
}
