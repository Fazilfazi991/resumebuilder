import Link from "next/link";
import { AuthCard, AuthField } from "@/components/auth/AuthCard";
import { login, resendConfirmation } from "../actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string; redirect?: string }>;
}) {
  const params = await searchParams;
  const authReady = isSupabaseConfigured();
  const showResend = params.error?.toLowerCase().includes("confirm");

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage resumes, templates, and downloads."
      error={params.error ?? (!authReady ? "Account access is temporarily unavailable. Please try again later." : undefined)}
      message={params.message}
      footer={<>New to ResumeCraft? <Link href="/signup" className="font-bold text-blue-700">Create an account</Link></>}
    >
      <form action={login} className="space-y-4">
        <input type="hidden" name="next" value={params.next ?? params.redirect ?? "/dashboard"} />
        <AuthField label="Email" name="email" type="email" autoComplete="email" />
        <AuthField label="Password" name="password" type="password" autoComplete="current-password" />
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm font-bold text-blue-700">Forgot password?</Link>
        </div>
        <button disabled={!authReady} className="h-11 w-full rounded-lg bg-blue-700 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60">Sign In</button>
        <button type="button" disabled className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400">Google login coming soon</button>
      </form>
      {showResend || params.message ? (
        <form action={resendConfirmation} className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-bold text-slate-950">Need a new confirmation email?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input name="email" type="email" required placeholder="Email address" className="h-11 rounded-lg border border-blue-200 bg-white px-3 text-sm outline-none focus:border-blue-600" />
            <button disabled={!authReady} className="min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white disabled:opacity-60">Resend</button>
          </div>
        </form>
      ) : null}
    </AuthCard>
  );
}
