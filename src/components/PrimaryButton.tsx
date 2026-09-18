import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  to?: string
  variant?: 'filled' | 'outline' | 'ghost'
  arrow?: boolean
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  flashy?: boolean
}

const base =
  'group relative inline-flex items-center gap-3 px-8 py-4 text-[0.72rem] uppercase tracking-widest2 transition-all duration-700 ease-luxe disabled:opacity-40 disabled:pointer-events-none'

const variants: Record<string, string> = {
  filled:
    'btn-shimmer bg-gold text-obsidian border border-gold hover:bg-gold-light hover:border-gold-light hover:shadow-glow-gold',
  outline:
    'border border-gold/50 text-ivory hover:border-gold hover:text-gold-light hover:shadow-glow-gold bg-transparent',
  ghost: 'text-stone hover:text-ivory border border-transparent',
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, onClick, to, variant = 'outline', arrow = true, className = '', type = 'button', disabled, flashy = false }, ref) => {
    const content = (
      <>
        <span className={`relative z-10 transition-colors duration-500 ${flashy ? 'golden-flash-text font-medium tracking-[0.25em]' : ''}`}>
          {children}
        </span>
        {arrow && (
          <span className={`relative z-10 inline-block transition-transform duration-700 ease-luxe group-hover:translate-x-1.5 ${flashy ? 'text-gold-light' : ''}`}>
            →
          </span>
        )}
      </>
    )

    const flashyClass = flashy ? 'golden-flash-btn' : ''

    if (to) {
      return (
        <Link to={to} className={`${base} ${variants[variant]} ${flashyClass} ${className}`}>
          {content}
        </Link>
      )
    }

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${variants[variant]} ${flashyClass} ${className}`}
      >
        {content}
      </button>
    )
  }
)

PrimaryButton.displayName = 'PrimaryButton'
export default PrimaryButton
