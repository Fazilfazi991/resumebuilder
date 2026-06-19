export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return process.env.NODE_ENV === "production"
    ? "https://resumebuilder-one-beta.vercel.app"
    : "http://localhost:3000";
}
