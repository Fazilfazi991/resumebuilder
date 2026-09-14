import { AppButton } from "@/components/app/AppButton";
import { FAQAccordion } from "@/components/app/FAQAccordion";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Help", "Answers about the Resumi builder, templates, PDF downloads, guest drafts, and accounts.", "/help");

const categories = ["Getting Started", "Resume Builder", "Templates", "Downloads", "Guest Drafts", "Account"];
const faqs = [
  { question: "Can I download as PDF?", answer: "Yes. The builder can export the selected resume template as a browser-generated A4 PDF." },
  { question: "Are templates ATS-friendly?", answer: "Classic ATS and Simple One Page are designed to be simple, readable, and ATS-friendly." },
  { question: "Can I edit later?", answer: "Yes. Guest drafts are restored from the same browser and device. Signed-in users can save resumes to their account and continue from another session." },
  { question: "Can I create multiple resumes?", answer: "Yes. Signed-in users can create, save, duplicate, and manage multiple resumes from the dashboard." },
  { question: "Do templates cost money?", answer: "No. During launch, all resume templates and PDF downloads are free." },
  { question: "Can I use it for UAE jobs?", answer: "Yes. UAE Professional and UAE example categories are part of the product direction." },
];

export default function HelpPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader eyebrow="Help" title="How can we help?" description="Find answers about templates, the builder, downloads, guest drafts, and your account." />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2" aria-label="Help topics">
            {categories.map((category) => <span key={category} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">{category}</span>)}
          </div>
          <div className="mt-8"><FAQAccordion items={faqs} /></div>
          <div className="mt-10 rounded-lg bg-blue-900 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Still need support?</h2>
            <p className="mt-2 text-blue-50">Send us a message and we will help you move forward.</p>
            <div className="mt-5"><AppButton href="/contact" variant="secondary">Contact Support</AppButton></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
