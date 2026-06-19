import { AppButton } from "@/components/app/AppButton";
import { AppHeader } from "@/components/app/AppHeader";
import { CouponCheckoutBox } from "@/components/payments/CouponCheckoutBox";
import { CurrencySelector } from "@/components/payments/CurrencySelector";
import { ReferralUnlockCard } from "@/components/account/ReferralUnlockCard";
import { CreditCard, Download, Settings, ShieldCheck, UserRound } from "lucide-react";
import { logout, updateProfile } from "@/app/(auth)/actions";
import { requireUser } from "@/lib/auth/require-user";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const { user, profile } = await requireUser("/account");
  const fullName = profile?.full_name || user.user_metadata?.full_name || "";
  const email = profile?.email || user.email || "";
  const plan = profile?.plan ?? "free";

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-blue-700">Account</p>
            <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-950">Profile, plan, and rewards</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Manage your profile, billing, downloads, and referral rewards from one clean workspace.</p>
              </div>
              <form action={logout}>
                <button className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100">Sign Out</button>
              </form>
            </div>
            {params.message ? <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{params.message}</p> : null}
            {params.error ? <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{params.error}</p> : null}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <AccountPanel icon={UserRound} title="Profile">
              <form action={updateProfile} className="grid gap-4">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Full name</span>
                  <input name="fullName" defaultValue={fullName} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600" />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Email</span>
                  <input value={email} readOnly className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500" />
                </label>
                <div className="flex flex-wrap gap-2">
                  <AppButton type="submit" variant="secondary">Save Profile</AppButton>
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-sm font-bold text-emerald-700"><ShieldCheck size={16} />Verified</span>
                </div>
              </form>
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Account created {formatDate(profile?.created_at ?? user.created_at)}</div>
            </AccountPanel>
            <AccountPanel icon={CreditCard} title="Plan">
              <p className="text-2xl font-bold capitalize text-slate-950">{plan}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Upgrade for premium templates, AI tools, and watermark-free PDF exports.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CurrencySelector compact />
                <CouponCheckoutBox planId="premium">Upgrade to Premium</CouponCheckoutBox>
              </div>
            </AccountPanel>
          </div>

          <div className="mt-6">
            <ReferralUnlockCard />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <AccountPanel icon={Download} title="Download history">
              <p className="text-sm leading-6 text-slate-600">Your exported PDFs and invoices will appear here after downloads are saved to your account.</p>
            </AccountPanel>
            <AccountPanel icon={Settings} title="Settings">
              <p className="text-sm leading-6 text-slate-600">Notification, privacy, and account preferences are managed in settings.</p>
            </AccountPanel>
          </div>
        </section>
      </main>
    </>
  );
}

function AccountPanel({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <Icon size={21} aria-hidden="true" />
      </div>
      <h2 className="mb-4 text-xl font-bold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}
