"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Trophy } from "lucide-react"
import { getGamification, getGoal, getTransactions, saveGamification, initializeTransactions } from "@/lib/finance-data"
import { checkBadgeUnlocks } from "@/lib/gamification"
import type { GamificationData } from "@/types/finance"
import LevelProgress from "@/components/gamification/level-progress"
import StreakTracker from "@/components/gamification/streak-tracker"
import BadgeShowcase from "@/components/gamification/badge-showcase"
import ChallengesSection from "@/components/gamification/challenges-section"
import GamificationWidget from "@/components/finance/gamification-widget"
import QuickStatsWidget from "@/components/finance/quick-stats-widget"

export default function GamificationPage() {
  const [gamification, setGamification] = useState<GamificationData | null>(null)

  useEffect(() => {
    const run = async () => {
      const loadedGamification = getGamification()
      const goal = getGoal()
      const transactions = await initializeTransactions()

      // Check for new badge unlocks
      const unlockedBadges = checkBadgeUnlocks(loadedGamification, goal, transactions)

      if (unlockedBadges.length > 0) {
        saveGamification(loadedGamification)
      }

      setGamification(loadedGamification)
    }
    run()
  }, [])

  if (!gamification) {
    return null
  }

  return (
    <>
      <div className="lg:col-span-7">
        <DashboardPageLayout
          header={{
            title: "Gamification",
            description: `Level ${gamification.level}`,
            icon: Trophy,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LevelProgress gamification={gamification} />
            <StreakTracker gamification={gamification} />
          </div>

          <BadgeShowcase badges={gamification.badges} />

          <ChallengesSection challenges={gamification.challenges} />
        </DashboardPageLayout>
      </div>

      <div className="col-span-3 hidden lg:block">
        <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-y-auto">
          <GamificationWidget />
        </div>
      </div>
    </>
  )
}
