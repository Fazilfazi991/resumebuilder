import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { safeRedirectPath } from "../lib/auth/redirects.ts";
import { getSiteUrl } from "../lib/site-url.ts";
import { photoStoragePathFromUrl, privatePhotoUrl, withPrivatePhotoUrl } from "../lib/resume/photo-url.ts";
import { contactRateLimitFingerprints, requestNetworkIdentifier } from "../lib/contact/rate-limit.ts";
import nextConfig from "../next.config.ts";

test("safeRedirectPath keeps internal paths and their query/hash", () => {
  assert.equal(safeRedirectPath("/builder/abc?tab=preview#top"), "/builder/abc?tab=preview#top");
});

test("safeRedirectPath rejects external and backslash-based redirects", () => {
  for (const value of ["https://evil.example", "//evil.example", "/\\evil.example", "/%5cevil.example", "javascript:alert(1)"]) {
    assert.equal(safeRedirectPath(value), "/dashboard");
  }
});

test("getSiteUrl canonicalizes both Resumi host variants", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://resumi.live/";
  assert.equal(getSiteUrl(), "https://www.resumi.live");
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.resumi.live/path";
  assert.equal(getSiteUrl(), "https://www.resumi.live");
  if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = previous;
});

test("photo helpers accept only the authenticated user's storage folder", () => {
  const ownPath = "user-1/resume-1/profile-photo.png";
  assert.equal(photoStoragePathFromUrl(privatePhotoUrl(ownPath), "user-1"), ownPath);
  assert.equal(photoStoragePathFromUrl("https://project.supabase.co/storage/v1/object/public/resume-photos/user-1/resume-1/profile-photo.png", "user-1"), ownPath);
  assert.equal(photoStoragePathFromUrl(privatePhotoUrl("user-2/resume-1/profile-photo.png"), "user-1"), null);
  assert.equal(photoStoragePathFromUrl(privatePhotoUrl("user-1/../user-2/photo.png"), "user-1"), null);
  assert.equal(photoStoragePathFromUrl(privatePhotoUrl("user-1\\..\\user-2\\photo.png"), "user-1"), null);
});

test("saved legacy public photo URLs are normalized for the authenticated owner", () => {
  const legacyUrl = "https://project.supabase.co/storage/v1/object/public/resume-photos/user-1/resume-1/photo.jpg";
  const resumeData = { personal: { photoUrl: legacyUrl } };
  const normalized = withPrivatePhotoUrl(resumeData, "user-1");

  assert.equal(normalized.personal.photoUrl, "/api/resume-photo?path=user-1%2Fresume-1%2Fphoto.jpg");
  assert.equal(withPrivatePhotoUrl(resumeData, "user-2"), resumeData);
});

test("contact throttling fingerprints identifiers without storing their raw values", () => {
  const first = contactRateLimitFingerprints(" Person@Example.com ", "203.0.113.10", "test-secret");
  const same = contactRateLimitFingerprints("person@example.com", "203.0.113.10", "test-secret");
  const differentNetwork = contactRateLimitFingerprints("person@example.com", "203.0.113.11", "test-secret");

  assert.deepEqual(first, same);
  assert.match(first.emailFingerprint, /^[a-f0-9]{64}$/);
  assert.match(first.networkFingerprint, /^[a-f0-9]{64}$/);
  assert.notEqual(first.networkFingerprint, differentNetwork.networkFingerprint);
  assert.equal(JSON.stringify(first).includes("203.0.113.10"), false);
  assert.equal(JSON.stringify(first).includes("person@example.com"), false);
});

test("contact throttling uses the first forwarded network address", () => {
  const requestHeaders = new Headers({ "x-forwarded-for": "203.0.113.10, 10.0.0.1" });
  assert.equal(requestNetworkIdentifier(requestHeaders), "203.0.113.10");
});

test("migration 008 remains safe before the relaunch deployment", () => {
  const migration = readFileSync(new URL("../supabase/migrations/008_auth_contact_and_storage_hardening.sql", import.meta.url), "utf8");

  assert.doesNotMatch(migration, /update\s+storage\.buckets/i);
  assert.doesNotMatch(migration, /resume_photos_public_read/i);
  assert.match(migration, /security invoker/i);
  assert.doesNotMatch(migration, /security definer/i);
  assert.match(migration, /grant execute on function public\.submit_contact_message[^;]+to service_role/is);
  assert.match(migration, /revoke all on function public\.submit_contact_message[^;]+from anon/is);
  assert.match(migration, /revoke all on function public\.submit_contact_message[^;]+from authenticated/is);
});

test("migration 009 privatizes photo reads without rewriting stored objects", () => {
  const migration = readFileSync(new URL("../supabase/migrations/009_resume_photo_storage_privacy.sql", import.meta.url), "utf8");

  assert.match(migration, /on conflict \(id\) do update set public = false/i);
  assert.match(migration, /drop policy if exists "resume_photos_public_read"/i);
  assert.match(migration, /create policy "resume_photos_owner_read"[\s\S]+to authenticated[\s\S]+\(select auth\.uid\(\)\)::text/i);
  assert.match(migration, /resume_photos_owner_insert/i);
  assert.match(migration, /resume_photos_owner_update/i);
  assert.match(migration, /resume_photos_owner_delete/i);
  assert.doesNotMatch(migration, /(?:delete|update)\s+from\s+storage\.objects/i);
});

test("migration 010 fixes the contact timestamp collision without weakening RPC grants", () => {
  const migration = readFileSync(new URL("../supabase/migrations/010_fix_contact_submission_timestamp.sql", import.meta.url), "utf8");

  assert.match(migration, /request_timestamp timestamptz := clock_timestamp\(\)/i);
  assert.match(migration, /last_seen_at < request_timestamp - interval '24 hours'/i);
  assert.doesNotMatch(migration, /last_seen_at < current_time/i);
  assert.match(migration, /security invoker/i);
  assert.doesNotMatch(migration, /security definer/i);
  assert.match(migration, /grant execute on function public\.submit_contact_message[^;]+to service_role/is);
  assert.match(migration, /revoke all on function public\.submit_contact_message[^;]+from anon/is);
  assert.match(migration, /revoke all on function public\.submit_contact_message[^;]+from authenticated/is);
});

test("global responses include baseline browser security headers", async () => {
  const rules = await nextConfig.headers();
  const globalRule = rules.find((rule) => rule.source === "/(.*)");
  const headers = new Map(globalRule?.headers.map(({ key, value }) => [key.toLowerCase(), value]));

  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=()");
});
