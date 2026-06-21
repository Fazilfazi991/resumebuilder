import type { ResumeData } from "@/types/resume";
import { getContactLinks, type ContactLink, type ContactLinkType } from "@/lib/resume/contact-links";
import { Globe, Link as LinkIcon, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { resumeTypography } from "./resume-typography";

type Variant = "inline" | "stacked" | "sidebar" | "compact";

type Props = {
  personal: ResumeData["personal"];
  variant?: Variant;
  showIcons?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
};

const iconMap = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
  linkedin: Linkedin,
  portfolio: LinkIcon,
} satisfies Record<ContactLinkType, typeof Mail>;

export function ResumeContactBlock({ personal, variant = "inline", showIcons = true, align = "left", className = "" }: Props) {
  const items = getContactLinks(personal);
  if (!items.length) return null;

  const primary = items.filter((item) => item.type === "email" || item.type === "phone" || item.type === "location");
  const links = items.filter((item) => item.type === "website" || item.type === "linkedin" || item.type === "portfolio");
  const isStacked = variant === "stacked" || variant === "sidebar";

  if (isStacked) {
    return (
      <div className={`space-y-2 text-current ${className}`} style={{ fontSize: resumeTypography.contact, lineHeight: resumeTypography.lineHeightBody }}>
        {items.map((item) => <ContactItem key={`${item.type}-${item.href ?? item.value}`} item={item} showIcon={showIcons} stacked />)}
      </div>
    );
  }

  return (
    <div className={`max-w-full space-y-1.5 text-current ${alignClass(align)} ${className}`} style={{ fontSize: resumeTypography.contact, lineHeight: 1.4 }}>
      {primary.length ? <InlineRow items={primary} showIcons={showIcons} align={align} /> : null}
      {links.length ? <InlineRow items={links} showIcons={showIcons} align={align} /> : null}
    </div>
  );
}

function InlineRow({ items, showIcons, align }: { items: ContactLink[]; showIcons: boolean; align: "left" | "center" | "right" }) {
  return (
    <div className={`flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 ${justifyClass(align)}`}>
      {items.map((item, index) => (
        <span key={`${item.type}-${item.href ?? item.value}`} className="inline-flex min-w-0 items-center gap-2">
          {index > 0 ? <span className="shrink-0 text-current opacity-45">|</span> : null}
          <ContactItem item={item} showIcon={showIcons} />
        </span>
      ))}
    </div>
  );
}

function ContactItem({ item, showIcon, stacked = false }: { item: ContactLink; showIcon: boolean; stacked?: boolean }) {
  const Icon = iconMap[item.type];
  const content = (
    <>
      {showIcon ? <Icon size={stacked ? 11 : 10.5} className="shrink-0 text-current" aria-hidden="true" /> : null}
      <span className="min-w-0 break-words">{item.label}</span>
    </>
  );
  const className = `${stacked ? "grid grid-cols-[13px_1fr] gap-2.5" : "inline-flex max-w-full items-center gap-1.5"} min-w-0 text-current no-underline`;

  if (!item.href) {
    return <span className={className}>{content}</span>;
  }

  const isWeb = item.type === "website" || item.type === "linkedin" || item.type === "portfolio";
  return (
    <a href={item.href} target={isWeb ? "_blank" : undefined} rel={isWeb ? "noopener noreferrer" : undefined} className={className}>
      {content}
    </a>
  );
}

function alignClass(align: Props["align"]) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

function justifyClass(align: Props["align"]) {
  if (align === "center") return "justify-center";
  if (align === "right") return "justify-end";
  return "justify-start";
}
