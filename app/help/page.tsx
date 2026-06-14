import { AppButton } from "@/components/app/AppButton";
import { FAQAccordion } from "@/components/app/FAQAccordion";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { Search } from "lucide-react";

const categories = ["Getting Started", "Resume Builder", "Templates", "Downloads", "Payments", "Account"];
const faqs = [
  { question: "Can I download as PDF?", answer: "PDF export is planned for the backend phase. The frontend already uses print-friendly A4 template components." },
  { question: "Are templates ATS-friendly?", answer: "Classic ATS and Simple One Page are designed to be simple, readable, and ATS-friendly." },
  { question: "Can I edit later?", answer: "Yes. The builder uses shared resume data now; persistent editing will come once Supabase is connected." },
  { question: "Can I create multiple resumes?", answer: "Yes. The portal includes dashboard and My Resumes flows for managing multiple resumes." },
  { question: "Do premium templates cost money?", answer: "Premium locking will be connected later. For now premium labels are visible in the UI." },
  { question: "Can I use it for UAE jobs?", answer: "Yes. UAE Professional and UAE example categories are part of the product direction." },
];

export default function HelpPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader eyebrow="Help" title="How can we help?" description="Find answers about templates, the builder, downloads, payments, and your account." />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} aria-hidden="true" />
            <input placeholder="Search help articles" className="h-14 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold outline-none focus:border-teal-400" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => <button key={category} className="rounded-lg border border-slate-200 bg-white p-4 text-left font-bold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50">{category}</button>)}
          </div>
          <div className="mt-8"><FAQAccordion items={faqs} /></div>
          <div className="mt-10 rounded-lg bg-teal-800 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Still need support?</h2>
            <p className="mt-2 text-teal-50">Send us a message and we will help you move forward.</p>
            <div className="mt-5"><AppButton href="/contact" variant="secondary">Contact Support</AppButton></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
