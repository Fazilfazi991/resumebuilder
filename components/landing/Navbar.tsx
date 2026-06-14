import { FileText } from "lucide-react";
import { MobileNavbar } from "./MobileNavbar";

const navItems = [
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "AI Tools", href: "/ai-tools" },
  { label: "Examples", href: "/resume-examples" },
  { label: "Help", href: "/help" },
  { label: "Login", href: "/login" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2 text-lg font-bold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
            <FileText size={20} aria-hidden="true" />
          </span>
          <span>Resume<span className="text-teal-500">Craft</span></span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/builder/sample-resume"
            className="hidden rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-700/20 transition hover:bg-teal-800 sm:inline-flex"
          >
            Create Resume
          </a>
          <MobileNavbar />
        </div>
      </nav>
    </header>
  );
}
