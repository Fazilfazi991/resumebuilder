import { AppHeader } from "@/components/app/AppHeader";
import { StatCard } from "@/components/app/StatCard";
import { isAdminEmail } from "@/lib/auth/admin-access";
import { requireUser } from "@/lib/auth/require-user";
import type { Database } from "@/types/database";
import type { ResumeData } from "@/types/resume";
import { Activity, BarChart3, CreditCard, Download, FileText, Mail, Phone, ShieldCheck, TrendingUp, UsersRound, WalletCards } from "lucide-react";
import { redirect } from "next/navigation";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Resume = Database["public"]["Tables"]["resumes"]["Row"];
type DownloadRow = Database["public"]["Tables"]["downloads"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];

export default async function AdminDashboardPage() {
  const { supabase, user, profile } = await requireUser("/admin");
  const allowedByEmail = isAdminEmail(user.email ?? profile?.email);

  if (profile?.plan !== "admin" && !allowedByEmail) {
    redirect("/dashboard");
  }

  if (profile?.plan !== "admin" && allowedByEmail) {
    await supabase.from("profiles").update({ plan: "admin" }).eq("user_id", user.id);
  }

  const [profilesResult, resumesResult, downloadsResult, paymentsResult] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("resumes").select("*").order("updated_at", { ascending: false }).limit(500),
    supabase.from("downloads").select("*").order("downloaded_at", { ascending: false }).limit(500),
    supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(500),
  ]);

  const profiles = profilesResult.data ?? [];
  const resumes = resumesResult.data ?? [];
  const downloads = downloadsResult.data ?? [];
  const payments = paymentsResult.data ?? [];
  const profileByUserId = new Map(profiles.map((item) => [item.user_id, item]));
  const paidPayments = payments.filter((item) => item.status.toLowerCase() === "paid" || item.status.toLowerCase() === "succeeded" || item.status.toLowerCase() === "complete");
  const totalRevenue = paidPayments.reduce((total, item) => total + Number(item.amount ?? 0), 0);
  const premiumUsers = profiles.filter((item) => item.plan === "premium" || item.plan === "lifetime").length;
  const adminUsers = profiles.filter((item) => item.plan === "admin").length;
  const today = startOfDay(new Date());
  const usersToday = profiles.filter((item) => new Date(item.created_at) >= today).length;
  const resumesToday = resumes.filter((item) => new Date(item.created_at) >= today).length;
  const downloadsToday = downloads.filter((item) => new Date(item.downloaded_at) >= today).length;
  const paymentsToday = payments.filter((item) => new Date(item.created_at) >= today).length;
  const resumesWithEmail = resumes.filter((item) => Boolean(item.resume_data.personal.email?.trim())).length;
  const resumesWithPhone = resumes.filter((item) => Boolean(item.resume_data.personal.phone?.trim())).length;
  const resumesWithLinks = resumes.filter((item) => Boolean(item.resume_data.personal.linkedin?.trim() || item.resume_data.personal.portfolio?.trim() || item.resume_data.personal.website?.trim())).length;
  const averageResumesPerUser = profiles.length ? (resumes.length / profiles.length).toFixed(1) : "0";
  const planCounts = countBy(profiles, (item) => item.plan);
  const templateCounts = countBy(resumes, (item) => item.template_id);
  const latestResumes = resumes.slice(0, 12);
  const latestUsers = profiles.slice(0, 10);
  const latestPayments = payments.slice(0, 8);
  const latestDownloads = downloads.slice(0, 8);
  const recentActivity = [
    ...profiles.slice(0, 6).map((item) => ({ id: `user-${item.id}`, type: "User joined", title: item.email || item.full_name || "New user", date: item.created_at })),
    ...resumes.slice(0, 6).map((item) => ({ id: `resume-${item.id}`, type: "Resume updated", title: item.title, date: item.updated_at })),
    ...downloads.slice(0, 6).map((item) => ({ id: `download-${item.id}`, type: "PDF downloaded", title: item.template_id, date: item.downloaded_at })),
    ...payments.slice(0, 6).map((item) => ({ id: `payment-${item.id}`, type: "Payment", title: `${item.plan} ${item.status}`, date: item.created_at })),
  ].sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()).slice(0, 12);

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-700">Admin</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">Resumi admin dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Monitor users, resumes, downloads, payments, and the contact details users add inside their resumes.</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
              Admin access: {profile?.email || profile?.full_name || user.email || "current user"}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={UsersRound} label="Users" value={String(profiles.length)} helper={`${usersToday} joined today, ${adminUsers} owners/admins`} />
            <StatCard icon={FileText} label="Resumes" value={String(resumes.length)} helper={`${resumesToday} created today, ${averageResumesPerUser} per user`} />
            <StatCard icon={Download} label="Downloads" value={String(downloads.length)} helper={`${downloadsToday} downloads today`} />
            <StatCard icon={WalletCards} label="Payments" value={formatMoney(totalRevenue, payments[0]?.currency)} helper={`${payments.length} records, ${paymentsToday} today`} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={TrendingUp} label="Paid users" value={String(premiumUsers)} helper={`${planCounts.premium ?? 0} premium, ${planCounts.lifetime ?? 0} lifetime`} />
            <StatCard icon={Mail} label="Resume emails" value={String(resumesWithEmail)} helper={`${percent(resumesWithEmail, resumes.length)} of resumes`} />
            <StatCard icon={Phone} label="Resume phones" value={String(resumesWithPhone)} helper={`${percent(resumesWithPhone, resumes.length)} of resumes`} />
            <StatCard icon={BarChart3} label="Resume links" value={String(resumesWithLinks)} helper={`${percent(resumesWithLinks, resumes.length)} added LinkedIn/portfolio/site`} />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Resume contact details</h2>
                  <p className="mt-1 text-sm text-slate-500">Latest resumes with user-entered contact information.</p>
                </div>
                <ShieldCheck className="text-blue-700" size={22} aria-hidden="true" />
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
                    <tr>
                      {["Resume", "Owner", "Contact", "Location", "Template", "Updated"].map((header) => <th key={header} className="px-3 py-3 font-bold">{header}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {latestResumes.map((resume) => {
                      const owner = profileByUserId.get(resume.user_id);
                      const personal = resume.resume_data.personal;
                      return (
                        <tr key={resume.id} className="align-top">
                          <td className="px-3 py-4">
                            <p className="font-bold text-slate-950">{resume.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{personal.fullName || "No resume name"} · {personal.jobTitle || "No title"}</p>
                          </td>
                          <td className="px-3 py-4">
                            <p className="font-semibold text-slate-800">{owner?.full_name || "Unknown user"}</p>
                            <p className="mt-1 text-xs text-slate-500">{owner?.email || "No account email"}</p>
                          </td>
                          <td className="px-3 py-4">
                            <ContactLine icon={Mail} value={personal.email} fallback="No resume email" />
                            <ContactLine icon={Phone} value={personal.phone} fallback="No phone" />
                            <p className="mt-1 text-xs text-slate-500">{[personal.linkedin, personal.portfolio || personal.website].filter(Boolean).join(" | ") || "No links"}</p>
                          </td>
                          <td className="px-3 py-4 text-slate-600">{personal.location || "Not added"}</td>
                          <td className="px-3 py-4">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{resume.template_id}</span>
                          </td>
                          <td className="px-3 py-4 text-slate-500">{formatDate(resume.updated_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">Users and plans</h2>
              <div className="mt-5 space-y-3">
                {latestUsers.map((userProfile) => (
                  <article key={userProfile.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-950">{userProfile.full_name || "Unnamed user"}</p>
                        <p className="mt-1 text-sm text-slate-500">{userProfile.email || "No email"}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${planClassName(userProfile.plan)}`}>{userProfile.plan}</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">Joined {formatDate(userProfile.created_at)}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Activity size={19} /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Live website activity</h2>
                  <p className="mt-1 text-sm text-slate-500">Latest users, resume edits, downloads, and payment events.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {recentActivity.map((item) => (
                  <article key={item.id} className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-700">{item.type}</p>
                    <p className="mt-2 truncate font-bold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.date)}</p>
                  </article>
                ))}
              </div>
            </section>

            <ActivityPanel title="Template usage" icon={BarChart3}>
              {Object.entries(templateCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([templateId, count]) => (
                <ActivityRow key={templateId} title={templateId} meta={`${percent(count, resumes.length)} of resumes`} value={String(count)} />
              ))}
            </ActivityPanel>

            <ActivityPanel title="Plan breakdown" icon={UsersRound}>
              {(["free", "premium", "lifetime", "admin"] as const).map((plan) => (
                <ActivityRow key={plan} title={plan} meta={`${percent(planCounts[plan] ?? 0, profiles.length)} of users`} value={String(planCounts[plan] ?? 0)} />
              ))}
            </ActivityPanel>

            <ActivityPanel title="Recent payments" icon={CreditCard}>
              {latestPayments.length ? latestPayments.map((payment) => {
                const owner = profileByUserId.get(payment.user_id);
                return (
                  <ActivityRow
                    key={payment.id}
                    title={`${payment.plan} · ${payment.status}`}
                    meta={`${owner?.email ?? "Unknown user"} · ${formatDate(payment.created_at)}`}
                    value={formatMoney(Number(payment.amount), payment.currency)}
                  />
                );
              }) : <EmptyAdminState>No payment records yet.</EmptyAdminState>}
            </ActivityPanel>

            <ActivityPanel title="Recent downloads" icon={Download}>
              {latestDownloads.length ? latestDownloads.map((download) => {
                const owner = profileByUserId.get(download.user_id);
                return (
                  <ActivityRow
                    key={download.id}
                    title={download.template_id}
                    meta={`${owner?.email ?? "Unknown user"} · ${formatDate(download.downloaded_at)}`}
                    value="PDF"
                  />
                );
              }) : <EmptyAdminState>No downloads tracked yet.</EmptyAdminState>}
            </ActivityPanel>
          </div>
        </section>
      </main>
    </>
  );
}

function ContactLine({ icon: Icon, value, fallback }: { icon: typeof Mail; value: string; fallback: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-slate-700">
      <Icon size={14} className="text-slate-400" aria-hidden="true" />
      {value || fallback}
    </p>
  );
}

function ActivityPanel({ title, icon: Icon, children }: { title: string; icon: typeof CreditCard; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon size={19} /></div>
        <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      </div>
      <div className="mt-5 divide-y divide-slate-100">{children}</div>
    </section>
  );
}

function ActivityRow({ title, meta, value }: { title: string; meta: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="font-bold text-slate-950">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{meta}</p>
      </div>
      <p className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{value}</p>
    </div>
  );
}

function EmptyAdminState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-500">{children}</p>;
}

function planClassName(plan: Profile["plan"]) {
  if (plan === "admin") return "bg-slate-950 text-white";
  if (plan === "lifetime") return "bg-purple-50 text-purple-700";
  if (plan === "premium") return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-600";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatMoney(amount: number, currency = "AED") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "AED",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function percent(value: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = getKey(item) || "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}
