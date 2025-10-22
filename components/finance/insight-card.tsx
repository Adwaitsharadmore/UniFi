"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Insight } from "@/types/finance"
import { AlertTriangle, TrendingUp, Trophy, X } from "lucide-react"

interface InsightCardProps {
  insight: Insight
  onDismiss: (id: string) => void
}

export default function InsightCard({ insight, onDismiss }: InsightCardProps) {
  const getIcon = () => {
    switch (insight.type) {
      case "opportunity":
        return TrendingUp
      case "warning":
        return AlertTriangle
      case "achievement":
        return Trophy
    }
  }

  const getIconColor = () => {
    switch (insight.type) {
      case "opportunity":
        return "text-success"
      case "warning":
        return "text-warning"
      case "achievement":
        return "text-primary"
    }
  }

  const getBgColor = () => {
    switch (insight.type) {
      case "opportunity":
        return "bg-success/20"
      case "warning":
        return "bg-warning/20"
      case "achievement":
        return "bg-primary/20"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const Icon = getIcon()

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className={`size-12 rounded-lg ${getBgColor()} flex items-center justify-center shrink-0`}>
            <Icon className={`size-6 ${getIconColor()}`} />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display uppercase text-lg">{insight.title}</h3>
                  <Badge variant="outline" className="uppercase text-xs">
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onDismiss(insight.id)} className="shrink-0">
                <X className="size-4" />
              </Button>
            </div>

            {insight.potentialSavings && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                <TrendingUp className="size-4 text-success" />
                <span className="text-sm font-medium">
                  Potential savings: <span className="font-display">{formatCurrency(insight.potentialSavings)}</span>{" "}
                  per month
                </span>
              </div>
            )}

            {insight.actionable && (
              <div className="flex gap-2">
                <Button size="sm" className="uppercase font-display">
                  Take Action
                </Button>
                <Button size="sm" variant="outline" className="uppercase font-display bg-transparent">
                  Learn More
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
