# 01 Foundation Platform

## Mission
Establish the production baseline for DecantSnibro with Next.js scaffolding, TypeScript configuration, Tailwind CSS, and Supabase environment wiring.

## Success Criteria
- Project boots locally with Next.js 14+ (App Router) + TypeScript + Tailwind CSS.
- Supabase client and server utilities are bootstrapped with environment variable contracts.
- Environment variables documented in .env.example.
- Lint, typecheck, and build commands pass cleanly.

## Prerequisites
- `00-project-overview` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/foundation-platform`

## Atomic Steps
1. Initialize Next.js 14+ with App Router, TypeScript strict mode, and src/ directory.
2. Install and configure Tailwind CSS v4 with PostCSS.
3. Create Supabase client utility (src/lib/supabase/client.ts) using createBrowserClient.
4. Create Supabase server utility (src/lib/supabase/server.ts) using createServerClient with cookie handling.
5. Create .env.example with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY placeholders.
6. Configure ESLint + Prettier with consistent rules.
7. Verify clean build with no TypeScript errors.

## Key Files / Areas
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `.env.example`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`

## Verification
- Build:
  - npm run build completes with zero errors.
  - npm run lint passes.
- Manual:
  - Dev server starts and renders default page.
  - Supabase client initializes without runtime errors.

## Definition of Done
- [ ] Baseline Next.js + TypeScript + Tailwind stack boots cleanly.
- [ ] Supabase client/server utilities created with env var contracts.
- [ ] Lint, typecheck, build all pass.
- [ ] .env.example documents all required variables.

## Commit Flow
- `feat(platform): bootstrap next.js typescript and tailwind foundation`
- `feat(supabase): add client and server utility bootstrap`
- `build(config): add eslint prettier and build scripts`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
