import diageoResponse from './diageoQuizResponse.json'
import type { Question } from '../types'

export type AtmosphereType = 'smoke' | 'cream' | 'citrus' | 'ember' | 'botanical' | 'amber'

export interface SensoryTransitionMetadata {
  category: string
  title: string
  description: string
  imageUrl: string
  fallbackImageUrl?: string
  atmosphere: AtmosphereType
  ambientHue: number
  notes?: string[]
  sommelierCalibration?: string
}

// Extract Diageo images
const DIAGEO_IMAGES: Record<string, string> = {}
try {
  const quizQuestions = (diageoResponse as any)?.pageProps?.currentPageContent?.body?.[0]?.question || []
  for (const q of quizQuestions) {
    if (q.flavorName && q.image?.imageS?.url) {
      DIAGEO_IMAGES[q.flavorName] = q.image.imageS.url
    }
  }
} catch {}

export const SENSORY_TRANSITION_REGISTRY: Record<string, SensoryTransitionMetadata> = {
  chillies: {
    category: 'SPICE & HEAT',
    title: 'HOT CHILLIES',
    description: 'Vibrant capsaicin prickle, peppery warmth, and an energetic finish.',
    imageUrl: DIAGEO_IMAGES['chillies'] || '/images/flavors/chillies.jpg',
    fallbackImageUrl: '/images/flavors/chillies.jpg',
    atmosphere: 'ember',
    ambientHue: 20,
    notes: ['CAPSAICIN HEAT', 'PEPPERY WARMTH', 'RADIANT EMBERS'],
    sommelierCalibration: 'Fiery capsaicin calibration for palate intensity and peppery warmth.',
  },
  coconut: {
    category: 'TROPICAL SILK',
    title: 'TOASTED COCONUT',
    description: 'Silky toasted coconut, creamy lactones, and luxurious vanillin.',
    imageUrl: DIAGEO_IMAGES['coconut'] || '/images/flavors/coconut.jpg',
    fallbackImageUrl: '/images/flavors/coconut.jpg',
    atmosphere: 'cream',
    ambientHue: 40,
    notes: ['TOASTED COCONUT', 'CREAMY LACTONES', 'VELVET VANILLIN'],
    sommelierCalibration: 'Silky toasted coconut sugars, tropical lactones, and luxurious mouthfeel.',
  },
  appleCooked: {
    category: 'ORCHARD & CARAMEL',
    title: 'COOKED APPLE',
    description: 'Baked orchard apples, caramelized sugar, and autumnal warmth.',
    imageUrl: '/images/flavors/appleCooked.png',
    fallbackImageUrl: DIAGEO_IMAGES['appleCooked'] || '/images/flavors/appleCooked.png',
    atmosphere: 'amber',
    ambientHue: 35,
    notes: ['BAKED ORCHARD', 'CARAMELIZED', 'AUTUMNAL WARMTH'],
    sommelierCalibration: 'Stewed orchard fruit esters with caramelized pastry and cinnamon sugar.',
  },
  caramelPopcorns: {
    category: 'MAILLARD CONFECTION',
    title: 'CARAMEL POPCORN',
    description: 'Toasted buttery toffee, charred oak richness, and bourbon cask depth.',
    imageUrl: DIAGEO_IMAGES['caramelPopcorns'] || '/images/flavors/caramelPopcorns.jpg',
    fallbackImageUrl: '/images/flavors/caramelPopcorns.jpg',
    atmosphere: 'amber',
    ambientHue: 32,
    notes: ['TOASTED TOFFEE', 'BOURBON CASK', 'BUTTER CONFECTION'],
    sommelierCalibration: 'Toasted buttery toffee, charred oak richness, and deep bourbon sweetness.',
  },
  greenTea: {
    category: 'BOTANICAL CLARITY',
    title: 'GREEN TEA',
    description: 'Crisp mountain botanicals, structured tannins, and herbal clarity.',
    imageUrl: DIAGEO_IMAGES['greenTea'] || '/images/flavors/greenTea.jpg',
    fallbackImageUrl: '/images/flavors/greenTea.jpg',
    atmosphere: 'botanical',
    ambientHue: 110,
    notes: ['HIGHLAND BOTANICAL', 'STRUCTURED TANNIN', 'HERBAL CLARITY'],
    sommelierCalibration: 'Crisp botanical cut of highland tea and structured wood tannins.',
  },
  pear: {
    category: 'FLORAL ESTERS',
    title: 'RIPE PEAR',
    description: 'Delicate white blossoms, crisp autumn pear, and ethereal floral lift.',
    imageUrl: DIAGEO_IMAGES['pear'] || '/images/flavors/pear.jpg',
    fallbackImageUrl: '/images/flavors/pear.jpg',
    atmosphere: 'botanical',
    ambientHue: 75,
    notes: ['AUTUMN ORCHARD', 'WHITE BLOSSOM', 'ETHEREAL LIFT'],
    sommelierCalibration: 'Delicate white blossoms, crisp autumn pear, and ethereal floral sweetness.',
  },
  freshGinger: {
    category: 'RHIZOME ZEST',
    title: 'FRESH GINGER',
    description: 'Electric gingerol zing, invigorating heat, and spirited radiance.',
    imageUrl: DIAGEO_IMAGES['freshGinger'] || '/images/flavors/freshGinger.jpg',
    fallbackImageUrl: '/images/flavors/freshGinger.jpg',
    atmosphere: 'ember',
    ambientHue: 30,
    notes: ['ELECTRIC GINGEROL', 'TINGLING WARMTH', 'ROOT RADIANCE'],
    sommelierCalibration: 'Electric gingerol zing, invigorating heat, and spirited radiance.',
  },
  cumin: {
    category: 'EARTHEN SAVORY',
    title: 'TOASTED CUMIN',
    description: 'Toasted cumin aldehydes, savory warmth, and grounding terroir richness.',
    imageUrl: DIAGEO_IMAGES['cumin'] || '/images/flavors/cumin.jpg',
    fallbackImageUrl: '/images/flavors/cumin.jpg',
    atmosphere: 'amber',
    ambientHue: 38,
    notes: ['TOASTED TERROIR', 'SAVORY WARMTH', 'EARTHEN ALDEHYDES'],
    sommelierCalibration: 'Earthy rustic warmth of toasted cumin aldehydes and roasted spice.',
  },
  cinnamon: {
    category: 'BARK & HEARTH',
    title: 'CEYLON CINNAMON',
    description: 'Aromatic Ceylon bark, soothing sweetness, and hearthside glow.',
    imageUrl: DIAGEO_IMAGES['cinnamon'] || '/images/flavors/cinnamon.jpg',
    fallbackImageUrl: '/images/flavors/cinnamon.jpg',
    atmosphere: 'ember',
    ambientHue: 25,
    notes: ['AROMATIC BARK', 'HEARTHSIDE GLOW', 'SWEET WOODSPICE'],
    sommelierCalibration: 'Comforting aromatic bark of roasted Ceylon cinnamon and hearthside glow.',
  },
  burntBrinjal: {
    category: 'PYROLYTIC SMOKE',
    title: 'BURNT BRINJAL',
    description: 'Smoldering embers, savory umami depth, and lingering campfire ash.',
    imageUrl: DIAGEO_IMAGES['burntBrinjal'] || '/images/flavors/burntBrinjal.jpg',
    fallbackImageUrl: '/images/flavors/burntBrinjal.jpg',
    atmosphere: 'smoke',
    ambientHue: 18,
    notes: ['SMOLDERING PEAT', 'SAVORY UMAMI', 'CAMPFIRE ASH'],
    sommelierCalibration: 'Dark smoldering depth of hearth embers and savory pyrolytic umami.',
  },
  burntWood: {
    category: 'CHARRED OAK',
    title: 'BURNT WOOD',
    description: 'Heavy charred Scottish oak, smoldering peat, and tempestuous smoke.',
    imageUrl: DIAGEO_IMAGES['burntWood'] || '/images/flavors/burntWood.jpg',
    fallbackImageUrl: '/images/flavors/burntWood.jpg',
    atmosphere: 'smoke',
    ambientHue: 15,
    notes: ['CHARRED OAK', 'PEAT EMBER', 'TEMPESTUOUS SMOKE'],
    sommelierCalibration: 'Heavy charred Scottish oak, smoldering peat, and tempestuous smoke.',
  },
  lemongrass: {
    category: 'CITRUS LUMINOSITY',
    title: 'FRESH LEMONGRASS',
    description: 'Luminous citral brilliance, crushed herb oils, and sparkling freshness.',
    imageUrl: DIAGEO_IMAGES['lemongrass'] || '/images/flavors/lemongrass.jpg',
    fallbackImageUrl: '/images/flavors/lemongrass.jpg',
    atmosphere: 'citrus',
    ambientHue: 85,
    notes: ['CITRAL BRILLIANCE', 'CRUSHED HERB OILS', 'SPARKLING ZEST'],
    sommelierCalibration: 'Luminous citral brilliance, hand-crushed herb oils, and sparkling freshness.',
  },
  lassi: {
    category: 'CREAMY VELVET',
    title: 'CREAMY LASSI',
    description: 'Rich cultured cream, silky mouthfeel, and a soothing, unhurried finish.',
    imageUrl: DIAGEO_IMAGES['lassi'] || '/images/flavors/lassi.jpg',
    fallbackImageUrl: '/images/flavors/lassi.jpg',
    atmosphere: 'cream',
    ambientHue: 42,
    notes: ['CULTURED CREAM', 'SILKY MOUTHFEEL', 'UNHURRIED FINISH'],
    sommelierCalibration: 'Velvety balance of cultured cream and silky lactic acid.',
  },
}

/**
 * Returns consistent, unified sensory metadata for any Question.
 */
export function getSensoryTransitionData(question: Question): SensoryTransitionMetadata {
  const registered = SENSORY_TRANSITION_REGISTRY[question.id]
  if (registered) return registered

  return {
    category: (question.stageName || 'PALATE CALIBRATION').toUpperCase(),
    title: (question.flavorName || question.stageSubtitle || question.id).toUpperCase(),
    description: question.sommelierNote || 'Calibrating palate affinity and sensory resonance.',
    imageUrl: DIAGEO_IMAGES[question.id] || `/images/flavors/${question.id}.jpg`,
    fallbackImageUrl: `/images/flavors/${question.id}.jpg`,
    notes: ['PALATE CALIBRATION', 'BALANCED PROFILE', 'TASTING RESONANCE'],
    sommelierCalibration: question.sommelierNote || 'Calibrating palate affinity and sensory resonance.',
    atmosphere: 'amber',
    ambientHue: 38,
  }
}
