import { AppButton } from "@/components/app/AppButton";
import { SubmitButton } from "@/components/app/SubmitButton";
import { requireUser } from "@/lib/auth/require-user";
import { createResumeAndRedirect } from "@/lib/resume/server";
import { FileText, Plus } from "lucide-react";

export default async function NewResumePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  await requireUser("/builder/new");
  const params = await searchParams;
  const templateId = params.template ?? "modern-minimal";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-200/70">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <FileText size={22} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">Create a new resume</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Start with an empty resume and fill in only your real details.</p>
        <form action={createResumeAndRedirect} className="mt-6">
          <input type="hidden" name="templateId" value={templateId} />
          <SubmitButton className="w-full" pendingText="Creating resume...">
            <Plus size={17} aria-hidden="true" />
            Create Resume
          </SubmitButton>
        </form>
        <div className="mt-3">
          <AppButton href="/dashboard" variant="secondary">Back to Dashboard</AppButton>
        </div>
      </section>
    </main>
  );
}
