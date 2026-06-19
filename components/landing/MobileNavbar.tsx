"use client";

import { FileText, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  ["Home", "/"], ["Templates", "/templates"], ["Pricing", "/pricing"],
  ["AI Tools", "/ai-tools"], ["Resume Examples", "/resume-examples"],
  ["Help", "/help"], ["Login", "/login"],
] as const;

export function MobileNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700" aria-label={open ? "Close navigation" : "Open navigation"}>
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      <div className={`absolute inset-x-0 top-16 origin-top border-b border-slate-200 bg-white px-4 shadow-xl transition duration-200 ${open ? "visible scale-y-100 opacity-100" : "invisible scale-y-95 opacity-0"}`}>
        <nav className="mx-auto max-w-7xl py-4">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-11 items-center border-b border-slate-100 px-2 text-sm font-bold text-slate-700 last:border-0">{label}</Link>)}
          <Link href="/builder/guest" onClick={() => setOpen(false)} className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white"><FileText size={17} />Create Resume</Link>
        </nav>
      </div>
    </div>
  );
}
