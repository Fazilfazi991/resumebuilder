import type { ReactNode } from "react";
import { TemplateHeading } from "./TemplateHeading";

export function TemplateSection({ title, children, tone = "slate", className = "", rule = true }: { title: string; children: ReactNode; tone?: Parameters<typeof TemplateHeading>[0]["tone"]; className?: string; rule?: boolean }) {
  return (
    <section className={`resume-section ${className}`}>
      <TemplateHeading tone={tone} rule={rule}>{title}</TemplateHeading>
      {children}
    </section>
  );
}
