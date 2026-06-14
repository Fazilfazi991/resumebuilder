import Link from "next/link";
import { AuthCard, AuthField } from "@/components/auth/AuthCard";
import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage resumes, templates, and downloads."
      error={params.error}
      message={params.message}
      footer={<>New to ResumeCraft? <Link href="/signup" className="font-bold text-teal-700">Create an account</Link></>}
    >
      <form action={login} className="space-y-4">
        <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
        <AuthField label="Email" name="email" type="email" autoComplete="email" />
        <AuthField label="Password" name="password" type="password" autoComplete="current-password" />
        <button className="h-11 w-full rounded-lg bg-teal-700 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800">Sign In</button>
      </form>
    </AuthCard>
  );
}
