"use client"

import { useLearning } from "@/hooks/use-learning"
import { CheckpointPlayer } from "@/components/learning/CheckpointPlayer"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CheckpointPage() {
  const { checkpointId } = useParams()
  const router = useRouter()
  const { curriculum } = useLearning()

  // Find the unit that contains this checkpoint
  const unit = curriculum.find(u => u.checkpointId === checkpointId)

  if (!unit) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Checkpoint Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The checkpoint you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/dashboard/learning')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Back to Learning
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <CheckpointPlayer 
        checkpointId={checkpointId as string}
        unit={unit}
        onComplete={() => router.push('/dashboard/learning')}
      />
    </div>
  )
}
