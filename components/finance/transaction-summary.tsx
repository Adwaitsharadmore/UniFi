import { Card, CardContent } from "@/components/ui/card"
import type { Transaction } from "@/types/finance"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface TransactionSummaryProps {
  transactions: Transaction[]
}

export default function TransactionSummary({ transactions }: TransactionSummaryProps) {
  const totalIncome = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)

  const netSavings = totalIncome - totalExpenses

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-display mb-1">Total Income</p>
              <p className="text-2xl font-display text-success">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="size-12 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="size-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-display mb-1">Total Expenses</p>
              <p className="text-2xl font-display">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="size-12 rounded-lg bg-destructive/20 flex items-center justify-center">
              <TrendingDown className="size-6 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-display mb-1">Net Savings</p>
              <p className={`text-2xl font-display ${netSavings >= 0 ? "text-success" : "text-destructive"}`}>
                {formatCurrency(netSavings)}
              </p>
            </div>
            <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <DollarSign className="size-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
