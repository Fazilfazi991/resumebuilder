import { AppButton } from "@/components/app/AppButton";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { LockKeyhole, ScanSearch, ShieldCheck, UsersRound } from "lucide-react";

const sections = [
  ["Why we built ResumeCraft", "ResumeCraft exists to make professional resume creation less confusing for students, freshers, UAE job seekers, and experienced professionals."],
  ["Built for job seekers, students, and professionals", "The product is designed for real application workflows: multiple resumes, reusable profile data, and templates for different roles."],
  ["ATS-friendly by design", "Templates are built as clean HTML/CSS components so text stays readable, selectable, and ready for future PDF export."],
  ["Privacy-first promise", "Resume data should stay under the user's control. Backend storage will be added carefully with clear account and data controls."],
  ["Future roadmap", "Next phases include Supabase auth, saved resumes, PDF export, payments, admin metadata, and AI writing tools."],
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader
        eyebrow="About"
        title="ResumeCraft helps people apply with confidence"
        description="We are building a practical resume platform where one profile can generate polished, professional resumes for many opportunities."
        actions={<AppButton href="/builder/guest">Try the Builder</AppButton>}
      />
      <main className="bg-slate-50">
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
          {sections.map(([title, description], index) => {
            const icons = [UsersRound, ScanSearch, ShieldCheck, LockKeyhole, ScanSearch];
            const Icon = icons[index];
            return (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon size={21} aria-hidden="true" /></div>
                <h2 className="text-xl font-bold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}
