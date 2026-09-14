import { AppButton } from "@/components/app/AppButton";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { LockKeyhole, ScanSearch, ShieldCheck, UsersRound } from "lucide-react";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("About", "Learn how Resumi helps job seekers create, review, save, and download professional resumes.", "/about");

const sections = [
  ["Why we built Resumi", "Resumi exists to make professional resume creation less confusing for students, freshers, UAE job seekers, and experienced professionals."],
  ["Built for job seekers, students, and professionals", "The product is designed for real application workflows: multiple resumes, reusable profile data, and templates for different roles."],
  ["ATS-friendly by design", "Templates use readable structure and selectable text, while the built-in ATS check highlights missing details, keywords, and measurable impact."],
  ["Control over your work", "Guests can build without an account, while signed-in users can save multiple resumes. Account data is protected with user-scoped access rules."],
  ["Practical, honest guidance", "The current assistant uses structured questions and checklists. Resumi labels rule-based tools accurately and leaves every final wording choice with you."],
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader
        eyebrow="About"
        title="Resumi helps people apply with confidence"
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
