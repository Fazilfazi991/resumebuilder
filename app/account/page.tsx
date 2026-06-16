import { AppButton } from "@/components/app/AppButton";
import { AppHeader } from "@/components/app/AppHeader";
import { CheckoutButton } from "@/components/payments/CheckoutButton";
import { ReferralUnlockCard } from "@/components/account/ReferralUnlockCard";
import { CreditCard, Download, Settings, ShieldCheck, UserRound } from "lucide-react";
import { logout } from "@/app/(auth)/actions";

export default function AccountPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-teal-700">Account</p>
            <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-950">Profile, plan, and rewards</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Manage your profile, billing, downloads, and referral rewards from one clean workspace.</p>
              </div>
              <form action={logout}>
                <button className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100">Sign Out</button>
              </form>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <AccountPanel icon={UserRound} title="Profile">
              <p className="font-bold text-slate-950">Sophia Bennett</p>
              <p className="mt-1 text-sm text-slate-500">sophia.bennett@email.com</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <AppButton variant="secondary">Edit Profile</AppButton>
                <span className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-sm font-bold text-emerald-700"><ShieldCheck size={16} />Verified</span>
              </div>
            </AccountPanel>
            <AccountPanel icon={CreditCard} title="Plan">
              <p className="text-2xl font-bold text-slate-950">Free</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Upgrade for premium templates, AI tools, and watermark-free PDF exports.</p>
              <div className="mt-5"><CheckoutButton planId="premium">Upgrade to Premium</CheckoutButton></div>
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
              <p className="text-sm leading-6 text-slate-600">Notification, privacy, and account preferences are ready for the next backend pass.</p>
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
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
        <Icon size={21} aria-hidden="true" />
      </div>
      <h2 className="mb-4 text-xl font-bold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}
