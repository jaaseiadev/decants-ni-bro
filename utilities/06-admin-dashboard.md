# 06 Admin Dashboard

## Mission
Build the admin dashboard home page with hero metric cards, low stock alerts, recent sales table, and revenue growth chart.

## Success Criteria
- Dashboard (/admin) displays 4 hero metric cards: Total Perfumes, Low Stock Alerts, Monthly Revenue, Net Profit.
- Metric cards are stark black with ivory serif numbers in extreme typographic scale.
- Low stock alert strip shows horizontal scrolling pill list of flagged perfumes.
- Recent sales table with alternating greige/ivory rows.
- Revenue growth mini bar chart in monochrome using Recharts.

## Prerequisites
- `02-design-system-shell` merged.
- `04-database-api-layer` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/admin-dashboard`

## Atomic Steps
1. Create Dashboard page at /admin with hero metrics section.
2. Build 4 MetricCard components: black background, ivory text, large serif numbers, small-caps labels.
3. Compute metrics from real data: total perfumes count, low stock count (5ml < 10 or 10ml < 5), monthly revenue sum, net profit.
4. Build low stock alert strip with horizontal scrolling pills in red accent.
5. Build recent sales table with clean borderless rows, alternating tones.
6. Add Recharts BarChart for revenue growth — monochrome bars, no accessibility layer duplicates.
7. Fetch dashboard data from API with loading states.

## Key Files / Areas
- `src/app/(admin)/admin/page.tsx`
- `src/components/admin/MetricCard.tsx`
- `src/components/admin/RevenueChart.tsx`
- `src/components/admin/RecentSalesTable.tsx`

## Verification
- Visual:
  - Metric cards display with editorial typographic scale.
  - Chart renders without Recharts accessibility warnings.
- Data:
  - Metrics compute correctly from live database data.
  - Low stock alerts flag correct perfumes.

## Definition of Done
- [ ] Dashboard renders all 4 metric cards with real data.
- [ ] Low stock alerts and recent sales display correctly.
- [ ] Revenue chart renders without console warnings.
- [ ] Responsive layout on mobile and desktop.

## Commit Flow
- `feat(dashboard): build admin dashboard with hero metrics`
- `feat(dashboard): add recent sales table and revenue chart`
- `fix(charts): set accessibilityLayer false to prevent recharts key warnings`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
