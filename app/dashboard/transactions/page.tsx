"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { TrendingUp } from "lucide-react"
import { getTransactions, initializeTransactions } from "@/lib/finance-data"
import type { Transaction, TransactionCategory } from "@/types/finance"
import TransactionTable from "@/components/finance/transaction-table"
import TransactionFilters from "@/components/finance/transaction-filters"
import TransactionSummary from "@/components/finance/transaction-summary"
import CategoryBreakdown from "@/components/finance/category-breakdown"
import TopMerchants from "@/components/finance/top-merchants"
import { calculateCategorySpending } from "@/lib/analytics"
import AIChatWidget from "@/components/ai-chat/ai-chat-widget"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [categorySpending, setCategorySpending] = useState([] as ReturnType<typeof calculateCategorySpending>)
  const [filters, setFilters] = useState({
    search: "",
    category: "all" as TransactionCategory | "all",
    type: "all" as "all" | "debit" | "credit",
    dateRange: "all" as "all" | "week" | "month" | "year",
  })

  useEffect(() => {
    const run = async () => {
      const loadedTransactions = await initializeTransactions()
      setTransactions(loadedTransactions)
      setFilteredTransactions(loadedTransactions)
    }
    run()
  }, [])

  useEffect(() => {
    let filtered = [...transactions]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (txn) =>
          txn.merchant.toLowerCase().includes(searchLower) ||
          txn.description.toLowerCase().includes(searchLower) ||
          txn.category.toLowerCase().includes(searchLower),
      )
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((txn) => txn.category === filters.category)
    }

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter((txn) => txn.type === filters.type)
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      switch (filters.dateRange) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter((txn) => new Date(txn.date) >= cutoffDate)
    }

    setFilteredTransactions(filtered)
  }, [filters, transactions])

  useEffect(() => {
    if (filteredTransactions.length > 0) {
      setCategorySpending(calculateCategorySpending(filteredTransactions))
    } else {
      setCategorySpending([])
    }
  }, [filteredTransactions])

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 h-screen">
        <div className="min-w-0">
          <DashboardPageLayout
            header={{
              title: "Transactions",
              description: `${filteredTransactions.length} transactions`,
              icon: TrendingUp,
            }}
          >
            <TransactionSummary transactions={filteredTransactions} />

            <div className="space-y-6">
              <TransactionFilters filters={filters} onFiltersChange={setFilters} />
              <TransactionTable transactions={filteredTransactions} />
            </div>
          </DashboardPageLayout>
        </div>

        <div className="hidden lg:block py-5">
          <div className="space-y-6 h-full overflow-y-auto">
            <CategoryBreakdown categorySpending={categorySpending} />
            <TopMerchants transactions={filteredTransactions} />
          </div>
        </div>
      </div>
      
      {/* AI Chat Widget */}
      <AIChatWidget />
    </>
  )
}
