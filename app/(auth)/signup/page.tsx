import Link from "next/link";
import { AuthCard, AuthField } from "@/components/auth/AuthCard";
import { signup } from "../actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCard
      title="Create your account"
      description="Save resumes, switch templates, and keep every application organized."
      error={params.error}
      footer={<>Already have an account? <Link href="/login" className="font-bold text-teal-700">Sign in</Link></>}
    >
      <form action={signup} className="space-y-4">
        <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
        <AuthField label="Full name" name="fullName" autoComplete="name" />
        <AuthField label="Email" name="email" type="email" autoComplete="email" />
        <AuthField label="Password" name="password" type="password" autoComplete="new-password" />
        <button className="h-11 w-full rounded-lg bg-teal-700 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800">Create Account</button>
      </form>
    </AuthCard>
  );
}
