import { AppButton } from "@/components/app/AppButton";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { SectionBadge } from "@/components/app/SectionBadge";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { pageMetadata } from "@/lib/page-metadata";
import { Bot, BriefcaseBusiness, FileSearch, Gauge, Languages, ListChecks, PenLine, Sparkles } from "lucide-react";

export const metadata = pageMetadata("Guided Resume Tools", "Use Resumi's guided resume assistant, ATS checks, and deterministic cover-letter drafting tools.", "/ai-tools");

const tools = [
  [ListChecks, "Summary Writing Guide", "Answer focused questions and apply your own wording to the summary.", "In Builder"],
  [PenLine, "Achievement Bullet Guidance", "Capture a responsibility or result and add it to your experience.", "In Builder"],
  [Gauge, "ATS Resume Check", "Review structure, contact details, keywords, and measurable impact.", "In Builder"],
  [BriefcaseBusiness, "Cover Letter Draft", "Create a rule-based draft from your resume details, then edit it yourself.", "Available"],
  [FileSearch, "Job Description Matcher", "Compare your resume with a job post.", "Not available"],
  [Sparkles, "Skill Suggestions", "Suggestions based on a target role.", "Not available"],
  [Languages, "Grammar & Tone Check", "Automated language and tone review.", "Not available"],
  [Bot, "LinkedIn Bio Draft", "Turn resume details into a profile draft.", "Not available"],
] as const;

export default function AIToolsPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader
        eyebrow="Guided Tools"
        title="Practical guidance for stronger resume content"
        description="The current tools use structured questions, checklists, and rule-based drafting. No generative AI model is connected in this release."
        actions={<AppButton href="/builder/guest">Try in Builder</AppButton>}
      />
      <main className="bg-slate-50">
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {tools.map(([Icon, title, description, status]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon size={21} aria-hidden="true" /></div>
              <SectionBadge tone={status === "In Builder" || status === "Available" ? "emerald" : "slate"}>{status}</SectionBadge>
              <h2 className="mt-4 font-bold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              <div className="mt-5">{status === "Not available" ? <AppButton variant="secondary" disabled>Not available</AppButton> : <AppButton href={status === "Available" ? "/cover-letter" : "/builder/guest"} variant="secondary">{status === "In Builder" ? "Try in builder" : "Create a draft"}</AppButton>}</div>
            </article>
          ))}
        </section>
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-950">How guided tools help job seekers</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {["Better wording", "Sharper targeting", "Faster applications"].map((item) => (
                <div key={item} className="rounded-lg bg-slate-50 p-5">
                  <h3 className="font-bold text-slate-950">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Use guided suggestions while staying in control of your final resume content.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
