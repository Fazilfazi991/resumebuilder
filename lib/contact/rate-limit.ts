import { createHmac } from "node:crypto";

function fingerprint(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function contactRateLimitFingerprints(email: string, network: string, secret: string) {
  if (!secret) throw new Error("Contact rate limiting is not configured.");

  return {
    emailFingerprint: fingerprint(`email:${email.trim().toLowerCase()}`, secret),
    networkFingerprint: fingerprint(`network:${network.trim() || "unknown"}`, secret),
  };
}

export function requestNetworkIdentifier(requestHeaders: Headers) {
  const forwarded =
    requestHeaders.get("x-vercel-forwarded-for") ??
    requestHeaders.get("x-forwarded-for") ??
    requestHeaders.get("x-real-ip") ??
    "unknown";

  return forwarded.split(",", 1)[0]?.trim() || "unknown";
}
