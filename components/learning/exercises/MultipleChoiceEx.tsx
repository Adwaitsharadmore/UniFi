"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import type { MultipleChoice } from "@/types/learning"
import { useEffect } from "react"

interface MultipleChoiceExProps {
  exercise: MultipleChoice
  userAnswer: number | null
  setUserAnswer: (answer: number) => void
  showResult: boolean
  isCorrect: boolean
  disabled: boolean
}

export function MultipleChoiceEx({
  exercise,
  userAnswer,
  setUserAnswer,
  showResult,
  isCorrect,
  disabled
}: MultipleChoiceExProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return
      
      const key = event.key
      if (key >= '1' && key <= '9') {
        const index = parseInt(key) - 1
        if (index < exercise.options.length) {
          setUserAnswer(index)
        }
      } else if (key === 'Enter' && userAnswer !== null) {
        // Submit answer (handled by parent component)
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, exercise.options.length, setUserAnswer, userAnswer])
  const getOptionVariant = (index: number) => {
    if (!showResult) {
      return userAnswer === index ? "default" : "outline"
    }

    if (index === exercise.correctIndex) {
      return "default" // Green for correct
    }
    
    if (userAnswer === index && index !== exercise.correctIndex) {
      return "destructive" // Red for wrong
    }

    return "outline"
  }

  const getOptionClassName = (index: number) => {
    if (!showResult) return ""

    if (index === exercise.correctIndex) {
      return "bg-green-500 hover:bg-green-500 text-white border-green-500"
    }
    
    if (userAnswer === index && index !== exercise.correctIndex) {
      return "bg-red-500 hover:bg-red-500 text-white border-red-500"
    }

    return ""
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

      <div className="space-y-3">
        {exercise.options.map((option, index) => (
          <motion.div
            key={index}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <Button
              variant={getOptionVariant(index)}
              className={cn(
                "w-full justify-start p-4 h-auto text-left",
                getOptionClassName(index),
                disabled && "cursor-not-allowed"
              )}
              onClick={() => !disabled && setUserAnswer(index)}
              disabled={disabled}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  userAnswer === index ? "border-current" : "border-muted-foreground"
                )}>
                  {showResult && index === exercise.correctIndex && (
                    <Check className="h-4 w-4" />
                  )}
                  {showResult && userAnswer === index && index !== exercise.correctIndex && (
                    <X className="h-4 w-4" />
                  )}
                  {!showResult && userAnswer === index && (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
                <span className="text-xs text-muted-foreground">({index + 1})</span>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      {showResult && exercise.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted/50 rounded-lg"
        >
          <p className="text-sm text-muted-foreground">
            <strong>Explanation:</strong> {exercise.explanation}
          </p>
        </motion.div>
      )}
    </div>
  )
}
