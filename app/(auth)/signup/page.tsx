import Link from "next/link";
import { AuthCard, AuthField } from "@/components/auth/AuthCard";
import { signup } from "../actions";
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
    </AuthCard>
  );
}
