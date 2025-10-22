"use client"

import { useLearning } from "@/hooks/use-learning"
import { PathHeader } from "@/components/learning/PathHeader"
import { UnitRow } from "@/components/learning/UnitRow"
import { SkillSheet } from "@/components/learning/SkillSheet"
import { TipsModal } from "@/components/learning/TipsModal"
import { useState } from "react"

export default function LearningPage() {
  const { curriculum, getSkillStatus, getTip } = useLearning()
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showTipsModal, setShowTipsModal] = useState(false)
  const [selectedTip, setSelectedTip] = useState<string | null>(null)

  // Filter skills based on search query
  const filteredUnits = curriculum.map(unit => ({
    ...unit,
    skills: unit.skills.filter(skill => 
      skill.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(unit => unit.skills.length > 0)

  return (
    <div className="flex flex-col h-full">
      <PathHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSkill={selectedSkill}
        onTipsClick={() => {
          if (selectedSkill) {
            const skill = curriculum
              .flatMap(unit => unit.skills)
              .find(s => s.id === selectedSkill)
            if (skill?.tipId) {
              setSelectedTip(skill.tipId)
              setShowTipsModal(true)
            }
          }
        }}
      />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {filteredUnits.map((unit) => (
          <UnitRow
            key={unit.id}
            unit={unit}
            onSkillClick={setSelectedSkill}
            getSkillStatus={getSkillStatus}
          />
        ))}
      </div>

      {selectedSkill && (
        <SkillSheet
          skillId={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}

      <TipsModal
        open={showTipsModal}
        onClose={() => {
          setShowTipsModal(false)
          setSelectedTip(null)
        }}
        tip={selectedTip ? getTip(selectedTip) : null}
      />
    </div>
  )
}
