import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Challenge } from "@/types/finance"
import { Target, Clock } from "lucide-react"

interface ChallengesSectionProps {
  challenges: Challenge[]
}

export default function ChallengesSection({ challenges }: ChallengesSectionProps) {
  const activeChallenges = challenges.filter((c) => c.active)
  // Strip completed list from the compact panel

  // Sample challenges if none exist
  const sampleChallenges: Challenge[] = [
    {
      id: "challenge-1",
      name: "No Dining Out Week",
      description: "Avoid dining out for 7 consecutive days",
      type: "weekly",
      progress: 3,
      target: 7,
      reward: 200,
      active: true,
      expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "challenge-2",
      name: "Save $500 This Month",
      description: "Reach $500 in net savings by month end",
      type: "custom",
      progress: 320,
      target: 500,
      reward: 500,
      active: true,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "challenge-3",
      name: "Log 10 Transactions",
      description: "Record 10 transactions this week",
      type: "weekly",
      progress: 10,
      target: 10,
      reward: 100,
      active: false,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const displayChallenges = activeChallenges.length > 0 ? activeChallenges : sampleChallenges.filter((c) => c.active)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          CHALLENGES
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-4">
        {displayChallenges.length > 0 && (
          <div className="space-y-2">
            <div className="space-y-2">
              {displayChallenges.map((challenge) => {
                const progressPercentage = (challenge.progress / challenge.target) * 100
                return (
                  <div key={challenge.id} className="p-3 rounded-lg bg-background/50 border border-border space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Target className="size-4 text-primary shrink-0" />
                        <h4 className="font-display uppercase truncate">{challenge.name}</h4>
                        <Badge variant="outline" className="text-[10px] uppercase shrink-0">
                          {challenge.type}
                        </Badge>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground uppercase">{challenge.reward} XP</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{challenge.progress} / {challenge.target}</span>
                        {challenge.expiresAt && (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Clock className="size-3" />
                            {Math.ceil((new Date(challenge.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
                          </span>
                        )}
                      </div>
                      <Progress value={progressPercentage} className="h-1.5" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
