# 08 Inventory Management

## Mission
Build the inventory management page with stock table, inline restock controls, ml-remaining progress bars, and a timestamped inventory log.

## Success Criteria
- Inventory page (/admin/inventory) shows table with perfume name, thumbnail, ml remaining, status, last updated.
- Each row has an inline restock input + "ADD STOCK" button.
- Thin progress bar shows ml remaining (nude fill on greige track).
- Inventory log section shows timestamped list of all stock changes.

## Prerequisites
- `04-database-api-layer` merged.
- `06-admin-dashboard` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/inventory-management`

## Atomic Steps
1. Create InventoryAdmin page with stock overview table.
2. Display perfume thumbnail, name, total ml remaining (bold large number), status pill, last updated date.
3. Build thin progress bar component: nude fill on greige track, proportional to max stock.
4. Add inline restock input (small nude-toned) + "ADD STOCK" button per row.
5. Wire restock action: update perfume stock in database, create inventory_log entry.
6. Build inventory log section: timestamped list with monospaced type, showing restock/sale events.
7. Fetch inventory data and log from API with loading states.

## Key Files / Areas
- `src/app/(admin)/admin/inventory/page.tsx`
- `src/components/admin/StockProgressBar.tsx`
- `src/components/admin/InventoryLog.tsx`

## Verification
- Restock:
  - Add stock → perfume stock updates immediately.
  - Inventory log records the restock event with timestamp.
- Display:
  - Progress bars reflect correct stock levels.
  - Low stock items are visually highlighted.

## Definition of Done
- [ ] Inventory table displays all perfumes with stock data.
- [ ] Inline restock updates stock and logs the change.
- [ ] Progress bars render correctly.
- [ ] Inventory log shows full history.

## Commit Flow
- `feat(inventory): build inventory table with stock progress bars`
- `feat(inventory): add inline restock and inventory log`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
