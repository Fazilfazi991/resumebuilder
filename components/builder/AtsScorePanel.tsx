"use client";

import { analyzeJobMatch, type JobMatchResult } from "@/lib/ats/job-match";
import { calculateAtsScore, type AtsCategoryScore, type AtsIssueSeverity } from "@/lib/ats/score-resume";
import type { ResumeData, ResumeSection } from "@/types/resume";
import { CheckCircle2, ChevronDown, CircleAlert, Lightbulb, SearchCheck, Target } from "lucide-react";
import { useMemo, useState } from "react";

type AtsScorePanelProps = {
  data: ResumeData;
  onFixSection?: (section: ResumeSection) => void;
};

const categorySectionMap: Record<string, ResumeSection> = {
  personal: "personal",
  summary: "summary",
  skills: "skills",
  experience: "experience",
  projects: "projects",
  education: "education",
  "certifications-languages": "certificates",
  "ats-formatting": "templates" as ResumeSection,
};

export function AtsScorePanel({ data, onFixSection }: AtsScorePanelProps) {
  const score = useMemo(() => calculateAtsScore(data), [data]);
  const [openCategory, setOpenCategory] = useState(score.categories[0]?.id ?? "");
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatch, setJobMatch] = useState<JobMatchResult | null>(null);
  const issueCount = score.categories.reduce((sum, category) => sum + category.issues, 0);
  const scoreTone = toneFor(score.percentage);

  const analyze = () => {
    setJobMatch(analyzeJobMatch(data, jobDescription));
  };

  return (
    <section className="space-y-5 pb-24 lg:pb-0">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[180px_1fr] lg:items-center">
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-slate-100" style={{ background: `conic-gradient(${scoreTone.hex} ${score.percentage * 3.6}deg, #e2e8f0 0deg)` }}>
            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <span className="text-3xl font-bold text-slate-950">{score.percentage}%</span>
              <span className={`mt-1 text-xs font-bold ${scoreTone.text}`}>{score.label}</span>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${scoreTone.badge}`}>{score.label}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{score.totalScore}/{score.maxScore} points</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-950">Resume Score: {score.percentage}%</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Aim for at least 70% before applying. {score.summary}</p>
            <p className="mt-2 text-sm font-bold text-slate-700">Fix {issueCount} issues to improve your resume.</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full transition-all" style={{ width: `${score.percentage}%`, backgroundColor: scoreTone.hex }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-950">Optimize</h3>
            <p className="mt-1 text-sm text-slate-500">Open each category for clear fixes.</p>
          </div>
          <Target className="text-teal-700" size={22} aria-hidden="true" />
        </div>
        <div className="space-y-3">
          {score.categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              isOpen={openCategory === category.id}
              onToggle={() => setOpenCategory((current) => current === category.id ? "" : category.id)}
              onFix={() => {
                const section = categorySectionMap[category.id];
                if (section && section !== ("templates" as ResumeSection)) onFixSection?.(section);
              }}
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-950">Job Match</h3>
            <p className="mt-1 text-sm text-slate-500">Paste a job description to compare keywords locally.</p>
          </div>
          <SearchCheck className="text-teal-700" size={22} aria-hidden="true" />
        </div>
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={6}
          placeholder="Paste the job description here"
          className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6 outline-none focus:border-teal-400"
        />
        <button onClick={analyze} className="mt-3 min-h-11 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white">Analyze Match</button>
        {jobMatch ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg bg-teal-50 p-4">
              <p className="text-sm font-bold text-teal-700">Match score</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{jobMatch.percentage}%</p>
            </div>
            <KeywordBox title="Matching keywords" keywords={jobMatch.matchingKeywords} tone="green" />
            <KeywordBox title="Missing keywords" keywords={jobMatch.missingKeywords} tone="red" />
            <div className="lg:col-span-3">
              <KeywordBox title="Suggested skills/keywords to add" keywords={jobMatch.suggestedKeywords} tone="gray" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function AtsInsightsCompact({ data, onViewRecommendations }: { data: ResumeData; onViewRecommendations: () => void }) {
  const score = useMemo(() => calculateAtsScore(data), [data]);
  const scoreTone = toneFor(score.percentage);
  const rows = score.categories.slice(0, 6);

  return (
    <aside className="hidden min-w-0 border-l border-slate-200 bg-slate-50/80 p-4 xl:block">
      <div className="sticky top-24 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <h2 className="font-bold text-slate-950">ATS Insights</h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Optimization companion</p>
          </div>
          <Target className="text-teal-700" size={18} aria-hidden="true" />
        </div>
        <div className="p-4 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-slate-100" style={{ background: `conic-gradient(${scoreTone.hex} ${score.percentage * 3.6}deg, #e2e8f0 0deg)` }}>
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <span className="text-2xl font-bold text-slate-950">{score.percentage}%</span>
            </div>
          </div>
          <p className={`mt-3 text-sm font-bold ${scoreTone.text}`}>{score.label === "Strong" ? "Strong Match" : score.label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Your resume is well-optimized for ATS systems.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {rows.map((category) => (
            <div key={category.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-700">{category.label}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${category.issues ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{category.score}/{category.maxScore}</span>
                {category.issues ? <CircleAlert size={14} className="text-amber-500" /> : <CheckCircle2 size={14} className="text-teal-700" />}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <button onClick={onViewRecommendations} className="min-h-11 w-full rounded-lg border border-teal-200 bg-white px-3 text-sm font-bold text-teal-700 hover:bg-teal-50">
            View Recommendations
          </button>
        </div>
      </div>
    </aside>
  );
}

function CategoryRow({ category, isOpen, onToggle, onFix }: { category: AtsCategoryScore; isOpen: boolean; onToggle: () => void; onFix: () => void }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <div className="min-w-0">
          <p className="font-bold text-slate-950">{category.label}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{category.score}/{category.maxScore} points</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CountPill tone="green" value={category.passed} />
          <CountPill tone="red" value={category.issues} />
          <CountPill tone="gray" value={category.suggestions} />
          <ChevronDown className={`text-slate-400 transition ${isOpen ? "rotate-180" : ""}`} size={18} aria-hidden="true" />
        </div>
      </button>
      {isOpen ? (
        <div className="space-y-3 border-t border-slate-200 p-4">
          {category.items.map((item) => (
            <div key={item.id} className="rounded-lg bg-white p-4">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${severityBadge(item.severity)}`}>
                {item.severity === "success" ? <CheckCircle2 size={13} /> : item.severity === "suggestion" ? <Lightbulb size={13} /> : <CircleAlert size={13} />}
                {item.severity}
              </span>
              <p className="mt-3 font-bold text-slate-950">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">Action: {item.action}</p>
              {item.severity !== "success" ? <button onClick={onFix} className="mt-3 min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Fix in editor</button> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CountPill({ tone, value }: { tone: "green" | "red" | "gray"; value: number }) {
  const classes = tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "red" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600";
  return <span className={`inline-flex min-w-7 justify-center rounded-full px-2 py-1 text-xs font-bold ${classes}`}>{value}</span>;
}

function KeywordBox({ title, keywords, tone }: { title: string; keywords: string[]; tone: "green" | "red" | "gray" }) {
  const classes = tone === "green" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : tone === "red" ? "border-rose-100 bg-rose-50 text-rose-700" : "border-slate-200 bg-slate-50 text-slate-700";
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm font-bold text-slate-950">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {keywords.length ? keywords.map((keyword) => <span key={keyword} className={`rounded-full border px-2.5 py-1 text-xs font-bold ${classes}`}>{keyword}</span>) : <span className="text-sm text-slate-500">No keywords yet.</span>}
      </div>
    </div>
  );
}

export function toneFor(percentage: number) {
  if (percentage >= 85) return { hex: "#16a34a", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-700" };
  if (percentage >= 70) return { hex: "#0f8f7f", text: "text-teal-700", badge: "bg-teal-50 text-teal-700" };
  if (percentage >= 40) return { hex: "#d97706", text: "text-amber-700", badge: "bg-amber-50 text-amber-700" };
  return { hex: "#e11d48", text: "text-rose-700", badge: "bg-rose-50 text-rose-700" };
}

function severityBadge(severity: AtsIssueSeverity) {
  if (severity === "success") return "bg-emerald-50 text-emerald-700";
  if (severity === "suggestion") return "bg-slate-100 text-slate-600";
  if (severity === "warning") return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
}
