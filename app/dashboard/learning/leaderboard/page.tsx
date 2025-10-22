"use client"

import { useLearning } from "@/hooks/use-learning"
import { WeeklyLeaderboard } from "@/components/learning/WeeklyLeaderboard"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function LeaderboardPage() {
  const router = useRouter()
  const { getLeaderboard } = useLearning()
  const [leaderboard, setLeaderboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await getLeaderboard()
        setLeaderboard(data)
      } catch (error) {
        console.error('Failed to load leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [getLeaderboard])

  return (
    <div className="h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Weekly Leaderboard</h1>
            <p className="text-muted-foreground">
              See how you rank against other learners
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/learning')}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
          >
            Back to Learning
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading leaderboard...</p>
            </div>
          </div>
        ) : (
          <WeeklyLeaderboard leaderboard={leaderboard} />
        )}
      </div>
    </div>
  )
}
