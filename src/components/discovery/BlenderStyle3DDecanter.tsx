import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BlenderStyle3DDecanterProps {
  progress: number // 0 to 1
  hue?: number
  matchScore?: number
  className?: string
}

/**
 * 3D Crystal Decanter Scene rendered via Three.js
 * Contains:
 * - Crystalline geometric flask with transmission and refractive edges
 * - Dynamic fluid amber liquid mesh that rises with quiz progress
 * - Orbiting golden essence particles
 * - Alchemical brass rings rotating around the neck
 */
function DecanterScene({ progress, hue = 38 }: { progress: number; hue: number }) {
  const decanterGroup = useRef<THREE.Group>(null)
  const liquidMeshRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Fluid target height based on progress (0 to 1)
  const currentFill = Math.max(0.08, Math.min(0.95, progress))
  const targetLiquidY = -1.2 + currentFill * 1.6
  const targetLiquidScaleY = Math.max(0.1, currentFill * 1.8)

  // Decanter crystal colors
  const liquidColor = useMemo(() => {
    const col = new THREE.Color()
    col.setHSL(hue / 360, 0.85, 0.48)
    return col
  }, [hue])

  const goldColor = useMemo(() => new THREE.Color('#DFBA73'), [])

  // Floating essence bubbles/particles
  const particleCount = 45
  const [particlePositions, particleSpeeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const spd = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.9
      pos[i * 3 + 1] = -1.2 + Math.random() * 1.8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.9
      spd[i] = 0.2 + Math.random() * 0.5
    }
    return [pos, spd]
  }, [particleCount])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // Gentle floating idle rotation
    if (decanterGroup.current) {
      decanterGroup.current.rotation.y = time * 0.35
      decanterGroup.current.position.y = Math.sin(time * 1.5) * 0.05
    }

    // Alchemical orbital rings rotating
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 1.2) * 0.25
      ring1Ref.current.rotation.z = time * 0.8
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 2 + Math.cos(time * 0.9) * 0.2
      ring2Ref.current.rotation.z = -time * 0.6
    }

    // Liquid surface undulating
    if (liquidMeshRef.current) {
      // Lerp position Y and scale Y smoothly towards progress
      liquidMeshRef.current.position.y = THREE.MathUtils.lerp(
        liquidMeshRef.current.position.y,
        targetLiquidY,
        delta * 3
      )
      liquidMeshRef.current.scale.y = THREE.MathUtils.lerp(
        liquidMeshRef.current.scale.y,
        targetLiquidScaleY,
        delta * 3
      )
      liquidMeshRef.current.rotation.y = -time * 0.2
    }

    // Rising golden micro-bubbles inside decanter
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const yIndex = i * 3 + 1
        positions[yIndex] += particleSpeeds[i] * delta * 0.8
        if (positions[yIndex] > 0.8) {
          positions[yIndex] = -1.2
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={decanterGroup}>
      {/* ── Outer Crystal Vessel Wall (Refractive Glass) ── */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.75, 2.2, 8, 1, false]} />
        <meshPhysicalMaterial
          roughness={0.05}
          transmission={0.92}
          thickness={1.2}
          ior={1.52}
          reflectivity={0.9}
          color="#FAF7F2"
          transparent
          opacity={0.35}
          wireframe={false}
        />
      </mesh>

      {/* Crystal Neck & Lip */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.5, 16]} />
        <meshStandardMaterial
          color="#C6A15B"
          metalness={0.9}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Crystal Stopper / Keystone Gem */}
      <mesh position={[0, 1.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#DFBA73"
          metalness={0.8}
          roughness={0.15}
          emissive="#C6A15B"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* ── Internal Rising Amber Liquid ── */}
      <mesh ref={liquidMeshRef} position={[0, targetLiquidY, 0]}>
        <cylinderGeometry args={[0.3, 0.65, 1.0, 16]} />
        <meshStandardMaterial
          color={liquidColor}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.85}
          emissive={liquidColor}
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* ── Orbiting Alchemical Brass Rings ── */}
      <mesh ref={ring1Ref} position={[0, 0.1, 0]}>
        <torusGeometry args={[0.95, 0.015, 12, 48]} />
        <meshStandardMaterial color={goldColor} metalness={0.95} roughness={0.15} />
      </mesh>

      <mesh ref={ring2Ref} position={[0, -0.3, 0]}>
        <torusGeometry args={[1.05, 0.012, 12, 48]} />
        <meshStandardMaterial color={goldColor} metalness={0.95} roughness={0.15} />
      </mesh>

      {/* ── Rising Golden Spirit Bubbles ── */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#FFF2CE"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Core Volumetric Light */}
      <pointLight position={[0, 0, 0]} color={liquidColor} intensity={2.5} distance={3} />
    </group>
  )
}

export default function BlenderStyle3DDecanter({
  progress,
  hue = 38,
  matchScore = 78,
  className = '',
}: BlenderStyle3DDecanterProps) {
  const percentText = Math.round(progress * 100)

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D WebGL Canvas Chamber */}
      <div className="relative w-28 h-24 sm:w-32 sm:h-28">
        {/* Ambient Backlight Halo */}
        <div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-700"
          style={{
            opacity: 0.35 + (progress * 0.3),
            background: `radial-gradient(circle, hsl(${hue}, 85%, 55%) 0%, transparent 70%)`,
          }}
        />

        <Canvas
          camera={{ position: [0, 0.22, 4.3], fov: 38 }}
          gl={{ alpha: true, antialias: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[3, 5, 4]} intensity={1.8} color="#FAF7F2" />
          <directionalLight position={[-3, -2, -2]} intensity={0.6} color="#C6A15B" />
          <pointLight position={[0, 2, 2]} intensity={1.2} color="#FFFFFF" />

          <DecanterScene progress={progress} hue={hue} />
        </Canvas>
      </div>

      {/* Alchemical HUD Underneath Decanter (Compact Luxury Micro-Row) */}
      <div className="mt-0.5 flex items-center justify-center gap-1.5 font-mono text-[9px] tracking-wider text-stone/50 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-pulse" />
        <span className="text-[#C6A15B] font-semibold">FORGE</span>
        <span className="text-white/20">·</span>
        <span className="text-[#FAF7F2] font-medium">{matchScore}% MATCH ({percentText}%)</span>
      </div>
    </div>
  )
}
