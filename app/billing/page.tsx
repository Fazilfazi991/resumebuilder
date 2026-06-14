import { AppButton } from "@/components/app/AppButton";
import { FAQAccordion } from "@/components/app/FAQAccordion";
import { PortalShell } from "@/components/app/PortalShell";
import { Check, CreditCard, Receipt } from "lucide-react";

const plans = ["Free", "Premium", "Lifetime"];

export default function BillingPage() {
  return (
    <PortalShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-teal-700">Billing</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Plans and billing</h1>
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-lg border border-teal-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><CreditCard size={21} /></div>
            <h2 className="text-xl font-bold text-slate-950">Current plan: Free</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Upgrade later for premium templates, AI tools, and watermark-free PDF exports.</p>
            <div className="mt-5"><AppButton>Upgrade Plan</AppButton></div>
          </section>
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-950">{plan}</h3>
                <p className="mt-2 text-sm text-slate-600">{plan === "Free" ? "$0" : plan === "Premium" ? "AED 19" : "AED 49"}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {["Templates", "Builder access", "Future PDF export"].map((item) => <li key={item} className="flex gap-2"><Check size={15} className="text-teal-700" />{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Placeholder icon={CreditCard} title="Payment method" copy="Payment methods will appear here after payment integration." />
          <Placeholder icon={Receipt} title="Invoice history" copy="Invoices and payment history placeholder for the backend phase." />
        </div>
        <div className="mt-8"><FAQAccordion items={[{ question: "Are payments active?", answer: "No. This page is UI-only until Stripe, Razorpay, or another provider is connected." }, { question: "Can I upgrade now?", answer: "Upgrade buttons are placeholders for the future payment flow." }]} /></div>
      </section>
    </PortalShell>
  );
}

function Placeholder({ icon: Icon, title, copy }: { icon: typeof CreditCard; title: string; copy: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Icon size={21} /></div>
      <h2 className="font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
    </section>
  );
}
