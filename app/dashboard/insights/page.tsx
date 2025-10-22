"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Lightbulb } from "lucide-react"
import { getTransactions, getInsights, saveInsights, initializeTransactions } from "@/lib/finance-data"
import { calculateCategorySpending } from "@/lib/analytics"
import type { Insight } from "@/types/finance"
import { generateInsights } from "@/lib/insights"
import InsightCard from "@/components/finance/insight-card"
import GamificationWidget from "@/components/finance/gamification-widget"
import QuickStatsWidget from "@/components/finance/quick-stats-widget"

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    const run = async () => {
      const transactions = await initializeTransactions()
      let loadedInsights = getInsights()

    // Generate insights if none exist
    if (loadedInsights.length === 0 && transactions.length > 0) {
      const categorySpending = calculateCategorySpending(transactions)
      loadedInsights = generateInsights(transactions, categorySpending)
      saveInsights(loadedInsights)
    }

      setInsights(loadedInsights)
    }
    run()
  }, [])

  const handleDismiss = (insightId: string) => {
    const updated = insights.filter((i) => i.id !== insightId)
    setInsights(updated)
    saveInsights(updated)
  }

  const opportunityInsights = insights.filter((i) => i.type === "opportunity")
  const warningInsights = insights.filter((i) => i.type === "warning")
  const achievementInsights = insights.filter((i) => i.type === "achievement")

  return (
    <>
      <div className="lg:col-span-7">
        <DashboardPageLayout
          header={{
            title: "Insights",
            description: `${insights.length} recommendations`,
            icon: Lightbulb,
          }}
        >
          {insights.length === 0 ? (
            <div className="text-center py-12 bg-accent rounded-lg border border-border">
              <Lightbulb className="size-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-display uppercase mb-2">No Insights Yet</p>
              <p className="text-sm text-muted-foreground">
                Keep tracking your transactions to get personalized insights
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {opportunityInsights.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-display uppercase flex items-center gap-2">
                    <span className="size-2 rounded-full bg-success" />
                    Savings Opportunities
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {opportunityInsights.map((insight) => (
                      <InsightCard key={insight.id} insight={insight} onDismiss={handleDismiss} />
                    ))}
                  </div>
                </div>
              )}

              {warningInsights.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-display uppercase flex items-center gap-2">
                    <span className="size-2 rounded-full bg-warning" />
                    Attention Needed
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {warningInsights.map((insight) => (
                      <InsightCard key={insight.id} insight={insight} onDismiss={handleDismiss} />
                    ))}
                  </div>
                </div>
              )}

              {achievementInsights.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-display uppercase flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    Achievements
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {achievementInsights.map((insight) => (
                      <InsightCard key={insight.id} insight={insight} onDismiss={handleDismiss} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
