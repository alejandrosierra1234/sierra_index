# Index security review - 2026-09-19

## Scope

Source review of authentication, account administration, RLS, communications,
storage and the Monday edge function; production Supabase configuration and
anonymous API probes. This is not a penetration-test certification or a claim
that every endpoint, dependency, historical credential or account is safe.

## Confirmed findings and remediation

1. **High: mixed public storage.** `product-images` was public and contained
   employee photos and avatars alongside commercial images. Upload policies
   admitted any authenticated account. Applied `update45.sql` in production:
   private bucket, restrictive read/write gates, active-account checks,
   capability-scoped HR/product access and ownership checks for avatars.
   Only images referenced by active published commercial cards retain anonymous
   access through the signing endpoint. Old active published revisions follow
   the existing public-card versioning contract.
2. **Public signup enabled despite administrator-managed accounts.** Disabled
   public signup in production. Email authentication remains enabled; the
   administrator invitation flow uses the server admin API, not public signup.
   Anonymous sign-ins and manual identity linking were already disabled.
3. **Server password minimum weaker than the application.** Increased the
   production minimum from six to eight characters, matching the existing UI.
   Existing passwords are not reset by this change.
4. **Unescaped avatar attribute.** Escaped avatar URLs in profile rendering and
   save rendering to prevent an attribute breakout from stored profile data.

## Application changes

`js/private-assets.js` resolves durable storage references to five-minute signed
URLs under the current caller's authorization. Signed URLs are canonicalized
before database writes; the cache is invalidated on session changes. Export
paths resolve images before canvas/PDF/print processing. No service-role key is
introduced into the browser.

## Evidence

- Production: migration 45 recorded; bucket private; five storage policies
  installed; anonymous employee-read predicate false.
- Production: no public-schema table without RLS was found; the active-account
  pre-request guard is configured on the API role.
- Anonymous HTTP probe: profiles query returns 401, "Account inactive or
  unauthenticated"; listing the employees storage prefix returns an empty list.
- Public auth settings: `disable_signup=true`, email provider still enabled.
- Redirect allowlist contains the exact production `auth.html` URL, no wildcard.
- Published private-assets module was fetched and compared byte-for-byte with
  the committed file. A fresh production browser tab retained the current
  authorized session and displayed employee photos in the HR directory.
- Automated security suites cover account access, callbacks, communication
  permissions, browser storage ownership and profiles. New tests cover signed
  URL isolation and storage-policy behavior using PGlite, including suspension,
  cross-user avatar writes, HR read/write separation and public-card exceptions.
- Communications checks: 22 checks; export checks: 8 checks.

## Remaining work / limits

- Require MFA for administrators through an enrollment, recovery and challenge
  workflow plus server-side AAL checks. Supabase TOTP support is enabled, but
  Index currently has no MFA workflow or enforcement. Do not enable an AAL gate
  without enrollment/recovery or administrators could be locked out.
- Leaked-password protection is disabled and requires the Pro plan in the
  current dashboard. No paid plan was purchased during this review.
- Reauthentication for password changes needs UI support before enforcement.
- Review dependency pinning, CSP compatibility (the app has extensive inline
  scripts), Monday item-to-board validation, endpoint abuse controls, backups
  and restore drills in a follow-up hardening pass.
- Signed URLs are bearer capabilities valid for up to five minutes. Revocation
  blocks new private reads/signatures, not previously downloaded copies or a
  still-valid signed URL. Previously public files may already have been copied;
  closing the bucket cannot reverse that exposure.
- Local policy tests do not substitute for testing every production role. No
  disposable user was created, no real user's password changed and no live
  account was suspended/deleted as part of verification. End-to-end new-user
  invitation delivery and all PDF/image workflows were not exercised live.
- No evidence of exploitation was established; historical access logs and
  incident response were outside this pass.
