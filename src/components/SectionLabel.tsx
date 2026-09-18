interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

/** A small, widely-tracked label. Used sparingly to mark a section's role. */
export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}
