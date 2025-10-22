"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import BracketsIcon from "@/components/icons/brackets"
import { getGoal, getTransactions, initializeTransactions } from "@/lib/finance-data"
import { calculateFinancialMetrics, calculateGoalProgress } from "@/lib/analytics"
import type { Goal, Transaction, FinancialMetrics, GoalProgress } from "@/types/finance"
import FinancialChart from "@/components/finance/financial-chart"
import RecentTransactions from "@/components/finance/recent-transactions"
import GoalProgressCard from "@/components/finance/goal-progress-card"
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react"
import GamificationPanel from "@/components/finance/gamification-panel"

export default function DashboardOverview() {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null)
  const [progress, setProgress] = useState<GoalProgress | null>(null)

  useEffect(() => {
    const run = async () => {
      const loadedGoal = getGoal()
      const loadedTransactions = await initializeTransactions()

      setGoal(loadedGoal)
      setTransactions(loadedTransactions)

      if (loadedTransactions.length > 0) {
        const calculatedMetrics = calculateFinancialMetrics(loadedTransactions)
        setMetrics(calculatedMetrics)

        if (loadedGoal) {
          const calculatedProgress = calculateGoalProgress(loadedGoal, calculatedMetrics)
          setProgress(calculatedProgress)
        }
      }
    }

    run()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="w-full">
        <DashboardPageLayout
          header={{
            title: "Overview",
            description: `Last updated ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
            icon: BracketsIcon,
          }}
        >
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardStat
              label="GOAL PROGRESS"
              value={progress ? formatPercentage(progress.progressPercentage) : "0%"}
              description={progress?.isOnTrack ? "ON TRACK" : "NEEDS ATTENTION"}
              icon={Target}
              intent={progress?.isOnTrack ? "positive" : "negative"}
              direction={progress?.isOnTrack ? "up" : "down"}
            />

            <DashboardStat
              label="SAVINGS RATE"
              value={metrics ? formatPercentage(metrics.savingsRate) : "0%"}
              description="OF INCOME SAVED"
              icon={TrendingUp}
              intent={metrics && metrics.savingsRate > 20 ? "positive" : "neutral"}
              direction={metrics && metrics.savingsRate > 20 ? "up" : undefined}
            />

            <DashboardStat
              label="AVAILABLE BALANCE"
              value={metrics ? formatCurrency(metrics.monthlyIncome - metrics.monthlyExpenses) : "$0"}
              description="INCOME - EXPENSES"
              icon={DollarSign}
              intent={metrics && metrics.monthlyIncome > metrics.monthlyExpenses ? "positive" : "negative"}
              direction={metrics && metrics.monthlyIncome > metrics.monthlyExpenses ? "up" : "down"}
            />

            <DashboardStat
              label="DAYS TO GOAL"
              value={progress ? Math.ceil(progress.monthsToGoal * 30).toString() : "0"}
              description="PROJECTED COMPLETION"
              icon={TrendingDown}
              intent="neutral"
            />
          </div>

          {/* Financial Chart */}
          <div>
            <FinancialChart transactions={transactions} />
          </div>

          {/* Bottom Section: Goal Progress and Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoalProgressCard goal={goal} progress={progress} />
            <RecentTransactions transactions={transactions.slice(0, 10)} />
          </div>

        </DashboardPageLayout>
      </div>

      <div className="hidden lg:block">
        <div className="space-y-6 py-sides sticky top-0">
          <GamificationPanel />
        </div>
      </div>
    </div>
  )
}
