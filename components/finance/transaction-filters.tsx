"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { TransactionCategory } from "@/types/finance"

interface TransactionFiltersProps {
  filters: {
    search: string
    category: TransactionCategory | "all"
    type: "all" | "debit" | "credit"
    dateRange: "all" | "week" | "month" | "year"
  }
  onFiltersChange: (filters: any) => void
}

const CATEGORIES: (TransactionCategory | "all")[] = [
  "all",
  "Shopping",
  "Dining",
  "Transportation",
  "Healthcare",
  "Subscriptions",
  "Fitness",
  "Housing",
  "Income",
  "Cash",
  "Services",
  "Entertainment",
  "Groceries",
  "Utilities",
  "Other",
]

export default function TransactionFilters({ filters, onFiltersChange }: TransactionFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>

      <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.type} onValueChange={(value) => onFiltersChange({ ...filters, type: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="debit">Expenses</SelectItem>
          <SelectItem value="credit">Income</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.dateRange} onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="week">Last Week</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
          <SelectItem value="year">Last Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
