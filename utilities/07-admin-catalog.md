# 07 Admin Catalog Management

## Mission
Build the admin catalog view with editorial grid, search/filter toolbar, and the Add/Edit perfume form with photo upload to Supabase Storage.

## Success Criteria
- Admin catalog (/admin/catalog) shows editorial grid with edit/delete controls.
- Search bar and filter dropdowns (Accord, Status, Size) work.
- Add Perfume button navigates to /admin/perfume/new.
- Add/Edit form has photo upload drop zone, all fields, and saves to Supabase.
- Photo uploads go to Supabase Storage and return public URLs.

## Prerequisites
- `04-database-api-layer` merged.
- `06-admin-dashboard` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/admin-catalog`

## Atomic Steps
1. Create CatalogAdmin page with editorial grid layout matching public catalog but with edit/delete overlays.
2. Add toolbar: underline search input, filter dropdowns, solid black "+ Add Perfume" button.
3. Build search functionality filtering by perfume name.
4. Build filter functionality for Accord, Status.
5. Create AddEditPerfume form page with left photo upload zone and right form column.
6. Implement drag-and-drop photo upload with preview — uploads to Supabase Storage.
7. Build form fields: Name, Brand, Description (textarea), Scent Notes (3 sub-inputs), Accords (tag input), Status (select with defaultValue, NOT selected attribute on options), Prices.
8. Wire form submission to create/update API routes.
9. Add delete confirmation modal for removing perfumes.

## Key Files / Areas
- `src/app/(admin)/admin/catalog/page.tsx`
- `src/app/(admin)/admin/perfume/new/page.tsx`
- `src/app/(admin)/admin/perfume/[id]/edit/page.tsx`
- `src/components/admin/PerfumeForm.tsx`
- `src/components/admin/PhotoUpload.tsx`

## Verification
- CRUD:
  - Create a new perfume with photo → appears in catalog.
  - Edit existing perfume → changes persist.
  - Delete perfume → removed from catalog.
- Form:
  - No React warnings about selected on option elements (uses defaultValue on select).
  - Photo upload shows preview and saves to storage.
- Search/Filter:
  - Search narrows results by name.
  - Filters work independently and in combination.

## Definition of Done
- [ ] Admin catalog displays with edit/delete controls.
- [ ] Add/Edit form saves perfumes to Supabase.
- [ ] Photo upload works with Supabase Storage.
- [ ] No React warnings for select elements.

## Commit Flow
- `feat(admin-catalog): build catalog grid with search filter and edit controls`
- `feat(perfume-form): implement add edit form with photo upload`
- `fix(form): use defaultValue on select instead of selected on option`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
