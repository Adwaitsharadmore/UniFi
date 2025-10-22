import type { Transaction, TransactionCategory } from "@/types/finance"
import { parse, format as formatDate } from "date-fns"

// Category keywords for auto-categorization
const CATEGORY_KEYWORDS: Record<TransactionCategory, string[]> = {
  Shopping: ["TARGET", "WALMART", "AMAZON", "COSTCO", "BEST BUY", "HOLIDAY GIFT SHOP"],
  Dining: ["STARBUCKS", "CHIPOTLE", "MCDONALDS", "DUNKIN DONUTS", "RESTAURANT", "CAFE", "PIZZA", "BURGER"],
  Transportation: ["SHELL", "CHEVRON", "UBER", "LYFT", "GAS", "PARKING"],
  Healthcare: ["CVS", "WALGREENS", "PHARMACY", "DOCTOR", "HOSPITAL", "MEDICAL"],
  Subscriptions: ["SPOTIFY", "NETFLIX", "HULU", "DISNEY", "APPLE", "SUBSCRIPTION"],
  Fitness: ["PLANET FITNESS", "GYM", "YOGA", "PELOTON"],
  Housing: ["RENT", "MORTGAGE", "PROPERTY", "METRO REALTY"],
  Income: ["PAYROLL", "SALARY", "DEPOSIT", "ADROIT SERVICES"],
  Cash: ["ATM", "WITHDRAWAL", "CASH", "CHASE ATM"],
  Services: ["ZELLE", "VENMO", "PAYPAL", "TRANSFER"],
  Entertainment: ["MOVIE", "THEATER", "CONCERT", "GAME"],
  Groceries: ["GROCERY", "WHOLE FOODS", "TRADER JOE", "SAFEWAY"],
  Utilities: ["ELECTRIC", "WATER", "GAS", "INTERNET", "PHONE", "AT&T", "T-MOBILE"],
  Other: [],
}

export function categorizeTransaction(description: string): TransactionCategory {
  const upperDesc = description.toUpperCase()

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => upperDesc.includes(keyword))) {
      return category as TransactionCategory
    }
  }

  return "Other"
}

export function extractMerchant(description: string): string {
  // Remove common prefixes and clean up
  const cleaned = description
    .replace(/^(DEBIT CARD PURCHASE|CREDIT CARD|ACH|CHECK)\s*/i, "")
    .replace(/\s+\d{4}$/, "") // Remove trailing numbers
    .trim()

  return cleaned
}

export function parseCSVTransactions(csvData: string): Transaction[] {
  const lines = csvData.trim().split(/\r?\n/)
  const transactions: Transaction[] = []

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Parse CSV line properly handling commas within quoted fields
    const parts = parseCSVLine(line)

    if (parts.length < 5) continue

    const dateRaw = parts[0].trim()
    const description = parts[1].trim()
    const withdrawal = parts[2].trim()
    const deposit = parts[3].trim()
    const balance = parts[4].trim()

    // Skip BEGINNING BALANCE entries
    if (description.includes("BEGINNING BALANCE")) continue

    // Determine amount and type
    let amount = 0
    let type: "debit" | "credit" = "debit"
    
    if (withdrawal && withdrawal !== "") {
      amount = parseAmount(withdrawal)
      type = "debit"
    } else if (deposit && deposit !== "") {
      amount = parseAmount(deposit)
      type = "credit"
    }

    // Skip zero amount transactions
    if (amount === 0) continue

    const merchant = extractMerchant(description)
    const category = categorizeTransaction(description)
    const balanceAmount = parseAmount(balance)

    // Normalize date to yyyy-MM-dd for analytics
    let normalizedDate = dateRaw
    try {
      // Handle MM/DD/YY format (e.g., "07/01/25" -> "2025-07-01")
      const parsed = parse(dateRaw, "MM/dd/yy", new Date())
      normalizedDate = formatDate(parsed, "yyyy-MM-dd")
    } catch {
      // Fallback: try to parse as-is if it's already in a different format
      try {
        const parsed = new Date(dateRaw)
        if (!isNaN(parsed.getTime())) {
          normalizedDate = formatDate(parsed, "yyyy-MM-dd")
        }
      } catch {}
    }

    transactions.push({
      id: `txn-${Date.now()}-${i}`,
      date: normalizedDate,
      description,
      merchant,
      amount,
      type,
      category,
      balance: balanceAmount,
      tags: [],
    })
  }

  return transactions
}

// Helper function to parse CSV line properly handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

// Helper function to parse amount strings like "$120.00" or "$(41.65)"
function parseAmount(amountStr: string): number {
  if (!amountStr || amountStr === "") return 0
  
  // Remove currency symbols, commas, and parentheses
  const cleaned = amountStr
    .replace(/[$,\s]/g, "")
    .replace(/[()]/g, "-")
  
  const amount = Number.parseFloat(cleaned)
  return isNaN(amount) ? 0 : amount
}

// Detect recurring transactions
export function detectRecurringTransactions(transactions: Transaction[]): Transaction[] {
  const merchantCounts = new Map<string, Transaction[]>()

  // Group by merchant
  transactions.forEach((txn) => {
    const existing = merchantCounts.get(txn.merchant) || []
    existing.push(txn)
    merchantCounts.set(txn.merchant, existing)
  })

  // Mark recurring if same merchant appears 3+ times with similar amounts
  merchantCounts.forEach((txns) => {
    if (txns.length >= 3) {
      const amounts = txns.map((t) => t.amount)
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length
      const variance = amounts.reduce((sum, amt) => sum + Math.abs(amt - avgAmount), 0) / amounts.length

      // If variance is low (within 20% of average), mark as recurring
      if (variance < avgAmount * 0.2) {
        txns.forEach((t) => {
          t.isRecurring = true
        })
      }
    }
  })

  return transactions
}

// Detect unusual transactions
export function detectUnusualTransactions(transactions: Transaction[]): Transaction[] {
  const amounts = transactions.filter((t) => t.type === "debit").map((t) => t.amount)

  if (amounts.length === 0) return transactions

  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length
  const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length
  const stdDev = Math.sqrt(variance)

  transactions.forEach((txn) => {
    if (txn.type === "debit" && txn.amount > mean + 2 * stdDev) {
      txn.isUnusual = true
    }
  })

  return transactions
}
