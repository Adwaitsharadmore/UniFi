import type { Transaction } from '@/types/finance';
import type { Txn } from './types';

/**
 * Normalize existing transaction data to analytics format
 */
export function normalizeTransaction(txn: Transaction): Txn {
  // Determine direction based on type
  const direction: 'inflow' | 'outflow' = txn.type === 'credit' ? 'inflow' : 'outflow';
  
  // Convert amount to cents (assuming amount is in dollars)
  const amountCents = Math.round(Math.abs(txn.amount) * 100);
  
  // Normalize description and merchant
  const description = txn.description.trim();
  const merchant = txn.merchant?.trim();
  
  // Generate stable ID if not present
  const id = txn.id || generateStableId(txn);
  
  return {
    id,
    date: txn.date,
    description,
    merchant,
    amountCents,
    direction,
    category: txn.category,
    account: 'Checking', // Default account - could be enhanced with actual account data
    isPending: false, // Default to false - could be enhanced with pending detection
    meta: {}
  };
}

/**
 * Generate a stable ID from transaction data
 */
function generateStableId(txn: Transaction): string {
  const hashInput = `${txn.date}-${txn.description}-${txn.amount}-${txn.type}`;
  return `txn-${hashInput.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
}

/**
 * Normalize array of transactions
 */
export function normalizeTransactions(txns: Transaction[]): Txn[] {
  return txns.map(normalizeTransaction);
}
