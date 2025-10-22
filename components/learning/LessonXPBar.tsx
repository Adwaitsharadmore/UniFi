"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface LessonXPBarProps {
  currentXP: number
  goalXP: number
}

export function LessonXPBar({ currentXP, goalXP }: LessonXPBarProps) {
  const progress = (currentXP / goalXP) * 100

  return (
    <div className="flex items-center gap-2 min-w-32">
      <span className="text-sm font-medium">XP</span>
      <div className="flex-1">
        <Progress 
          value={progress} 
          className="h-2 bg-muted/50"
        />
      </div>
      <span className="text-sm text-muted-foreground min-w-8">
        {currentXP}/{goalXP}
      </span>
    </div>
  )
}
