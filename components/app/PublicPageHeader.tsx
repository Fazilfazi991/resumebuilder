import type { ReactNode } from "react";
import { SectionBadge } from "./SectionBadge";

type PublicPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PublicPageHeader({ eyebrow, title, description, actions }: PublicPageHeaderProps) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <SectionBadge>{eyebrow}</SectionBadge>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
