import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

/* ────────────────────────────────────────────────────────────────────────────
 *  WHISKY GLASS GEOMETRY  — Procedural Glencairn-style tasting glass
 *  Wider proportions for better visibility at smaller canvas sizes
 * ──────────────────────────────────────────────────────────────────────── */

function GlassBody({ mouseRef, intensity }: { mouseRef: React.MutableRefObject<{ x: number; y: number }>; intensity: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const liquidBodyRef = useRef<THREE.Mesh>(null)
  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null)

  // Wider Glencairn-style profile for better screen presence
  const glassProfile = useMemo(() => {
    const pts: THREE.Vector2[] = []
    // Base platform
    pts.push(new THREE.Vector2(0.0, 0))
    pts.push(new THREE.Vector2(0.42, 0))
    pts.push(new THREE.Vector2(0.44, 0.03))
    pts.push(new THREE.Vector2(0.44, 0.08))
    // Stem
    pts.push(new THREE.Vector2(0.18, 0.18))
    pts.push(new THREE.Vector2(0.16, 0.22))
    // Bowl expansion — wider for visibility
    pts.push(new THREE.Vector2(0.20, 0.34))
    pts.push(new THREE.Vector2(0.46, 0.56))
    pts.push(new THREE.Vector2(0.54, 0.74))
    // Bowl peak — generous width
    pts.push(new THREE.Vector2(0.52, 0.88))
    // Taper to rim
    pts.push(new THREE.Vector2(0.44, 0.98))
    pts.push(new THREE.Vector2(0.40, 1.06))
    // Rim
    pts.push(new THREE.Vector2(0.39, 1.10))
    pts.push(new THREE.Vector2(0.395, 1.12))
    return pts
  }, [])

  const glassGeometry = useMemo(() => {
    return new THREE.LatheGeometry(glassProfile, 72, 0, Math.PI * 2)
  }, [glassProfile])

  // Whisky liquid — fills ~60% of the bowl
  const liquidProfile = useMemo(() => {
    const pts: THREE.Vector2[] = []
    pts.push(new THREE.Vector2(0.0, 0.34))
    pts.push(new THREE.Vector2(0.20, 0.34))
    pts.push(new THREE.Vector2(0.36, 0.48))
    pts.push(new THREE.Vector2(0.46, 0.62))
    pts.push(new THREE.Vector2(0.51, 0.74))
    pts.push(new THREE.Vector2(0.49, 0.82))
    // Liquid top surface
    pts.push(new THREE.Vector2(0.45, 0.86))
    pts.push(new THREE.Vector2(0.0, 0.86))
    return pts
  }, [])

  const liquidGeometry = useMemo(() => {
    return new THREE.LatheGeometry(liquidProfile, 48, 0, Math.PI * 2)
  }, [liquidProfile])

  // Liquid surface cap
  const liquidSurfaceGeo = useMemo(() => {
    return new THREE.CircleGeometry(0.45, 48)
  }, [])

  // Smooth damped mouse tracking
  const smoothMouse = useRef({ x: 0, y: 0 })
  const liquidTilt = useRef({ x: 0, z: 0 })

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Smooth mouse interpolation
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.025
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.025

    // Slow idle animation
    const idleRotY = Math.sin(t * 0.12) * 0.02
    const idleRotX = Math.sin(t * 0.1 + 0.7) * 0.015
    const idleY = Math.sin(t * 0.08) * 0.05

    // Mouse parallax (max ±5°)
    const mouseRotY = smoothMouse.current.x * 0.08
    const mouseRotX = -smoothMouse.current.y * 0.06

    groupRef.current.rotation.y = idleRotY + mouseRotY
    groupRef.current.rotation.x = idleRotX + mouseRotX
    groupRef.current.position.y = idleY - 0.1

    // Liquid tilt response
    const targetTiltX = smoothMouse.current.y * 0.035
    const targetTiltZ = -smoothMouse.current.x * 0.035
    liquidTilt.current.x += (targetTiltX - liquidTilt.current.x) * 0.015
    liquidTilt.current.z += (targetTiltZ - liquidTilt.current.z) * 0.015

    if (liquidBodyRef.current) {
      liquidBodyRef.current.rotation.x = liquidTilt.current.x + Math.sin(t * 0.15) * 0.006
      liquidBodyRef.current.rotation.z = liquidTilt.current.z + Math.cos(t * 0.13) * 0.005
    }

    // Liquid glow response to intensity
    if (liquidMaterialRef.current) {
      const baseEmission = 0.2 + intensity * 0.4
      liquidMaterialRef.current.emissiveIntensity = baseEmission + Math.sin(t * 0.25) * 0.06
    }
  })

  return (
    <group ref={groupRef} scale={1.7} position={[0, -0.1, 0]}>
      {/* Crystal Glass Shell — outer */}
      <mesh geometry={glassGeometry}>
        <meshPhysicalMaterial
          color="#f0e8d8"
          metalness={0.0}
          roughness={0.04}
          transmission={0.88}
          thickness={0.5}
          ior={1.52}
          transparent
          opacity={0.4}
          envMapIntensity={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          side={THREE.DoubleSide}
          attenuationColor={new THREE.Color('#f5e6c8')}
          attenuationDistance={1.5}
        />
      </mesh>

      {/* Inner Glass — for refraction depth */}
      <mesh geometry={glassGeometry} scale={0.95}>
        <meshPhysicalMaterial
          color="#f5efe2"
          metalness={0.0}
          roughness={0.02}
          transmission={0.92}
          thickness={0.15}
          ior={1.48}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Amber Whisky Liquid Body */}
      <mesh ref={liquidBodyRef} geometry={liquidGeometry}>
        <meshPhysicalMaterial
          ref={liquidMaterialRef}
          color="#d4880a"
          metalness={0.08}
          roughness={0.12}
          transmission={0.45}
          thickness={1.5}
          ior={1.36}
          transparent
          opacity={0.88}
          emissive="#c67a20"
          emissiveIntensity={0.25}
          attenuationColor={new THREE.Color('#6b3510')}
          attenuationDistance={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Liquid Surface Cap */}
      <mesh
        geometry={liquidSurfaceGeo}
        position={[0, 0.86, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#d4920a"
          metalness={0.25}
          roughness={0.06}
          transmission={0.35}
          thickness={0.2}
          ior={1.36}
          transparent
          opacity={0.75}
          emissive="#d4880a"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Rim Highlight Ring */}
      <mesh position={[0, 1.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.37, 0.40, 72]} />
        <meshPhysicalMaterial
          color="#faf0d8"
          metalness={0.5}
          roughness={0.08}
          transparent
          opacity={0.65}
          emissive="#e8d196"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Base reflection disc */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 48]} />
        <meshStandardMaterial
          color="#1a1510"
          metalness={0.9}
          roughness={0.12}
          transparent
          opacity={0.55}
          emissive="#c6a15b"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 *  FLOATING AMBER PARTICLES — Warm dust motes around the glass
 * ──────────────────────────────────────────────────────────────────────── */

function AmberParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 60

  const { positions, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const off = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Distribute in a cylinder around the glass
      const angle = Math.random() * Math.PI * 2
      const dist = 0.8 + Math.random() * 2.5
      pos[i * 3] = Math.cos(angle) * dist
      pos[i * 3 + 1] = (Math.random() - 0.3) * 3
      pos[i * 3 + 2] = Math.sin(angle) * dist
      spd[i] = 0.015 + Math.random() * 0.03
      off[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, speeds: spd, offsets: off }
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return
    const t = state.clock.elapsedTime
    const posAttr = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute

    for (let i = 0; i < count; i++) {
      const baseY = positions[i * 3 + 1]
      posAttr.setY(i, baseY + Math.sin(t * speeds[i] * 2 + offsets[i]) * 0.15)
      // Slow orbital drift
      const baseX = positions[i * 3]
      const baseZ = positions[i * 3 + 2]
      const driftAngle = t * speeds[i] * 0.3 + offsets[i]
      posAttr.setX(i, baseX + Math.sin(driftAngle) * 0.05)
      posAttr.setZ(i, baseZ + Math.cos(driftAngle) * 0.05)
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#e8d196"
        size={0.014}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 *  SCENE SETUP — Cinematic lighting configuration
 * ──────────────────────────────────────────────────────────────────────── */

function SceneSetup({ intensity }: { intensity: number }) {
  const { camera } = useThree()

  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 36
      camera.updateProjectionMatrix()
    }
  })

  const warmKeyIntensity = 3.0 + intensity * 2.0
  const rimIntensity = 1.5 + intensity * 1.0

  return (
    <>
      {/* Warm Amber Key Light — upper right */}
      <directionalLight
        color="#e8a84c"
        intensity={warmKeyIntensity}
        position={[3, 5, 2]}
        castShadow={false}
      />

      {/* Champagne-Gold Rim Light — behind left */}
      <directionalLight
        color="#d4bc74"
        intensity={rimIntensity}
        position={[-3, 3, -3]}
      />

      {/* Top-down crystal highlight */}
      <pointLight
        color="#faf7f2"
        intensity={0.8}
        position={[0, 4, 1]}
        distance={10}
        decay={2}
      />

      {/* Warm under-glow for liquid visibility */}
      <pointLight
        color="#c67a20"
        intensity={0.5 + intensity * 0.4}
        position={[0, -0.5, 1.5]}
        distance={5}
        decay={2}
      />

      {/* Subtle blue fill for glass edge contrast */}
      <pointLight
        color="#3a4a6a"
        intensity={0.15}
        position={[-2, 1, 3]}
        distance={8}
        decay={2}
      />

      {/* Ambient base — very dark */}
      <ambientLight color="#1a1410" intensity={0.12} />

      <Environment preset="night" environmentIntensity={0.3} />
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 *  MAIN EXPORT — TasteDiscoveryGlass Canvas
 * ──────────────────────────────────────────────────────────────────────── */

interface TasteDiscoveryGlassProps {
  intensity?: number
  className?: string
}

export default function TasteDiscoveryGlass({ intensity = 0, className = '' }: TasteDiscoveryGlassProps) {
  const mouseRef = useRef({ x: 0, y: 0 })

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    mouseRef.current = { x, y }
  }, [])

  const handlePointerLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 }
  }, [])

  return (
    <div
      className={`w-full h-full ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ minHeight: '200px' }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.8, 3.0], fov: 36, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ background: 'transparent' }}
      >
        <SceneSetup intensity={intensity} />
        <Float
          speed={0.3}
          rotationIntensity={0.04}
          floatIntensity={0.06}
          floatingRange={[-0.03, 0.03]}
        >
          <GlassBody mouseRef={mouseRef} intensity={intensity} />
        </Float>
        <AmberParticles />
      </Canvas>
    </div>
  )
}
