import { AppHeader } from "@/components/app/AppHeader";
import { TemplatesClient } from "@/components/templates/TemplatesClient";

export default function TemplatesPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-teal-700">Templates</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Choose a resume template</h1>
            <p className="mt-3 text-slate-600">Start with one profile, then switch between ATS, modern, UAE, and premium designs anytime.</p>
          </div>
          <TemplatesClient />
        </section>
      </main>
    </>
  );
}
