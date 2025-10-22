"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { TrendingUp, TrendingDown, Target, Calendar } from "lucide-react"
import { getGoal, getTransactions, initializeTransactions } from "@/lib/finance-data"
import { calculateAnalytics } from "@/lib/analytics"
import type { Goal, Transaction } from "@/types/finance"

export default function QuickStatsWidget() {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const run = async () => {
      const loadedGoal = getGoal()
      const loadedTransactions = await initializeTransactions()
      setGoal(loadedGoal)
      setTransactions(loadedTransactions)
    }
    run()
  }, [])

  if (!goal || transactions.length === 0) return null

  const analytics = calculateAnalytics(transactions, goal)
  const daysToGoal = Math.ceil((goal.targetAmount - goal.currentAmount) / (analytics.monthlyNet / 30))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          QUICK STATS
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-4">
        {/* Goal Progress */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border">
          <div className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            <div>
              <div className="text-sm font-medium font-mono">{analytics.goalProgress.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground uppercase">Goal Progress</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium font-mono">${goal.currentAmount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">of ${goal.targetAmount.toLocaleString()}</div>
          </div>
        </div>

        {/* Monthly Net */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border">
          <div className="flex items-center gap-2">
            {analytics.monthlyNet >= 0 ? (
              <TrendingUp className="size-5 text-success" />
            ) : (
              <TrendingDown className="size-5 text-destructive" />
            )}
            <div>
              <div className="text-sm font-medium font-mono">${Math.abs(analytics.monthlyNet).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground uppercase">Monthly Net</div>
            </div>
          </div>
        </div>

        {/* Days to Goal */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-chart-4" />
            <div>
              <div className="text-sm font-medium font-mono">{daysToGoal > 0 ? daysToGoal : "—"} DAYS</div>
              <div className="text-xs text-muted-foreground uppercase">To Goal</div>
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-muted-foreground font-medium">SAVINGS RATE</span>
            <span className="text-sm font-medium font-mono">{analytics.savingsRate.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
