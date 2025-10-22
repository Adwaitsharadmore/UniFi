import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import type { GamificationData } from "@/types/finance"
import { Flame } from "lucide-react"

interface StreakTrackerProps {
  gamification: GamificationData
}

export default function StreakTracker({ gamification }: StreakTrackerProps) {
  const streakMilestones = [7, 30, 100, 365]
  const nextMilestone = streakMilestones.find((m) => m > gamification.streak) || 365

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          STREAK
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-5">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-orange-500/15 border-2 border-orange-500">
            <Flame className="size-8 text-orange-500" />
          </div>
          <div>
            <p className="text-4xl font-display leading-none">{gamification.streak}</p>
            <p className="text-xs text-muted-foreground uppercase">Day streak</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-background/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground uppercase">Next milestone</span>
            <span className="text-xs font-mono">{nextMilestone}d</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
              style={{ width: `${(gamification.streak / nextMilestone) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {gamification.streak > 0 ? "One day at a time. Keep it going!" : "Make today day 1."}
        </p>
      </CardContent>
    </Card>
  )
}
