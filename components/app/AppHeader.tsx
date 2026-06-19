import { FileText, UserRound } from "lucide-react";
import Link from "next/link";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Resumes", href: "/my-resumes" },
  { label: "Templates", href: "/templates" },
  { label: "Builder", href: "/builder/new" },
  { label: "Billing", href: "/billing" },
  { label: "Settings", href: "/settings" },
  { label: "Account", href: "/account" },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white">
            <FileText size={19} aria-hidden="true" />
          </span>
          <span>Resume<span className="text-blue-500">Craft</span></span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-semibold text-slate-600 lg:flex">
          {links.map((link) => (
            <Link key={link.href} className="transition hover:text-slate-950" href={link.href}>{link.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="hidden h-10 items-center rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-600 sm:inline-flex lg:hidden">Settings</Link>
          <Link
            href="/account"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
            aria-label="Account"
          >
            <UserRound size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
