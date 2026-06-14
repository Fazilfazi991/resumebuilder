"use client";

import { FileText, LayoutDashboard, LayoutTemplate, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resumes", href: "/my-resumes", icon: FileText },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Account", href: "/account", icon: UserRound },
];

export function PortalBottomNav() {
  const pathname = usePathname();
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">{items.map(({ label, href, icon: Icon }) => { const active = pathname === href || pathname.startsWith(`${href}/`); return <Link key={href} href={href} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold ${active ? "text-teal-700" : "text-slate-500"}`}><Icon size={19} /><span>{label}</span></Link>; })}</nav>;
}
