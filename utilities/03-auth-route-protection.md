# 03 Authentication & Route Protection

## Mission
Implement Supabase Auth with email/password login, session management, admin route protection, and a cinematic full-black login screen.

## Success Criteria
- Login page renders on /login with full-black background, centered brand, and bottom-line white inputs.
- Supabase Auth handles sign-in and session persistence.
- Admin routes (/admin/*) are protected — unauthenticated users redirect to /login.
- Sign-out clears session and redirects to public catalog.

## Prerequisites
- `01-foundation-platform` merged.
- `02-design-system-shell` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/auth-route-protection`

## Atomic Steps
1. Create /login page with full-black background, DECANTSNIBRO logo in large white condensed caps.
2. Add email and password inputs in bottom-line white-on-black style.
3. Wire sign-in button to supabase.auth.signInWithPassword().
4. Create auth middleware (middleware.ts) to protect /admin/* routes.
5. On successful login, redirect to /admin dashboard.
6. Add sign-out functionality in admin nav that calls supabase.auth.signOut().
7. Handle auth errors with inline error messages styled in the brand aesthetic.
8. Add subtle grain texture overlay on login background.

## Key Files / Areas
- `src/app/login/page.tsx`
- `src/middleware.ts`
- `src/lib/auth/session.ts`
- `src/components/layout/AdminLayout.tsx`

## Verification
- Auth Flow:
  - Login with valid credentials → redirect to /admin.
  - Login with invalid credentials → inline error message.
- Route Protection:
  - Unauthenticated /admin access → redirect to /login.
  - Authenticated /admin access → dashboard renders.
- Session:
  - Refresh page while logged in → session persists.
  - Sign out → session cleared, redirected to /.

## Definition of Done
- [ ] Login page matches design spec (full-black, editorial typography).
- [ ] Supabase Auth sign-in and sign-out work end to end.
- [ ] Admin routes protected by middleware.
- [ ] Auth errors displayed gracefully.

## Commit Flow
- `feat(auth): implement login page with supabase auth`
- `feat(auth): add middleware for admin route protection`
- `feat(auth): add sign-out and session persistence`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
