# 10 Statistics & Analytics

## Mission
Build the statistics page with month selector, summary metrics, grouped bar charts (Recharts), detailed breakdown table, and expense log accordion.

## Success Criteria
- Stats page (/admin/stats) has horizontal month selector pill row.
- Summary row: Total Revenue, Total ml Sold, Net Profit in large editorial numbers.
- Full-width Recharts BarChart: monochrome grouped bars per perfume (5ml vs 10ml units sold).
- Detailed breakdown table: perfume name, total ml, 5ml/10ml units, 5ml/10ml revenue.
- Expense log accordion below with categorized expenses.

## Prerequisites
- `04-database-api-layer` merged.
- `09-sales-recording` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/statistics-analytics`

## Atomic Steps
1. Create StatsAdmin page with month selector at top (horizontal scrollable pills).
2. Build summary row with 3 large editorial metric cards (bordered, not filled).
3. Implement Recharts BarChart with stacked/grouped bars — 5ml (taupe) and 10ml (black) per perfume.
4. Set accessibilityLayer={false} on BarChart to prevent duplicate key warnings.
5. Build detailed breakdown table with clean minimal borderless rows.
6. Build expense log accordion using HTML details/summary.
7. Filter all data by selected month.
8. Fetch stats data from API aggregating sales and expenses.

## Key Files / Areas
- `src/app/(admin)/admin/stats/page.tsx`
- `src/components/admin/MonthSelector.tsx`
- `src/components/admin/SalesChart.tsx`
- `src/components/admin/ExpenseAccordion.tsx`

## Verification
- Charts:
  - Bar chart renders without Recharts accessibilityLayer key warnings.
  - Chart data updates when month selection changes.
- Data:
  - Summary metrics match aggregated sales data.
  - Breakdown table totals are consistent with chart.

## Definition of Done
- [ ] Stats page renders with month filtering.
- [ ] Charts display without console warnings.
- [ ] Breakdown table shows correct aggregated data.
- [ ] Expense accordion is functional.

## Commit Flow
- `feat(stats): build statistics page with month selector and summary metrics`
- `feat(stats): add recharts bar chart with accessibility fix`
- `feat(stats): add breakdown table and expense accordion`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
