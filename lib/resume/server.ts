"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { defaultSectionOrder, emptyResumeData } from "./mock-data";
import { createResumeSchema, updateResumeSchema } from "@/lib/validations/resume";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ResumeData } from "@/types/resume";
import { withPrivatePhotoUrl } from "./photo-url";

type ResumeInput = {
  title: string;
  templateId: string;
  resumeData: ResumeData;
  sectionOrder: string[];
};

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
  return `${base || "resume"}-${crypto.randomUUID().slice(0, 8)}`;
}

async function getAuthenticatedClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authentication required.");
  }

  return { supabase, user };
}

export async function createResume(input?: Partial<ResumeInput>) {
  const payload = createResumeSchema.parse({
    title: input?.title ?? "Untitled Resume",
    templateId: input?.templateId ?? "modern-minimal",
    resumeData: input?.resumeData ?? emptyResumeData,
    sectionOrder: input?.sectionOrder ?? defaultSectionOrder,
  });
  const { supabase, user } = await getAuthenticatedClient();

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: payload.title,
      slug: slugify(payload.title),
      template_id: payload.templateId,
      resume_data: payload.resumeData,
      section_order: payload.sectionOrder,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/my-resumes");
  revalidatePath("/admin");
  return data;
}

export async function createResumeAndRedirect(formData: FormData) {
  const templateId = String(formData.get("templateId") ?? "modern-minimal");
  const tab = String(formData.get("tab") ?? "");
  const resume = await createResume({
    title: "Untitled Resume",
    templateId,
  });

  const query = tab ? `?tab=${encodeURIComponent(tab)}` : "";
  redirect(`/builder/${resume.id}${query}`);
}

export async function getUserResumes() {
  const { supabase, user } = await getAuthenticatedClient();
  const { data, error } = await supabase.from("resumes").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map((resume) => ({ ...resume, resume_data: withPrivatePhotoUrl(resume.resume_data, user.id) }));
}

export async function getUserDownloads(limit = 100) {
  const { supabase, user } = await getAuthenticatedClient();
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  const { data, error } = await supabase
    .from("downloads")
    .select("id, resume_id, template_id, downloaded_at")
    .eq("user_id", user.id)
    .order("downloaded_at", { ascending: false })
    .limit(safeLimit);
  if (error) throw new Error(error.message);
  return data;
}

export async function getUserDownloadCount() {
  const { supabase, user } = await getAuthenticatedClient();
  const { count, error } = await supabase
    .from("downloads")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getResumeById(resumeId: string) {
  const { supabase, user } = await getAuthenticatedClient();
  const { data, error } = await supabase.from("resumes").select("*").eq("id", resumeId).single();
  if (error) throw new Error(error.message);
  return { ...data, resume_data: withPrivatePhotoUrl(data.resume_data, user.id) };
}

export async function updateResume(resumeId: string, input: Partial<ResumeInput> & { isPublic?: boolean }) {
  const payload = updateResumeSchema.parse(input);
  const { supabase } = await getAuthenticatedClient();
  const update = {
    ...(payload.title ? { title: payload.title } : {}),
    ...(payload.templateId ? { template_id: payload.templateId } : {}),
    ...(payload.resumeData ? { resume_data: payload.resumeData } : {}),
    ...(payload.sectionOrder ? { section_order: payload.sectionOrder } : {}),
    ...(payload.isPublic !== undefined ? { is_public: payload.isPublic } : {}),
  };

  const { data, error } = await supabase.from("resumes").update(update).eq("id", resumeId).select().single();
  if (error) throw new Error(error.message);
  revalidatePath(`/builder/${resumeId}`);
  revalidatePath("/dashboard");
  revalidatePath("/my-resumes");
  revalidatePath("/admin");
  return data;
}

export async function deleteResume(resumeId: string) {
  const { supabase } = await getAuthenticatedClient();
  const { error } = await supabase.from("resumes").delete().eq("id", resumeId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/my-resumes");
  revalidatePath("/admin");
}

export async function duplicateResume(resumeId: string) {
  const original = await getResumeById(resumeId);
  return createResume({
    title: `${original.title} Copy`,
    templateId: original.template_id,
    resumeData: original.resume_data,
    sectionOrder: original.section_order,
  });
}

export async function getTemplates() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("templates").select("*").eq("is_active", true).order("name");
  if (error) throw new Error(error.message);
  return data;
}

export async function getTemplateById(templateId: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("templates").select("*").eq("id", templateId).eq("is_active", true).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function selectTemplateForResume(resumeId: string, templateId: string) {
  return updateResume(resumeId, { templateId });
}

export async function authorizeResumeDownload(resumeId: string, _templateId: string) {
  const { supabase, user } = await getAuthenticatedClient();
  void _templateId;

  const { data: resume } = await supabase.from("resumes").select("id").eq("id", resumeId).eq("user_id", user.id).maybeSingle();

  if (!resume) {
    return { ok: false, reason: "not_found" as const, message: "Resume access could not be verified." };
  }

  // Launch mode: all resume templates and PDF downloads are free. Premium gating can be re-enabled later.
  return { ok: true };
}

export async function recordDownload(resumeId: string, templateId: string) {
  const authorization = await authorizeResumeDownload(resumeId, templateId);
  if (!authorization.ok) {
    throw new Error(authorization.message);
  }

  const { supabase, user } = await getAuthenticatedClient();
  const { data, error } = await supabase
    .from("downloads")
    .insert({ user_id: user.id, resume_id: resumeId, template_id: templateId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/account");
  revalidatePath("/admin");
  return data;
}
