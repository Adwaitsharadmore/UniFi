"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bullet } from "@/components/ui/bullet"
import { Badge } from "@/components/ui/badge"
import type { Badge as BadgeType } from "@/types/finance"
import { Lock, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface BadgeShowcaseProps {
  badges: BadgeType[]
}

export default function BadgeShowcase({ badges }: BadgeShowcaseProps) {
  const router = useRouter()
  const unlockedBadges = badges.filter((b) => b.unlocked)
  const lockedBadges = badges.filter((b) => !b.unlocked)

  const handleShowInCommunity = () => {
    const shareText = `Just earned ${unlockedBadges.length} new badge${unlockedBadges.length > 1 ? 's' : ''}! 🏆 ${unlockedBadges.map(b => b.name).join(', ')} - Every achievement counts on the journey to financial freedom!`
    const encodedText = encodeURIComponent(shareText)
    router.push(`/dashboard/community?tab=feed&share=${encodedText}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          BADGES
          <Badge variant="outline" className="ml-auto">
            {unlockedBadges.length} / {badges.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-3">
        {unlockedBadges.length > 0 && (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center"
                title={badge.name}
              >
                <div className="text-3xl">{badge.icon}</div>
                <p className="text-[11px] mt-1 font-display uppercase truncate">{badge.name}</p>
              </div>
            ))}
          </div>
        )}

        {lockedBadges.length > 0 && (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-lg bg-muted/20 border border-border text-center opacity-60"
                title={badge.name}
              >
                <div className="relative">
                  <div className="text-3xl grayscale">{badge.icon}</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="size-5 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-[11px] mt-1 font-display uppercase truncate">{badge.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Show in Community Button */}
        {unlockedBadges.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <Button 
              onClick={handleShowInCommunity}
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Show in Community
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
