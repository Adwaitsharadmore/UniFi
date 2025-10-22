import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/types/finance"
import { format } from "date-fns"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface TransactionTableProps {
  transactions: Transaction[]
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
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
    return colors[category] || "bg-muted text-muted-foreground border-border"
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-accent rounded-lg border border-border">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent hover:bg-accent">
            <TableHead className="uppercase text-xs font-display">Date</TableHead>
            <TableHead className="uppercase text-xs font-display">Merchant</TableHead>
            <TableHead className="uppercase text-xs font-display">Category</TableHead>
            <TableHead className="uppercase text-xs font-display text-right">Amount</TableHead>
            <TableHead className="uppercase text-xs font-display text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((txn) => (
            <TableRow key={txn.id} className="hover:bg-accent/50">
              <TableCell className="font-mono text-sm">{format(new Date(txn.date), "MMM dd, yyyy")}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`size-6 rounded flex items-center justify-center shrink-0 ${
                      txn.type === "credit" ? "bg-success/20" : "bg-destructive/20"
                    }`}
                  >
                    {txn.type === "credit" ? (
                      <ArrowUpRight className="size-3 text-success" />
                    ) : (
                      <ArrowDownRight className="size-3 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{txn.merchant}</p>
                    {txn.isRecurring && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Recurring
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`text-xs uppercase ${getCategoryColor(txn.category)}`}>
                  {txn.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className={`font-mono font-medium ${txn.type === "credit" ? "text-success" : "text-foreground"}`}>
                  {txn.type === "credit" ? "+" : "-"}
                  {formatCurrency(txn.amount)}
                </span>
              </TableCell>
              <TableCell className="text-right font-mono text-sm text-muted-foreground">
                {formatCurrency(txn.balance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
