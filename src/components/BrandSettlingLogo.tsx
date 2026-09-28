/**
 * BrandSettlingLogo
 *
 * Premium luxury brand mark for No. 8 Reserve matching the no8reserve.com
 * header aesthetic — centered, prominent, with elegant gold decorative lines.
 * Clean and stable with no blinking or pulsing effects.
 */

interface BrandSettlingLogoProps {
  className?: string
  onRestart?: () => void
}

export default function BrandSettlingLogo({
  className = '',
  onRestart,
}: BrandSettlingLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        onClick={onRestart}
        className="relative inline-flex items-center gap-0 select-none cursor-pointer group"
        title="No. 8 Reserve — Spirit Discovery"
        aria-label="No. 8 Reserve"
      >
        {/* Left decorative gold line with diamond end */}
        <div className="hidden md:flex items-center mr-5 lg:mr-7">
          <span className="w-1.5 h-1.5 rotate-45 border border-[#C6A15B]/60 bg-transparent" />
          <div className="w-16 lg:w-24 xl:w-32 h-px bg-gradient-to-r from-[#C6A15B]/20 via-[#C6A15B]/50 to-[#C6A15B]/80" />
          <span className="w-1.5 h-1.5 rotate-45 border border-[#C6A15B]/70 bg-[#C6A15B]/30" />
        </div>

        {/* Central Logo Image — Premium, prominent, crisp */}
        <img
          src="/images/logo-BJ7D25WF.webp"
          alt="No. 8 Reserve"
          className="h-8 sm:h-10 w-auto object-contain select-none drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
        />

        {/* Right decorative gold line with diamond end */}
        <div className="hidden md:flex items-center ml-5 lg:ml-7">
          <span className="w-1.5 h-1.5 rotate-45 border border-[#C6A15B]/70 bg-[#C6A15B]/30" />
          <div className="w-16 lg:w-24 xl:w-32 h-px bg-gradient-to-l from-[#C6A15B]/20 via-[#C6A15B]/50 to-[#C6A15B]/80" />
          <span className="w-1.5 h-1.5 rotate-45 border border-[#C6A15B]/60 bg-transparent" />
        </div>
      </div>
    </div>
  )
}
