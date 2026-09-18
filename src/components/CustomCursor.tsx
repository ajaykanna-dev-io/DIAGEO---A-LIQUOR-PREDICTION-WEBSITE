import { useEffect, useRef, useState } from 'react'

/**
 * A minimal custom cursor: a small dot that grows into an outlined ring
 * over interactive elements. Also manages a subtle cursor-following
 * radial light on dark sections.
 *
 * Disabled on touch/mobile and respects prefers-reduced-motion.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || reduced) return
    setEnabled(true)
    document.body.classList.add('cursor-enabled')

    // Smooth glow position (lerped for slow follow)
    let glowX = 0
    let glowY = 0
    let mouseX = 0
    let mouseY = 0

    const move = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.top = `${mouseY}px`
        cursorRef.current.style.left = `${mouseX}px`
      }
    }

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [role="button"], input, .cursor-hover')
      cursorRef.current?.classList.toggle('hovering', Boolean(interactive))
    }

    // Slow-follow radial glow
    let rafId: number
    const lerpGlow = () => {
      glowX += (mouseX - glowX) * 0.08
      glowY += (mouseY - glowY) * 0.08
      if (glowRef.current) {
        glowRef.current.style.top = `${glowY}px`
        glowRef.current.style.left = `${glowX}px`
      }
      rafId = requestAnimationFrame(lerpGlow)
    }
    rafId = requestAnimationFrame(lerpGlow)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      cancelAnimationFrame(rafId)
      document.body.classList.remove('cursor-enabled')
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
    </>
  )
}
