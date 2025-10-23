export type Direction = 'inflow' | 'outflow';

export type Txn = {
  id: string;           // stable hash
  date: string;         // 'YYYY-MM-DD' local (use UTC for bucketing, display local)
  postedAt?: string;    // ISO timestamp if available
  description: string;
  merchant?: string;
  amountCents: number;  // absolute value in cents
  direction: Direction; // inflow/outflow (signless)
  category?: string;    // optional (Dining, Salary, Rent, Transfer, CC Payment, Refund, etc.)
  account?: string;     // 'Checking' | 'Savings' | 'Credit' | 'Cash' | BANK name
  isPending?: boolean;
  // optional enrichment for transfer matching:
  externalId?: string;
  // metadata for classification
  meta?: {
    transfer?: boolean;
    refund?: boolean;
  };
};

export type SeriesPoint = { 
  bucket: string; 
  incomeCents: number; 
  expenseCents: number; 
  savingsCents: number; 
};

export type Grain = 'week' | 'month' | 'quarter' | 'year';

export type BuildSeriesOptions = {
  grain?: Grain;
  start?: Date;    // inclusive
  end?: Date;      // inclusive
  timezone?: string; // default user's TZ
};
