# 09 Sales Recording

## Mission
Build the sales recording page with a New Sale form, auto-computed financial summary, and a recent sales feed.

## Success Criteria
- Sales page (/admin/sales) has split layout: New Sale form left, Recent Sales feed right.
- New Sale form: searchable perfume dropdown, size toggle (5ml/10ml), quantity stepper, payment type toggle (Cash/GCash), date picker.
- Auto-computed summary: Revenue, COGS, Profit in large serif numbers.
- Recent Sales feed: card list with perfume name, size, qty, revenue, profit, date.

## Prerequisites
- `04-database-api-layer` merged.
- `08-inventory-management` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/sales-recording`

## Atomic Steps
1. Create SalesAdmin page with split layout (form left, feed right).
2. Build searchable perfume selector dropdown with photo thumbnails.
3. Build size toggle: pill toggle between 5ml and 10ml, selected = black fill.
4. Build quantity stepper with +/- buttons.
5. Build payment type toggle: Cash / GCash pill toggle.
6. Add date picker input.
7. Auto-compute and display Revenue, COGS, Profit in real-time as form values change.
8. Wire form submission: create sale record, update perfume stock, create inventory_log entry.
9. Build recent sales feed: card list showing recent sales with all details.
10. Fetch sales data from API.

## Key Files / Areas
- `src/app/(admin)/admin/sales/page.tsx`
- `src/components/admin/NewSaleForm.tsx`
- `src/components/admin/SalesSummary.tsx`
- `src/components/admin/SalesFeed.tsx`

## Verification
- Sale Flow:
  - Record a sale → stock decrements, sale appears in feed.
  - Auto-computed values update as inputs change.
- Validation:
  - Cannot sell more than available stock.
  - All required fields validated before submission.

## Definition of Done
- [ ] New Sale form creates sales and updates inventory.
- [ ] Auto-computed financial summary works in real-time.
- [ ] Recent sales feed displays correctly.
- [ ] Stock automatically decrements on sale.

## Commit Flow
- `feat(sales): build new sale form with auto-computed summary`
- `feat(sales): wire sale submission with stock update and inventory log`
- `feat(sales): add recent sales feed`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
