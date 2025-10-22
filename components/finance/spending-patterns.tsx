"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import type { SpendingPattern } from "@/types/finance"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SpendingPatternsProps {
  patterns: SpendingPattern[]
}

export default function SpendingPatterns({ patterns }: SpendingPatternsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          SPENDING BY DAY OF WEEK
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent">
        {patterns.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pattern data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patterns}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="dayOfWeek" stroke="var(--muted-foreground)" className="text-xs uppercase" />
              <YAxis stroke="var(--muted-foreground)" className="text-xs" tickFormatter={formatCurrency} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-display uppercase">{payload[0].payload.dayOfWeek}</p>
                        <p className="text-lg font-mono">{formatCurrency(payload[0].value as number)}</p>
                        <p className="text-xs text-muted-foreground">
                          {payload[0].payload.transactionCount} transactions
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="amount" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
