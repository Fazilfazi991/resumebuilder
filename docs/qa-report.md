# Resumi QA Report

## Test Run

- Date: 2026-06-21 14:26 GST (UTC+04:00)
- Stabilization checkpoint: credential-dependent checks confirmed passed before commit
- Local environment: `http://127.0.0.1:3000`
- Production smoke test: `https://resumi.live` (redirects to `https://www.resumi.live`)
- Browser sizes exercised: desktop, 390px, and 430px
- Build: passed (`npm run build`, 27 routes)
- Lint: passed with zero warnings (`npm run lint`)

## Routes Tested

Local browser checks covered `/`, `/login`, `/signup`, `/forgot-password`, `/dashboard`, `/my-resumes`, `/account`, `/settings`, `/billing`, `/templates`, `/pricing`, `/builder/guest`, `/builder/[resumeId]` access control, `/cover-letter`, and the template/preview/download overlays inside the guest builder.

Production smoke testing confirmed the public homepage loads at `www.resumi.live`, presents the expected navigation, and renders without a production-page error observed during the smoke test.

## Passed

- Required public Supabase variables and local site URL are present.
- The service-role key is referenced only by server/admin code and is not exposed through a `NEXT_PUBLIC_` variable.
- Auth callback and confirmation routes validate safe redirects and use `exchangeCodeForSession` / `verifyOtp`.
- Invalid login displays the friendly `Invalid login credentials` message.
- Unauthenticated protected routes redirect to `/login?next=...` without a redirect loop.
- `/builder/guest` remains publicly accessible.
- Guest personal details and summary update the preview and ATS score reactively.
- Template preview uses sample data; applying a template preserves actual guest resume data.
- Guest draft content and the selected template restore after reload.
- Resume Preview displays current user content and exposes zoom/close controls.
- Guest PDF download opens the expected account/login gate.
- Mobile builder controls are reachable at 390px and no horizontal overflow was detected.
- Template modal search and filters render on mobile without body overflow.
- Coupon validation is case-insensitive and server-side; free upgrades require an authenticated user.
- All homepage primary navigation targets resolve to implemented internal routes.
- Signup confirmation works on `resumi.live`.
- Login and logout work.
- Logged-in autosave works.
- Guest-to-account migration works.
- Photo upload works.
- PDF export works.
- Coupon `THAMEEMAR` works.
- Cover letter creation works.
- Template switching preserves user data.
- ATS score updates correctly.
- Mobile layout is usable for the primary builder journey.

## Bugs Found And Fixed

### High

- Stale production URL fallback and auth documentation referenced the retired Vercel beta domain. Updated all references to `https://resumi.live`.
- The lint command was unusable because ESLint 9 had no flat config. Added the Next.js TypeScript configuration and resolved all resulting lint errors and warnings.

### Medium

- The builder promoted an unrelated external portfolio-builder URL beside the Portfolio field. Removed the promotion while retaining the field.
- Internal homepage and navbar navigation used plain anchors. Replaced them with Next.js `Link` navigation.
- Guest draft helpers used explicit `any` types. Added a bounded draft type.
- Autosave/retry effects used unstable callbacks. Memoized them to avoid stale hook dependencies.
- Local QA emitted a blocked dev-origin warning for `127.0.0.1`. Added a local-only allowed dev origin.

### Low

- Fixed an unescaped apostrophe and removed stale imports/declarations exposed by lint.

## Remaining Verification Gaps

These are not confirmed product defects, but they are still worth checking after each production deploy:

- **Medium:** Google login is visibly marked `coming soon`; OAuth is not implemented and was not tested.
- **Medium:** Stripe/payment completion and provider webhooks were not tested in this checkpoint.
- **Low:** Repeat a production smoke test after the pushed build is deployed.

## Risk Level

**Low to Medium.** Public pages, access control, guest editing, authenticated editing, ATS updates, template switching, draft recovery, preview behavior, PDF export, cover letter, responsive layout, lint, TypeScript, and production build are healthy. Remaining risk is mostly around external provider flows that were outside this stabilization checkpoint.

## Recommended Next Checks

1. Deploy this change set, then repeat the production smoke test and inspect Vercel/Supabase logs.
2. Validate Standard A4 and Auto-fit PDFs with short, normal, long, and photo resumes on desktop and mobile PDF viewers after deployment.
3. Schedule a separate payment/webhook QA pass before enabling paid promotion.
