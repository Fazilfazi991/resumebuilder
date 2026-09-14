import { pageMetadata } from "@/lib/page-metadata";
import { PublicPageHeader } from "@/components/app/PublicPageHeader";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export const metadata = pageMetadata("Terms of Use", "Terms for using the free-launch Resumi resume builder and related tools.", "/terms");

const sections = [
  ["Using Resumi", "Resumi provides tools for creating, editing, previewing, and downloading resumes and cover-letter drafts. You are responsible for reviewing your documents before using them in an application."],
  ["Free launch", "The guest resume builder, current launch templates, and PDF downloads are available without payment during the current free launch. Resumi does not currently sell a subscription or paid plan, and these Terms do not promise that every feature will remain free forever."],
  ["Accounts", "You may use supported features as a guest or create an account with email and password or Google Sign-In. Keep access to your account secure and provide accurate account information."],
  ["Your content", "You keep ownership of the resume, cover-letter, and profile content you provide. You give Resumi permission to store and process that content only as needed to operate, secure, support, and improve the service."],
  ["Acceptable use", "Do not misuse Resumi, attempt to access another person's data, interfere with the service, upload harmful material, or use the product in violation of applicable law or another person's rights."],
  ["Accuracy and availability", "Templates, ATS guidance, writing prompts, and generated drafts are tools, not a guarantee of interviews, employment, ATS results, or error-free documents. The service may occasionally be unavailable or change as the product develops."],
  ["Privacy", "The Privacy Policy explains what information Resumi handles, why it is used, and how to request access or deletion."],
  ["Changes and contact", "These Terms may be updated when the product changes. Material updates will be reflected on this page. Questions or account-data requests can be submitted through the Contact page."],
] as const;

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <PublicPageHeader eyebrow="Legal" title="Terms of Use" description="The rules and expectations for using Resumi during its free launch." />
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
