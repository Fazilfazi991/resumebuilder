import { BuilderClient } from "@/components/builder/BuilderClient";

export default async function GuestBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const params = await searchParams;
  return <BuilderClient initialTemplateId={params.template ?? "modern-minimal"} isGuest />;
}
