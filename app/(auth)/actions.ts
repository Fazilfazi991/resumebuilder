"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema, updateProfileSchema } from "@/lib/validations/auth";
import { safeRedirectPath } from "@/lib/auth/redirects";
import { requireUser } from "@/lib/auth/require-user";

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

  redirect(safeRedirectPath(formData.get("next")));
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    errorRedirect("/signup", "Supabase keys are not configured yet.");
  }

  const result = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    next: formData.get("next"),
  });

  if (!result.success) {
    errorRedirect("/signup", result.error.issues[0]?.message ?? "Invalid signup details.");
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";
  const nextPath = safeRedirectPath(formData.get("next"));
  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { full_name: result.data.fullName },
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    errorRedirect("/signup", error.message);
  }

  if (data.user) {
    await supabase.from("profiles").upsert(
      {
        user_id: data.user.id,
        full_name: result.data.fullName,
        email: result.data.email,
        plan: "free",
      },
      { onConflict: "user_id" },
    );
  }

  redirect("/login?message=Check your email to confirm your account.");
}

export async function forgotPassword(formData: FormData) {
  if (!isSupabaseConfigured()) {
    errorRedirect("/forgot-password", "Supabase keys are not configured yet.");
  }

  const result = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!result.success) {
    errorRedirect("/forgot-password", result.error.issues[0]?.message ?? "Enter a valid email address.");
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
  });

  if (error) {
    errorRedirect("/forgot-password", error.message);
  }

  redirect("/forgot-password?message=Password reset link sent. Check your email.");
}

export async function resetPassword(formData: FormData) {
  const result = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    errorRedirect("/reset-password", result.error.issues[0]?.message ?? "Unable to update password.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: result.data.password });
  if (error) {
    errorRedirect("/reset-password", error.message);
  }

  redirect("/dashboard?message=Password updated.");
}

export async function updateProfile(formData: FormData) {
  const result = updateProfileSchema.safeParse({ fullName: formData.get("fullName") });
  if (!result.success) {
    errorRedirect("/account", result.error.issues[0]?.message ?? "Unable to update profile.");
  }

  const { supabase, user } = await requireUser("/account");
  const email = user.email ?? "";
  const { data: existingProfile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
  const { error } = existingProfile
    ? await supabase.from("profiles").update({ full_name: result.data.fullName, email }).eq("user_id", user.id)
    : await supabase.from("profiles").insert({ user_id: user.id, full_name: result.data.fullName, email, plan: "free" });

  if (error) {
    errorRedirect("/account", error.message);
  }

  await supabase.auth.updateUser({ data: { full_name: result.data.fullName } });
  redirect("/account?message=Profile updated.");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
