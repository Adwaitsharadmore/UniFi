import { format, startOfWeek, startOfMonth, startOfQuarter, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachQuarterOfInterval, eachYearOfInterval } from 'date-fns';
import type { Txn, SeriesPoint, Grain, BuildSeriesOptions } from './types';
import { markTransfers, markRefunds } from './classify';

/**
 * Generate bucket key for a given date and grain
 */
function bucketKey(date: Date, grain: Grain, timezone: string = 'UTC'): string {
  switch (grain) {
    case 'week': {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
      return format(weekStart, 'yyyy-MM-dd');
    }
    case 'month': {
      const monthStart = startOfMonth(date);
      return format(monthStart, 'yyyy-MM-dd');
    }
    case 'quarter': {
      const quarterStart = startOfQuarter(date);
      return format(quarterStart, 'yyyy-MM-dd');
    }
    case 'year': {
      const yearStart = startOfYear(date);
      return format(yearStart, 'yyyy-MM-dd');
    }
    default:
      return format(date, 'yyyy-MM-dd');
  }
}

/**
 * Get display label for a bucket
 */
function bucketLabel(bucket: string, grain: Grain): string {
  const date = new Date(bucket);
  
  switch (grain) {
    case 'week':
      return format(date, 'MMM dd');
    case 'month':
      return format(date, 'MMM yyyy');
    case 'quarter':
      return `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
    case 'year':
      return format(date, 'yyyy');
    default:
      return format(date, 'MMM dd');
  }
}

/**
 * Generate all bucket dates for the given range and grain
 */
function generateBuckets(start: Date, end: Date, grain: Grain): string[] {
  const buckets: string[] = [];
  
  switch (grain) {
    case 'week': {
      const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
      weeks.forEach(week => buckets.push(bucketKey(week, grain)));
      break;
    }
    case 'month': {
      const months = eachMonthOfInterval({ start, end });
      months.forEach(month => buckets.push(bucketKey(month, grain)));
      break;
    }
    case 'quarter': {
      const quarters = eachQuarterOfInterval({ start, end });
      quarters.forEach(quarter => buckets.push(bucketKey(quarter, grain)));
      break;
    }
    case 'year': {
      const years = eachYearOfInterval({ start, end });
      years.forEach(year => buckets.push(bucketKey(year, grain)));
      break;
    }
  }
  
  return buckets;
}

/**
 * Build income/expense/savings series from transactions
 */
export function buildIncomeExpenseSavingsSeries(
  txns: Txn[],
  opts: BuildSeriesOptions = {}
): SeriesPoint[] {
  const {
    grain = 'month',
    start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Default to last year
    end = new Date(),
    timezone = 'UTC'
  } = opts;

  // Filter out pending transactions and transactions outside date range
  const filteredTxns = txns.filter(txn => 
    !txn.isPending && 
    new Date(txn.date) >= start && 
    new Date(txn.date) <= end
  );

  // Mark transfers and refunds
  const classifiedTxns = markRefunds(markTransfers(filteredTxns));

  // Generate all buckets for the range
  const buckets = generateBuckets(start, end, grain);
  const bucketMap = new Map<string, { incomeCents: number; expenseCents: number; refundCents: number }>();
  
  // Initialize all buckets with zeros
  buckets.forEach(bucket => {
    bucketMap.set(bucket, { incomeCents: 0, expenseCents: 0, refundCents: 0 });
  });

  // Aggregate transactions by bucket
  classifiedTxns.forEach(txn => {
    const bucket = bucketKey(new Date(txn.date), grain, timezone);
    const bucketData = bucketMap.get(bucket);
    
    if (!bucketData) return; // Skip if bucket not in range
    
    // Skip transfers
    if (txn.meta?.transfer) return;
    
    if (txn.direction === 'inflow') {
      if (txn.meta?.refund) {
        // Refunds reduce expenses
        bucketData.refundCents += txn.amountCents;
      } else {
        // Regular income
        bucketData.incomeCents += txn.amountCents;
      }
    } else if (txn.direction === 'outflow') {
      // Regular expenses
      bucketData.expenseCents += txn.amountCents;
    }
  });

  // Convert to series points and net refunds
  const series: SeriesPoint[] = buckets.map(bucket => {
    const data = bucketMap.get(bucket)!;
    
    // Net refunds against expenses
    const netExpenses = Math.max(0, data.expenseCents - data.refundCents);
    const savings = data.incomeCents - netExpenses;
    
    return {
      bucket,
      incomeCents: data.incomeCents,
      expenseCents: netExpenses,
      savingsCents: savings
    };
  });

  return series;
}

/**
 * Convert cents to dollars for display
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Convert series points to chart-ready data
 */
export function seriesToChartData(series: SeriesPoint[], grain: Grain): Array<{
  name: string;
  income: number;
  expenses: number;
  savings: number;
}> {
  return series.map(point => ({
    name: bucketLabel(point.bucket, grain),
    income: centsToDollars(point.incomeCents),
    expenses: centsToDollars(point.expenseCents),
    savings: centsToDollars(point.savingsCents)
  }));
}
