"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, X, GripVertical } from "lucide-react"
import type { OrderSteps } from "@/types/learning"

interface OrderStepsExProps {
  exercise: OrderSteps
  userAnswer: string[] | null
  setUserAnswer: (answer: string[]) => void
  showResult: boolean
  isCorrect: boolean
  disabled: boolean
}

export function OrderStepsEx({
  exercise,
  userAnswer,
  setUserAnswer,
  showResult,
  isCorrect,
  disabled
}: OrderStepsExProps) {
  const handleStepClick = (step: string) => {
    if (disabled) return

    const currentAnswer = userAnswer || []
    if (currentAnswer.includes(step)) {
      // Remove step
      setUserAnswer(currentAnswer.filter(s => s !== step))
    } else {
      // Add step
      setUserAnswer([...currentAnswer, step])
    }
  }

  const getStepClassName = (step: string, index: number) => {
    const isSelected = userAnswer?.includes(step) || false
    const isCorrectPosition = exercise.correctOrder[index] === step
    const isInCorrectPosition = userAnswer?.[index] === step && isCorrectPosition
    
    if (!showResult) {
      return isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
    }

    if (isInCorrectPosition) {
      return "bg-green-500 text-white"
    }
    
    if (isSelected && !isCorrectPosition) {
      return "bg-red-500 text-white"
    }

    return "bg-muted/50"
  }

  const getStepNumber = (step: string) => {
    const index = userAnswer?.indexOf(step)
    return index !== undefined && index >= 0 ? index + 1 : null
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{exercise.prompt}</h2>
        {exercise.difficulty && (
          <div className="flex justify-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full",
                  i < exercise.difficulty! ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selected Steps Order */}
      {userAnswer && userAnswer.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Your order:</p>
          <div className="space-y-2">
            {userAnswer.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <span className="flex-1">{step}</span>
                {showResult && exercise.correctOrder[index] === step && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                {showResult && exercise.correctOrder[index] !== step && (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Available Steps */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Click to add steps in order:</p>
        <div className="grid gap-2">
          {exercise.steps.map((step, index) => {
            const stepNumber = getStepNumber(step)
            return (
              <motion.div
                key={step}
                whileHover={!disabled ? { scale: 1.02 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start p-4 h-auto",
                    getStepClassName(step, index),
                    disabled && "cursor-not-allowed"
                  )}
                  onClick={() => handleStepClick(step)}
                  disabled={disabled}
                >
                  <div className="flex items-center gap-3 w-full">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-left">{step}</span>
                    {stepNumber && (
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {stepNumber}
                      </div>
                    )}
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted/50 rounded-lg"
        >
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Correct order:</strong>
          </p>
          <div className="space-y-1">
            {exercise.correctOrder.map((step, index) => (
              <div key={step} className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
