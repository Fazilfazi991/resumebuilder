import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loginPathFor } from "./redirects";

export async function requireUser(next = "/dashboard") {
  if (!isSupabaseConfigured()) {
    redirect(`/login?error=${encodeURIComponent("Supabase keys are not configured yet.")}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect(loginPathFor(next));
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", data.user.id).maybeSingle();
  return { supabase, user: data.user, profile };
}
