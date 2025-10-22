"use client"

import { useLearning } from "@/hooks/use-learning"
import { PracticeQueue } from "@/components/learning/PracticeQueue"
import { useRouter } from "next/navigation"

export default function PracticePage() {
  const router = useRouter()
  const { getPracticeQueue } = useLearning()

  const practiceItems = getPracticeQueue()

  return (
    <div className="h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Practice</h1>
            <p className="text-muted-foreground">
              Review exercises to strengthen your knowledge
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/learning')}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
          >
            Back to Learning
          </button>
        </div>

        <PracticeQueue 
          practiceItems={practiceItems}
          onComplete={() => router.push('/dashboard/learning')}
        />
      </div>
    </div>
  )
}
