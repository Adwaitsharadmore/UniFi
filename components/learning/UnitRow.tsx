"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillNode } from "./SkillNode"
import { CheckpointNode } from "./CheckpointNode"
import type { Unit, SkillStatus } from "@/types/learning"
import { cn } from "@/lib/utils"

interface UnitRowProps {
  unit: Unit
  onSkillClick: (skillId: string) => void
  getSkillStatus: (skill: any) => SkillStatus
}

export function UnitRow({ unit, onSkillClick, getSkillStatus }: UnitRowProps) {
  return (
    <div className="space-y-4">
      {/* Unit Title Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <span className="text-2xl">📚</span>
            Unit {unit.order}: {unit.title}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Skills Path */}
      <div className="relative">
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {unit.skills.map((skill, index) => (
            <div key={skill.id} className="flex items-center">
              <SkillNode
                skill={skill}
                status={getSkillStatus(skill)}
                onClick={() => onSkillClick(skill.id)}
              />
              
              {/* Connection Line */}
              {index < unit.skills.length - 1 && (
                <div className="w-8 h-0.5 bg-border mx-2 flex-shrink-0" />
              )}
            </div>
          ))}
          
          {/* Checkpoint */}
          {unit.checkpointId && (
            <>
              <div className="w-8 h-0.5 bg-border mx-2 flex-shrink-0" />
              <CheckpointNode
                checkpointId={unit.checkpointId}
                unitTitle={unit.title}
              />
            </>
          )}
        </div>
        
        {/* Zigzag Path Line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 -z-10" />
      </div>
    </div>
  )
}
