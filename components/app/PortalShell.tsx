import { AppHeader } from "./AppHeader";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50">{children}</main>
    </>
  );
}
