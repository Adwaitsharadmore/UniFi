"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import type { FillInNumeric } from "@/types/learning"
import { useState } from "react"

interface FillNumericExProps {
  exercise: FillInNumeric
  userAnswer: number | null
  setUserAnswer: (answer: number) => void
  showResult: boolean
  isCorrect: boolean
  disabled: boolean
}

export function FillNumericEx({
  exercise,
  userAnswer,
  setUserAnswer,
  showResult,
  isCorrect,
  disabled
}: FillNumericExProps) {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (value: string) => {
    if (disabled) return
    setInputValue(value)
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue)) {
      setUserAnswer(numericValue)
    }
  }

  const getInputClassName = () => {
    if (!showResult) return ""

    if (isCorrect) {
      return "border-green-500 bg-green-50 focus:border-green-500"
    } else {
      return "border-red-500 bg-red-50 focus:border-red-500"
    }
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

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter your answer"
            className={cn(
              "w-32 text-center text-lg font-semibold",
              getInputClassName()
            )}
            disabled={disabled}
          />
          {exercise.unit && (
            <span className="text-lg font-medium text-muted-foreground">
              {exercise.unit}
            </span>
          )}
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            {isCorrect ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Correct!</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-red-500" />
                <span className="text-red-600 font-medium">
                  Correct answer: {exercise.correct}{exercise.unit}
                </span>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Number Pad for Mobile */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="h-12"
            onClick={() => {
              if (disabled) return
              if (key === '⌫') {
                setInputValue(prev => prev.slice(0, -1))
                const newValue = inputValue.slice(0, -1)
                const numericValue = parseFloat(newValue)
                setUserAnswer(isNaN(numericValue) ? null : numericValue)
              } else if (key === '.') {
                if (!inputValue.includes('.')) {
                  const newValue = inputValue + '.'
                  setInputValue(newValue)
                  const numericValue = parseFloat(newValue)
                  setUserAnswer(isNaN(numericValue) ? null : numericValue)
                }
              } else {
                const newValue = inputValue + key.toString()
                setInputValue(newValue)
                const numericValue = parseFloat(newValue)
                setUserAnswer(isNaN(numericValue) ? null : numericValue)
              }
            }}
            disabled={disabled}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  )
}
