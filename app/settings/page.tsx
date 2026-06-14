import { AppButton } from "@/components/app/AppButton";
import { PortalShell } from "@/components/app/PortalShell";

export default function SettingsPage() {
  return (
    <PortalShell>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-teal-700">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Account settings</h1>
        <div className="mt-8 space-y-5">
          <Panel title="Profile settings">
            <div className="grid gap-4 md:grid-cols-2"><Field label="Full name" value="Sophia Bennett" /><Field label="Email" value="sophia.bennett@email.com" /></div>
            <div className="mt-5"><AppButton>Save Changes</AppButton></div>
          </Panel>
          <Panel title="Password">
            <p className="text-sm text-slate-600">Password update UI placeholder. Auth will be added with Supabase later.</p>
          </Panel>
          <Panel title="Notification preferences">
            {["Product updates", "Resume tips", "Billing emails"].map((item) => (
              <label key={item} className="mt-3 flex items-center gap-3 text-sm font-semibold text-slate-700"><input type="checkbox" defaultChecked />{item}</label>
            ))}
          </Panel>
          <Panel title="Data export">
            <p className="text-sm text-slate-600">Export all resume data placeholder for the backend phase.</p>
          </Panel>
          <section className="rounded-lg border border-rose-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-rose-700">Delete account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Danger zone placeholder. Real deletion needs auth and database safeguards.</p>
            <div className="mt-5"><AppButton variant="danger">Delete Account</AppButton></div>
          </section>
        </div>
      </section>
    </PortalShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-4 text-xl font-bold text-slate-950">{title}</h2>{children}</section>;
}

function Field({ label, value }: { label: string; value: string }) {
  return <label className="block"><span className="text-sm font-bold text-slate-700">{label}</span><input defaultValue={value} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-teal-400" /></label>;
}
