import { AppHeader } from "@/components/app/AppHeader";
import { GuestResumePrompt } from "@/components/auth/GuestResumePrompt";
import { requireUser } from "@/lib/auth/require-user";

export default async function OnboardingPage() {
  await requireUser("/onboarding");

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-teal-700">Welcome to ResumeCraft</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Finish setting up your workspace</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Save a guest resume if you created one, or jump straight into your account.</p>
          <div className="mt-6">
            <GuestResumePrompt />
          </div>
        </section>
      </main>
    </>
  );
}
