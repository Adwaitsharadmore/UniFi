"use client"

import { useState, useEffect, useCallback } from 'react'
import type { 
  Unit, 
  Skill, 
  Lesson, 
  Exercise, 
  Tip, 
  ProgressState, 
  SRSItem, 
  LearningActions, 
  LearningState, 
  UseLearningReturn,
  LessonStatus,
  SkillStatus
} from '@/types/learning'
import { addLearningXP, checkLearningBadgeUnlocks, XP_REWARDS } from '@/lib/gamification'

const STORAGE_KEY = 'finsight:learning:progress'

// Default progress state
const DEFAULT_PROGRESS: ProgressState = {
  hearts: 5,
  maxHearts: 5,
  xp: 0,
  streakDays: 0,
  lastActiveISO: undefined,
  crownsBySkill: {},
  lessonStatus: {},
  srs: []
}

// SRS (Spaced Repetition System) constants
const SRS_INTERVALS = [1, 2, 3, 5, 8, 13, 21] // days
const SRS_EASE_FACTOR = 2.5
const SRS_MIN_EASE = 1.3

export function useLearning(): UseLearningReturn {
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS)
  const [currentLesson, setCurrentLesson] = useState<string | undefined>()
  const [currentExercise, setCurrentExercise] = useState<string | undefined>()
  const [lessonHearts, setLessonHearts] = useState(5)
  const [lessonXP, setLessonXP] = useState(0)
  const [curriculum, setCurriculum] = useState<{ units: Unit[] } | null>(null)
  const [lessons, setLessons] = useState<{ lessons: Lesson[] } | null>(null)
  const [exercises, setExercises] = useState<{ exercises: Exercise[] } | null>(null)
  const [tips, setTips] = useState<{ tips: Tip[] } | null>(null)

  // Load data from JSON files
  useEffect(() => {
    const loadData = async () => {
      try {
        const [curriculumRes, lessonsRes, exercisesRes, tipsRes] = await Promise.all([
          fetch('/data/learning/curriculum.json'),
          fetch('/data/learning/lessons.json'),
          fetch('/data/learning/exercises.json'),
          fetch('/data/learning/tips.json')
        ])

        const [curriculumData, lessonsData, exercisesData, tipsData] = await Promise.all([
          curriculumRes.json(),
          lessonsRes.json(),
          exercisesRes.json(),
          tipsRes.json()
        ])

        setCurriculum(curriculumData)
        setLessons(lessonsData)
        setExercises(exercisesData)
        setTips(tipsData)
      } catch (error) {
        console.error('Failed to load learning data:', error)
      }
    }

    loadData()
  }, [])

  // Load progress from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setProgress(parsed)
        
        // Check for daily heart refill
        const today = new Date().toISOString().split('T')[0]
        const lastActive = parsed.lastActiveISO?.split('T')[0]
        
        if (lastActive !== today) {
          // Refill hearts daily
          setProgress(prev => ({
            ...prev,
            hearts: prev.maxHearts,
            lastActiveISO: new Date().toISOString()
          }))
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }, [])

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: ProgressState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
      setProgress(newProgress)
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }, [])

  // Get skill status based on prerequisites and lesson completion
  const getSkillStatus = useCallback((skill: Skill): SkillStatus => {
    // Check prerequisites
    if (skill.prerequisiteSkillIds) {
      const prerequisitesMet = skill.prerequisiteSkillIds.every(prereqId => {
        const prereqSkill = curriculum?.units
          .flatMap(unit => unit.skills)
          .find(s => s.id === prereqId)
        return prereqSkill && getSkillStatus(prereqSkill) === 'passed'
      })
      if (!prerequisitesMet) return 'locked'
    }

    // Check if all lessons are completed
    const allLessons = skill.lessons.map(l => l.id)
    const completedLessons = allLessons.filter(lessonId => 
      progress.lessonStatus[lessonId] === 'passed' || progress.lessonStatus[lessonId] === 'perfect'
    )

    if (completedLessons.length === 0) return 'open'
    if (completedLessons.length === allLessons.length) {
      // Check if any lesson was perfect
      const hasPerfect = allLessons.some(lessonId => 
        progress.lessonStatus[lessonId] === 'perfect'
      )
      return hasPerfect ? 'perfect' : 'passed'
    }
    
    return 'open'
  }, [progress.lessonStatus, curriculum])

  // Get lesson status
  const getLessonStatus = useCallback((lessonId: string): LessonStatus => {
    return progress.lessonStatus[lessonId] || 'locked'
  }, [progress.lessonStatus])

  // Actions
  const startLesson = useCallback((lessonId: string) => {
    setCurrentLesson(lessonId)
    setCurrentExercise(undefined)
    setLessonHearts(progress.hearts)
    setLessonXP(0)
  }, [progress.hearts])

  const submitAnswer = useCallback((exerciseId: string, answer: any): boolean => {
    if (!exercises) return false

    const exercise = exercises.exercises.find(e => e.id === exerciseId)
    if (!exercise) return false

    let isCorrect = false

    // Check answer based on exercise type
    switch (exercise.type) {
      case 'multiple_choice':
        isCorrect = answer === exercise.correctIndex
        break
      case 'true_false':
        isCorrect = answer === exercise.correct
        break
      case 'tap_tokens':
        isCorrect = JSON.stringify(answer.sort()) === JSON.stringify(exercise.correct.sort())
        break
      case 'fill_in_numeric':
        const tolerance = exercise.tolerance || 0
        isCorrect = Math.abs(answer - exercise.correct) <= tolerance
        break
      case 'categorize_txn':
        isCorrect = JSON.stringify(answer) === JSON.stringify(exercise.correct)
        break
      case 'budget_scenario':
        isCorrect = answer === exercise.correctIndex
        break
      case 'order_steps':
        isCorrect = JSON.stringify(answer) === JSON.stringify(exercise.correctOrder)
        break
    }

    // Award XP
    if (isCorrect) {
      setLessonXP(prev => prev + 1)
    } else {
      loseHeart()
    }

    // Add to SRS queue
    enqueueSRS(exerciseId, isCorrect, 0) // TODO: track response time

    return isCorrect
  }, [exercises])

  const loseHeart = useCallback(() => {
    setLessonHearts(prev => Math.max(0, prev - 1))
    setProgress(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1)
    }))
  }, [])

  const gainHeart = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      hearts: Math.min(prev.maxHearts, prev.hearts + 1)
    }))
  }, [])

  const completeLesson = useCallback((lessonId: string, perfect: boolean) => {
    if (!lessons) return

    const lesson = lessons.lessons.find(l => l.id === lessonId)
    if (!lesson) return

    const newStatus: LessonStatus = perfect ? 'perfect' : 'passed'
    const xpGained = perfect ? XP_REWARDS.perfectLesson : XP_REWARDS.lessonCompleted

    setProgress(prev => {
      const newProgress = {
        ...prev,
        lessonStatus: {
          ...prev.lessonStatus,
          [lessonId]: newStatus
        },
        xp: prev.xp + xpGained
      }

      // Update skill crowns
      const skillId = lesson.skillId
      const skill = curriculum?.units
        .flatMap(unit => unit.skills)
        .find(s => s.id === skillId)
      
      if (skill) {
        const allLessons = skill.lessons.map(l => l.id)
        const completedLessons = allLessons.filter(id => 
          newProgress.lessonStatus[id] === 'passed' || newProgress.lessonStatus[id] === 'perfect'
        )
        
        if (completedLessons.length === allLessons.length) {
          const hasPerfect = allLessons.some(id => newProgress.lessonStatus[id] === 'perfect')
          newProgress.crownsBySkill[skillId] = hasPerfect ? 3 : 2 // Gold or silver crown
        }
      }

      saveProgress(newProgress)
      return newProgress
    })

    setCurrentLesson(undefined)
    setCurrentExercise(undefined)
  }, [lessons, curriculum, saveProgress])

  const enqueueSRS = useCallback((exerciseId: string, correct: boolean, responseTime: number) => {
    setProgress(prev => {
      const existingIndex = prev.srs.findIndex(item => item.exerciseId === exerciseId)
      const now = new Date()
      
      let newItem: SRSItem
      
      if (existingIndex >= 0) {
        const existing = prev.srs[existingIndex]
        
        if (correct) {
          // Correct answer - increase interval
          const currentIntervalIndex = SRS_INTERVALS.indexOf(existing.interval)
          const newIntervalIndex = Math.min(currentIntervalIndex + 1, SRS_INTERVALS.length - 1)
          const newInterval = SRS_INTERVALS[newIntervalIndex]
          
          newItem = {
            ...existing,
            interval: newInterval,
            ease: Math.min(existing.ease + 0.1, SRS_EASE_FACTOR),
            wrongStreak: 0,
            dueAt: new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000).toISOString()
          }
        } else {
          // Wrong answer - reset interval
          newItem = {
            ...existing,
            interval: 1,
            ease: Math.max(existing.ease - 0.2, SRS_MIN_EASE),
            wrongStreak: existing.wrongStreak + 1,
            dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
          }
        }
        
        const newSRS = [...prev.srs]
        newSRS[existingIndex] = newItem
        return { ...prev, srs: newSRS }
      } else {
        // New item
        newItem = {
          exerciseId,
          interval: correct ? 2 : 1,
          ease: correct ? 2.5 : 1.3,
          wrongStreak: correct ? 0 : 1,
          dueAt: new Date(now.getTime() + (correct ? 2 : 1) * 24 * 60 * 60 * 1000).toISOString()
        }
        
        return { ...prev, srs: [...prev.srs, newItem] }
      }
    })
  }, [])

  const dequeueSRS = useCallback((exerciseId: string) => {
    setProgress(prev => ({
      ...prev,
      srs: prev.srs.filter(item => item.exerciseId !== exerciseId)
    }))
  }, [])

  const refillDaily = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      hearts: prev.maxHearts,
      lastActiveISO: new Date().toISOString()
    }))
  }, [])

  const awardXP = useCallback((amount: number) => {
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + amount
    }))
    
    // TODO: Integrate with main gamification system
    // This would update the main app's XP and check for badge unlocks
  }, [])

  const incrementStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const lastActive = progress.lastActiveISO?.split('T')[0]
    
    if (lastActive !== today) {
      setProgress(prev => ({
        ...prev,
        streakDays: prev.streakDays + 1,
        lastActiveISO: new Date().toISOString()
      }))
    }
  }, [progress.lastActiveISO])

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProgress(DEFAULT_PROGRESS)
    setCurrentLesson(undefined)
    setCurrentExercise(undefined)
    setLessonHearts(5)
    setLessonXP(0)
  }, [])

  // Get practice queue (due SRS items)
  const getPracticeQueue = useCallback(() => {
    const now = new Date()
    return progress.srs
      .filter(item => new Date(item.dueAt) <= now)
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
  }, [progress.srs])

  // Get leaderboard data
  const getLeaderboard = useCallback(async (week?: string) => {
    try {
      const response = await fetch('/data/learning/leaderboard.json')
      const data = await response.json()
      return week ? data.leaderboards.find((lb: any) => lb.week === week) : data.leaderboards[0]
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
      return null
    }
  }, [])

  // Get tip by ID
  const getTip = useCallback((tipId: string) => {
    return tips?.tips.find(tip => tip.id === tipId)
  }, [tips])

  // Get exercise by ID
  const getExercise = useCallback((exerciseId: string) => {
    return exercises?.exercises.find(ex => ex.id === exerciseId)
  }, [exercises])

  // Get lesson by ID
  const getLesson = useCallback((lessonId: string) => {
    return lessons?.lessons.find(lesson => lesson.id === lessonId)
  }, [lessons])

  const state: LearningState = {
    ...progress,
    currentLesson,
    currentExercise,
    lessonHearts,
    lessonXP
  }

  const actions: LearningActions = {
    startLesson,
    submitAnswer,
    loseHeart,
    gainHeart,
    completeLesson,
    enqueueSRS,
    dequeueSRS,
    refillDaily,
    awardXP,
    incrementStreak,
    resetProgress
  }

  return {
    ...state,
    ...actions,
    // Additional helper methods
    getSkillStatus,
    getLessonStatus,
    getPracticeQueue,
    getLeaderboard,
    getTip,
    getExercise,
    getLesson,
    curriculum: curriculum?.units || [],
    lessons: lessons?.lessons || [],
    exercises: exercises?.exercises || [],
    tips: tips?.tips || []
  }
}
