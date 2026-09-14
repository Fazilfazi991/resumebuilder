"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ResumeData } from "@/types/resume";

type AnonymousResumeInput = {
  sessionId: string;
  resumeData: ResumeData;
  templateId: string;
  progress: number;
  atsScore: number;
  status?: "draft" | "previewed" | "downloaded";
  downloaded?: boolean;
  source?: string;
};

export async function syncAnonymousResume(input: AnonymousResumeInput) {
  if (!input.sessionId) {
    return { ok: false, message: "Missing anonymous session." };
  }

  try {
    const requestHeaders = await headers();
    const personal = input.resumeData.personal;
    const urlReferrer = requestHeaders.get("referer");
    const now = new Date().toISOString();
    const userAgent = requestHeaders.get("user-agent");

    const supabase = createAdminClient();
    const payload = {
      session_id: input.sessionId,
      resume_data: { ...input.resumeData, personal: { ...personal, photoUrl: "" } },
      template_id: input.templateId,
      progress: Math.max(0, Math.min(100, Math.round(input.progress))),
      ats_score: Math.max(0, Math.min(100, Math.round(input.atsScore))),
      source: input.source ?? "builder",
      status: input.downloaded ? "downloaded" : input.status ?? "draft",
      user_email: personal.email || null,
      user_phone: personal.phone || null,
      user_name: personal.fullName || null,
      updated_at: now,
      last_seen_at: now,
      user_agent: userAgent,
      device_type: inferDeviceType(userAgent),
      referrer: urlReferrer,
      utm_source: getQueryParam(urlReferrer, "utm_source"),
      utm_medium: getQueryParam(urlReferrer, "utm_medium"),
      utm_campaign: getQueryParam(urlReferrer, "utm_campaign"),
      ...(input.downloaded ? { downloaded_at: now } : {}),
    };
    const { error } = await supabase.from("anonymous_resumes").upsert(payload, { onConflict: "session_id" });

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Anonymous sync failed." };
  }
}

function inferDeviceType(userAgent: string | null) {
  if (!userAgent) return null;
  return /mobile|android|iphone|ipad/i.test(userAgent) ? "mobile" : "desktop";
}

function getQueryParam(url: string | null, key: string) {
  if (!url) return null;
  try {
    return new URL(url).searchParams.get(key);
  } catch {
    return null;
  }
}
