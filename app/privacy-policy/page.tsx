import { pageMetadata } from "@/lib/page-metadata";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export const metadata = pageMetadata("Privacy Policy", "How Resumi handles account information, Google Sign-In identity data, resume drafts, and contact messages.", "/privacy-policy");

const sections = [
  ["Accounts and sign-in", "If you create an account with email and password, Resumi stores your email, display name, plan status, and account identifier through Supabase. If you choose Google Sign-In, Resumi receives the basic identity information you approve, such as your name, email address, profile image, and Google account identifier."],
  ["Google credentials", "Resumi requests only openid, email, and profile for Google authentication. Resumi does not receive or store your Google password or Google OAuth credentials. Google and Supabase handle the authentication exchange."],
  ["Account and resume data", "Signed-in users can store profile details, resumes, selected templates, section order, and download activity in Supabase so the product can save, restore, and manage their work. Profile photos are stored in private, user-scoped storage and are served through short-lived access links."],
  ["Anonymous resume drafts", "When you use the guest builder, Resumi may save a device-specific session identifier, your resume draft, selected template, completion progress, ATS score, download status, and basic device, browser, referral, and campaign details. If your resume contains a name, email, phone number, location, or links, those details may be included in the server-side draft. Guest photos remain in the local browser draft and are excluded from anonymous server sync."],
  ["Contact messages", "When you submit the Contact form, Resumi stores the name, email address, subject, and message you provide so the team can review and respond to your request."],
  ["Why Resumi uses information", "Resumi uses this information to provide authentication, save and recover work, render resumes, enable downloads, secure access, respond to support requests, diagnose reliability problems, understand product completion, and improve the service."],
  ["Retention and deletion", "Account records and saved resumes are retained while needed to provide the service or until deletion is requested, subject to security, legal, and backup constraints. Anonymous drafts may also be retained for draft recovery and product improvement. To request access or deletion, use the Contact page and provide enough identifying information for Resumi to locate the relevant account or draft."],
  ["Payments", "Payments are disabled during the current free launch. Resumi does not currently collect payment-card details through the product. If paid features are introduced, this policy will be updated before payment processing is enabled."],
  ["Data sharing and protection", "Resumi uses service providers such as Supabase to host authentication, database, and storage functions. Information is not made public by default. Technical controls include row-level access rules for account data and private owner-scoped photo storage, but no online service can promise absolute security."],
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader eyebrow="Privacy" title="Privacy Policy" description="How Resumi handles account information, resume drafts, Google Sign-In, and support messages." />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-6 text-sm font-semibold text-slate-500">Last updated: September 14, 2026</p>
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
