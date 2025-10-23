import type { Txn } from './types';

/**
 * Check if a transaction looks like a transfer based on category and description
 */
export function looksLikeTransfer(t: Txn): boolean {
  const desc = t.description.toLowerCase();
  const category = (t.category || '').toLowerCase();
  
  // Category-based transfer detection
  if (category.includes('transfer') || category.includes('payment to card') || category.includes('cc payment')) {
    return true;
  }
  
  // Description-based transfer detection
  const transferPatterns = [
    /transfer/i,
    /xfer/i,
    /venmo transfer/i,
    /zelle transfer/i,
    /atm cash deposit/i,
    /cash withdrawal/i,
    /payment to card/i,
    /cc payment/i,
    /to savings/i,
    /from savings/i,
    /brokerage/i,
    /coinbase/i,
    /robinhood/i,
    /401k/i,
    /investment/i
  ];
  
  return transferPatterns.some(pattern => pattern.test(desc));
}

/**
 * Check if a transaction looks like a refund based on description
 */
export function looksLikeRefund(t: Txn): boolean {
  const desc = t.description.toLowerCase();
  
  const refundPatterns = [
    /refund/i,
    /reversal/i,
    /return/i,
    /chargeback/i,
    /cashback/i
  ];
  
  return refundPatterns.some(pattern => pattern.test(desc));
}

/**
 * Calculate merchant similarity using Jaccard similarity on tokenized strings
 */
export function similarMerchants(a?: string, b?: string): number {
  if (!a || !b) return 0;
  
  const tokenize = (str: string) => 
    str.toLowerCase()
       .replace(/[^\w\s]/g, ' ')
       .split(/\s+/)
       .filter(token => token.length > 2);
  
  const tokensA = new Set(tokenize(a));
  const tokensB = new Set(tokenize(b));
  
  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Find transfer pairs within a 48-hour window
 */
export function pairTransfers(txns: Txn[]): Set<string> {
  const transferIds = new Set<string>();
  const sortedTxns = [...txns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  for (let i = 0; i < sortedTxns.length; i++) {
    const txnA = sortedTxns[i];
    if (txnA.direction !== 'outflow') continue;
    
    // Look for matching inflow within 48 hours
    for (let j = i + 1; j < sortedTxns.length; j++) {
      const txnB = sortedTxns[j];
      
      // Stop if more than 48 hours apart
      const timeDiff = new Date(txnB.date).getTime() - new Date(txnA.date).getTime();
      if (timeDiff > 48 * 60 * 60 * 1000) break;
      
      // Check for transfer pair conditions
      if (
        txnB.direction === 'inflow' &&
        txnA.amountCents === txnB.amountCents &&
        txnA.account !== txnB.account &&
        (
          similarMerchants(txnA.description, txnB.description) >= 0.6 ||
          similarMerchants(txnA.merchant, txnB.merchant) >= 0.6 ||
          (txnA.category === 'Transfer' || txnA.category === 'Credit Card Payment') ||
          (txnB.category === 'Transfer' || txnB.category === 'Credit Card Payment')
        )
      ) {
        transferIds.add(txnA.id);
        transferIds.add(txnB.id);
        break; // Found a pair, move to next transaction
      }
    }
  }
  
  return transferIds;
}

/**
 * Mark transfers in transaction list
 */
export function markTransfers(txns: Txn[]): Txn[] {
  const transferIds = pairTransfers(txns);
  
  return txns.map(txn => ({
    ...txn,
    meta: {
      ...txn.meta,
      transfer: transferIds.has(txn.id) || looksLikeTransfer(txn)
    }
  }));
}

/**
 * Mark refunds in transaction list
 */
export function markRefunds(txns: Txn[]): Txn[] {
  const sortedTxns = [...txns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return sortedTxns.map((txn, index) => {
    if (txn.direction !== 'inflow' || !looksLikeRefund(txn)) {
      return txn;
    }
    
    // Look for matching expense in the last 60 days
    const txnDate = new Date(txn.date);
    const sixtyDaysAgo = new Date(txnDate.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    for (let i = index - 1; i >= 0; i--) {
      const prevTxn = sortedTxns[i];
      const prevDate = new Date(prevTxn.date);
      
      if (prevDate < sixtyDaysAgo) break;
      
      if (
        prevTxn.direction === 'outflow' &&
        similarMerchants(txn.description, prevTxn.description) >= 0.4
      ) {
        return {
          ...txn,
          meta: {
            ...txn.meta,
            refund: true
          }
        };
      }
    }
    
    return txn;
  });
}
