import { AppButton } from "@/components/app/AppButton";
import { FAQAccordion } from "@/components/app/FAQAccordion";
import { PortalShell } from "@/components/app/PortalShell";
import { requireUser } from "@/lib/auth/require-user";
import { Check, CreditCard } from "lucide-react";

const plans = [
  { name: "Launch Free", price: "Free now" },
];

export default async function BillingPage() {
  await requireUser("/billing");

  return (
    <PortalShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-700">Billing</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Plans and billing</h1>
            <p className="mt-2 text-sm text-slate-600">Payments are disabled during launch. All templates and PDF downloads are free.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-lg border border-blue-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><CreditCard size={21} /></div>
            <h2 className="text-xl font-bold text-slate-950">Launch mode active</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">No payment is needed to use templates, switch designs, or download PDFs.</p>
            <div className="mt-5"><AppButton href="/builder/guest">Build Resume</AppButton></div>
          </section>
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-950">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{plan.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {["Templates", "Builder access", "PDF export"].map((item) => <li key={item} className="flex gap-2"><Check size={15} className="text-green-700" />{item}</li>)}
                </ul>
                <div className="mt-5">
                  <AppButton href="/builder/guest" variant="secondary">Start Free</AppButton>
                </div>
              </article>
            ))}
          </div>
        </div>
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-950">No billing details required</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Resumi is not accepting payments during launch, so there is no payment method or invoice history to manage.</p>
        </section>
        <div className="mt-8"><FAQAccordion items={[{ question: "Are payments active?", answer: "No. Payments are disabled during launch." }, { question: "Can I download without upgrading?", answer: "Yes. All resume templates and PDF downloads are free during launch." }]} /></div>
      </section>
    </PortalShell>
  );
}
