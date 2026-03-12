# 05 Public Catalog & Perfume Detail

## Mission
Build the buyer-facing perfume catalog with editorial grid layout and immersive perfume detail page with scent notes, accords, pricing, and reviews.

## Success Criteria
- Catalog page (/) shows editorial grid of perfumes with alternating large/small cards.
- Each card displays: photo, name, accords pills, status, prices, star rating + review count.
- Perfume detail page (/perfume/[id]) has full-screen hero image (60%) with right info panel.
- Detail page shows scent notes (Top/Middle/Base columns), accords, When to Wear, pricing, reviews.
- Review submission with star rating widget and comment textarea.

## Prerequisites
- `02-design-system-shell` merged.
- `04-database-api-layer` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/public-catalog`

## Atomic Steps
1. Create Catalog page with editorial grid — alternating large (col-span-2) and small cards like a fashion lookbook.
2. Build PerfumeCard component: full-bleed photo, name in condensed serif, brand in spaced caps, status pill, prices, star rating.
3. Add search bar (minimal underline style) and filter dropdowns (Accord, Status) to catalog toolbar.
4. Create PerfumeDetail page with 60/40 split: hero image left, info panel right.
5. Build scent notes section with 3-column layout (Top / Middle / Base).
6. Display accords as pill tags and When to Wear as styled pills.
7. Add pricing display with 5ml and 10ml options and availability status.
8. Build StarRating component for display and input.
9. Build reviews section: star input widget + comment textarea + submit button.
10. Display submitted reviews with avatar initials, rating, comment, and date.
11. Fetch perfume data from API and handle loading/error states.

## Key Files / Areas
- `src/app/(public)/page.tsx`
- `src/app/(public)/perfume/[id]/page.tsx`
- `src/components/catalog/PerfumeCard.tsx`
- `src/components/catalog/PerfumeDetail.tsx`
- `src/components/catalog/StarRating.tsx`
- `src/components/catalog/ReviewSection.tsx`

## Verification
- Visual:
  - Catalog grid matches editorial lookbook style.
  - Detail page hero image fills 60% width on desktop.
  - Mobile stacks to single column preserving editorial proportions.
- Functional:
  - Search filters perfumes by name.
  - Filter dropdowns filter by accord and status.
  - Review submission persists and displays immediately.

## Definition of Done
- [ ] Catalog page renders editorial grid with real data from Supabase.
- [ ] Perfume detail page shows all information with immersive layout.
- [ ] Reviews can be submitted and displayed.
- [ ] Responsive on mobile and desktop.

## Commit Flow
- `feat(catalog): build editorial grid catalog page with perfume cards`
- `feat(detail): implement perfume detail page with hero layout`
- `feat(reviews): add star rating widget and review submission`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
