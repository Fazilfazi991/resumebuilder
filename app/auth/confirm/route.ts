import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeRedirectPath } from "@/lib/auth/redirects";

const allowedOtpTypes = new Set(["signup", "email", "recovery", "invite", "magiclink", "email_change"]);

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = safeRedirectPath(url.searchParams.get("next"), "/dashboard");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Account confirmation is temporarily unavailable.")}`, request.url));
  }

  if (!tokenHash || !type || !allowedOtpTypes.has(type)) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Unable to confirm your account.")}`, request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as EmailOtpType,
  });

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Unable to confirm your account.")}`, request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
