"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DangerZoneProps {
  onReset: () => void
}

export default function DangerZone({ onReset }: DangerZoneProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-destructive">
          <Bullet className="bg-destructive" />
          DANGER ZONE
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-destructive/5 space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Reset All Data</p>
            <p className="text-xs text-muted-foreground mb-3">
              This will permanently delete all your financial data, goals, transactions, and progress. This action
              cannot be undone.
            </p>
            <Button variant="destructive" onClick={onReset} className="uppercase font-display">
              Reset Everything
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
