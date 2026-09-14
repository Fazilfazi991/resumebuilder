const canonicalProductionOrigin = "https://www.resumi.live";

function normalizeSiteOrigin(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === "resumi.live" || url.hostname === "www.resumi.live") {
      return canonicalProductionOrigin;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const configuredOrigin = configuredUrl ? normalizeSiteOrigin(configuredUrl) : null;
  if (configuredOrigin) return configuredOrigin;

  if (typeof window !== "undefined" && window.location.origin) {
    return normalizeSiteOrigin(window.location.origin) ?? window.location.origin;
  }

  return process.env.NODE_ENV === "production"
    ? canonicalProductionOrigin
    : "http://127.0.0.1:3000";
}
