import { BrandLogo } from "@/components/app/BrandLogo";
import Link from "next/link";
import { MobileNavbar } from "./MobileNavbar";

const navItems = [
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "AI Tools", href: "/ai-tools" },
  { label: "Login", href: "/login" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Resumi home">
          <BrandLogo className="h-9 w-auto" priority />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/builder/guest"
            className="hidden rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 sm:inline-flex"
          >
            Create Resume
          </Link>
          <MobileNavbar />
        </div>
      </nav>
    </header>
  );
}
