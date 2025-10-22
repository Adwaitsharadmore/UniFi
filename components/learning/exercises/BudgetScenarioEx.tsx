"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, X, TrendingUp, TrendingDown } from "lucide-react"
import type { BudgetScenario } from "@/types/learning"

interface BudgetScenarioExProps {
  exercise: BudgetScenario
  userAnswer: number | null
  setUserAnswer: (answer: number) => void
  showResult: boolean
  isCorrect: boolean
  disabled: boolean
}

export function BudgetScenarioEx({
  exercise,
  userAnswer,
  setUserAnswer,
  showResult,
  isCorrect,
  disabled
}: BudgetScenarioExProps) {
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

  const calculateBudgetImpact = (option: string) => {
    // Simple budget impact calculation for demo
    const { incomeMonthly, fixed, variable, goalMonthly } = exercise.context
    const totalFixed = Object.values(fixed).reduce((sum, val) => sum + val, 0)
    const totalVariable = Object.values(variable).reduce((sum, val) => sum + val, 0)
    const currentTotal = totalFixed + totalVariable
    const available = incomeMonthly - currentTotal
    const goal = goalMonthly || 0

    // Mock impact calculation based on option content
    if (option.toLowerCase().includes('increase')) {
      return { impact: -200, type: 'negative' }
    } else if (option.toLowerCase().includes('decrease')) {
      return { impact: 150, type: 'positive' }
    } else if (option.toLowerCase().includes('cut')) {
      return { impact: 300, type: 'positive' }
    }
    
    return { impact: 0, type: 'neutral' }
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

      {/* Budget Context */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Budget Scenario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Monthly Income:</span>
              <span className="ml-2 text-green-600">
                ${exercise.context.incomeMonthly.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-medium">Fixed Expenses:</span>
              <span className="ml-2">
                ${Object.values(exercise.context.fixed).reduce((sum, val) => sum + val, 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-medium">Variable Expenses:</span>
              <span className="ml-2">
                ${Object.values(exercise.context.variable).reduce((sum, val) => sum + val, 0).toLocaleString()}
              </span>
            </div>
            {exercise.context.goalMonthly && (
              <div>
                <span className="font-medium">Savings Goal:</span>
                <span className="ml-2 text-blue-600">
                  ${exercise.context.goalMonthly.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="font-medium">{exercise.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {exercise.options.map((option, index) => {
          const impact = calculateBudgetImpact(option)
          return (
            <motion.div
              key={index}
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
            >
              <Button
                variant={getOptionVariant(index)}
                className={cn(
                  "w-full justify-between p-4 h-auto text-left",
                  getOptionClassName(index),
                  disabled && "cursor-not-allowed"
                )}
                onClick={() => !disabled && setUserAnswer(index)}
                disabled={disabled}
              >
                <div className="flex items-center gap-3">
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
                </div>
                
                {/* Budget Impact Indicator */}
                {impact.impact !== 0 && (
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                    impact.type === 'positive' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {impact.type === 'positive' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    ${Math.abs(impact.impact)}
                  </div>
                )}
              </Button>
            </motion.div>
          )
        })}
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
