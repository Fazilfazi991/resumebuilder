import { AppHeader } from "./AppHeader";
import { PortalBottomNav } from "./PortalBottomNav";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-50 pb-20 lg:pb-0">{children}</main>
      <PortalBottomNav />
    </>
  );
}
