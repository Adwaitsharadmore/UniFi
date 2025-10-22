"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bullet } from "@/components/ui/bullet"
import { Flame, Trophy, Zap } from "lucide-react"
import { getGamification } from "@/lib/finance-data"
import type { GamificationData } from "@/types/finance"
import { calculateLevel, calculateXPForNextLevel } from "@/lib/gamification"

export default function GamificationWidget() {
  const [gamification, setGamification] = useState<GamificationData | null>(null)

  useEffect(() => {
    const data = getGamification()
    setGamification(data)
  }, [])

  if (!gamification) return null

  const level = calculateLevel(gamification.totalXP || 0)
  const xpForNextLevel = calculateXPForNextLevel(level) || 0
  const prevLevelXP = level > 1 ? calculateXPForNextLevel(level - 1) || 0 : 0
  const currentLevelXP = (gamification.totalXP || 0) - prevLevelXP
  const xpNeeded = xpForNextLevel - prevLevelXP
  const progress = xpNeeded > 0 ? (currentLevelXP / xpNeeded) * 100 : 0

  const unlockedBadges = gamification.badges?.filter((b) => b.unlocked).length || 0
  const totalBadges = gamification.badges?.length || 0
  const latestBadge = gamification.badges?.filter((b) => b.unlocked)[0]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          YOUR PROGRESS
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground font-medium">LEVEL</span>
          <Badge variant="secondary" className="bg-background/50 uppercase">
            {level}
          </Badge>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-warning" />
              <span className="font-medium font-mono">{(gamification.totalXP || 0).toLocaleString()} XP</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">{xpForNextLevel.toLocaleString()} XP</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border">
          <div className="flex items-center gap-2">
            <Flame className="size-5 text-chart-5" />
            <div>
              <div className="text-sm font-medium font-mono">{gamification.currentStreak || 0} DAY STREAK</div>
              <div className="text-xs text-muted-foreground uppercase">Keep it going!</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-warning" />
            <div>
              <div className="text-sm font-medium font-mono">
                {unlockedBadges}/{totalBadges} BADGES
              </div>
              <div className="text-xs text-muted-foreground uppercase">Unlocked</div>
            </div>
          </div>
        </div>

        {/* Recent Badge */}
        {latestBadge && (
          <div className="pt-2 border-t border-border">
            <div className="text-xs uppercase text-muted-foreground font-medium mb-2">LATEST BADGE</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl">{latestBadge.icon}</div>
              <div>
                <div className="text-sm font-medium uppercase">{latestBadge.name}</div>
                <div className="text-xs text-muted-foreground">{latestBadge.description}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
