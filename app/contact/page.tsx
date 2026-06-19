import { AppButton } from "@/components/app/AppButton";
import { FAQAccordion } from "@/components/app/FAQAccordion";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { Building2, GraduationCap, Headphones, Mail } from "lucide-react";

const contactCards = [
  [Headphones, "Support", "Questions about resumes, templates, or the builder."],
  [Mail, "Partnership", "Collaborate on distribution, hiring, or content."],
  [GraduationCap, "Colleges & institutes", "Help students create job-ready resumes."],
  [Building2, "Business inquiries", "Team plans and hiring-focused workflows."],
] as const;

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader eyebrow="Contact" title="Talk to Resumi" description="Send a message about support, partnerships, colleges, or business inquiries." />
      <main className="bg-slate-50">
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" />
              <Field label="Email" />
            </div>
            <div className="mt-4"><Field label="Subject" /></div>
            <label className="mt-4 block">
              <span className="text-sm font-bold text-slate-700">Message</span>
              <textarea className="mt-2 h-36 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-blue-600" />
            </label>
            <div className="mt-5"><AppButton>Submit Message</AppButton></div>
          </form>
          <div className="grid gap-4 sm:grid-cols-2">
            {contactCards.map(([Icon, title, copy]) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon size={21} aria-hidden="true" /></div>
                <h2 className="font-bold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
          <FAQAccordion items={[{ question: "How fast do you reply?", answer: "This is a frontend placeholder now. A real support workflow will be added with backend integration." }, { question: "Can colleges partner with Resumi?", answer: "Yes. The product direction includes student and institute workflows." }]} />
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({ label }: { label: string }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-blue-600" />
    </label>
  );
}
