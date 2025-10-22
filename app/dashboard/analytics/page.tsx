"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { BarChart3 } from "lucide-react"
import { getTransactions, initializeTransactions } from "@/lib/finance-data"
import type { Transaction, CategorySpending, SpendingPattern } from "@/types/finance"
import { calculateCategorySpending, analyzeSpendingPatterns } from "@/lib/analytics"
import SpendingPatterns from "@/components/finance/spending-patterns"
import GamificationWidget from "@/components/finance/gamification-widget"

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([])
  const [spendingPatterns, setSpendingPatterns] = useState<SpendingPattern[]>([])

  useEffect(() => {
    const run = async () => {
      const loadedTransactions = await initializeTransactions()
      setTransactions(loadedTransactions)

      if (loadedTransactions.length > 0) {
        const categories = calculateCategorySpending(loadedTransactions)
        setCategorySpending(categories)

        const patterns = analyzeSpendingPatterns(loadedTransactions)
        setSpendingPatterns(patterns)
      }
    }
    run()
  }, [])

  return (
    <>
      <div className="lg:col-span-7">
        <DashboardPageLayout
          header={{
            title: "Analytics",
            description: "Spending insights",
            icon: BarChart3,
          }}
        >
          <SpendingPatterns patterns={spendingPatterns} />
        </DashboardPageLayout>
      </div>

      <div className="col-span-3 hidden lg:block">
        <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-y-auto">
          <GamificationWidget />
        </div>
      </div>
    </>
  )
}
