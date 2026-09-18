import { useMemo } from 'react'
import { spirits, getAlternativesWithMatch } from '@/data/spirits'
import {
  moodOptions,
  flavourOptions,
  occasionOptions,
  type DiscoveryAnswers,
} from '@/data/discoveryStages'
import type { Spirit, TasteProfile } from '@/types'

export interface DiscoveryMatchResult {
  primarySpirit: Spirit
  matchScore: number
  alternatives: { spirit: Spirit; match: number }[]
  computedProfile: TasteProfile
  summaryHeadline: string
  tastingNoteHighlights: string[]
}

export function useDiscoveryMatch(answers: DiscoveryAnswers): DiscoveryMatchResult {
  return useMemo(() => {
    // 1. Base default profile
    const targetProfile: TasteProfile = {
      complexity: 75,
      smoothness: 75,
      intensity: 70,
      sweetness: 65,
      smokiness: 25,
    }

    // 2. Accumulate weights from Mood
    const selectedMood = moodOptions.find((m) => m.id === answers.mood)
    if (selectedMood) {
      targetProfile.complexity += selectedMood.weights.complexity * 0.3
      targetProfile.smoothness += selectedMood.weights.smoothness * 0.3
      targetProfile.intensity += selectedMood.weights.intensity * 0.3
      targetProfile.sweetness += selectedMood.weights.sweetness * 0.3
      targetProfile.smokiness += selectedMood.weights.smokiness * 0.3
    }

    // 3. Accumulate weights from Flavour
    const selectedFlavour = flavourOptions.find((f) => f.id === answers.flavour)
    if (selectedFlavour) {
      targetProfile.complexity += selectedFlavour.weights.complexity * 0.45
      targetProfile.smoothness += selectedFlavour.weights.smoothness * 0.45
      targetProfile.intensity += selectedFlavour.weights.intensity * 0.45
      targetProfile.sweetness += selectedFlavour.weights.sweetness * 0.45
      targetProfile.smokiness += selectedFlavour.weights.smokiness * 0.45
    }

    // 4. Accumulate weights from Occasion
    const selectedOccasion = occasionOptions.find((o) => o.id === answers.occasion)
    if (selectedOccasion) {
      targetProfile.complexity += selectedOccasion.weights.complexity * 0.25
      targetProfile.smoothness += selectedOccasion.weights.smoothness * 0.25
      targetProfile.intensity += selectedOccasion.weights.intensity * 0.25
      targetProfile.sweetness += selectedOccasion.weights.sweetness * 0.25
      targetProfile.smokiness += selectedOccasion.weights.smokiness * 0.25
    }

    // 5. Accumulate from Character Spectrum (Light/Bold and Subtle/Expressive)
    if (answers.character) {
      const { weight, expression } = answers.character
      // weight (0 Light -> 100 Bold): affects intensity and complexity vs smoothness
      const weightDelta = (weight - 50) * 0.35
      targetProfile.intensity += weightDelta
      targetProfile.smoothness -= weightDelta * 0.4
      targetProfile.complexity += weightDelta * 0.25

      // expression (0 Subtle -> 100 Expressive): affects sweetness and smokiness punch
      const exprDelta = (expression - 50) * 0.35
      targetProfile.sweetness += exprDelta * 0.3
      targetProfile.complexity += exprDelta * 0.35
    }

    // Clamp values 0-100
    const finalProfile: TasteProfile = {
      complexity: Math.max(20, Math.min(99, Math.round(targetProfile.complexity))),
      smoothness: Math.max(20, Math.min(99, Math.round(targetProfile.smoothness))),
      intensity: Math.max(20, Math.min(99, Math.round(targetProfile.intensity))),
      sweetness: Math.max(20, Math.min(99, Math.round(targetProfile.sweetness))),
      smokiness: Math.max(0, Math.min(99, Math.round(targetProfile.smokiness))),
    }

    // 6. Filter by Spirit Category if chosen
    let eligibleSpirits = spirits
    if (answers.spirit) {
      const spiritCatMap: Record<string, string> = {
        whisky: 'Whisky',
        gin: 'Gin',
        rum: 'Rum',
        tequila: 'Tequila',
        brandy: 'Cognac',
        vodka: 'Vodka',
      }
      const targetCat = spiritCatMap[answers.spirit.toLowerCase()]
      if (targetCat) {
        const matchingCategory = spirits.filter((s) => s.category === targetCat)
        if (matchingCategory.length > 0) {
          eligibleSpirits = matchingCategory
        }
      }
    }

    // 7. Score spirits
    const scoredSpirits = eligibleSpirits.map((s) => {
      const diff =
        Math.abs(s.profile.complexity - finalProfile.complexity) * 1.1 +
        Math.abs(s.profile.smoothness - finalProfile.smoothness) * 1.2 +
        Math.abs(s.profile.intensity - finalProfile.intensity) * 1.3 +
        Math.abs(s.profile.sweetness - finalProfile.sweetness) * 1.0 +
        Math.abs(s.profile.smokiness - finalProfile.smokiness) * 1.2

      const score = Math.max(68, Math.min(99, Math.round(100 - diff / 6.2)))
      return { spirit: s, match: score }
    })

    scoredSpirits.sort((a, b) => b.match - a.match)

    const topMatch = scoredSpirits[0] || {
      spirit: spirits[1], // Macallan 18 default
      match: 94,
    }

    // Get alternatives
    const alternatives = getAlternativesWithMatch(topMatch.spirit, 3)

    return {
      primarySpirit: topMatch.spirit,
      matchScore: topMatch.match,
      alternatives,
      computedProfile: finalProfile,
      summaryHeadline: topMatch.spirit.descriptors.join(' · '),
      tastingNoteHighlights: topMatch.spirit.tastingNotes.slice(0, 3),
    }
  }, [answers])
}
