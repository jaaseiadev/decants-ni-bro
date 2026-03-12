# 04 Database Schema & API Layer

## Mission
Design and implement the Supabase database schema for perfumes, inventory, sales, reviews, and expenses. Create server-side API routes for all CRUD operations.

## Success Criteria
- Supabase tables created: perfumes, inventory_log, sales, reviews, expenses.
- Row-Level Security (RLS) policies enforce read-only for public, full CRUD for authenticated admin.
- API routes (Next.js Route Handlers) wrap all database operations with proper error handling.
- Supabase Storage bucket created for perfume images.

## Prerequisites
- `01-foundation-platform` merged.
- `03-auth-route-protection` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/database-api-layer`

## Atomic Steps
1. Create `perfumes` table: id, name, brand, description, status, price_5ml, price_10ml, rating, review_count, image_url, notes_top, notes_middle, notes_base, accords, when_to_wear, stock_5ml, stock_10ml, created_at, updated_at.
2. Create `sales` table: id, perfume_id, perfume_name, size, qty, revenue, profit, payment_type, sale_date, created_at.
3. Create `inventory_log` table: id, perfume_id, perfume_name, change_ml, type (restock/sale), created_at.
4. Create `reviews` table: id, perfume_id, author_name, rating, comment, created_at.
5. Create `expenses` table: id, category, description, amount, month, created_at.
6. Enable RLS: public can SELECT perfumes and reviews; authenticated users have full CRUD on all tables.
7. Create Supabase Storage bucket "perfume-images" with public read access.
8. Build API route handlers: GET/POST/PUT/DELETE for perfumes, GET/POST for sales, GET/POST for inventory, GET/POST for reviews.
9. Add comprehensive error handling and typed responses for all API routes.

## Key Files / Areas
- `supabase/migrations/001_create_tables.sql`
- `src/app/api/perfumes/route.ts`
- `src/app/api/perfumes/[id]/route.ts`
- `src/app/api/sales/route.ts`
- `src/app/api/inventory/route.ts`
- `src/app/api/reviews/route.ts`
- `src/lib/supabase/types.ts`

## Verification
- Database:
  - All tables created with correct columns and constraints.
  - RLS policies enforce public read-only, admin full access.
- API:
  - GET /api/perfumes returns perfume list.
  - POST /api/perfumes creates a new perfume (auth required).
  - PUT /api/perfumes/[id] updates perfume (auth required).
- Storage:
  - Image upload to Supabase Storage returns public URL.
  - Uploaded images render correctly in the UI.

## Definition of Done
- [ ] All database tables created with proper types and constraints.
- [ ] RLS policies enforced and tested.
- [ ] API routes handle CRUD for all entities with typed responses.
- [ ] Supabase Storage bucket configured for perfume images.

## Commit Flow
- `feat(db): create supabase migration for perfumes sales inventory reviews expenses`
- `feat(api): add route handlers for perfume CRUD operations`
- `feat(api): add route handlers for sales inventory and reviews`
- `feat(storage): configure supabase storage for perfume images`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
