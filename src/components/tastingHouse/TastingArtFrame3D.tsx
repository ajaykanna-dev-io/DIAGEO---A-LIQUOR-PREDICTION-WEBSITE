import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Text } from '@react-three/drei'
import * as THREE from 'three'

interface TastingArtFrame3DProps {
  id: string
  optionNumber: string // "01", "02", "03", "04"
  title: string
  subtitle?: string
  imageSrc: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: number
  isSelected: boolean
  isAnySelected: boolean
  onSelect: (id: string) => void
}

/**
 * TastingArtFrame3D — Museum-Illuminated Physical Tasting Art Display
 * Features:
 * - Backlit exhibition canvas: high-clarity emissive mapping ensures rich, vibrant photographic details
 *   are 100% visible and radiant regardless of room shadow falloff.
 * - Multi-tier beveled dark walnut frame + brushed champagne brass inner molding.
 * - Dedicated warm brass picture sconce casting a focused 2700K pool of light.
 * - Expanded hit target mesh for instant mouse hover & click interaction.
 * - Tactile selection response: frame floats forward from the wall, scales up, and gleams in champagne gold.
 * - Proper aspect ratio fitting: UV repeat and offset dynamically calculated to provide "object-fit: cover"
 *   preventing pictures from appearing squished or stretched in the fixed frame.
 */
export default function TastingArtFrame3D({
  id,
  optionNumber,
  title,
  subtitle,
  imageSrc,
  position,
  rotation,
  scale = 1.0,
  isSelected,
  isAnySelected,
  onSelect,
}: TastingArtFrame3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Load artwork texture safely with anisotropic filtering for crisp viewing
  const rawTexture = useTexture(imageSrc)

  // Clone and apply object-fit: cover UV matrix transformation so artwork is never stretched
  const texture = useMemo(() => {
    const t = rawTexture.clone()
    t.generateMipmaps = true
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.magFilter = THREE.LinearFilter
    t.anisotropy = 8
    t.wrapS = THREE.ClampToEdgeWrapping
    t.wrapT = THREE.ClampToEdgeWrapping

    const applyCover = (img: { width: number; height: number }) => {
      if (!img || !img.width || !img.height) return
      const planeWidth = 0.92
      const planeHeight = 0.54
      const planeAspect = planeWidth / planeHeight // ~1.7037
      const imageAspect = img.width / img.height

      if (imageAspect < planeAspect) {
        // Image is taller (e.g. portrait 3:4): fit width, crop height centered
        const scaleY = imageAspect / planeAspect
        t.repeat.set(1, scaleY)
        t.offset.set(0, (1 - scaleY) * 0.5)
      } else {
        // Image is wider: fit height, crop width centered
        const scaleX = planeAspect / imageAspect
        t.repeat.set(scaleX, 1)
        t.offset.set((1 - scaleX) * 0.5, 0)
      }
      t.needsUpdate = true
    }

    const sourceImage = (t.image || rawTexture.image) as { width?: number; height?: number } | undefined
    if (sourceImage && typeof sourceImage.width === 'number' && typeof sourceImage.height === 'number' && sourceImage.width > 0) {
      applyCover({ width: sourceImage.width, height: sourceImage.height })
    }

    return t
  }, [rawTexture, imageSrc])

  // Ensure UV adjustments update once image is fully decoded
  useEffect(() => {
    const img = texture.image as (HTMLImageElement & { width?: number; height?: number }) | undefined
    if (!img) return

    const updateCover = () => {
      if (typeof img.width !== 'number' || typeof img.height !== 'number' || img.width === 0 || img.height === 0) return
      const planeWidth = 0.92
      const planeHeight = 0.54
      const planeAspect = planeWidth / planeHeight
      const imageAspect = img.width / img.height

      if (imageAspect < planeAspect) {
        const scaleY = imageAspect / planeAspect
        texture.repeat.set(1, scaleY)
        texture.offset.set(0, (1 - scaleY) * 0.5)
      } else {
        const scaleX = planeAspect / imageAspect
        texture.repeat.set(scaleX, 1)
        texture.offset.set((1 - scaleX) * 0.5, 0)
      }
      texture.needsUpdate = true
    }

    if (img.complete && typeof img.width === 'number' && img.width > 0) {
      updateCover()
    } else if (typeof img.addEventListener === 'function') {
      img.addEventListener('load', updateCover)
      return () => img.removeEventListener('load', updateCover)
    }
  }, [texture])

  // Dynamic spring-like motion values
  const currentScale = useRef(scale)
  const currentPos = useRef(new THREE.Vector3(...position))
  const currentRotY = useRef(rotation[1])
  const currentZOffset = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Target scale & forward displacement when selected / hovered
    const baseScale = scale ?? 1.0
    const targetScale = isSelected ? baseScale * 1.06 : hovered ? baseScale * 1.03 : baseScale
    const targetOffset = isSelected ? 0.16 : hovered ? 0.07 : 0.0

    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 7)
    currentZOffset.current = THREE.MathUtils.lerp(currentZOffset.current, targetOffset, delta * 7)

    // Smoothly interpolate position and rotation Y when frames animate or carousel rotates
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, position[0], delta * 6)
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, position[1], delta * 6)
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, position[2], delta * 6)
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, rotation[1], delta * 6)

    groupRef.current.scale.setScalar(currentScale.current)
    groupRef.current.rotation.set(rotation[0], currentRotY.current, rotation[2])

    // Offset along the local Z-axis (forward perpendicular to frame face)
    groupRef.current.position.set(
      currentPos.current.x + Math.sin(currentRotY.current) * currentZOffset.current,
      currentPos.current.y,
      currentPos.current.z + Math.cos(currentRotY.current) * currentZOffset.current
    )
  })

  // Backlit exhibition canvas luminance: Always radiant, crisp and vivid!
  const canvasEmissiveIntensity = isSelected ? 1.0 : hovered ? 0.92 : isAnySelected ? 0.72 : 0.85
  const frameEmissive = isSelected ? '#E5C478' : hovered ? '#C6A15B' : '#000000'

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
    >
      {/* ── 0. Generous Hit Target Mesh (Guarantees effortless mouse raycasting) ── */}
      <mesh position={[0, 0, 0.06]} visible={false}>
        <planeGeometry args={[1.15, 0.95]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* ── 1. Dedicated Brass Gallery Picture Light (Mounted on top of frame) ── */}
      <group position={[0, 0.44, 0.12]}>
        {/* Brass Lamp Hood */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.52, 0.025, 0.06]} />
          <meshStandardMaterial color="#C6A15B" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Support Arms */}
        <mesh position={[-0.18, -0.05, -0.06]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          <meshStandardMaterial color="#C6A15B" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.18, -0.05, -0.06]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          <meshStandardMaterial color="#C6A15B" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* High-intensity warm picture light focused directly onto the artwork */}
        <pointLight
          position={[0, -0.05, 0.08]}
          intensity={isSelected ? 3.5 : hovered ? 2.5 : 1.8}
          distance={1.6}
          color="#FFE7B0"
          decay={2}
        />
      </group>

      {/* ── 2. Dark Walnut Outer Beveled Frame (1.02m wide x 0.82m high x 0.06m deep) ── */}
      <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
        <boxGeometry args={[1.02, 0.82, 0.06]} />
        <meshStandardMaterial
          color={isSelected ? '#1f160e' : '#140f0a'}
          roughness={0.6}
          metalness={0.12}
        />
      </mesh>

      {/* ── 3. Champagne Brass Inner Reveal / Bezel ── */}
      <mesh position={[0, 0, 0.002]}>
        <boxGeometry args={[0.96, 0.76, 0.012]} />
        <meshStandardMaterial
          color="#C6A15B"
          emissive={frameEmissive}
          emissiveIntensity={isSelected ? 0.85 : hovered ? 0.35 : 0.0}
          roughness={0.22}
          metalness={0.92}
        />
      </mesh>

      {/* ── 4. Museum-Illuminated Artwork Canvas (Self-luminous & crystal-clear) ── */}
      <mesh position={[0, 0.085, 0.01]}>
        <planeGeometry args={[0.92, 0.54]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={canvasEmissiveIntensity}
          roughness={0.35}
          metalness={0.02}
        />
      </mesh>

      {/* ── 5. Museum Glass Specular Glaze ── */}
      <mesh position={[0, 0.085, 0.014]}>
        <planeGeometry args={[0.92, 0.54]} />
        <meshPhysicalMaterial
          color="#FAF7F2"
          transparent
          opacity={0.06}
          roughness={0.08}
          metalness={0.15}
          reflectivity={0.9}
          clearcoat={0.95}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* ── 6. Refined Brass Gallery Placard (Bottom of Frame) ── */}
      <group position={[0, -0.265, 0.012]}>
        {/* Background Plaque */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.92, 0.13]} />
          <meshStandardMaterial
            color={isSelected ? '#1c1611' : '#110e0b'}
            roughness={0.4}
            metalness={0.35}
          />
        </mesh>

        {/* Option Number Tag */}
        <Text
          position={[-0.42, 0.014, 0.002]}
          fontSize={0.042}
          color="#C6A15B"
          anchorX="left"
          anchorY="middle"
        >
          {optionNumber}
        </Text>

        {/* Option Title */}
        <Text
          position={[-0.31, 0.018, 0.002]}
          fontSize={0.046}
          color={isSelected ? '#FAF7F2' : hovered ? '#F5F0E6' : '#E8E1D5'}
          anchorX="left"
          anchorY="middle"
          maxWidth={0.7}
        >
          {title}
        </Text>

        {/* Subtitle / Tasting Note */}
        {subtitle && (
          <Text
            position={[-0.31, -0.03, 0.002]}
            fontSize={0.028}
            color={isSelected ? '#D8BD7A' : '#9E9588'}
            anchorX="left"
            anchorY="middle"
            maxWidth={0.7}
          >
            {subtitle}
          </Text>
        )}
      </group>

      {/* ── 7. Active Selection Checkmark Crest ── */}
      {isSelected && (
        <group position={[0.42, 0.32, 0.022]}>
          <mesh>
            <circleGeometry args={[0.048, 24]} />
            <meshBasicMaterial color="#C6A15B" />
          </mesh>
          <Text
            position={[0, 0, 0.002]}
            fontSize={0.042}
            color="#090807"
            anchorX="center"
            anchorY="middle"
          >
            ✓
          </Text>
        </group>
      )}
    </group>
  )
}
