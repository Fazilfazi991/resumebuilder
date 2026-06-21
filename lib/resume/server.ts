"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { defaultSectionOrder, emptyResumeData } from "./mock-data";
import { createResumeSchema, updateResumeSchema } from "@/lib/validations/resume";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ResumeData } from "@/types/resume";

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
  const { supabase } = await getAuthenticatedClient();
  const { data, error } = await supabase.from("resumes").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getResumeById(resumeId: string) {
  const { supabase } = await getAuthenticatedClient();
  const { data, error } = await supabase.from("resumes").select("*").eq("id", resumeId).single();
  if (error) throw new Error(error.message);
  return data;
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

export async function recordDownload(resumeId: string, templateId: string) {
  const { supabase, user } = await getAuthenticatedClient();
  const { data, error } = await supabase
    .from("downloads")
    .insert({ user_id: user.id, resume_id: resumeId, template_id: templateId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return data;
}
