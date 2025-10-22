"use client"

import { useLearning } from "@/hooks/use-learning"
import { LessonPlayer } from "@/components/learning/LessonPlayer"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LessonPage() {
  const { lessonId } = useParams()
  const router = useRouter()
  const { getLesson, startLesson, currentLesson } = useLearning()

  const lesson = getLesson(lessonId as string)

  useEffect(() => {
    if (lesson && !currentLesson) {
      startLesson(lessonId as string)
    }
  }, [lesson, lessonId, startLesson, currentLesson])

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Lesson Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The lesson you're looking for doesn't exist.
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
      <LessonPlayer 
        lessonId={lessonId as string}
        onComplete={() => router.push('/dashboard/learning')}
      />
    </div>
  )
}
