# Resumi production cutover

Do not apply the storage privacy migration before the relaunch application is live. The current production application reads authenticated resume photos from legacy public Supabase Storage URLs.

## Required order

1. Apply `008_auth_contact_and_storage_hardening.sql`. This migration is backward-compatible with the current production application and does not change the `resume-photos` bucket.
2. Deploy the relaunch application code.
3. While the bucket is still public, sign in as the owner of a resume saved with a legacy `/storage/v1/object/public/resume-photos/...` photo URL. Confirm the builder preview and a downloaded PDF render the photo through `/api/resume-photo?path=...`.
4. Apply `009_resume_photo_storage_privacy.sql`. It makes the bucket private and replaces public read access with authenticated, owner-folder read access. It does not delete or rewrite stored objects.
5. Verify the owner can still render and download the photo through `/api/resume-photo`, another authenticated user receives no photo, an anonymous request receives `401`, and the old direct public object URL no longer returns the image.

Keep the existing bare-domain Supabase redirect entries during the cutover. Remove them only after canonical `www` production authentication, email confirmation/reset links, and Google OAuth have been validated.

## Rollback boundary

If legacy-photo preview or PDF verification fails at step 3, stop and roll back the application deployment; do not apply migration 009. If the failure begins only after step 4, restore the bucket's prior public-read configuration while the issue is investigated. No photo object migration is required.
