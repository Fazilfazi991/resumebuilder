import { pageMetadata } from "@/lib/page-metadata";
import { AppButton } from "@/components/app/AppButton";
import { FAQAccordion } from "@/components/app/FAQAccordion";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Check } from "lucide-react";

export const metadata = pageMetadata("Pricing", "Build resumes with every current Resumi template and download PDFs free during launch.", "/pricing");

const features = ["Guest resume builder", "All current launch templates", "Live preview and template switching", "ATS resume checks", "PDF downloads", "No watermark"];
const faqs = [
  { question: "Can I start for free?", answer: "Yes. The guest builder does not require an account, credit card, or payment." },
  { question: "Do templates cost money?", answer: "No. Every template currently shown in Resumi is included in the free launch." },
  { question: "Can I create multiple resumes?", answer: "Yes. A signed-in account can save and manage multiple resumes. Guest drafts are saved on the device for recovery." },
  { question: "Are paid plans available?", answer: "No. Resumi is not accepting payments during the current launch." },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader eyebrow="Pricing" title="Everything you need to build a resume is free during launch" description="Use every current template, switch designs, check your resume, and download PDFs without payment." actions={<AppButton href="/builder/guest">Start Building</AppButton>} />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <article className="rounded-lg border border-blue-600 bg-white p-7 shadow-sm ring-4 ring-blue-100">
            <p className="text-sm font-bold text-blue-700">Current launch access</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-3xl font-bold text-slate-950">Free</h2>
              <p className="font-bold text-slate-700">No credit card required</p>
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-600"><Check size={17} className="mt-0.5 shrink-0 text-green-700" aria-hidden="true" />{feature}</li>)}
            </ul>
            <div className="mt-7"><AppButton href="/builder/guest">Create Resume Free</AppButton></div>
          </article>
          <p className="mt-5 text-center text-sm leading-6 text-slate-600">Paid plans are not offered or enabled. If Resumi introduces paid features later, pricing and terms will be shown clearly before any purchase.</p>
        </section>
        <section className="mx-auto grid max-w-5xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8">
          <div><h2 className="text-3xl font-bold text-slate-950">Pricing FAQ</h2><p className="mt-3 text-slate-600">Clear answers for the current free launch.</p></div>
          <FAQAccordion items={faqs} />
        </section>
      </main>
      <Footer />
    </>
  );
}
