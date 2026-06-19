"use client";

import Link from "next/link";

export function BuilderLoadError() {
  const restoreLocalDraft = () => {
    const match = window.location.pathname.match(/\/builder\/([^/?#]+)/);
    const resumeId = match?.[1];
    if (!resumeId) {
      window.location.href = "/dashboard";
      return;
    }

    const raw = window.localStorage.getItem(`resumi_builder_draft_${resumeId}`);
    if (raw) {
      window.localStorage.setItem("resumi_builder_draft_guest", raw);
      window.location.href = "/builder/guest";
      return;
    }

    window.location.reload();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-slate-950">We couldn't load this resume.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Connection issue. Your latest edits may still be saved on this device.</p>
        <div className="mt-6 grid gap-3">
          <button onClick={() => window.location.reload()} className="min-h-11 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white">Retry</button>
          <button onClick={restoreLocalDraft} className="min-h-11 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700">Restore local draft</button>
          <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700">Go to Dashboard</Link>
        </div>
      </section>
    </main>
  );
}
