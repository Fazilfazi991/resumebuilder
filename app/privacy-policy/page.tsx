import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

const sections = [
  ["Anonymous resume drafts", "When you use the guest builder, Resumi may save your resume draft, selected template, progress, ATS score, and basic device/referrer details so you can continue editing and so we can improve the product."],
  ["Contact details", "If you add your name, email, phone, links, or location inside your resume, that information may be stored as part of your resume draft. We do not ask for extra personal data in the launch builder."],
  ["How we use data", "We use resume draft data to provide the builder, recover drafts, understand completion/download activity, improve templates, and support users who contact us."],
  ["Access and deletion", "Anonymous drafts are not public. You can request deletion by contacting us through the contact page with the email or phone used in your resume draft."],
  ["Accounts and payments", "Login, account, coupon, and payment systems may exist in the product, but they are not required for the free launch resume builder flow."],
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        description="How Resumi handles resume drafts and launch builder data."
      />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {sections.map(([title, copy]) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
