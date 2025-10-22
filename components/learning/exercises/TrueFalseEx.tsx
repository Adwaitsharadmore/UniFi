"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import type { TrueFalse } from "@/types/learning"
import { useEffect } from "react"

interface TrueFalseExProps {
  exercise: TrueFalse
  userAnswer: boolean | null
  setUserAnswer: (answer: boolean) => void
  showResult: boolean
  isCorrect: boolean
  disabled: boolean
}

export function TrueFalseEx({
  exercise,
  userAnswer,
  setUserAnswer,
  showResult,
  isCorrect,
  disabled
}: TrueFalseExProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return
      
      const key = event.key.toLowerCase()
      if (key === 't' || key === '1') {
        setUserAnswer(true)
      } else if (key === 'f' || key === '2') {
        setUserAnswer(false)
      } else if (key === 'enter' && userAnswer !== null) {
        // Submit answer (handled by parent component)
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, setUserAnswer, userAnswer])
  const getButtonVariant = (value: boolean) => {
    if (!showResult) {
      return userAnswer === value ? "default" : "outline"
    }

    if (value === exercise.correct) {
      return "default" // Green for correct
    }
    
    if (userAnswer === value && value !== exercise.correct) {
      return "destructive" // Red for wrong
    }

    return "outline"
  }

  const getButtonClassName = (value: boolean) => {
    if (!showResult) return ""

    if (value === exercise.correct) {
      return "bg-green-500 hover:bg-green-500 text-white border-green-500"
    }
    
    if (userAnswer === value && value !== exercise.correct) {
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

      <div className="flex justify-center gap-6">
        <motion.div
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <Button
            variant={getButtonVariant(true)}
            size="lg"
            className={cn(
              "w-32 h-20 text-lg font-bold",
              getButtonClassName(true),
              disabled && "cursor-not-allowed"
            )}
            onClick={() => !disabled && setUserAnswer(true)}
            disabled={disabled}
          >
            <div className="flex flex-col items-center gap-2">
              <Check className="h-6 w-6" />
              <span>TRUE</span>
              <span className="text-xs text-muted-foreground">(T/1)</span>
            </div>
          </Button>
        </motion.div>

        <motion.div
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <Button
            variant={getButtonVariant(false)}
            size="lg"
            className={cn(
              "w-32 h-20 text-lg font-bold",
              getButtonClassName(false),
              disabled && "cursor-not-allowed"
            )}
            onClick={() => !disabled && setUserAnswer(false)}
            disabled={disabled}
          >
            <div className="flex flex-col items-center gap-2">
              <X className="h-6 w-6" />
              <span>FALSE</span>
              <span className="text-xs text-muted-foreground">(F/2)</span>
            </div>
          </Button>
        </motion.div>
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
