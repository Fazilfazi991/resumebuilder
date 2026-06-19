import Link from "next/link";
import { AuthCard, AuthField } from "@/components/auth/AuthCard";
import { resetPassword } from "../actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCard
      title="Choose a new password"
      description="Set a fresh password for your Resumi account."
      error={params.error}
      message={params.message}
      footer={<>Remembered it? <Link href="/login" className="font-bold text-blue-700">Sign in</Link></>}
    >
      <form action={resetPassword} className="space-y-4">
        <AuthField label="New password" name="password" type="password" autoComplete="new-password" />
        <AuthField label="Confirm new password" name="confirmPassword" type="password" autoComplete="new-password" />
        <button className="h-11 w-full rounded-lg bg-blue-700 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900">Update Password</button>
      </form>
    </AuthCard>
  );
}
