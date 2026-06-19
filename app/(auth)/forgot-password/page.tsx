import Link from "next/link";
import { AuthCard, AuthField } from "@/components/auth/AuthCard";
import { forgotPassword } from "../actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we will send a secure reset link."
      error={params.error}
      message={params.message}
      footer={<><Link href="/login" className="font-bold text-blue-700">Back to login</Link></>}
    >
      <form action={forgotPassword} className="space-y-4">
        <AuthField label="Email" name="email" type="email" autoComplete="email" />
        <button className="h-11 w-full rounded-lg bg-blue-700 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900">Send Reset Link</button>
      </form>
    </AuthCard>
  );
}
