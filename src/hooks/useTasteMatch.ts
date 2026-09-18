import { useMemo } from 'react'
import { questions } from '@/data/questions'
import { spirits } from '@/data/spirits'
import type { Answers, Spirit, TasteProfile } from '@/types'

const BASE: TasteProfile = { complexity: 50, smoothness: 50, intensity: 50, sweetness: 50, smokiness: 50 }
const STEP = 8

/**
 * Derives a mock "taste DNA" profile from the user's answers, then finds
 * the closest matching spirit in the local catalog. All computation is
 * frontend-only and deterministic — no backend, no network calls.
 */
export function computeTasteProfile(answers: Answers): TasteProfile {
  const profile: TasteProfile = { ...BASE }

  questions.forEach((q) => {
    const chosenId = answers[q.id]
    const option = q.options.find((o) => o.id === chosenId)
    if (!option) return
    Object.entries(option.weights).forEach(([key, weight]) => {
      const k = key as keyof TasteProfile
      profile[k] = clamp(profile[k] + (weight ?? 0) * STEP)
    })
  })

  return profile
}

function clamp(v: number) {
  return Math.max(4, Math.min(98, Math.round(v)))
}

export function findBestMatch(profile: TasteProfile): { spirit: Spirit; match: number } {
  let best = spirits[0]
  let bestDiff = Infinity

  spirits.forEach((s) => {
    const diff =
      Math.abs(s.profile.complexity - profile.complexity) +
      Math.abs(s.profile.smoothness - profile.smoothness) +
      Math.abs(s.profile.intensity - profile.intensity) +
      Math.abs(s.profile.sweetness - profile.sweetness) +
      Math.abs(s.profile.smokiness - profile.smokiness)
    if (diff < bestDiff) {
      bestDiff = diff
      best = s
    }
  })

  const match = Math.max(74, Math.min(99, Math.round(100 - bestDiff / 7)))
  return { spirit: best, match }
}

export function useTasteMatch(answers: Answers) {
  return useMemo(() => {
    const profile = computeTasteProfile(answers)
    const { spirit, match } = findBestMatch(profile)
    return { profile, spirit, match }
  }, [answers])
}
