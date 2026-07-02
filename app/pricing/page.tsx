import { AppButton } from "@/components/app/AppButton";
import { FAQAccordion } from "@/components/app/FAQAccordion";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Check } from "lucide-react";

const plans = [
  { name: "Launch Free", price: "Free during launch", features: ["All resume templates", "PDF downloads", "No watermark", "Guest builder", "Cover letters"], featured: true, href: "/builder/guest" },
  { name: "Premium", price: "Coming soon", features: ["Advanced AI tools", "Priority templates", "Career workflow tools", "More export options"], disabled: true },
  { name: "Lifetime", price: "Coming soon", features: ["Future lifetime access", "Launch pricing", "Priority support", "All future pro templates"], disabled: true },
  { name: "Career Pro", price: "Coming soon", features: ["Job tracker", "AI matching", "Interview prep", "LinkedIn tools"], disabled: true },
];

const faqs = [
  { question: "Can I start for free?", answer: "Yes. During launch, every resume template and PDF download is free." },
  { question: "Do templates cost money?", answer: "No. All templates are free for the launch version. Paid plans may return later for advanced features." },
  { question: "Can I create multiple resumes?", answer: "Yes. The frontend supports multiple resume cards now, and backend storage will come in the next phase." },
  { question: "Will Career Pro include AI tools?", answer: "Career Pro is reserved for advanced AI tools such as job matching, writing help, and interview preparation." },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader
        eyebrow="Pricing"
        title="Launch offer: all templates are free"
        description="Use any resume template, switch designs, and download PDF resumes without payment during MVP launch."
        actions={<AppButton href="/builder/guest">Start Building</AppButton>}
      />
      <main className="bg-slate-50">
        <section className="border-b border-blue-100 bg-blue-50">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <p className="text-sm font-bold text-blue-950">Payments are disabled for launch. Coupon and payment backend code is retained for future re-enable.</p>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {plans.map((plan) => (
            <article key={plan.name} className={`rounded-lg border bg-white p-6 shadow-sm ${plan.featured ? "border-blue-600 ring-4 ring-blue-100" : "border-slate-200"}`}>
              <h2 className="text-xl font-bold text-slate-950">{plan.name}</h2>
              <p className="mt-4 text-2xl font-bold text-slate-950">{plan.price}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-slate-600">
                    <Check size={16} className="mt-0.5 shrink-0 text-green-700" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {plan.href ? <AppButton href={plan.href} variant={plan.featured ? "primary" : "secondary"}>Start Free</AppButton> : <AppButton disabled variant="secondary">Coming Soon</AppButton>}
              </div>
            </article>
          ))}
        </section>
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-950">
                <tr>{["Feature", "Free", "Premium", "Lifetime", "Career Pro"].map((item) => <th key={item} className="p-4 font-bold">{item}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {[
                  ["Resume builder", "Yes", "Yes", "Yes", "Yes"],
                  ["All templates", "Yes", "Yes", "Yes", "Yes"],
                  ["PDF download", "Yes", "Yes", "Yes", "Yes"],
                  ["AI tools", "Basic", "Basic", "Basic", "Advanced"],
                  ["Job tracker", "No", "No", "No", "Yes"],
                ].map((row) => (
                  <tr key={row[0]}>{row.map((cell) => <td key={cell} className="p-4">{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8">
          <div><h2 className="text-3xl font-bold text-slate-950">Pricing FAQ</h2><p className="mt-3 text-slate-600">Quick answers for the launch version.</p></div>
          <FAQAccordion items={faqs} />
        </section>
        <section className="bg-blue-900 px-4 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">Build your better resume today</h2>
          <p className="mt-3 text-blue-50">All templates and PDF downloads are free during launch.</p>
          <div className="mt-6"><AppButton href="/builder/guest" variant="secondary">Create Resume Now</AppButton></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
