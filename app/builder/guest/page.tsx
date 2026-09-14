import { BuilderClient } from "@/components/builder/BuilderClient";
import { BuilderErrorBoundary } from "@/components/builder/BuilderErrorBoundary";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Free Resume Builder", "Build, preview, and download a professional resume free without creating an account.", "/builder/guest");

export default async function GuestBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const params = await searchParams;
  return (
    <BuilderErrorBoundary>
      <BuilderClient initialTemplateId={params.template ?? "modern-minimal"} isGuest />
    </BuilderErrorBoundary>
  );
}
