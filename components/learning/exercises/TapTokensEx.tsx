"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import type { TapTokens } from "@/types/learning"

interface TapTokensExProps {
  exercise: TapTokens
  userAnswer: string[] | null
  setUserAnswer: (answer: string[]) => void
  showResult: boolean
  isCorrect: boolean
  disabled: boolean
}

export function TapTokensEx({
  exercise,
  userAnswer,
  setUserAnswer,
  showResult,
  isCorrect,
  disabled
}: TapTokensExProps) {
  const handleTokenClick = (token: string) => {
    if (disabled) return

    const currentAnswer = userAnswer || []
    const isSelected = currentAnswer.includes(token)
    
    if (isSelected) {
      setUserAnswer(currentAnswer.filter(t => t !== token))
    } else {
      setUserAnswer([...currentAnswer, token])
    }
  }

  const getTokenVariant = (token: string) => {
    const isSelected = userAnswer?.includes(token) || false
    const isCorrectToken = exercise.correct.includes(token)
    
    if (!showResult) {
      return isSelected ? "default" : "outline"
    }

    if (isCorrectToken) {
      return "default" // Green for correct
    }
    
    if (isSelected && !isCorrectToken) {
      return "destructive" // Red for wrong
    }

    return "outline"
  }

  const getTokenClassName = (token: string) => {
    const isSelected = userAnswer?.includes(token) || false
    const isCorrectToken = exercise.correct.includes(token)
    
    if (!showResult) return ""

    if (isCorrectToken) {
      return "bg-green-500 hover:bg-green-500 text-white border-green-500"
    }
    
    if (isSelected && !isCorrectToken) {
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

      {/* Selected Tokens Display */}
      {userAnswer && userAnswer.length > 0 && (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm font-medium mb-2">Your selection:</p>
          <div className="flex flex-wrap gap-2">
            {userAnswer.map((token, index) => (
              <motion.div
                key={token}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium"
              >
                {token}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Token Bank */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Select the correct options:</p>
        <div className="grid grid-cols-2 gap-3">
          {exercise.tokens.map((token) => (
            <motion.div
              key={token}
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
            >
              <Button
                variant={getTokenVariant(token)}
                className={cn(
                  "w-full justify-between p-3",
                  getTokenClassName(token),
                  disabled && "cursor-not-allowed"
                )}
                onClick={() => handleTokenClick(token)}
                disabled={disabled}
              >
                <span>{token}</span>
                {showResult && exercise.correct.includes(token) && (
                  <Check className="h-4 w-4" />
                )}
                {showResult && userAnswer?.includes(token) && !exercise.correct.includes(token) && (
                  <X className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted/50 rounded-lg"
        >
          <p className="text-sm text-muted-foreground">
            <strong>Correct answers:</strong> {exercise.correct.join(", ")}
          </p>
        </motion.div>
      )}
    </div>
  )
}
