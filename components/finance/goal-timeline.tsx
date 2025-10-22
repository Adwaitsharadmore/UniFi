import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import type { Goal, GoalProgress } from "@/types/finance"
import { format } from "date-fns"
import { Check } from "lucide-react"

interface GoalTimelineProps {
  goal: Goal | null
  progress: GoalProgress | null
}

export default function GoalTimeline({ goal, progress }: GoalTimelineProps) {
  if (!goal || !progress) {
    return null
  }

  const milestones = [
    { percentage: 25, label: "Quarter", reached: progress.progressPercentage >= 25 },
    { percentage: 50, label: "Halfway", reached: progress.progressPercentage >= 50 },
    { percentage: 75, label: "Three Quarters", reached: progress.progressPercentage >= 75 },
    { percentage: 100, label: "Complete", reached: progress.progressPercentage >= 100 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          MILESTONE TIMELINE
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Started</span>
              <span className="font-mono">{format(new Date(goal.createdAt), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target Date</span>
              <span className="font-mono">{format(new Date(goal.deadline), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Projected</span>
              <span className={`font-mono ${progress.isOnTrack ? "text-success" : "text-warning"}`}>
                {format(new Date(progress.projectedCompletionDate), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          <div className="relative pt-4">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
              {milestones.map((milestone) => (
                <div key={milestone.percentage} className="relative flex items-start gap-4">
                  <div
                    className={`relative z-10 size-8 rounded-full border-2 flex items-center justify-center ${
                      milestone.reached ? "bg-success border-success" : "bg-background border-border"
                    }`}
                  >
                    {milestone.reached && <Check className="size-4 text-success-foreground" />}
                  </div>
                  <div className="flex-1 pt-1">
                    <p
                      className={`font-display uppercase ${milestone.reached ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {milestone.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{milestone.percentage}% of goal</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
