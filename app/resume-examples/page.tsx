import { A4Preview } from "@/components/app/A4Preview";
import { AppButton } from "@/components/app/AppButton";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { SectionBadge } from "@/components/app/SectionBadge";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

const filters = ["All", "Freshers", "UAE Jobs", "Tech", "Sales", "Marketing", "Finance", "Creative", "Healthcare", "Education"];
const examples = [
  ["Fresh Graduate Resume", "Freshers", "A clean starter resume focused on education, projects, and skills."],
  ["UAE Sales Executive Resume", "UAE Jobs", "A UAE-friendly sales resume with measurable achievements."],
  ["Software Developer Resume", "Tech", "Technical resume highlighting skills, projects, and impact."],
  ["Marketing Specialist Resume", "Marketing", "Campaign-focused layout with metrics and brand work."],
  ["Accountant Resume", "Finance", "Finance resume with accuracy, reporting, and compliance signals."],
  ["Graphic Designer Resume", "Creative", "Portfolio-first resume for visual and brand designers."],
  ["Nurse Resume", "Healthcare", "Healthcare resume emphasizing patient care and certifications."],
  ["Teacher Resume", "Education", "Education resume for schools, institutes, and tutoring roles."],
  ["Project Manager Resume", "Tech", "Roadmap, delivery, and stakeholder management focused."],
  ["Customer Service Resume", "Sales", "Service resume with support metrics and communication skills."],
] as const;

export default function ResumeExamplesPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader eyebrow="Resume Examples" title="Resume examples for every career" description="Browse role-specific examples you can adapt inside the builder." />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {filters.map((filter, index) => <button key={filter} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${index === 0 ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}>{filter}</button>)}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map(([title, category, description], index) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <A4Preview templateId={index % 3 === 1 ? "uae-professional" : index % 3 === 2 ? "classic-ats" : "modern-minimal"} />
                <div className="mt-4"><SectionBadge>{category}</SectionBadge></div>
                <h2 className="mt-3 font-bold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <AppButton href="/resume-examples" variant="secondary">View Example</AppButton>
                  <AppButton href="/builder/guest">Use Template</AppButton>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-teal-800 px-4 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">Turn an example into your resume</h2>
          <p className="mt-3 text-teal-50">Start with proven structure, then personalize every section.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
