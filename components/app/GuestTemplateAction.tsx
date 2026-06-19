"use client";

import { useState } from "react";
import { AppButton } from "./AppButton";

type GuestTemplateActionProps = {
  templateId: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
};

const guestDraftKeys = ["resumi_builder_draft_guest", "resumi_guest_resume"];

export function GuestTemplateAction({ templateId, children = "Use Template", variant = "primary" }: GuestTemplateActionProps) {
  const [showDraftChoice, setShowDraftChoice] = useState(false);

  const builderHref = `/builder/guest?template=${encodeURIComponent(templateId)}`;

  const handleTemplateClick = () => {
    const existingDraft = readGuestDraft();
    if (existingDraft && hasResumeContent(existingDraft.resumeData)) {
      setShowDraftChoice(true);
      return;
    }

    if (existingDraft) {
      writeGuestDraft({
        ...existingDraft,
        templateId,
        updatedAt: new Date().toISOString(),
      });
    }

    window.location.href = builderHref;
  };

  const applyToCurrentDraft = () => {
    const existingDraft = readGuestDraft();
    if (existingDraft) {
      const nextDraft = {
        ...existingDraft,
        templateId,
        updatedAt: new Date().toISOString(),
      };
      writeGuestDraft(nextDraft);
    }
    window.location.href = builderHref;
  };

  const startNewResume = () => {
    guestDraftKeys.forEach((key) => window.localStorage.removeItem(key));
    window.location.href = builderHref;
  };

  return (
    <>
      <AppButton variant={variant} onClick={handleTemplateClick}>{children}</AppButton>
      {showDraftChoice ? (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/55 p-3 sm:items-center">
          <section className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-950">Use this template?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              You already have resume details filled in. Apply this template to your current draft, or start a new resume and clear the draft.
            </p>
            <div className="mt-5 grid gap-2">
              <AppButton onClick={applyToCurrentDraft}>Apply to current draft</AppButton>
              <AppButton variant="secondary" onClick={startNewResume}>Start new resume</AppButton>
              <AppButton variant="ghost" onClick={() => setShowDraftChoice(false)}>Cancel</AppButton>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function readGuestDraft(): Record<string, any> | null {
  for (const key of guestDraftKeys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as Record<string, any>;
      if (parsed && typeof parsed === "object" && parsed.resumeData) {
        return parsed;
      }
    } catch {
      window.localStorage.removeItem(key);
    }
  }

  return null;
}

function writeGuestDraft(draft: Record<string, any>) {
  guestDraftKeys.forEach((key) => window.localStorage.setItem(key, JSON.stringify(draft)));
}

function hasResumeContent(value: unknown): boolean {
  return countTextValues(value) >= 2;
}

function countTextValues(value: unknown): number {
  if (typeof value === "string") return value.trim() ? 1 : 0;
  if (Array.isArray(value)) return value.reduce((total, item) => total + countTextValues(item), 0);
  if (value && typeof value === "object") return Object.values(value).reduce((total, item) => total + countTextValues(item), 0);
  return 0;
}
