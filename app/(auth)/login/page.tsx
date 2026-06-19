import Link from "next/link";
import { AuthCard, AuthField } from "@/components/auth/AuthCard";
import { login } from "../actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string; redirect?: string }>;
}) {
  const params = await searchParams;
  const authReady = isSupabaseConfigured();

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
    </AuthCard>
  );
}
