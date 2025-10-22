"use client"

import { useEffect, useState } from "react"
import { getGamification } from "@/lib/finance-data"
import type { GamificationData } from "@/types/finance"

import StreakTracker from "@/components/gamification/streak-tracker"
import BadgeShowcase from "@/components/gamification/badge-showcase"
import ChallengesSection from "@/components/gamification/challenges-section"

export default function GamificationPanel() {
  const [gamification, setGamification] = useState<GamificationData | null>(null)

  useEffect(() => {
    const data = getGamification()
    setGamification(data)
  }, [])

  if (!gamification) return null

  return (
    <div className="space-y-6">
      {/* Compact, motivational layout inspired by Duolingo */}
      <StreakTracker gamification={gamification} />
      <ChallengesSection challenges={(gamification.challenges || []).slice(0, 3)} />
      {gamification.badges?.length > 0 && <BadgeShowcase badges={gamification.badges.slice(0, 8)} />}
    </div>
  )
}


