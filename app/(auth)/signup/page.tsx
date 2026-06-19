import Link from "next/link";
import { AuthCard, AuthField } from "@/components/auth/AuthCard";
import { resendConfirmation, signup } from "../actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; redirect?: string }>;
}) {
  const params = await searchParams;
  const authReady = isSupabaseConfigured();

  return (
    <AuthCard
      title="Create your account"
      description="Save resumes, switch templates, and keep every application organized."
      error={params.error ?? (!authReady ? "Account creation is temporarily unavailable. Please try again later." : undefined)}
      footer={<>Already have an account? <Link href="/login" className="font-bold text-blue-700">Sign in</Link></>}
    >
      {params.error ? (
        <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
          <p className="font-bold text-slate-950">No account needed to keep editing.</p>
          <Link href="/builder/guest" className="mt-2 inline-flex min-h-10 items-center rounded-lg bg-blue-700 px-3 text-sm font-bold text-white">
            Continue as guest
          </Link>
        </div>
      ) : null}
      <form action={signup} className="space-y-4">
        <input type="hidden" name="next" value={params.next ?? params.redirect ?? "/dashboard"} />
        <AuthField label="Full name" name="fullName" autoComplete="name" />
        <AuthField label="Email" name="email" type="email" autoComplete="email" />
        <AuthField label="Password" name="password" type="password" autoComplete="new-password" />
        <AuthField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" />
        <div className="grid gap-2 rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-900">
          <span>Free to start</span>
          <span>No credit card required</span>
          <span>Save resumes anytime</span>
        </div>
        <button disabled={!authReady} className="h-11 w-full rounded-lg bg-blue-700 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60">Create Account</button>
      </form>
      <form action={resendConfirmation} className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-bold text-slate-950">Already signed up?</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">Resend your confirmation email.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input name="email" type="email" required placeholder="Email address" className="h-11 rounded-lg border border-blue-200 bg-white px-3 text-sm outline-none focus:border-blue-600" />
          <button disabled={!authReady} className="min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white disabled:opacity-60">Resend</button>
        </div>
      </form>
    </AuthCard>
  );
}
