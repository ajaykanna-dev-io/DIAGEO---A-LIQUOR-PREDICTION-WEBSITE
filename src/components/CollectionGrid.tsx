import { useMemo, useState } from 'react'
import SpiritCard from './SpiritCard'
import type { Spirit, SpiritCategory } from '@/types'

interface CollectionGridProps {
  spirits: Spirit[]
}

const categories: SpiritCategory[] = ['Whisky', 'Rum', 'Gin', 'Tequila', 'Cognac', 'Vodka']

export default function CollectionGrid({ spirits }: CollectionGridProps) {
  const [active, setActive] = useState<SpiritCategory | 'All'>('All')

  const available = useMemo(
    () => categories.filter((c) => spirits.some((s) => s.category === c)),
    [spirits]
  )

  const filtered = useMemo(
    () => (active === 'All' ? spirits : spirits.filter((s) => s.category === active)),
    [spirits, active]
  )

  return (
    <div>
      <div className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-3 sm:gap-y-4 mb-10 sm:mb-16 border-b border-gold/10 pb-6 sm:pb-8">
        <FilterButton label="All" active={active === 'All'} onClick={() => setActive('All')} />
        {available.map((c) => (
          <FilterButton key={c} label={c} active={active === c} onClick={() => setActive(c)} />
        ))}
      </div>

      <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2">
        {filtered.map((spirit) => (
          <SpiritCard key={spirit.id} spirit={spirit} />
        ))}
      </div>
    </div>
  )
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative text-xs uppercase tracking-widest2 pb-2 transition-colors duration-500 ${
        active ? 'text-gold-light' : 'text-stone hover:text-ivory'
      }`}
    >
      {label}
      {/* Animated underline */}
      <span
        className={`absolute left-0 bottom-0 h-px bg-gold transition-all duration-700 ease-luxe ${
          active ? 'w-full' : 'w-0'
        }`}
      />
    </button>
  )
}
