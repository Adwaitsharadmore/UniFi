"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface ProgressRingMiniProps {
  current: number
  target: number
  size?: number
  strokeWidth?: number
  className?: string
}

export default function ProgressRingMini({ 
  current, 
  target, 
  size = 40, 
  strokeWidth = 3,
  className = ""
}: ProgressRingMiniProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const data = [
    { name: 'completed', value: percentage, fill: 'hsl(var(--primary))' },
    { name: 'remaining', value: 100 - percentage, fill: 'hsl(var(--muted))' }
  ]

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={radius - strokeWidth}
            outerRadius={radius}
            startAngle={90}
            endAngle={450}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill}
                className={index === 0 ? "drop-shadow-sm" : ""}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-mono font-medium">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  )
}
