import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Progress } from "@/components/ui/progress"
import type { GamificationData } from "@/types/finance"
import { getLevelTitle, getXPForNextLevel } from "@/lib/gamification"
import { Zap } from "lucide-react"
import { Trophy } from "lucide-react" // Declaring Trophy variable

interface LevelProgressProps {
  gamification: GamificationData
}

export default function LevelProgress({ gamification }: LevelProgressProps) {
  const nextLevelXP = getXPForNextLevel(gamification.xp)
  const currentLevelXP = (gamification.level - 1) * 1000
  const xpInCurrentLevel = gamification.xp - currentLevelXP
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP
  const progressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          LEVEL & XP
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center size-24 rounded-full bg-primary/20 border-4 border-primary">
            <span className="text-4xl font-display text-primary">{gamification.level}</span>
          </div>
          <p className="text-lg font-display uppercase">{getLevelTitle(gamification.level)}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current XP</span>
            <span className="font-mono">
              {gamification.xp.toLocaleString()} / {nextLevelXP.toLocaleString()}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            {(xpNeededForNextLevel - xpInCurrentLevel).toLocaleString()} XP to next level
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-background/50 border border-border text-center">
            <Zap className="size-6 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-display">{gamification.xp.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground uppercase">Total XP</p>
          </div>
          <div className="p-4 rounded-lg bg-background/50 border border-border text-center">
            <Trophy className="size-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-display">{gamification.badges.filter((b) => b.unlocked).length}</p>
            <p className="text-xs text-muted-foreground uppercase">Badges Earned</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
