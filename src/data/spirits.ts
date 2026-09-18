import type { Spirit } from '@/types'

export const spirits: Spirit[] = [
  {
    id: 'clase-azul-reposado',
    brand: 'Clase Azul',
    name: 'Reposado',
    fullName: 'Clase Azul Reposado',
    category: 'Tequila',
    origin: 'Jalisco, Mexico',
    archetype: 'THE EXPLORER',
    descriptors: ['Smooth', 'Warm', 'Celebratory'],
    description:
      'Rested eight months in ex-cognac and sherry casks, Clase Azul Reposado softens agave sweetness into caramel and vanilla, finishing with quiet warmth rather than heat.',
    tastingNotes: ['Cooked agave', 'Caramel', 'Vanilla', 'Cinnamon', 'Almond'],
    servingStyle: 'Neat, in a small clay cup at room temperature',
    pairing: 'Mole negro or an intimate evening celebration',
    cask: 'Ex-Cognac & Sherry Casks (8 Months)',
    abv: '40% Vol.',
    image: '/images/bottles/clase-azul-reposado.jpg',
    profile: { complexity: 70, smoothness: 91, intensity: 58, sweetness: 82, smokiness: 15 },
    glyphHue: 205,
  },
  {
    id: 'macallan-18',
    brand: 'The Macallan',
    name: '18',
    fullName: 'The Macallan 18',
    category: 'Whisky',
    origin: 'Speyside, Scotland',
    archetype: 'THE CONNOISSEUR',
    descriptors: ['Rich', 'Complex', 'Refined'],
    description:
      'Matured entirely in hand-selected sherry-seasoned oak casks, The Macallan 18 unfolds in layers — dried fruit, antique wood, and a slow curl of warming spice that lingers long after the glass is empty.',
    tastingNotes: ['Dried fig', 'Toasted oak', 'Clove', 'Orange peel', 'Dark chocolate'],
    servingStyle: 'Neat, in a tulip glass, at room temperature',
    pairing: 'Dark single-origin chocolate or quiet contemplation',
    cask: 'Hand-selected Sherry-Seasoned Oak Casks',
    abv: '43% Vol.',
    image: '/images/bottles/macallan-18.jpg',
    profile: { complexity: 92, smoothness: 87, intensity: 81, sweetness: 76, smokiness: 68 },
    glyphHue: 34,
  },
  {
    id: 'hennessy-xo',
    brand: 'Hennessy',
    name: 'XO',
    fullName: 'Hennessy XO',
    category: 'Cognac',
    origin: 'Cognac, France',
    archetype: 'THE EPICUREAN',
    descriptors: ['Opulent', 'Deep', 'Timeless'],
    description:
      'A blend of over a hundred eaux-de-vie aged up to thirty years, Hennessy XO is dense with candied fruit, leather, and rancio — a cognac built for slow, deliberate attention.',
    tastingNotes: ['Candied plum', 'Leather', 'Dark rose', 'Rancio', 'Cacao'],
    servingStyle: 'Neat, in a wide-bowled snifter',
    pairing: 'Aged Gouda or private fireside conversation',
    cask: 'French Limousin Oak (Up to 30 Years)',
    abv: '40% Vol.',
    image: '/images/bottles/hennessy-xo.jpg',
    profile: { complexity: 95, smoothness: 78, intensity: 88, sweetness: 66, smokiness: 20 },
    glyphHue: 16,
  },
  {
    id: 'lagavulin-16',
    brand: 'Lagavulin',
    name: '16',
    fullName: 'Lagavulin 16',
    category: 'Whisky',
    origin: 'Islay, Scotland',
    archetype: 'THE PURIST',
    descriptors: ['Smoky', 'Intense', 'Maritime'],
    description:
      'Lagavulin 16 is Islay at its most uncompromising — thick peat smoke wrapped around brine, iodine, and a sweetness that surfaces only after the smoke has made its point.',
    tastingNotes: ['Peat smoke', 'Sea salt', 'Iodine', 'Dried fruit', 'Tar'],
    servingStyle: 'Neat, with three drops of still water',
    pairing: 'Smoked wild game or a storm on the coast',
    cask: 'Refill American Oak Casks (16 Years)',
    abv: '43% Vol.',
    image: '/images/bottles/lagavulin-16.jpg',
    profile: { complexity: 90, smoothness: 62, intensity: 96, sweetness: 40, smokiness: 97 },
    glyphHue: 14,
  },
  {
    id: 'glenfiddich-21',
    brand: 'Glenfiddich',
    name: '21',
    fullName: 'Glenfiddich 21',
    category: 'Whisky',
    origin: 'Speyside, Scotland',
    archetype: 'THE ARBITER',
    descriptors: ['Layered', 'Warm', 'Elegant'],
    description:
      'Finished in Caribbean rum casks, Glenfiddich 21 carries a quiet sweetness beneath its classic Speyside backbone — vanilla and baked apple resolving into a long, spiced finish.',
    tastingNotes: ['Baked apple', 'Vanilla', 'Toffee', 'Nutmeg', 'Oak'],
    servingStyle: 'Neat or with a hand-carved ice sphere',
    pairing: 'Roasted Marcona almonds or slow jazz',
    cask: 'Ex-Bourbon with Caribbean Rum Cask Finish',
    abv: '40% Vol.',
    image: '/images/bottles/glenfiddich-21.jpg',
    profile: { complexity: 84, smoothness: 88, intensity: 70, sweetness: 79, smokiness: 22 },
    glyphHue: 30,
  },
  {
    id: 'dalmore-18',
    brand: 'Dalmore',
    name: '18',
    fullName: 'Dalmore 18',
    category: 'Whisky',
    origin: 'Highlands, Scotland',
    archetype: 'THE PATRICIAN',
    descriptors: ['Bold', 'Sweet', 'Structured'],
    description:
      'Aged in a rare succession of Matusalem, Apostoles, and Amoroso sherry butts, Dalmore 18 is architecture in liquid form — citrus and cocoa held together by a firm, confident spine.',
    tastingNotes: ['Marmalade', 'Espresso', 'Dark cherry', 'Cinnamon', 'Walnut'],
    servingStyle: 'Neat, allowing ten minutes to open in glass',
    pairing: 'Orange-dusted bitter chocolate',
    cask: 'Matusalem, Apostoles & Amoroso Sherry Butts',
    abv: '43% Vol.',
    image: '/images/bottles/dalmore-18.jpg',
    profile: { complexity: 88, smoothness: 80, intensity: 85, sweetness: 74, smokiness: 30 },
    glyphHue: 20,
  },
  {
    id: 'diplomatico-reserva',
    brand: 'Diplomático',
    name: 'Reserva Exclusiva',
    fullName: 'Diplomático Reserva Exclusiva',
    category: 'Rum',
    origin: 'Venezuela',
    archetype: 'THE HEDONIST',
    descriptors: ['Velvet', 'Sweet', 'Round'],
    description:
      'A blend of pot- and column-distilled rums aged up to twelve years, Diplomático Reserva Exclusiva pours like dark honey — orange peel, toffee, and tobacco settling into a silken finish.',
    tastingNotes: ['Toffee', 'Orange zest', 'Tobacco leaf', 'Vanilla', 'Molasses'],
    servingStyle: 'Neat over a single crystal ice rock',
    pairing: 'Dark caramel tart or late terrace evening',
    cask: 'Ex-Bourbon White Oak Barrels (12 Years)',
    abv: '40% Vol.',
    image: '/images/bottles/diplomatico-reserva.jpg',
    profile: { complexity: 74, smoothness: 94, intensity: 62, sweetness: 90, smokiness: 12 },
    glyphHue: 28,
  },
  {
    id: 'plantation-xo',
    brand: 'Plantation',
    name: 'XO 20th Anniversary',
    fullName: 'Plantation XO 20th Anniversary',
    category: 'Rum',
    origin: 'Barbados',
    archetype: 'THE VOYAGER',
    descriptors: ['Fruit-forward', 'Silky', 'Bright'],
    description:
      'A tropical-then-continental aging journey gives Plantation XO its signature lift — ripe banana and dried apricot carried on a smooth, sun-warmed body.',
    tastingNotes: ['Banana', 'Dried apricot', 'Honey', 'Cinnamon', 'Coconut'],
    servingStyle: 'Neat or lightly cellar-chilled',
    pairing: 'Tropical tarte tatin or golden-hour sunset',
    cask: 'Tropical Bourbon Casks + Ferrand French Oak',
    abv: '40% Vol.',
    image: '/images/bottles/plantation-xo.jpg',
    profile: { complexity: 68, smoothness: 90, intensity: 55, sweetness: 88, smokiness: 8 },
    glyphHue: 36,
  },
  {
    id: 'hendricks',
    brand: "Hendrick's",
    name: 'Original',
    fullName: "Hendrick's Gin",
    category: 'Gin',
    origin: 'Scotland',
    archetype: 'THE BOTANIST',
    descriptors: ['Fresh', 'Floral', 'Curious'],
    description:
      "Infused with rose and cucumber alongside classic botanicals, Hendrick's trades the expected juniper punch for something quieter and more perfumed — an unconventional, contemplative pour.",
    tastingNotes: ['Rose petal', 'Cucumber', 'Juniper', 'Coriander', 'Citrus peel'],
    servingStyle: 'With fine Indian tonic and cucumber ribbon',
    pairing: 'Oysters on the half shell or sunlit conservatory',
    cask: 'Carter-Head & Bennett Still Infusion',
    abv: '41.4% Vol.',
    image: '/images/bottles/hendricks.jpg',
    profile: { complexity: 60, smoothness: 82, intensity: 45, sweetness: 38, smokiness: 4 },
    glyphHue: 150,
  },
  {
    id: 'monkey47',
    brand: 'Monkey 47',
    name: 'Schwarzwald Dry Gin',
    fullName: 'Monkey 47 Schwarzwald Dry Gin',
    category: 'Gin',
    origin: 'Black Forest, Germany',
    archetype: 'THE ALCHEMIST',
    descriptors: ['Adventurous', 'Layered', 'Sharp'],
    description:
      'Forty-seven botanicals, including Black Forest lingonberry, converge into a gin of remarkable density — spiced, tart, and unmistakably its own.',
    tastingNotes: ['Lingonberry', 'Juniper', 'Pepper', 'Bergamot', 'Pine'],
    servingStyle: 'On the rocks with a twist of ruby grapefruit',
    pairing: 'Cured charcuterie or an intrepid conversation',
    cask: 'Traditional Earthenware Vats (100 Days)',
    abv: '47% Vol.',
    image: '/images/bottles/monkey47.png',
    profile: { complexity: 89, smoothness: 66, intensity: 78, sweetness: 30, smokiness: 10 },
    glyphHue: 342,
  },
]

export const getSpiritById = (id: string): Spirit | undefined =>
  spirits.find((s) => s.id === id)

export const getAlternatives = (spirit: Spirit, count = 3): Spirit[] => {
  const others = spirits.filter((s) => s.id !== spirit.id)
  const scored = others
    .map((s) => {
      const diff =
        Math.abs(s.profile.complexity - spirit.profile.complexity) +
        Math.abs(s.profile.smoothness - spirit.profile.smoothness) +
        Math.abs(s.profile.intensity - spirit.profile.intensity) +
        Math.abs(s.profile.sweetness - spirit.profile.sweetness) +
        Math.abs(s.profile.smokiness - spirit.profile.smokiness)
      const match = Math.max(60, Math.round(100 - diff / 6))
      return { spirit: s, match }
    })
    .sort((a, b) => b.match - a.match)
  return scored.slice(0, count).map((s) => s.spirit) as unknown as Spirit[]
}

export const getAlternativesWithMatch = (spirit: Spirit, count = 3) => {
  const others = spirits.filter((s) => s.id !== spirit.id)
  return others
    .map((s) => {
      const diff =
        Math.abs(s.profile.complexity - spirit.profile.complexity) +
        Math.abs(s.profile.smoothness - spirit.profile.smoothness) +
        Math.abs(s.profile.intensity - spirit.profile.intensity) +
        Math.abs(s.profile.sweetness - spirit.profile.sweetness) +
        Math.abs(s.profile.smokiness - spirit.profile.smokiness)
      const match = Math.max(60, Math.round(100 - diff / 6))
      return { spirit: s, match }
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, count)
}
