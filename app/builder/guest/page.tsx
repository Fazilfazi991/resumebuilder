import { BuilderClient } from "@/components/builder/BuilderClient";
import { BuilderErrorBoundary } from "@/components/builder/BuilderErrorBoundary";

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
