"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

function safeNext(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : "/dashboard";
  return path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard";
}

function errorRedirect(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    errorRedirect("/login", "Supabase keys are not configured yet.");
  }

  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!result.success) {
    errorRedirect("/login", result.error.issues[0]?.message ?? "Invalid login details.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    errorRedirect("/login", error.message);
  }

  redirect(safeNext(formData.get("next")));
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    errorRedirect("/signup", "Supabase keys are not configured yet.");
  }

  const result = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!result.success) {
    errorRedirect("/signup", result.error.issues[0]?.message ?? "Invalid signup details.");
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { full_name: result.data.fullName },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    errorRedirect("/signup", error.message);
  }

  redirect("/login?message=Check your email to confirm your account.");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
