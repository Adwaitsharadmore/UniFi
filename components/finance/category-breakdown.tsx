"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import type { CategorySpending } from "@/types/finance"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryBreakdownProps {
  categorySpending: CategorySpending[]
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--success)",
  "var(--warning)",
  "var(--destructive)",
]

export default function CategoryBreakdown({ categorySpending }: CategoryBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const chartData = categorySpending.map((cat) => ({
    name: cat.category,
    value: cat.amount,
    percentage: cat.percentage,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 pt-2 font-bold">
          <Bullet />
          SPENDING BY CATEGORY
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent">
        {categorySpending.length === 0 ? (
          <p className="text-muted-foreground text-sm">No spending data</p>
        ) : (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-display uppercase">{payload[0].name}</p>
                          <p className="text-lg font-mono">{formatCurrency(payload[0].value as number)}</p>
                          <p className="text-xs text-muted-foreground">
                            {(payload[0].payload.percentage as number).toFixed(1)}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2">
              {categorySpending.slice(0, 5).map((cat, index) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">{formatCurrency(cat.amount)}</p>
                    <p className="text-xs text-muted-foreground">{cat.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
