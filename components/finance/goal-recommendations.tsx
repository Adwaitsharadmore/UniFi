import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import type { Goal, GoalProgress, FinancialMetrics } from "@/types/finance"
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface GoalRecommendationsProps {
  goal: Goal | null
  progress: GoalProgress | null
  metrics: FinancialMetrics | null
}

export default function GoalRecommendations({ goal, progress, metrics }: GoalRecommendationsProps) {
  if (!goal || !progress || !metrics) {
    return null
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const recommendations = []

  // Check if on track
  if (progress.isOnTrack) {
    recommendations.push({
      type: "success",
      icon: CheckCircle,
      title: "You're on track!",
      description: `Keep up the great work. You're projected to reach your goal ${Math.ceil((new Date(progress.projectedCompletionDate).getTime() - new Date(goal.deadline).getTime()) / (1000 * 60 * 60 * 24 * 30))} months early.`,
    })
  } else {
    const additionalNeeded = progress.requiredMonthlySavings - (metrics.monthlyIncome - metrics.monthlyExpenses)
    recommendations.push({
      type: "warning",
      icon: AlertTriangle,
      title: "Increase your savings",
      description: `To reach your goal on time, you need to save an additional ${formatCurrency(additionalNeeded)} per month.`,
    })
  }

  // Savings rate recommendation
  if (metrics.savingsRate < 20) {
    recommendations.push({
      type: "opportunity",
      icon: TrendingUp,
      title: "Boost your savings rate",
      description: `Your current savings rate is ${metrics.savingsRate.toFixed(1)}%. Aim for at least 20% to build wealth faster.`,
    })
  }

  // Monthly savings recommendation
  recommendations.push({
    type: "info",
    icon: TrendingUp,
    title: "Required monthly savings",
    description: `Save ${formatCurrency(progress.requiredMonthlySavings)} per month to reach your ${formatCurrency(goal.targetAmount)} goal by ${new Date(goal.deadline).toLocaleDateString()}.`,
  })

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-success"
      case "warning":
        return "text-warning"
      case "opportunity":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-success/20"
      case "warning":
        return "bg-warning/20"
      case "opportunity":
        return "bg-primary/20"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          RECOMMENDATIONS
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent">
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon
            return (
              <div key={index} className="flex gap-3 p-4 rounded-lg bg-background/50 border border-border">
                <div className={`size-10 rounded-lg ${getBgColor(rec.type)} flex items-center justify-center shrink-0`}>
                  <Icon className={`size-5 ${getIconColor(rec.type)}`} />
                </div>
                <div className="flex-1">
                  <p className="font-display uppercase text-sm mb-1">{rec.title}</p>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
