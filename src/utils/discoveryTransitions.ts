/**
 * CINEMATIC DISCOVERY REVEAL
 *
 * Distinct ultra-luxury reveal techniques that intelligently alternate
 * based on flavour, category, and narrative progression.
 *
 * Avoids conventional fades, slides, or carousels in favor of organic,
 * optical, depth, and atmospheric camera language.
 */

export type RevealTechnique =
  | 'focus-pull'
  | 'object-led'
  | 'atmospheric'
  | 'liquid-diffusion'
  | 'editorial-mask'
  | 'depth-reveal'
  | 'breathing'
  | 'environmental-reveal'

export interface TransitionConfig {
  technique: RevealTechnique
  name: string
  sommelierTheme: string
  duration: number // ms (between 700ms and 1400ms)
}

/**
 * Stage-by-Stage Transition Vocabulary:
 * 01 → 02: Focus Pull
 * 02 → 03: Object-led Reveal
 * 03 → 04: Atmospheric Reveal
 * 04 → 05: Editorial Mask
 * 05 → 06: Depth Reveal
 * 06 → 07: Liquid Diffusion
 * 07 → 08: Focus Pull
 * 08 → 09: Object-led Reveal
 * 09 → 10: Atmospheric Reveal
 * 10 → 11: Depth Reveal
 * 11 → 12: Editorial Mask
 * 12 → 13: Cinematic Focus Pull
 * 13 → FINAL: Full Environmental Reveal
 */
export function getRevealTechniqueForStage(stageIndex: number): TransitionConfig {
  switch (stageIndex) {
    case 0:
      return {
        technique: 'focus-pull',
        name: 'Optical Focus Pull',
        sommelierTheme: 'Sensory Calibration Gateway',
        duration: 950,
      }
    case 1:
      // 01 -> 02: Chillies to Coconut (Focus Pull)
      return {
        technique: 'focus-pull',
        name: 'Cinematic Focus Pull',
        sommelierTheme: 'Optical Palate Refraction',
        duration: 950,
      }
    case 2:
      // 02 -> 03: Coconut to Baked Apple (Object-led Reveal)
      return {
        technique: 'object-led',
        name: 'Object-Led Emergence',
        sommelierTheme: 'Flavour Artifact Manifestation',
        duration: 1100,
      }
    case 3:
      // 03 -> 04: Baked Apple to Popcorn (Atmospheric Reveal)
      return {
        technique: 'atmospheric',
        name: 'Atmospheric Chamber Shift',
        sommelierTheme: 'Warm Amber Cellar Dispersion',
        duration: 1150,
      }
    case 4:
      // 04 -> 05: Popcorn to Green Tea (Editorial Mask)
      return {
        technique: 'editorial-mask',
        name: 'Editorial Mask Reveal',
        sommelierTheme: 'Botanical Ink Letterpress',
        duration: 900,
      }
    case 5:
      // 05 -> 06: Green Tea to Pear (Depth Reveal)
      return {
        technique: 'depth-reveal',
        name: 'Volumetric Depth Reveal',
        sommelierTheme: 'Cellar Plinth Perspective',
        duration: 1000,
      }
    case 6:
      // 06 -> 07: Pear to Ginger (Liquid Diffusion)
      return {
        technique: 'liquid-diffusion',
        name: 'Dark Amber Liquid Diffusion',
        sommelierTheme: 'Aged Spirit Radial Bloom',
        duration: 1200,
      }
    case 7:
      // 07 -> 08: Ginger to Cumin (Focus Pull)
      return {
        technique: 'focus-pull',
        name: 'Macro Focus Pull',
        sommelierTheme: 'Terroir Spice Resolution',
        duration: 950,
      }
    case 8:
      // 08 -> 09: Cumin to Cinnamon (Object-led Reveal)
      return {
        technique: 'object-led',
        name: 'Object-Led Emergence',
        sommelierTheme: 'Cask Stave Artifact Reveal',
        duration: 1100,
      }
    case 9:
      // 09 -> 10: Cinnamon to Aubergine (Atmospheric Reveal)
      return {
        technique: 'atmospheric',
        name: 'Smoked Umami Atmospheric Shift',
        sommelierTheme: 'Charcoal Haze Dissolution',
        duration: 1150,
      }
    case 10:
      // 10 -> 11: Aubergine to Smoke (Depth Reveal)
      return {
        technique: 'depth-reveal',
        name: 'Deep Cellar Perspective Reveal',
        sommelierTheme: 'Charred Oak Dimension',
        duration: 1050,
      }
    case 11:
      // 11 -> 12: Smoke to Lemongrass (Editorial Mask)
      return {
        technique: 'editorial-mask',
        name: 'Editorial Mask Reveal',
        sommelierTheme: 'Herbal Citronella Typographic Reveal',
        duration: 920,
      }
    case 12:
      // 12 -> 13: Lemongrass to Lassi (Cinematic Focus Pull)
      return {
        technique: 'focus-pull',
        name: 'Velvet Focus Pull',
        sommelierTheme: 'Cultured Cream Resolution',
        duration: 950,
      }
    case 13:
      // 13 -> The Reveal (Full Environmental Reveal)
      return {
        technique: 'environmental-reveal',
        name: 'Sanctuary Environmental Reveal',
        sommelierTheme: 'Bespoke Spirit Altar Opening',
        duration: 1350,
      }
    default:
      return {
        technique: 'focus-pull',
        name: 'Focus Pull',
        sommelierTheme: 'Sensory Clarity',
        duration: 950,
      }
  }
}
