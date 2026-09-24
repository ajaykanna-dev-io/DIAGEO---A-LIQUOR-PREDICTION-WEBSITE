import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BottleMagnifierProps {
  src: string
  alt: string
  className?: string
  zoom?: number
  lensSize?: number
  onHoverChange?: (isHovering: boolean) => void
}

export default function BottleMagnifier({
  src,
  alt,
  className = '',
  zoom = 2.7,
  lensSize = 164,
  onHoverChange,
}: BottleMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [isHovered, setIsHovered] = useState(false)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 })
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 })

  const updateDimensions = useCallback(() => {
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    setImgDimensions({
      width: rect.width,
      height: rect.height,
    })
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [updateDimensions])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imgRef.current) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const containerRect = containerRef.current.getBoundingClientRect()
    const imgRect = imgRef.current.getBoundingClientRect()

    // Check if cursor is near/over the actual image
    const margin = 20
    const isInside =
      clientX >= imgRect.left - margin &&
      clientX <= imgRect.right + margin &&
      clientY >= imgRect.top - margin &&
      clientY <= imgRect.bottom + margin

    if (!isInside) {
      if (isHovered) {
        setIsHovered(false)
        onHoverChange?.(false)
      }
      return
    }

    if (!isHovered) {
      setIsHovered(true)
      onHoverChange?.(true)
      updateDimensions()
    }

    // Lens position relative to the container
    const relativeX = clientX - containerRect.left
    const relativeY = clientY - containerRect.top
    setLensPos({ x: relativeX, y: relativeY })

    // Position on the actual image for background offset
    const clampedImgX = Math.max(0, Math.min(imgRect.width, clientX - imgRect.left))
    const clampedImgY = Math.max(0, Math.min(imgRect.height, clientY - imgRect.top))

    // Calculate background offset so the point under cursor is centered in lens
    const bgX = -clampedImgX * zoom + lensSize / 2
    const bgY = -clampedImgY * zoom + lensSize / 2

    setBgPos({ x: bgX, y: bgY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHoverChange?.(false)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center cursor-crosshair select-none"
    >
      {/* Base Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={updateDimensions}
        className={`${className} pointer-events-auto`}
      />

      {/* Luxury Magnifier Loupe */}
      <AnimatePresence>
        {isHovered && imgDimensions.width > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: lensSize,
              height: lensSize,
              left: lensPos.x - lensSize / 2,
              top: lensPos.y - lensSize / 2,
            }}
            className="pointer-events-none absolute z-50 rounded-full shadow-[0_0_30px_rgba(198,161,91,0.55),0_20px_50px_rgba(0,0,0,0.95)]"
          >
            {/* Outer Knurled Metallic Gold Bezel */}
            <div className="relative w-full h-full rounded-full border-2 border-[#C6A15B] bg-[#0c0b0a] overflow-hidden">
              {/* High-Resolution Zoomed Image */}
              <div
                className="w-full h-full rounded-full filter contrast-[1.08] brightness-[1.06]"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundPosition: `${bgPos.x}px ${bgPos.y}px`,
                  backgroundSize: `${imgDimensions.width * zoom}px ${imgDimensions.height * zoom}px`,
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#0a0908',
                }}
              />

              {/* Optical Convex Glass Specular Glare */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.12] to-transparent pointer-events-none"
                aria-hidden="true"
              />
              {/* Ambient Edge Vignette */}
              <div
                className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_transparent_60%,_rgba(0,0,0,0.45)_100%)] pointer-events-none"
                aria-hidden="true"
              />

              {/* Inner Fine Gold Hairline Reticle */}
              <div className="absolute inset-1 rounded-full border border-[#C6A15B]/40 pointer-events-none" />

              {/* Precision Horologist Reticle / Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Horizontal Ticks */}
                <div className="w-4 h-px bg-[#C6A15B]/70 absolute left-2" />
                <div className="w-4 h-px bg-[#C6A15B]/70 absolute right-2" />
                {/* Vertical Ticks */}
                <div className="h-4 w-px bg-[#C6A15B]/70 absolute top-2" />
                <div className="h-4 w-px bg-[#C6A15B]/70 absolute bottom-2" />
                {/* Center Reticle Point with Gap */}
                <div className="w-1.5 h-1.5 rounded-full border border-[#C6A15B]/80" />
              </div>

              {/* Top Cardinal Badge */}
              <div className="absolute top-1.5 inset-x-0 flex justify-center pointer-events-none">
                <span className="text-[8px] font-mono tracking-[0.24em] text-[#E5C378] uppercase bg-[#12100d]/90 px-2 py-0.5 rounded-full border border-[#C6A15B]/30 shadow-xs">
                  {zoom.toFixed(1)}× LOUPE
                </span>
              </div>
            </div>

            {/* Brass Outer Pointer Ring Accents */}
            <div className="absolute -inset-1 rounded-full border border-[#C6A15B]/25 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
