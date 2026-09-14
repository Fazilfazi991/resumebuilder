import { pageMetadata } from "@/lib/page-metadata";
import { SubmitButton } from "@/components/app/SubmitButton";
import { FAQAccordion } from "@/components/app/FAQAccordion";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { Building2, GraduationCap, Headphones, Mail } from "lucide-react";
import { submitContactMessage } from "./actions";

export const metadata = pageMetadata("Contact", "Contact Resumi for product support, partnership, education, or business questions.", "/contact");

const contactCards = [
  [Headphones, "Support", "Questions about resumes, templates, accounts, or the builder."],
  [Mail, "Partnerships", "Discuss distribution, hiring, or useful content collaborations."],
  [GraduationCap, "Colleges & institutes", "Explore ways to help students create job-ready resumes."],
  [Building2, "Business inquiries", "Ask about team or hiring-focused workflows."],
] as const;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string; subject?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <Navbar />
      <PublicPageHeader eyebrow="Contact" title="Talk to Resumi" description="Send a support, partnership, education, or business question to the Resumi team." />
      <main className="bg-slate-50">
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <form action={submitContactMessage} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Send a message</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Messages are securely saved for the Resumi team to review. Response times are not guaranteed.</p>
            {params.message ? <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{params.message}</p> : null}
            {params.error ? <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{params.error}</p> : null}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Name" name="name" autoComplete="name" />
              <Field label="Email" name="email" type="email" autoComplete="email" />
            </div>
            <div className="mt-4"><Field label="Subject" name="subject" defaultValue={params.subject} /></div>
            <label className="mt-4 block">
              <span className="text-sm font-bold text-slate-700">Message</span>
              <textarea name="message" required minLength={10} maxLength={5000} className="mt-2 h-36 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-blue-600" />
            </label>
            <label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="mt-5"><SubmitButton pendingText="Sending...">Submit Message</SubmitButton></div>
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
          <FAQAccordion items={[
            { question: "How quickly will I receive a reply?", answer: "We review messages as capacity allows, but we do not promise a specific response time." },
            { question: "Can colleges partner with Resumi?", answer: "Yes. Use the form above with a short description of your students and the support you are exploring." },
          ]} />
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, name, type = "text", autoComplete, defaultValue }: { label: string; name: string; type?: string; autoComplete?: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input name={name} type={type} required maxLength={type === "email" ? 254 : 160} autoComplete={autoComplete} defaultValue={defaultValue} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-blue-600" />
    </label>
  );
}
