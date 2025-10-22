"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Target } from "lucide-react"
import { getGoal, getTransactions, initializeTransactions } from "@/lib/finance-data"
import { calculateFinancialMetrics, calculateGoalProgress } from "@/lib/analytics"
import type { Goal, GoalProgress, FinancialMetrics } from "@/types/finance"
import GoalOverview from "@/components/finance/goal-overview"
import GoalTimeline from "@/components/finance/goal-timeline"
import GoalRecommendations from "@/components/finance/goal-recommendations"
import GamificationWidget from "@/components/finance/gamification-widget"
import QuickStatsWidget from "@/components/finance/quick-stats-widget"

export default function GoalsPage() {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [progress, setProgress] = useState<GoalProgress | null>(null)
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null)

  useEffect(() => {
    const run = async () => {
      const loadedGoal = getGoal()
      const transactions = await initializeTransactions()

      setGoal(loadedGoal)

      if (loadedGoal && transactions.length > 0) {
        const calculatedMetrics = calculateFinancialMetrics(transactions)
        setMetrics(calculatedMetrics)

        const calculatedProgress = calculateGoalProgress(loadedGoal, calculatedMetrics)
        setProgress(calculatedProgress)
      }
    }
    run()
  }, [])

  return (
    <>
      <div className="lg:col-span-7">
        <DashboardPageLayout
          header={{
            title: "Goals",
            description: goal?.name || "No goal set",
            icon: Target,
          }}
        >
          <GoalOverview goal={goal} progress={progress} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoalTimeline goal={goal} progress={progress} />
            <GoalRecommendations goal={goal} progress={progress} metrics={metrics} />
          </div>
        </DashboardPageLayout>
      </div>

      <div className="col-span-3 hidden lg:block">
        <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-y-auto">
          <GamificationWidget />
          <QuickStatsWidget />
        </div>
      </div>
    </>
  )
}
