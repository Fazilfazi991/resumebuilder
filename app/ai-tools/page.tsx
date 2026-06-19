import { AppButton } from "@/components/app/AppButton";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { SectionBadge } from "@/components/app/SectionBadge";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { Bot, BriefcaseBusiness, FileSearch, Gauge, Languages, PenLine, Sparkles, WandSparkles } from "lucide-react";

const tools = [
  [WandSparkles, "AI Summary Writer", "Create strong summaries from your experience.", "In Builder"],
  [PenLine, "Bullet Point Improver", "Turn duties into achievement-focused bullet points.", "In Builder"],
  [Gauge, "ATS Keyword Checker", "Find missing job keywords before applying.", "Available Soon"],
  [BriefcaseBusiness, "Cover Letter Generator", "Create matching cover letters from resume data.", "Available Soon"],
  [FileSearch, "Job Description Matcher", "Compare your resume to a job post.", "Available Soon"],
  [Sparkles, "Skill Recommender", "Discover skills to add based on target roles.", "Available Soon"],
  [Languages, "Grammar & Tone Checker", "Polish language and keep a professional tone.", "Available Soon"],
  [Bot, "LinkedIn Bio Generator", "Turn your resume into a sharp LinkedIn bio.", "Available Soon"],
] as const;

export default function AIToolsPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader
        eyebrow="AI Tools"
        title="Write better resumes with AI-powered guidance"
        description="ResumeCraft's AI layer will help you write sharper summaries, stronger bullets, and more targeted applications."
        actions={<AppButton href="/builder/guest">Try in Builder</AppButton>}
      />
      <main className="bg-slate-50">
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {tools.map(([Icon, title, description, status]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon size={21} aria-hidden="true" /></div>
              <SectionBadge tone={status === "In Builder" ? "emerald" : "slate"}>{status}</SectionBadge>
              <h2 className="mt-4 font-bold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              <div className="mt-5"><AppButton href="/builder/guest" variant="secondary">{status === "In Builder" ? "Try in builder" : "Coming soon"}</AppButton></div>
            </article>
          ))}
        </section>
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-950">How AI helps job seekers</h2>
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
