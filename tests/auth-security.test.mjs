import assert from "node:assert/strict";
import test from "node:test";
import { safeRedirectPath } from "../lib/auth/redirects.ts";
import { getSiteUrl } from "../lib/site-url.ts";
import { photoStoragePathFromUrl, privatePhotoUrl } from "../lib/resume/photo-url.ts";

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
});
