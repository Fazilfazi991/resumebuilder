# Resumi Relaunch QA Report

## Test Run

- Date: 2026-09-14 (GST / UTC+04:00)
- Branch: `codex/resumi-relaunch-google-auth-branding`
- Baseline commit: `3ed78e615e746cb9e7e70d3f53625532bfeda9bd`
- Local production build: passed with Next.js 16.3.5 (33 routes)
- Lint: passed with zero warnings
- TypeScript: passed
- Security unit tests: 4/4 passed
- Dependency audit: zero known vulnerabilities
- Browser: Chrome at desktop and 390px viewport

## Browser Coverage

Chrome checks covered `/`, `/templates`, `/pricing`, `/ai-tools`, `/resume-examples`, `/about`, `/contact`, `/help`, `/privacy-policy`, `/terms`, `/cover-letter`, `/login`, `/signup`, `/forgot-password`, `/builder/guest`, `/dashboard`, `/admin`, and a missing route. Public pages rendered their expected headings, no tested page had horizontal overflow, protected routes redirected to login, and the custom 404 rendered. The guest builder accepted synthetic data, updated its live preview, advanced through the guided flow, and restored its draft.

## Fixed in This Branch

- Added Google OAuth entry points, safe callback handling, friendly failures, and fallback profile creation.
- Hardened redirect validation against external, scheme-relative, encoded-backslash, and control-character redirects.
- Added private resume-photo delivery and an owner-scoped storage migration; guest photos no longer sync to the server.
- Restricted resume reads to owners/admins and added missing profile-insert policy.
- Added a real server-side contact form persistence path and migration.
- Prevented the Stripe checkout endpoint from operating while payments are disabled.
- Removed misleading AI, paid-plan, and unfinished-control claims from the free launch experience.
- Added deletion confirmation, guest storage failure handling, accurate privacy/terms copy, metadata, sitemap/robots updates, a branded 404, manifest, and Resumi app icon.
- Updated the dependency lockfile and removed the critical Next.js advisory reported by the package audit.

## Remaining External Blockers

- Google login is **not end-to-end verified**. In the inspected Supabase project, the Google provider is disabled and no OAuth client credentials are configured.
- Supabase Auth still uses `https://resumi.live` and bare-domain redirect entries. Before relaunch, update the Site URL and allowed redirects to the canonical `https://www.resumi.live` routes documented in `docs/google-auth-configuration.md`.
- Review and apply `supabase/migrations/008_auth_contact_and_storage_hardening.sql` before deploying the code. No production database or storage setting was changed during this work.
- Run new-user, existing-user, cancel/denial, session persistence, photo upload, authenticated autosave, and PDF viewer checks in a configured preview or production-like environment.
- No production deployment was performed.

## Severity Summary

- P0: dependency vulnerability resolved; no open code-level P0 found in the completed local checks.
- P1: external Google/Supabase configuration and the unapplied security/contact migration remain relaunch blockers.
- P2: authenticated and provider-dependent end-to-end scenarios remain to be exercised after configuration.

## Relaunch Decision

**NO-GO for production relaunch today.** The branch is locally buildable and materially hardened, but Google OAuth configuration, the Supabase migration, and provider/authenticated end-to-end verification must be completed first.
