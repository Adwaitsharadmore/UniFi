import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Progress } from "@/components/ui/progress"
import type { Goal, GoalProgress } from "@/types/finance"
import { format } from "date-fns"

interface GoalProgressCardProps {
  goal: Goal | null
  progress: GoalProgress | null
}

export default function GoalProgressCard({ goal, progress }: GoalProgressCardProps) {
  if (!goal || !progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <Bullet />
            GOAL PROGRESS
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-accent">
          <p className="text-muted-foreground text-sm">No goal set yet</p>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          GOAL PROGRESS
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-6">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-2xl font-display uppercase">{goal.name}</h3>
            <span className="text-sm text-muted-foreground">{progress.progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progress.progressPercentage} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Current</p>
            <p className="text-xl font-display">{formatCurrency(progress.currentAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Target</p>
            <p className="text-xl font-display">{formatCurrency(progress.targetAmount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Target Date</p>
            <p className="text-sm font-mono">{format(new Date(goal.deadline), "MMM dd, yyyy")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Projected</p>
            <p className="text-sm font-mono">{format(new Date(progress.projectedCompletionDate), "MMM dd, yyyy")}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase mb-2">Required Monthly Savings</p>
          <p className="text-2xl font-display">{formatCurrency(progress.requiredMonthlySavings)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {progress.isOnTrack ? "You're on track to reach your goal!" : "Increase savings to stay on track"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
