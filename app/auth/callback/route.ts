import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeRedirectPath } from "@/lib/auth/redirects";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const safeNext = safeRedirectPath(url.searchParams.get("next"), "/dashboard");
  const providerError = url.searchParams.get("error") || url.searchParams.get("error_description");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Account confirmation is temporarily unavailable.")}`, request.url));
  }

  if (providerError) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Authentication was cancelled or could not be completed.")}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("The sign-in link is incomplete. Please try again.")}`, request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
      if (!profile) {
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: user.id,
          full_name: String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? ""),
          email: user.email ?? "",
          plan: "free",
        });
        if (profileError) {
          await supabase.auth.signOut();
          return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Your account connected, but Resumi could not finish setting it up. Please try again.")}`, request.url));
        }
      }
    }
    return NextResponse.redirect(new URL(safeNext, request.url));
  }

  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("This sign-in link could not be completed. Please try again.")}`, request.url));
}
