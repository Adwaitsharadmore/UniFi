"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import type { CategorizeTxn } from "@/types/learning"

interface CategorizeTxnExProps {
  exercise: CategorizeTxn
  userAnswer: string[] | null
  setUserAnswer: (answer: string[]) => void
  showResult: boolean
  isCorrect: boolean
  disabled: boolean
}

export function CategorizeTxnEx({
  exercise,
  userAnswer,
  setUserAnswer,
  showResult,
  isCorrect,
  disabled
}: CategorizeTxnExProps) {
  const handleTransactionClick = (transactionIndex: number, category: string) => {
    if (disabled) return

    const currentAnswer = userAnswer || []
    const newAnswer = [...currentAnswer]
    newAnswer[transactionIndex] = category
    setUserAnswer(newAnswer)
  }

  const getTransactionClassName = (transactionIndex: number, category: string) => {
    const isSelected = userAnswer?.[transactionIndex] === category
    const isCorrectCategory = exercise.correct[transactionIndex] === category
    
    if (!showResult) {
      return isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
    }

    if (isCorrectCategory) {
      return "bg-green-500 text-white"
    }
    
    if (isSelected && !isCorrectCategory) {
      return "bg-red-500 text-white"
    }

    return "bg-muted/50"
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
        {/* Categories */}
        <div className="grid grid-cols-2 gap-3">
          {exercise.categories.map((category) => (
            <div
              key={category}
              className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-center"
            >
              <span className="font-medium text-primary">{category}</span>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Drag transactions to categories:</p>
          {exercise.transactions.map((transaction, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.desc}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {exercise.categories.map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "min-w-20",
                          getTransactionClassName(index, category)
                        )}
                        onClick={() => handleTransactionClick(index, category)}
                        disabled={disabled}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <strong>Correct categories:</strong>
          </p>
          <div className="mt-2 space-y-1">
            {exercise.transactions.map((transaction, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{transaction.desc}</span>
                <span className="font-medium text-green-600">
                  {exercise.correct[index]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
