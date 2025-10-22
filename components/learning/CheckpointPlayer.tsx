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
import { ArrowLeft, Check, RotateCcw, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Exercise, Unit } from "@/types/learning"

interface CheckpointPlayerProps {
  checkpointId: string
  unit: Unit
  onComplete: () => void
}

export function CheckpointPlayer({ checkpointId, unit, onComplete }: CheckpointPlayerProps) {
  const {
    getExercise,
    exercises,
    submitAnswer,
    loseHeart,
    awardXP,
    incrementStreak
  } = useLearning()

  const [checkpointExercises, setCheckpointExercises] = useState<Exercise[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showFailModal, setShowFailModal] = useState(false)
  const [checkpointHearts, setCheckpointHearts] = useState(5)
  const [checkpointXP, setCheckpointXP] = useState(0)
  const [perfectCheckpoint, setPerfectCheckpoint] = useState(true)

  const currentExercise = checkpointExercises[currentExerciseIndex]
  const progress = checkpointExercises.length > 0 ? ((currentExerciseIndex + 1) / checkpointExercises.length) * 100 : 0

  // Generate checkpoint exercises from unit skills
  useEffect(() => {
    const generateCheckpointExercises = () => {
      const unitExercises: Exercise[] = []
      
      // Get exercises from all skills in the unit
      unit.skills.forEach(skill => {
        // Find lessons for this skill
        const skillLessons = exercises.filter(ex => 
          ex.type === 'lesson' && (ex as any).skillId === skill.id
        )
        
        // Get exercises from lessons (simplified - in real app, you'd have lesson-exercise relationships)
        const skillExercises = exercises.filter(ex => 
          ex.type !== 'lesson' && Math.random() < 0.3 // Random selection for demo
        )
        
        unitExercises.push(...skillExercises.slice(0, 2)) // Max 2 per skill
      })
      
      // Shuffle and take up to 8 exercises
      const shuffled = unitExercises.sort(() => Math.random() - 0.5)
      setCheckpointExercises(shuffled.slice(0, 8))
    }

    generateCheckpointExercises()
  }, [unit, exercises])

  useEffect(() => {
    if (checkpointHearts === 0) {
      setShowFailModal(true)
    }
  }, [checkpointHearts])

  const handleSubmitAnswer = () => {
    if (userAnswer === null || !currentExercise) return

    const correct = submitAnswer(currentExercise.id, userAnswer)
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setCheckpointXP(prev => prev + 2) // Checkpoint exercises worth more XP
      awardXP(2)
    } else {
      setPerfectCheckpoint(false)
      setCheckpointHearts(prev => prev - 1)
    }

    // Auto-advance after showing result
    setTimeout(() => {
      if (currentExerciseIndex < checkpointExercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1)
        setUserAnswer(null)
        setShowResult(false)
      } else {
        // Checkpoint completed
        incrementStreak()
        setShowCompletionModal(true)
      }
    }, 2000)
  }

  const handleRetry = () => {
    setShowFailModal(false)
    setCurrentExerciseIndex(0)
    setUserAnswer(null)
    setShowResult(false)
    setPerfectCheckpoint(true)
    setCheckpointHearts(5)
    setCheckpointXP(0)
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

  if (checkpointExercises.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Checkpoint...</h2>
          <p className="text-muted-foreground">Preparing your unit test</p>
        </div>
      </div>
    )
  }

  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Preparing checkpoint exercise</p>
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
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                {unit.title} Checkpoint
              </h1>
              <p className="text-sm text-muted-foreground">
                Exercise {currentExerciseIndex + 1} of {checkpointExercises.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Hearts hearts={checkpointHearts} maxHearts={5} />
            <LessonXPBar currentXP={checkpointXP} goalXP={checkpointExercises.length * 2} />
            <StreakFlame streak={0} />
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
        perfect={perfectCheckpoint}
        xpEarned={perfectCheckpoint ? checkpointXP + 10 : checkpointXP}
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
