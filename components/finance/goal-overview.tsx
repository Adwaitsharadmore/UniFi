import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Goal, GoalProgress } from "@/types/finance"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, TargetIcon, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface GoalOverviewProps {
  goal: Goal | null
  progress: GoalProgress | null
}

export default function GoalOverview({ goal, progress }: GoalOverviewProps) {
  const router = useRouter()

  if (!goal || !progress) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No goal set yet</p>
        </CardContent>
      </Card>
    )
  }

  const handleShareMilestone = () => {
    // Navigate to community with pre-filled post content
    const shareText = `Just hit ${progress.progressPercentage.toFixed(0)}% of my ${goal.name} goal! 🎯 Every milestone counts on the journey to financial freedom!`
    const encodedText = encodeURIComponent(shareText)
    router.push(`/dashboard/community?tab=feed&share=${encodedText}`)
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
    <Card className="overflow-hidden">
      <CardContent className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-display uppercase">{goal.name}</h2>
            {goal.description && <p className="text-muted-foreground">{goal.description}</p>}
          </div>

          <div className="flex justify-center">
            <div className="relative size-48">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress.progressPercentage / 100)}`}
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-display">{progress.progressPercentage.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground uppercase">Complete</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-background/50 border border-border">
              <TargetIcon className="size-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground uppercase mb-1">Target</p>
              <p className="text-lg font-display">{formatCurrency(progress.targetAmount)}</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-background/50 border border-border">
              <TrendingUp className="size-6 mx-auto mb-2 text-success" />
              <p className="text-xs text-muted-foreground uppercase mb-1">Current</p>
              <p className="text-lg font-display">{formatCurrency(progress.currentAmount)}</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-background/50 border border-border">
              <Calendar className="size-6 mx-auto mb-2 text-warning" />
              <p className="text-xs text-muted-foreground uppercase mb-1">Months Left</p>
              <p className="text-lg font-display">{Math.ceil(progress.monthsToGoal)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence Score</span>
              <span className="font-mono">{progress.confidenceScore.toFixed(0)}%</span>
            </div>
            <Progress value={progress.confidenceScore} className="h-2" />
          </div>

          {/* Share Milestone Button */}
          <div className="pt-4 border-t border-border/50">
            <Button 
              onClick={handleShareMilestone}
              variant="outline" 
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Milestone in Community
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
