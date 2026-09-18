export interface DiscoveryOption {
  id: string
  label: string
  subtitle?: string
  image: string
  accentHue?: number
  flavorProfile?: string
  description?: string
  weights: {
    complexity: number
    smoothness: number
    intensity: number
    sweetness: number
    smokiness: number
  }
}

export interface MoodOption extends DiscoveryOption {}
export interface FlavourOption extends DiscoveryOption {
  tastingNote: string
}
export interface OccasionOption extends DiscoveryOption {
  setting: string
}
export interface SpiritOption {
  id: string
  name: string
  category: 'Whisky' | 'Gin' | 'Rum' | 'Vodka' | 'Tequila' | 'Cognac'
  heritage: string
  tagline: string
  image: string
  accentColor: string
  ambientHue: number
}

export interface CharacterState {
  weight: number // 0 (Light) -> 50 (Balanced) -> 100 (Bold)
  expression: number // 0 (Subtle) -> 50 (Balanced) -> 100 (Expressive)
}

export interface DiscoveryAnswers {
  mood?: string
  flavour?: string
  occasion?: string
  character?: CharacterState
  spirit?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 01 — THE MOOD
// ─────────────────────────────────────────────────────────────────────────────
export const moodOptions: MoodOption[] = [
  {
    id: 'relax',
    label: 'Relax & Unwind',
    subtitle: 'Solitary, contemplative, unhurried ease',
    image: '/images/discovery/01-mood-relax.webp',
    accentHue: 35,
    description: 'Slow velvet warmth and contemplative calm after a demanding day.',
    weights: { complexity: 20, smoothness: 35, intensity: -10, sweetness: 15, smokiness: 10 },
  },
  {
    id: 'celebrate',
    label: 'Celebrate',
    subtitle: 'Golden hour, toasts & grand milestones',
    image: '/images/discovery/02-mood-celebrate.webp',
    accentHue: 44,
    description: 'Effervescent luxury, crystal glasses chiming, and vibrant triumph.',
    weights: { complexity: 25, smoothness: 20, intensity: 20, sweetness: 25, smokiness: -10 },
  },
  {
    id: 'explore',
    label: 'Explore Something New',
    subtitle: 'Curiosity, unexpected terroir & wild intrigue',
    image: '/images/discovery/03-mood-explore.webp',
    accentHue: 28,
    description: 'Unchartered casks, complex botanical formulas, and intrepid spirits.',
    weights: { complexity: 35, smoothness: -5, intensity: 30, sweetness: 5, smokiness: 25 },
  },
  {
    id: 'connect',
    label: 'Connect & Share',
    subtitle: 'Convivial conversation & intimate warmth',
    image: '/images/discovery/04-mood-connect.webp',
    accentHue: 38,
    description: 'Rich pours made to linger over in the company of cherished equals.',
    weights: { complexity: 20, smoothness: 30, intensity: 10, sweetness: 20, smokiness: 5 },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 02 — THE FLAVOUR
// ─────────────────────────────────────────────────────────────────────────────
export const flavourOptions: FlavourOption[] = [
  {
    id: 'fruity',
    label: 'Fruity',
    subtitle: 'Ripe Orchard & Dark Fig',
    tastingNote: 'Candied plum, dried apricot & ruby grape',
    image: '/images/discovery/05-flavour-fruity.webp',
    accentHue: 25,
    weights: { complexity: 15, smoothness: 20, intensity: 5, sweetness: 35, smokiness: -20 },
  },
  {
    id: 'spicy',
    label: 'Spicy',
    subtitle: 'Exotic Cinnamon & Clove',
    tastingNote: 'Cracked peppercorn, nutmeg & toasted bark',
    image: '/images/discovery/06-flavour-spicy.webp',
    accentHue: 20,
    weights: { complexity: 25, smoothness: 5, intensity: 30, sweetness: 10, smokiness: 15 },
  },
  {
    id: 'smoky',
    label: 'Smoky',
    subtitle: 'Campfire Peat & Sea Salt',
    tastingNote: 'Charred barrel oak, maritime brine & drifting vapor',
    image: '/images/discovery/07-flavour-smoky.webp',
    accentHue: 15,
    weights: { complexity: 35, smoothness: -10, intensity: 40, sweetness: -15, smokiness: 50 },
  },
  {
    id: 'smooth',
    label: 'Smooth',
    subtitle: 'Velvet Vanilla & Butterscotch',
    tastingNote: 'Liquid cashmere, spun silk & delicate honey',
    image: '/images/discovery/08-flavour-smooth.webp',
    accentHue: 40,
    weights: { complexity: 10, smoothness: 45, intensity: -15, sweetness: 30, smokiness: -15 },
  },
  {
    id: 'citrus',
    label: 'Citrus',
    subtitle: 'Bergamot & Zesty Botanical',
    tastingNote: 'Bright grapefruit peel, coriander & fresh blossom',
    image: '/images/discovery/09-flavour-citrus.webp',
    accentHue: 48,
    weights: { complexity: 20, smoothness: 15, intensity: 10, sweetness: 10, smokiness: -25 },
  },
  {
    id: 'oaky',
    label: 'Rich & Oaky',
    subtitle: 'Heirloom Sherry & Roasted Cacao',
    tastingNote: 'Ancient stave wood, leather, espresso & cigar leaf',
    image: '/images/discovery/10-flavour-oaky.webp',
    accentHue: 30,
    weights: { complexity: 35, smoothness: 20, intensity: 25, sweetness: 15, smokiness: 20 },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 03 — THE OCCASION
// ─────────────────────────────────────────────────────────────────────────────
export const occasionOptions: OccasionOption[] = [
  {
    id: 'quiet',
    label: 'A quiet evening',
    subtitle: 'Low light, deep armchair, fireside stillness',
    setting: 'Private Sanctuary',
    image: '/images/discovery/11-occasion-quiet.webp',
    accentHue: 32,
    weights: { complexity: 20, smoothness: 30, intensity: 10, sweetness: 15, smokiness: 15 },
  },
  {
    id: 'friends',
    label: 'With friends',
    subtitle: 'Shared stories, laughter & flowing pours',
    setting: 'Convivial Gathering',
    image: '/images/discovery/12-occasion-friends.webp',
    accentHue: 40,
    weights: { complexity: 15, smoothness: 25, intensity: 15, sweetness: 25, smokiness: -5 },
  },
  {
    id: 'special',
    label: 'A special occasion',
    subtitle: 'Honoring triumphs with the cellar reserve',
    setting: 'Grand Milestone',
    image: '/images/discovery/13-occasion-special.webp',
    accentHue: 44,
    weights: { complexity: 35, smoothness: 25, intensity: 20, sweetness: 20, smokiness: 10 },
  },
  {
    id: 'after-dinner',
    label: 'After dinner',
    subtitle: 'The evening digestif with dark chocolate',
    setting: 'Salon Digestif',
    image: '/images/discovery/14-occasion-afterdinner.webp',
    accentHue: 22,
    weights: { complexity: 30, smoothness: 20, intensity: 25, sweetness: 20, smokiness: 15 },
  },
  {
    id: 'exploring',
    label: 'Just exploring',
    subtitle: 'An open palate ready to be astonished',
    setting: 'Tasting Laboratory',
    image: '/images/discovery/15-occasion-exploring.webp',
    accentHue: 35,
    weights: { complexity: 30, smoothness: 10, intensity: 20, sweetness: 10, smokiness: 20 },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 05 — THE SPIRIT WORLDS
// ─────────────────────────────────────────────────────────────────────────────
export const spiritOptions: SpiritOption[] = [
  {
    id: 'whisky',
    name: 'WHISKY',
    category: 'Whisky',
    heritage: 'Highlands, Speyside & Islay',
    tagline: 'Casks seasoned by decades of Scottish climate & sherry oak.',
    image: '/images/discovery/16-spirit-whisky.webp',
    accentColor: '#D8BD7A',
    ambientHue: 36,
  },
  {
    id: 'gin',
    name: 'GIN',
    category: 'Gin',
    heritage: 'Botanical Laboratories & Black Forest',
    tagline: 'Rare botanicals, hand-foraged juniper & crisp mountain dew.',
    image: '/images/discovery/17-spirit-gin.webp',
    accentColor: '#9AC2B8',
    ambientHue: 165,
  },
  {
    id: 'rum',
    name: 'RUM',
    category: 'Rum',
    heritage: 'Barbados & Venezuelan Terraces',
    tagline: 'Sun-drenched sugarcane aged in toasted ex-bourbon and cognac oak.',
    image: '/images/discovery/18-spirit-rum.webp',
    accentColor: '#D99B52',
    ambientHue: 28,
  },
  {
    id: 'tequila',
    name: 'TEQUILA',
    category: 'Tequila',
    heritage: 'Highlands of Jalisco, Mexico',
    tagline: 'Slow-cooked blue weber agave rested in fine French and American barrels.',
    image: '/images/discovery/19-spirit-tequila.webp',
    accentColor: '#C4A875',
    ambientHue: 45,
  },
  {
    id: 'brandy',
    name: 'BRANDY',
    category: 'Cognac',
    heritage: 'Charente Valley, Cognac, France',
    tagline: 'Noble eaux-de-vie distilled from white wine grapes into liquid rancio.',
    image: '/images/discovery/20-spirit-brandy.webp',
    accentColor: '#BD6F4C',
    ambientHue: 18,
  },
  {
    id: 'vodka',
    name: 'VODKA',
    category: 'Vodka',
    heritage: 'Glacial Filtration & Rare Winter Wheat',
    tagline: 'Purity elevated to silken crystalline texture and subtle mineral grace.',
    image: '/images/discovery/21-spirit-vodka.webp',
    accentColor: '#B6C4CF',
    ambientHue: 210,
  },
]
