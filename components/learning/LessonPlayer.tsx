"use client"

import { useState, useEffect } from "react"
import { useLearning } from "@/hooks/use-learning"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Hearts } from "./Hearts"
import { LessonXPBar } from "./LessonXPBar"
import { StreakFlame } from "./StreakFlame"
import { MultipleChoiceEx } from "./exercises/MultipleChoiceEx"
import { TapTokensEx } from "./exercises/TapTokensEx"
import { FillNumericEx } from "./exercises/FillNumericEx"
import { CategorizeTxnEx } from "./exercises/CategorizeTxnEx"
import { BudgetScenarioEx } from "./exercises/BudgetScenarioEx"
import { TrueFalseEx } from "./exercises/TrueFalseEx"
import { OrderStepsEx } from "./exercises/OrderStepsEx"
import { CompletionModal } from "./CompletionModal"
import { FailModal } from "./FailModal"
import { ArrowLeft, Check, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Exercise } from "@/types/learning"

interface LessonPlayerProps {
  lessonId: string
  onComplete: () => void
}

export function LessonPlayer({ lessonId, onComplete }: LessonPlayerProps) {
  const {
    getLesson,
    getExercise,
    currentLesson,
    lessonHearts,
    lessonXP,
    submitAnswer,
    loseHeart,
    completeLesson,
    incrementStreak
  } = useLearning()

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showFailModal, setShowFailModal] = useState(false)
  const [perfectLesson, setPerfectLesson] = useState(true)

  const lesson = getLesson(lessonId)
  const exercises = lesson?.exercises.map(ref => getExercise(ref.id)).filter(Boolean) as Exercise[] || []
  const currentExercise = exercises[currentExerciseIndex]

  const lessonXPGoal = 10
  const progress = (currentExerciseIndex / exercises.length) * 100

  const handleSubmitAnswer = () => {
    if (userAnswer === null) return

    const correct = submitAnswer(currentExercise.id, userAnswer)
    setIsCorrect(correct)
    setShowResult(true)

    if (!correct) {
      setPerfectLesson(false)
    }

    // Auto-advance after showing result
    setTimeout(() => {
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1)
        setUserAnswer(null)
        setShowResult(false)
      } else {
        // Lesson completed
        completeLesson(lessonId, perfectLesson)
        incrementStreak()
        setShowCompletionModal(true)
      }
    }, 2000)
  }

  useEffect(() => {
    if (lessonHearts === 0) {
      setShowFailModal(true)
    }
  }, [lessonHearts])

  // Keyboard navigation for lesson controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && userAnswer !== null && !showResult) {
        handleSubmitAnswer()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [userAnswer, showResult, handleSubmitAnswer])

  const handleRetry = () => {
    setShowFailModal(false)
    setCurrentExerciseIndex(0)
    setUserAnswer(null)
    setShowResult(false)
    setPerfectLesson(true)
  }

  const handleContinue = () => {
    setShowCompletionModal(false)
    onComplete()
  }

  const renderExercise = () => {
    if (!currentExercise) return null

    const commonProps = {
      exercise: currentExercise,
      userAnswer,
      setUserAnswer,
      showResult,
      isCorrect,
      disabled: showResult
    }

    switch (currentExercise.type) {
      case 'multiple_choice':
        return <MultipleChoiceEx {...commonProps} />
      case 'tap_tokens':
        return <TapTokensEx {...commonProps} />
      case 'fill_in_numeric':
        return <FillNumericEx {...commonProps} />
      case 'categorize_txn':
        return <CategorizeTxnEx {...commonProps} />
      case 'budget_scenario':
        return <BudgetScenarioEx {...commonProps} />
      case 'true_false':
        return <TrueFalseEx {...commonProps} />
      case 'order_steps':
        return <OrderStepsEx {...commonProps} />
      default:
        return <div>Unknown exercise type</div>
    }
  }

  if (!lesson || !currentExercise) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Preparing your lesson</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onComplete}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{lesson.title}</h1>
              <p className="text-sm text-muted-foreground">
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Hearts hearts={lessonHearts} maxHearts={5} />
            <LessonXPBar currentXP={lessonXP} goalXP={lessonXPGoal} />
            <StreakFlame streak={0} /> {/* TODO: Get actual streak */}
          </div>
        </div>

        <div className="px-6 pb-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Exercise Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                {renderExercise()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-6">
          <div className="text-sm text-muted-foreground">
            {showResult && (
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-medium">Correct!</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-medium">Try again next time</span>
                  </>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmitAnswer}
            disabled={userAnswer === null || showResult}
            size="lg"
            className="min-w-24"
          >
            {showResult ? 'Continue' : 'Check'}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <CompletionModal
        open={showCompletionModal}
        onClose={handleContinue}
        perfect={perfectLesson}
        xpEarned={perfectLesson ? 15 : 10}
        streakIncrement={1}
      />

      <FailModal
        open={showFailModal}
        onRetry={handleRetry}
        onPractice={() => {
          setShowFailModal(false)
          // TODO: Navigate to practice
        }}
      />
    </div>
  )
}
