import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/types/finance"
import { format } from "date-fns"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Income: "bg-success/20 text-success border-success/30",
      Shopping: "bg-chart-1/20 text-chart-1 border-chart-1/30",
      Dining: "bg-chart-3/20 text-chart-3 border-chart-3/30",
      Transportation: "bg-chart-4/20 text-chart-4 border-chart-4/30",
      Healthcare: "bg-chart-5/20 text-chart-5 border-chart-5/30",
      Subscriptions: "bg-primary/20 text-primary border-primary/30",
      Housing: "bg-destructive/20 text-destructive border-destructive/30",
    }
    return colors[category] || "bg-muted text-muted-foreground border-muted-foreground/30"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          RECENT TRANSACTIONS
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent">
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-sm uppercase">No transactions yet</p>
          ) : (
            transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`size-8 rounded flex items-center justify-center shrink-0 ${
                      txn.type === "credit"
                        ? "bg-success/20 border border-success/30"
                        : "bg-destructive/20 border border-destructive/30"
                    }`}
                  >
                    {txn.type === "credit" ? (
                      <ArrowUpRight className="size-4 text-success" />
                    ) : (
                      <ArrowDownRight className="size-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate uppercase">{txn.merchant}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {format(new Date(txn.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-xs uppercase font-medium ${getCategoryColor(txn.category)}`}
                  >
                    {txn.category}
                  </Badge>
                  <p
                    className={`text-sm font-mono font-medium ${txn.type === "credit" ? "text-success" : "text-foreground"}`}
                  >
                    {txn.type === "credit" ? "+" : "-"}
                    {formatCurrency(txn.amount)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
