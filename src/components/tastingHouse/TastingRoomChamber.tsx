import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface TastingRoomChamberProps {
  roomNumber: number // 1 to 4
  hasSelection?: boolean
  onWalkForward?: () => void
}

/**
 * TastingRoomChamber — Ultra-Luxury Architectural Visualization
 * Features:
 * - Hand-polished dark walnut chevron flooring with brushed champagne brass inlays
 * - Fluted walnut wainscoting & charcoal Venetian plaster with dramatic chiaroscuro falloff
 * - Interactive 3D Architectural Archway Threshold (Doorway beacon illuminates on selection and can be clicked in 3D)
 * - Symmetrical brass wall sconces casting warm up/down architectural light fans
 * - Center black marble plinth with crystal decanter, amber liquid, and glass reflections
 * - Visible passage revealing the atmosphere of the next chamber
 */
export default function TastingRoomChamber({
  roomNumber,
  hasSelection = false,
  onWalkForward,
}: TastingRoomChamberProps) {
  const [portalHovered, setPortalHovered] = useState(false)
  const portalGlowRef = useRef<THREE.PointLight>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  // Architectural materials with physically calibrated roughness & metalness
  const materials = useMemo(() => {
    return {
      walnutFloor: new THREE.MeshStandardMaterial({
        color: '#130e0a',
        roughness: 0.32,
        metalness: 0.15,
      }),
      charcoalWall: new THREE.MeshStandardMaterial({
        color: '#121214',
        roughness: 0.85,
        metalness: 0.04,
      }),
      wainscotWalnut: new THREE.MeshStandardMaterial({
        color: '#18120c',
        roughness: 0.52,
        metalness: 0.08,
      }),
      brassTrim: new THREE.MeshStandardMaterial({
        color: '#C6A15B',
        roughness: 0.25,
        metalness: 0.92,
      }),
      blackMarble: new THREE.MeshStandardMaterial({
        color: '#0a0a0c',
        roughness: 0.18,
        metalness: 0.28,
      }),
      amberGlass: new THREE.MeshPhysicalMaterial({
        color: '#e59b36',
        transparent: true,
        opacity: 0.78,
        roughness: 0.08,
        metalness: 0.08,
        transmission: 0.65,
        ior: 1.5,
      }),
      crystalGlass: new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.38,
        roughness: 0.04,
        metalness: 0.1,
        transmission: 0.88,
        ior: 1.52,
      }),
      ceilingPlaster: new THREE.MeshStandardMaterial({
        color: '#0a0a0b',
        roughness: 0.92,
      }),
      portalGlowMat: new THREE.MeshBasicMaterial({
        color: '#FFD991',
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      }),
    }
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Gentle pulsing beacon light at the portal when selection is unlocked
    if (portalGlowRef.current) {
      const baseIntensity = hasSelection ? 2.8 : 1.2
      const pulse = hasSelection ? Math.sin(time * 2.5) * 0.5 : 0
      portalGlowRef.current.intensity = baseIntensity + pulse + (portalHovered ? 1.0 : 0)
    }

    // Slow rotation of the threshold compass ring
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.15
    }
  })

  return (
    <group>
      {/* ════════════════════════════════════════════════════════════ */}
      {/* CHAMBER 01 (Foreground & Active Room: Z = +5.0 to 0.0)      */}
      {/* ════════════════════════════════════════════════════════════ */}

      {/* ── Floor (Dark Walnut Herringbone, Y = 0) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 2.5]}
        material={materials.walnutFloor}
        receiveShadow
      >
        <planeGeometry args={[6.4, 7.0]} />
      </mesh>

      {/* ── Floor Brass Inlay Perimeter Seams ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 2.5]} material={materials.brassTrim}>
        <ringGeometry args={[2.38, 2.4, 64]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 2.5]} material={materials.brassTrim}>
        <ringGeometry args={[1.58, 1.595, 64]} />
      </mesh>

      {/* ── Ceiling (Dark Matte Plaster, Y = 3.6m) ── */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 3.6, 2.5]}
        material={materials.ceilingPlaster}
      >
        <planeGeometry args={[6.4, 7.0]} />
      </mesh>

      {/* ── Outer Left Wall (X = -3.15m) ── */}
      <group position={[-3.15, 1.8, 2.5]}>
        <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.charcoalWall}>
          <planeGeometry args={[7.0, 2.7]} />
        </mesh>
        <mesh position={[0.02, -1.15, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.wainscotWalnut}>
          <planeGeometry args={[7.0, 1.3]} />
        </mesh>
        <mesh position={[0.03, 0.9, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.brassTrim}>
          <boxGeometry args={[7.0, 0.035, 0.04]} />
        </mesh>
      </group>

      {/* ── Outer Right Wall (X = +3.15m) ── */}
      <group position={[3.15, 1.8, 2.5]}>
        <mesh position={[0, 0.45, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.charcoalWall}>
          <planeGeometry args={[7.0, 2.7]} />
        </mesh>
        <mesh position={[-0.02, -1.15, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.wainscotWalnut}>
          <planeGeometry args={[7.0, 1.3]} />
        </mesh>
        <mesh position={[-0.03, 0.9, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.brassTrim}>
          <boxGeometry args={[7.0, 0.035, 0.04]} />
        </mesh>
      </group>

      {/* ── Left Gallery Architectural Display Wing (Mounting for Left Frames) ── */}
      <group position={[-1.68, 1.65, 0.44]} rotation={[0, (22 * Math.PI) / 180, 0]}>
        {/* Dark Walnut Backing Wall */}
        <mesh position={[0, 0, -0.05]} material={materials.wainscotWalnut}>
          <boxGeometry args={[1.4, 2.3, 0.04]} />
        </mesh>
        {/* Champagne Brass Bevel Trim */}
        <mesh position={[0, 0, -0.03]} material={materials.brassTrim}>
          <boxGeometry args={[1.44, 2.34, 0.01]} />
        </mesh>
      </group>

      {/* ── Right Gallery Architectural Display Wing (Mounting for Right Frames) ── */}
      <group position={[1.68, 1.65, 0.44]} rotation={[0, (-22 * Math.PI) / 180, 0]}>
        {/* Dark Walnut Backing Wall */}
        <mesh position={[0, 0, -0.05]} material={materials.wainscotWalnut}>
          <boxGeometry args={[1.4, 2.3, 0.04]} />
        </mesh>
        {/* Champagne Brass Bevel Trim */}
        <mesh position={[0, 0, -0.03]} material={materials.brassTrim}>
          <boxGeometry args={[1.44, 2.34, 0.01]} />
        </mesh>
      </group>

      {/* ── Symmetrical Architectural Brass Wall Sconces (Left & Right) ── */}
      {/* Left Sconce at X = -3.05, Z = 1.8 */}
      <group position={[-3.1, 2.0, 1.8]}>
        <mesh material={materials.brassTrim}>
          <boxGeometry args={[0.08, 0.45, 0.08]} />
        </mesh>
        <pointLight position={[0.1, 0.15, 0]} intensity={1.8} distance={2.5} color="#FFD18C" />
        <pointLight position={[0.1, -0.15, 0]} intensity={1.8} distance={2.5} color="#FFD18C" />
      </group>

      {/* Right Sconce at X = +3.05, Z = 1.8 */}
      <group position={[3.1, 2.0, 1.8]}>
        <mesh material={materials.brassTrim}>
          <boxGeometry args={[0.08, 0.45, 0.08]} />
        </mesh>
        <pointLight position={[-0.1, 0.15, 0]} intensity={1.8} distance={2.5} color="#FFD18C" />
        <pointLight position={[-0.1, -0.15, 0]} intensity={1.8} distance={2.5} color="#FFD18C" />
      </group>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* CENTRAL PORTAL / DOORWAY ARCH (Z = 0.0m)                     */}
      {/* Interactive 3D doorway threshold leading into next chamber   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <mesh position={[-2.2, 1.8, 0]} material={materials.charcoalWall}>
        <planeGeometry args={[2.0, 3.6]} />
      </mesh>
      <mesh position={[2.2, 1.8, 0]} material={materials.charcoalWall}>
        <planeGeometry args={[2.0, 3.6]} />
      </mesh>
      <mesh position={[0, 3.2, 0]} material={materials.charcoalWall}>
        <planeGeometry args={[2.4, 0.8]} />
      </mesh>

      {/* Architectural Doorway Jamb & Brass Reveal Casing */}
      <group position={[0, 1.4, 0]}>
        <mesh position={[-1.18, 0, -0.1]} material={materials.brassTrim}>
          <boxGeometry args={[0.06, 2.8, 0.25]} />
        </mesh>
        <mesh position={[1.18, 0, -0.1]} material={materials.brassTrim}>
          <boxGeometry args={[0.06, 2.8, 0.25]} />
        </mesh>
        <mesh position={[0, 1.4, -0.1]} material={materials.brassTrim}>
          <boxGeometry args={[2.42, 0.06, 0.25]} />
        </mesh>
      </group>

      {/* ── Interactive 3D Threshold Compass & Portal Beacon (Z = 0.0) ── */}
      <group
        position={[0, 0, 0]}
        onPointerOver={(e) => {
          if (hasSelection && onWalkForward) {
            e.stopPropagation()
            setPortalHovered(true)
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={(e) => {
          if (hasSelection && onWalkForward) {
            e.stopPropagation()
            setPortalHovered(false)
            document.body.style.cursor = 'auto'
          }
        }}
        onClick={(e) => {
          if (hasSelection && onWalkForward) {
            e.stopPropagation()
            onWalkForward()
          }
        }}
      >
        {/* Invisible 3D Click Hit Volume for the doorway */}
        <mesh position={[0, 1.4, -0.05]} visible={false}>
          <boxGeometry args={[2.3, 2.8, 0.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Luminous Floor Threshold Compass Inlay */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -0.1]}>
          <ringGeometry args={[0.75, 0.82, 48]} />
          <meshStandardMaterial
            color="#C6A15B"
            emissive={hasSelection ? '#C6A15B' : '#6b5428'}
            emissiveIntensity={hasSelection ? 0.9 : 0.2}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* Floating Waypoint Halo in the Archway when Selection is Unlocked */}
        {hasSelection && (
          <group position={[0, 1.5, -0.15]}>
            <mesh material={materials.portalGlowMat}>
              <ringGeometry args={[0.45, 0.52, 32]} />
            </mesh>
            <Text
              position={[0, -0.02, 0.01]}
              fontSize={0.056}
              color={portalHovered ? '#FAF7F2' : '#D8BD7A'}
              anchorX="center"
              anchorY="middle"
            >
              {roomNumber >= 4
                ? 'STEP FORWARD TO REVELATION →'
                : `STEP FORWARD TO CHAMBER 0${roomNumber + 1} →`}
            </Text>
          </group>
        )}

        {/* Archway Portal Halo Light */}
        <pointLight
          ref={portalGlowRef}
          position={[0, 2.5, -0.3]}
          intensity={hasSelection ? 2.8 : 1.2}
          distance={4.5}
          color="#F0C379"
        />
      </group>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TASTING PLINTH & ARTIFACTS IN ROOM 01 CENTER               */}
      {/* Resting gracefully below camera line of sight (Y: 0..0.7m)   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, 0.6]}>
        {/* Black Polished Marble Plinth */}
        <mesh position={[0, 0.35, 0]} material={materials.blackMarble} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.7, 0.55]} />
        </mesh>
        {/* Champagne Brass Base Accent */}
        <mesh position={[0, 0.02, 0]} material={materials.brassTrim}>
          <boxGeometry args={[1.24, 0.04, 0.59]} />
        </mesh>
        {/* Top Brass Inlay Border */}
        <mesh position={[0, 0.705, 0]} material={materials.brassTrim}>
          <boxGeometry args={[1.22, 0.01, 0.57]} />
        </mesh>

        {/* Exclusive AUREL Crystal Decanter */}
        <mesh position={[-0.22, 0.9, 0]} material={materials.crystalGlass} castShadow>
          <cylinderGeometry args={[0.06, 0.09, 0.34, 16]} />
        </mesh>
        <mesh position={[-0.22, 1.09, 0]} material={materials.brassTrim}>
          <sphereGeometry args={[0.035, 16, 16]} />
        </mesh>

        {/* Rare Amber Spirit Bottle */}
        <mesh position={[0.2, 0.91, 0]} material={materials.amberGlass} castShadow>
          <cylinderGeometry args={[0.055, 0.06, 0.36, 16]} />
        </mesh>
        <mesh position={[0.2, 1.13, 0]} material={materials.brassTrim}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 16]} />
        </mesh>

        {/* Crystal Tasting Tumbler with Amber Liquid */}
        <mesh position={[0, 0.79, 0.1]} material={materials.crystalGlass}>
          <cylinderGeometry args={[0.04, 0.035, 0.12, 16]} />
        </mesh>
        <mesh position={[0, 0.76, 0.1]} material={materials.amberGlass}>
          <cylinderGeometry args={[0.035, 0.033, 0.05, 16]} />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* CHAMBER 02 (Visible in the Distance Through Archway)         */}
      {/* Positioned from Z = -0.1 to Z = -7.0                        */}
      {/* ════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, -4.2]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          material={materials.walnutFloor}
          receiveShadow
        >
          <planeGeometry args={[6.4, 8.0]} />
        </mesh>

        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 3.6, 0]}
          material={materials.ceilingPlaster}
        >
          <planeGeometry args={[6.4, 8.0]} />
        </mesh>

        {/* Chamber 02 Far Back Wall */}
        <mesh position={[0, 1.8, -4.0]} material={materials.charcoalWall}>
          <planeGeometry args={[6.4, 3.6]} />
        </mesh>

        {/* Distant Backlit Alcove */}
        <mesh position={[0, 1.8, -3.95]} material={materials.wainscotWalnut}>
          <planeGeometry args={[2.4, 2.8]} />
        </mesh>
        <mesh position={[0, 1.8, -3.92]} material={materials.brassTrim}>
          <boxGeometry args={[2.46, 2.86, 0.03]} />
        </mesh>

        {/* Distant Warm Glow in Chamber 02 */}
        <pointLight
          position={[0, 2.4, -2.5]}
          intensity={2.5}
          distance={6.0}
          color="#FFCA7A"
          decay={2}
        />
      </group>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* LIGHTING & VOLUMETRICS                                      */}
      {/* ════════════════════════════════════════════════════════════ */}
      <ambientLight intensity={0.48} color="#524334" />

      {/* Downlight over Plinth */}
      <spotLight
        position={[0, 3.5, 1.0]}
        target-position={[0, 0.7, 0.6]}
        intensity={3.8}
        distance={5.0}
        angle={Math.PI / 5}
        penumbra={0.7}
        color="#FFE4B5"
      />
    </group>
  )
}
