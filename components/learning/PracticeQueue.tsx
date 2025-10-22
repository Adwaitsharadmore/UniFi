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
import { ArrowLeft, Check, RotateCcw, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Exercise, SRSItem } from "@/types/learning"

interface PracticeQueueProps {
  practiceItems: SRSItem[]
  onComplete: () => void
}

export function PracticeQueue({ practiceItems, onComplete }: PracticeQueueProps) {
  const {
    getExercise,
    submitAnswer,
    gainHeart,
    awardXP,
    dequeueSRS
  } = useLearning()

  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [correctStreak, setCorrectStreak] = useState(0)
  const [practiceXP, setPracticeXP] = useState(0)

  const currentItem = practiceItems[currentItemIndex]
  const currentExercise = currentItem ? getExercise(currentItem.exerciseId) : null

  const progress = practiceItems.length > 0 ? ((currentItemIndex + 1) / practiceItems.length) * 100 : 0

  useEffect(() => {
    if (correctStreak >= 5) {
      gainHeart()
      setCorrectStreak(0)
    }
  }, [correctStreak, gainHeart])

  const handleSubmitAnswer = () => {
    if (userAnswer === null || !currentExercise) return

    const correct = submitAnswer(currentExercise.id, userAnswer)
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setCorrectStreak(prev => prev + 1)
      setPracticeXP(prev => prev + 1)
      awardXP(1)
    }

    // Auto-advance after showing result
    setTimeout(() => {
      if (currentItemIndex < practiceItems.length - 1) {
        setCurrentItemIndex(prev => prev + 1)
        setUserAnswer(null)
        setShowResult(false)
      } else {
        // Practice session completed
        setShowCompletionModal(true)
      }
    }, 2000)
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

  if (practiceItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Practice Items</h2>
          <p className="text-muted-foreground mb-4">
            Complete some lessons to unlock practice exercises.
          </p>
          <Button onClick={onComplete}>
            Back to Learning
          </Button>
        </div>
      </div>
    )
  }

  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Preparing practice exercise</p>
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
              <h1 className="text-xl font-bold">Practice Session</h1>
              <p className="text-sm text-muted-foreground">
                Exercise {currentItemIndex + 1} of {practiceItems.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Hearts hearts={5} maxHearts={5} />
            <LessonXPBar currentXP={practiceXP} goalXP={practiceItems.length} />
            <StreakFlame streak={correctStreak} />
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
            key={currentItemIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
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
                    {correctStreak >= 5 && (
                      <span className="text-blue-600 font-medium ml-2">
                        +1 Heart!
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-medium">Keep practicing</span>
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

      {/* Completion Modal */}
      <CompletionModal
        open={showCompletionModal}
        onClose={handleContinue}
        perfect={false}
        xpEarned={practiceXP}
        streakIncrement={0}
      />
    </div>
  )
}
