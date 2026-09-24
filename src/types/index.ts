export type SpiritCategory =
  | 'Whisky'
  | 'Single Malt'
  | 'Blend'
  | 'Rum'
  | 'Gin'
  | 'Tequila'
  | 'Cognac'
  | 'Vodka'

export interface TasteProfile {
  complexity: number
  smoothness: number
  intensity: number
  sweetness: number
  smokiness: number
}

export interface Spirit {
  id: string
  brand: string
  name: string
  fullName: string
  category: SpiritCategory
  origin: string
  descriptors: string[]
  description: string
  tastingNotes: string[]
  servingStyle: string
  pairing: string
  profile: TasteProfile
  /** hue used for the generated bottle glyph, keeps art direction consistent per spirit */
  glyphHue: number
  /** optional high-res photography asset */
  image?: string
  /** taste identity archetype (e.g. 'THE EXPLORER', 'THE CONNOISSEUR') */
  archetype?: string
  /** cask / aging specs */
  cask?: string
  /** alcohol by volume */
  abv?: string
}

export type SensoryObjectType =
  | 'crystal-flacon'
  | 'amber-vessel'
  | 'botanical-flask'
  | 'peat-chalice'
  | 'bronze-instrument'
  | 'obsidian-beaker'
  | 'fluted-glass'
  | string

export type EssenceVaporType =
  | 'mist'
  | 'amber-glow'
  | 'golden-spark'
  | 'peat-smoke'
  | 'botanical-dew'
  | string

export interface QuestionOption {
  id: string
  label: string
  caption: string
  /** how strongly this option pushes each taste dimension, -2..2 */
  weights: Partial<TasteProfile>
  /** Sensory object type rendered in the tasting room */
  objectType: SensoryObjectType
  /** Tactile material of the vessel */
  material: string
  /** Sommelier tasting descriptors */
  sensoryDescriptor: string
  /** Granular tasting notes revealed on proximity */
  tastingNotes: string[]
  /** HSL hue used for volumetric lighting and liquid refraction */
  hue: number
  /** Visual signature of the vapor/essence when chosen */
  essenceVapor: EssenceVaporType
  /** Viscosity of the fluid inside (0.1 = light/watery, 0.9 = rich syrup/oil) */
  viscosity?: number
}

export interface Question {
  id: string
  index: number
  prompt: string
  headline?: string
  sommelierPrompt?: string
  stageName: string
  stageSubtitle: string
  sommelierNote: string
  options: QuestionOption[]
  image?: string
  flavorName?: string
  orderId?: string
  intro?: string
  flavour?: string | null
}

export type Answers = Record<string, string>

