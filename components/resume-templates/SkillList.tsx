import type { ResumeData } from "@/types/resume";

export function SkillList({ skills, variant = "plain", tone = "teal" }: { skills: ResumeData["skills"]; variant?: "plain" | "pills" | "bars"; tone?: "teal" | "cyan" | "purple" | "orange" }) {
  if (!skills.length) return null;
  const pill = { teal: "border-teal-200 bg-teal-50 text-teal-800", cyan: "border-cyan-200 bg-cyan-50 text-cyan-800", purple: "border-violet-200 bg-violet-50 text-violet-800", orange: "border-orange-200 bg-orange-50 text-orange-800" }[tone];

  if (variant === "plain") {
    return <p className="text-[10px] leading-[1.6] text-slate-700">{skills.map((skill) => skill.name).join(" | ")}</p>;
  }

  if (variant === "bars") {
    return <div className="space-y-2">{skills.map((skill) => <div key={skill.id}><div className="flex justify-between text-[9.5px] font-semibold"><span>{skill.name}</span><span className="text-slate-500">{skill.level}</span></div><div className="mt-1 h-1 bg-white/25"><div className="h-1 w-4/5 bg-current opacity-70" /></div></div>)}</div>;
  }

  return <div className="flex flex-wrap gap-1.5">{skills.map((skill) => <span key={skill.id} className={`rounded-full border px-2 py-1 text-[9px] font-semibold ${pill}`}>{skill.name}</span>)}</div>;
}
