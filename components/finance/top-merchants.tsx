import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import type { Transaction } from "@/types/finance"

interface TopMerchantsProps {
  transactions: Transaction[]
}

export default function TopMerchants({ transactions }: TopMerchantsProps) {
  const merchantSpending = new Map<string, number>()

  transactions
    .filter((t) => t.type === "debit")
    .forEach((txn) => {
      const current = merchantSpending.get(txn.merchant) || 0
      merchantSpending.set(txn.merchant, current + txn.amount)
    })

  const topMerchants = Array.from(merchantSpending.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

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
        <CardTitle className="flex items-center gap-2.5 pt-2 font-bold">
          <Bullet />
          TOP MERCHANTS
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent">
        {topMerchants.length === 0 ? (
          <p className="text-muted-foreground text-sm">No merchant data</p>
        ) : (
          <div className="space-y-3">
            {topMerchants.map(([merchant, amount], index) => (
              <div key={merchant} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-display text-primary">#{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium">{merchant}</span>
                </div>
                <span className="text-sm font-mono">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
