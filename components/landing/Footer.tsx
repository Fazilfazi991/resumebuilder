import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} Resumi. Build polished resumes with confidence.</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3">
          {[
            ["Templates", "/templates"],
            ["Pricing", "/pricing"],
            ["Guided Tools", "/ai-tools"],
            ["Help", "/help"],
            ["Contact", "/contact"],
            ["Privacy", "/privacy-policy"],
            ["Terms", "/terms"],
          ].map(([label, href]) => <Link key={href} className="transition hover:text-slate-950" href={href}>{label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
