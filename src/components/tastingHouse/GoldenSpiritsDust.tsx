import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GoldenSpiritsDustProps {
  count?: number
}

/**
 * GoldenSpiritsDust
 * Floating amber atmospheric photons that catch the warm spotlight beams,
 * creating an authentic cinematic private spirits reserve ambiance.
 */
export default function GoldenSpiritsDust({ count = 75 }: GoldenSpiritsDustProps) {
  const pointsRef = useRef<THREE.Points>(null)

  // Generate random positions and drifting phases
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Bounded within the chamber room volume
      pos[i * 3] = (Math.random() - 0.5) * 5.2 // X: -2.6 to +2.6
      pos[i * 3 + 1] = 0.4 + Math.random() * 2.8 // Y: 0.4 to 3.2m
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6.0 + 1.0 // Z: -2.0 to +4.0
      ph[i] = Math.random() * Math.PI * 2
    }

    return [pos, ph]
  }, [count])

  // Soft circular glowing particle texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      gradient.addColorStop(0, 'rgba(255, 220, 150, 1)')
      gradient.addColorStop(0.3, 'rgba(216, 175, 95, 0.7)')
      gradient.addColorStop(0.7, 'rgba(198, 161, 91, 0.2)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 32, 32)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.generateMipmaps = false
    return texture
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const phase = phases[i]

      // Gentle vertical and lateral Brownian drift
      posArray[idx] += Math.sin(time * 0.4 + phase) * 0.0012
      posArray[idx + 1] += Math.cos(time * 0.3 + phase) * 0.0008

      // Wrap around gracefully if drifted too high
      if (posArray[idx + 1] > 3.4) posArray[idx + 1] = 0.4
      if (posArray[idx + 1] < 0.3) posArray[idx + 1] = 3.3
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        map={particleTexture}
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#FFE5A3"
      />
    </points>
  )
}
