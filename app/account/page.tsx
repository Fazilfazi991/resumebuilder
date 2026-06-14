import { AppButton } from "@/components/app/AppButton";
import { AppHeader } from "@/components/app/AppHeader";
import { CreditCard, Download, Settings, UserRound } from "lucide-react";
import { logout } from "@/app/(auth)/actions";

export default function AccountPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-teal-700">Account</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Profile and billing</h1>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <AccountPanel icon={UserRound} title="Profile">
              <p className="font-bold text-slate-950">Sophia Bennett</p>
              <p className="mt-1 text-sm text-slate-500">sophia.bennett@email.com</p>
              <div className="mt-5"><AppButton variant="secondary">Edit Profile</AppButton></div>
            </AccountPanel>
            <AccountPanel icon={CreditCard} title="Plan">
              <p className="text-2xl font-bold text-slate-950">Free</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Upgrade for premium templates, AI tools, and watermark-free PDF exports.</p>
              <div className="mt-5"><AppButton>Upgrade to Premium</AppButton></div>
            </AccountPanel>
            <AccountPanel icon={Download} title="Download history">
              <p className="text-sm text-slate-600">PDF downloads will appear here after export is connected.</p>
            </AccountPanel>
            <AccountPanel icon={Settings} title="Settings">
              <p className="text-sm text-slate-600">Notification, privacy, and account settings placeholder for the next backend phase.</p>
            </AccountPanel>
          </div>
          <form action={logout} className="mt-6 flex justify-end">
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100">Sign Out</button>
          </form>
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
