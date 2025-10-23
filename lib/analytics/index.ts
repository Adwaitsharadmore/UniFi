// Export all analytics functionality
export * from './types';
export * from './classify';
export * from './series';
export * from './normalize';

// Re-export the main function for easy access
export { buildIncomeExpenseSavingsSeries } from './series';
export { normalizeTransactions } from './normalize';
