import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { photoStoragePathFromUrl, privatePhotoUrl } from "@/lib/resume/photo-url";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return new NextResponse("Photo storage is unavailable.", { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Sign in required.", { status: 401 });

  const requestedPath = request.nextUrl.searchParams.get("path") ?? "";
  const path = photoStoragePathFromUrl(privatePhotoUrl(requestedPath), user.id);
  if (!path) return new NextResponse("Photo not found.", { status: 404 });

  const { data, error } = await supabase.storage.from("resume-photos").createSignedUrl(path, 60);
  if (error || !data.signedUrl) return new NextResponse("Photo not found.", { status: 404 });

  const response = NextResponse.redirect(data.signedUrl, 302);
  response.headers.set("Cache-Control", "private, max-age=30");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
