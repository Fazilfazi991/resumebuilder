import type { ResumeData } from "@/types/resume";

export type ContactLinkType = "email" | "phone" | "location" | "website" | "linkedin" | "portfolio";

export type ContactLink = {
  type: ContactLinkType;
  label: string;
  value: string;
  href?: string;
};

const webLinkTypes: ContactLinkType[] = ["website", "linkedin", "portfolio"];

export function normalizeUrl(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isSameUrl(a?: string | null, b?: string | null) {
  const left = comparableUrl(a);
  const right = comparableUrl(b);
  return Boolean(left && right && left === right);
}

export function getDisplayLabel(type: ContactLinkType, value: string) {
  if (type === "website") return "Website";
  if (type === "linkedin") return "LinkedIn";
  if (type === "portfolio") return "Portfolio";
  return value.trim();
}

export function getContactLinks(personal: ResumeData["personal"]) {
  const items: ContactLink[] = [];
  const email = personal.email.trim();
  const phone = personal.phone.trim();
  const location = personal.location.trim();

  if (email) items.push({ type: "email", label: email, value: email, href: `mailto:${email}` });
  if (phone) items.push({ type: "phone", label: phone, value: phone, href: `tel:${phone.replace(/\s+/g, "")}` });
  if (location) items.push({ type: "location", label: location, value: location });

  const seen = new Set<string>();
  for (const type of webLinkTypes) {
    const value = personal[type].trim();
    const href = normalizeUrl(value);
    const comparable = comparableUrl(href);
    if (!href || !comparable || seen.has(comparable)) continue;
    seen.add(comparable);
    items.push({ type, label: getDisplayLabel(type, value), value, href });
  }

  return items;
}

function comparableUrl(value?: string | null) {
  const normalized = normalizeUrl(value);
  if (!normalized || /^(mailto:|tel:)/i.test(normalized)) return "";

  try {
    const url = new URL(normalized);
    return `${url.hostname.replace(/^www\./i, "").toLowerCase()}${url.pathname.replace(/\/+$/, "")}${url.search}`.toLowerCase();
  } catch {
    return normalized.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "").toLowerCase();
  }
}
