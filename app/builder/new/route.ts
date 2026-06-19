import { requireUser } from "@/lib/auth/require-user";
import { createResume } from "@/lib/resume/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await requireUser("/builder/new");

  const templateId = request.nextUrl.searchParams.get("template") ?? "modern-minimal";
  const resume = await createResume({
    title: "Untitled Resume",
    templateId,
  });

  return NextResponse.redirect(new URL(`/builder/${resume.id}`, request.url));
}
