import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type Period = 'month' | 'year' | 'last30' | 'custom' | 'all';

interface SaleRow {
  perfume_id: string | null;
  perfume_name: string;
  size: string;
  qty: number;
  revenue: number | string;
  profit: number | string;
  sale_date: string;
}

interface PerfumeRow {
  id: string;
  name: string;
  brand: string;
  image_url: string | null;
}

interface ExpenseRow {
  id: string;
  category: string;
  description: string | null;
  amount: number | string;
  month: string;
  created_at: string;
}

interface PerfumeStat {
  id: string | null;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  ml: number;
  units5ml: number;
  units10ml: number;
  rev5ml: number;
  rev10ml: number;
  totalRev: number;
  orders: number;
}

const PAGE_SIZE = 1000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH = /^\d{4}-\d{2}$/;
const YEAR = /^\d{4}$/;

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function getDateRange(searchParams: URLSearchParams) {
  const period = (searchParams.get('period') || 'month') as Period;

  if (!['month', 'year', 'last30', 'custom', 'all'].includes(period)) {
    throw new Error('Invalid period');
  }

  if (period === 'all') {
    return { period, start: null, endExclusive: null, label: 'All time' };
  }

  if (period === 'last30') {
    const today = startOfUtcDay(new Date());
    return {
      period,
      start: addUtcDays(today, -29),
      endExclusive: addUtcDays(today, 1),
      label: 'Last 30 days',
    };
  }

  if (period === 'year') {
    const year = searchParams.get('year');
    if (!year || !YEAR.test(year)) throw new Error('Invalid year');

    return {
      period,
      start: new Date(`${year}-01-01T00:00:00.000Z`),
      endExclusive: new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`),
      label: year,
    };
  }

  if (period === 'custom') {
    const startValue = searchParams.get('start');
    const endValue = searchParams.get('end');
    if (!startValue || !endValue || !ISO_DATE.test(startValue) || !ISO_DATE.test(endValue)) {
      throw new Error('Invalid custom date range');
    }

    const start = new Date(`${startValue}T00:00:00.000Z`);
    const endExclusive = addUtcDays(new Date(`${endValue}T00:00:00.000Z`), 1);
    if (start >= endExclusive) throw new Error('Start date must be before end date');

    return { period, start, endExclusive, label: `${startValue} to ${endValue}` };
  }

  const month = searchParams.get('month');
  if (!month || !MONTH.test(month)) throw new Error('Invalid month');

  const [year, monthNumber] = month.split('-').map(Number);
  return {
    period,
    start: new Date(Date.UTC(year, monthNumber - 1, 1)),
    endExclusive: new Date(Date.UTC(year, monthNumber, 1)),
    label: new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, monthNumber - 1, 1))),
  };
}

function saleMl(sale: SaleRow) {
  const quantity = Number(sale.qty || 0);
  if (sale.size === '5ml') return 5 * quantity;
  if (sale.size === '10ml') return 10 * quantity;
  if (sale.size === 'full_bottle') return 100 * quantity;
  return 0;
}

function aggregateSales(sales: SaleRow[], perfumes: PerfumeRow[]) {
  const perfumeById = new Map(perfumes.map((perfume) => [perfume.id, perfume]));
  const perfumeByName = new Map(
    perfumes.map((perfume) => [perfume.name.toLocaleLowerCase(), perfume])
  );
  const stats = new Map<string, PerfumeStat>();
  let totalRevenue = 0;
  let totalProfit = 0;
  let totalMlSold = 0;

  for (const sale of sales) {
    const perfume =
      (sale.perfume_id ? perfumeById.get(sale.perfume_id) : undefined) ||
      perfumeByName.get(sale.perfume_name.toLocaleLowerCase());
    const key = perfume?.id || `legacy:${sale.perfume_name.toLocaleLowerCase()}`;
    const revenue = Number(sale.revenue || 0);
    const ml = saleMl(sale);
    const quantity = Number(sale.qty || 0);
    const current = stats.get(key) || {
      id: perfume?.id || sale.perfume_id,
      name: perfume?.name || sale.perfume_name,
      brand: perfume?.brand || null,
      imageUrl: perfume?.image_url || null,
      ml: 0,
      units5ml: 0,
      units10ml: 0,
      rev5ml: 0,
      rev10ml: 0,
      totalRev: 0,
      orders: 0,
    };

    current.ml += ml;
    current.totalRev += revenue;
    current.orders += quantity;
    if (sale.size === '5ml') {
      current.units5ml += quantity;
      current.rev5ml += revenue;
    } else if (sale.size === '10ml') {
      current.units10ml += quantity;
      current.rev10ml += revenue;
    }
    stats.set(key, current);

    totalRevenue += revenue;
    totalProfit += Number(sale.profit || 0);
    totalMlSold += ml;
  }

  return {
    totalRevenue,
    totalProfit,
    totalMlSold,
    chartData: Array.from(stats.values()).sort((a, b) => b.totalRev - a.totalRev),
  };
}

async function fetchAllSales(supabase: Awaited<ReturnType<typeof createClient>>) {
  const rows: SaleRow[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('sales')
      .select('perfume_id, perfume_name, size, qty, revenue, profit, sale_date')
      .order('sale_date', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    const page = (data || []) as SaleRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  return rows;
}

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  let range: ReturnType<typeof getDateRange>;
  try {
    range = getDateRange(request.nextUrl.searchParams);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid date range' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  try {
    const [allSales, perfumeResult, expenseResult] = await Promise.all([
      fetchAllSales(supabase),
      supabase.from('perfumes').select('id, name, brand, image_url').order('name'),
      supabase
        .from('expenses')
        .select('id, category, description, amount, month, created_at')
        .order('created_at', {
          ascending: false,
        }),
    ]);

    if (perfumeResult.error) throw perfumeResult.error;
    if (expenseResult.error) throw expenseResult.error;

    const perfumes = (perfumeResult.data || []) as PerfumeRow[];
    const allExpenses = (expenseResult.data || []) as ExpenseRow[];
    const rangeSales = allSales.filter((sale) => {
      if (!range.start || !range.endExclusive) return true;
      const saleDate = new Date(sale.sale_date);
      return saleDate >= range.start && saleDate < range.endExclusive;
    });
    const expenses = allExpenses.filter((expense) => {
      if (!range.start || !range.endExclusive) return true;
      const finalIncludedDay = addUtcDays(range.endExclusive, -1);
      return expense.month >= monthKey(range.start) && expense.month <= monthKey(finalIncludedDay);
    });

    const selectedStats = aggregateSales(rangeSales, perfumes);
    const allTimeStats = aggregateSales(allSales, perfumes);
    const rankedById = new Map(
      allTimeStats.chartData.filter((item) => item.id).map((item) => [item.id as string, item])
    );
    const allTimePerfumes = perfumes
      .map(
        (perfume): PerfumeStat =>
          rankedById.get(perfume.id) || {
            id: perfume.id,
            name: perfume.name,
            brand: perfume.brand,
            imageUrl: perfume.image_url,
            ml: 0,
            units5ml: 0,
            units10ml: 0,
            rev5ml: 0,
            rev10ml: 0,
            totalRev: 0,
            orders: 0,
          }
      )
      .sort((a, b) => b.totalRev - a.totalRev || b.ml - a.ml || a.name.localeCompare(b.name));
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    return NextResponse.json({
      period: range.period,
      periodLabel: range.label,
      totalRevenue: selectedStats.totalRevenue,
      totalMlSold: selectedStats.totalMlSold,
      totalProfit: selectedStats.totalProfit,
      totalExpenses,
      netProfit: selectedStats.totalProfit - totalExpenses,
      chartData: selectedStats.chartData,
      expenses,
      expenseCoverage:
        range.period === 'last30' || range.period === 'custom' ? 'selected-months' : 'exact',
      allTime: {
        totalRevenue: allTimeStats.totalRevenue,
        totalMlSold: allTimeStats.totalMlSold,
        perfumes: allTimePerfumes,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
