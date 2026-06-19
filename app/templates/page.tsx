import { AppHeader } from "@/components/app/AppHeader";
import { TemplatesClient } from "@/components/templates/TemplatesClient";
import { createResumeAndRedirect } from "@/lib/resume/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function TemplatesPage() {
  let isLoggedIn = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    isLoggedIn = Boolean(data.user);
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-blue-700">Templates</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Choose a resume template</h1>
            <p className="mt-3 text-slate-600">Start with one profile, then switch between ATS, modern, UAE, and premium designs anytime.</p>
          </div>
          <TemplatesClient createAction={isLoggedIn ? createResumeAndRedirect : undefined} />
        </section>
      </main>
    </>
  );
}
