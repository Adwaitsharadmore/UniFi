"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { TrendingUp, Target } from "lucide-react"
import { getGoal, getTransactions, initializeTransactions } from "@/lib/finance-data"
import { calculateAnalytics } from "@/lib/analytics"
import type { Goal, Transaction } from "@/types/finance"

export default function TransactionsMetricsWidget() {
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
              <TrendingUp className="size-5 text-destructive" />
            )}
            <div>
              <div className="text-sm font-medium font-mono">${Math.abs(analytics.monthlyNet).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground uppercase">Monthly Net</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
