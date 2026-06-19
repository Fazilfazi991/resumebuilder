"use client";

import { AppButton } from "@/components/app/AppButton";
import type { ResumeData } from "@/types/resume";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveGuestResume } from "@/app/onboarding/actions";

type GuestPayload = {
  title: string;
  templateId: string;
  resumeData: ResumeData;
  sectionOrder: string[];
};

export function GuestResumePrompt() {
  const router = useRouter();
  const [guestResume, setGuestResume] = useState<GuestPayload | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem("resumi_guest_resume");
    if (!raw) return;
    try {
      setGuestResume(JSON.parse(raw) as GuestPayload);
    } catch {
      window.localStorage.removeItem("resumi_guest_resume");
    }
  }, []);

  const discard = () => {
    window.localStorage.removeItem("resumi_guest_resume");
    setGuestResume(null);
  };

  const save = async () => {
    if (!guestResume) return;
    setIsSaving(true);
    setError("");
    try {
      const resumeId = await saveGuestResume(guestResume);
      window.localStorage.removeItem("resumi_guest_resume");
      router.push(`/builder/${resumeId}`);
    } catch {
      setError("We could not save the guest resume. Please try again.");
      setIsSaving(false);
    }
  };

  if (!guestResume) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">You are all set</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Your account is ready. Create a new resume or open your dashboard.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <AppButton href="/builder/new">Create Resume</AppButton>
          <AppButton href="/dashboard" variant="secondary">Go to Dashboard</AppButton>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-blue-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-blue-700">Guest draft found</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">Save your current resume to your account?</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">We found “{guestResume.title || "Untitled Resume"}” from your guest session.</p>
      {error ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <AppButton onClick={save} disabled={isSaving}>{isSaving ? "Saving..." : "Save to my account"}</AppButton>
        <AppButton onClick={discard} variant="secondary">Discard</AppButton>
        <AppButton href="/dashboard" variant="secondary">Later</AppButton>
      </div>
    </section>
  );
}
