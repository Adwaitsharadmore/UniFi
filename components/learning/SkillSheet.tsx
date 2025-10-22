"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useLearning } from "@/hooks/use-learning"
import { useRouter } from "next/navigation"
import { Play, RotateCcw, Lightbulb, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { TipsModal } from "./TipsModal"

interface SkillSheetProps {
  skillId: string
  onClose: () => void
}

export function SkillSheet({ skillId, onClose }: SkillSheetProps) {
  const router = useRouter()
  const { 
    curriculum, 
    lessons, 
    getSkillStatus, 
    getLessonStatus, 
    crownsBySkill,
    getTip 
  } = useLearning()
  
  const [showTipsModal, setShowTipsModal] = useState(false)

  const skill = curriculum
    .flatMap(unit => unit.skills)
    .find(s => s.id === skillId)

  if (!skill) return null

  const status = getSkillStatus(skill)
  const crownLevel = crownsBySkill[skillId] || 0
  const skillLessons = lessons.filter(lesson => lesson.skillId === skillId)
  const completedLessons = skillLessons.filter(lesson => 
    getLessonStatus(lesson.id) === 'passed' || getLessonStatus(lesson.id) === 'perfect'
  )
  const progress = skillLessons.length > 0 ? (completedLessons.length / skillLessons.length) * 100 : 0

  const handleStartLesson = () => {
    const nextLesson = skillLessons.find(lesson => 
      getLessonStatus(lesson.id) === 'open'
    ) || skillLessons[0]
    
    if (nextLesson) {
      router.push(`/dashboard/learning/lesson/${nextLesson.id}`)
      onClose()
    }
  }

  const handlePractice = () => {
    router.push('/dashboard/learning/practice')
    onClose()
  }

  const handleTips = () => {
    if (skill?.tipId) {
      setShowTipsModal(true)
    }
  }

  return (
    <Sheet open={!!skillId} onOpenChange={onClose}>
      <SheetContent className="w-96 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <span className="text-3xl">{skill.icon}</span>
            <div>
              <h2 className="text-xl font-bold">{skill.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Crown
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < crownLevel ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedLessons.length}/{skillLessons.length} lessons</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge 
              variant={status === 'perfect' ? 'default' : status === 'passed' ? 'secondary' : 'outline'}
              className={cn(
                "px-4 py-2 text-sm font-medium",
                status === 'perfect' && "bg-yellow-500 text-yellow-900",
                status === 'passed' && "bg-green-500 text-green-900"
              )}
            >
              {status === 'locked' && '🔒 Locked'}
              {status === 'open' && '✨ Available'}
              {status === 'passed' && '✅ Completed'}
              {status === 'perfect' && '🌟 Perfect'}
            </Badge>
          </div>

          {/* Prerequisites */}
          {skill.prerequisiteSkillIds && skill.prerequisiteSkillIds.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Prerequisites</h3>
              <div className="flex flex-wrap gap-2">
                {skill.prerequisiteSkillIds.map(prereqId => {
                  const prereqSkill = curriculum
                    .flatMap(unit => unit.skills)
                    .find(s => s.id === prereqId)
                  return prereqSkill ? (
                    <Badge key={prereqId} variant="outline" className="text-xs">
                      {prereqSkill.icon} {prereqSkill.title}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Lessons List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Lessons</h3>
            <div className="space-y-2">
              {skillLessons.map((lesson, index) => {
                const lessonStatus = getLessonStatus(lesson.id)
                return (
                  <div
                    key={lesson.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      lessonStatus === 'locked' && "bg-muted/50 border-muted",
                      lessonStatus === 'open' && "bg-primary/5 border-primary/20",
                      lessonStatus === 'passed' && "bg-green-500/5 border-green-500/20",
                      lessonStatus === 'perfect' && "bg-yellow-500/5 border-yellow-500/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        lessonStatus === 'locked' && "bg-muted text-muted-foreground",
                        lessonStatus === 'open' && "bg-primary text-primary-foreground",
                        lessonStatus === 'passed' && "bg-green-500 text-white",
                        lessonStatus === 'perfect' && "bg-yellow-500 text-yellow-900"
                      )}>
                        {lessonStatus === 'perfect' ? '🌟' : 
                         lessonStatus === 'passed' ? '✓' : 
                         index + 1}
                      </div>
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {status !== 'locked' && (
              <Button 
                onClick={handleStartLesson}
                className="w-full"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                {completedLessons.length === 0 ? 'Start Learning' : 'Continue'}
              </Button>
            )}
            
            {status === 'passed' || status === 'perfect' ? (
              <Button 
                onClick={handlePractice}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Practice
              </Button>
            ) : null}
            
            {skill.tipId && (
              <Button 
                onClick={handleTips}
                variant="ghost"
                className="w-full"
                size="lg"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Tips & Tricks
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
      
      <TipsModal
        open={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        tip={skill?.tipId ? getTip(skill.tipId) : null}
      />
    </Sheet>
  )
}
