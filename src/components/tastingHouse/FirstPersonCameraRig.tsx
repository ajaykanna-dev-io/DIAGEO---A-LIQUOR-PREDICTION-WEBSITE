import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface FirstPersonCameraRigProps {
  isEntering: boolean
  isWalking: boolean
  onWalkComplete?: () => void
  currentRoom: number
}

/**
 * FirstPersonCameraRig — Blender-Style Cinematic 3D Human Camera
 * Features:
 * - Fluid interactive cursor parallax: mouse movements produce realistic 3D perspective shifts,
 *   revealing depth between wall-mounted frames, door jambs, and architectural lighting.
 * - Human eye-level perspective (1.68m) with natural cinematic lens equivalent (~40mm).
 * - Organic micro-breathing sway when standing stationary.
 * - Smooth cinematic dolly with subtle acceleration, human step cadence, and slight rotational roll
 *   when walking through the architectural portal into the next chamber.
 */
export default function FirstPersonCameraRig({
  isEntering,
  isWalking,
  onWalkComplete,
}: FirstPersonCameraRigProps) {
  const { camera } = useThree()
  const walkProgress = useRef(0)
  const isWalkingRef = useRef(false)

  // Smooth lerp tracking for mouse parallax
  const mousePanX = useRef(0)
  const mousePanY = useRef(0)

  // Target camera depth
  const currentZ = useRef(isEntering ? 4.2 : 3.4)

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const { pointer } = state

    // 1. Smooth mouse parallax tracking (Blender-style interactive viewport response)
    mousePanX.current = THREE.MathUtils.lerp(mousePanX.current, pointer.x, delta * 3.5)
    mousePanY.current = THREE.MathUtils.lerp(mousePanY.current, pointer.y, delta * 3.5)

    // 2. Natural human breathing micro-sway
    const swayX = Math.sin(time * 0.8) * 0.008
    const swayY = Math.cos(time * 1.1) * 0.006

    if (isWalking) {
      if (!isWalkingRef.current) {
        isWalkingRef.current = true
        walkProgress.current = 0
      }

      // Smooth ~2.2s cinematic walk progression
      walkProgress.current += delta * 0.45

      if (walkProgress.current >= 1.0) {
        walkProgress.current = 1.0
        if (onWalkComplete) {
          onWalkComplete()
          isWalkingRef.current = false
        }
      }

      // Cinematic smoothstep curve (gradual acceleration, steady stride, gentle arrival)
      const t = walkProgress.current
      const easeT = t * t * (3 - 2 * t)

      // Dolly from Chamber center (Z = 3.4) right through the archway (Z = 0) to next Chamber (Z = -4.0)
      const targetWalkZ = THREE.MathUtils.lerp(3.4, -4.0, easeT)
      currentZ.current = targetWalkZ

      // Subtle human vertical step cadence and rotational bank
      const stepBob = Math.sin(easeT * Math.PI * 4) * 0.018
      const stepRoll = Math.sin(easeT * Math.PI * 4) * 0.008

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePanX.current * 0.1, delta * 4)
      camera.position.y = 1.68 + stepBob
      camera.position.z = targetWalkZ
      camera.rotation.z = stepRoll

      // Focus straight ahead into the depth of the new chamber
      camera.lookAt(
        mousePanX.current * 0.2,
        1.68,
        targetWalkZ - 6.0
      )
    } else {
      // ── Stationary State in Tasting Chamber ──
      currentZ.current = THREE.MathUtils.lerp(currentZ.current, 3.4, delta * 2.5)

      // Interactive 3D Parallax:
      // Moving mouse to the left lets user see more of the right frames and side architecture;
      // moving mouse to the right reveals more of the left frames.
      const targetPosX = mousePanX.current * 0.32 + swayX
      const targetPosY = 1.68 + mousePanY.current * 0.18 + swayY

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPosX, delta * 4)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPosY, delta * 4)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, currentZ.current, delta * 4)
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, 0, delta * 5)

      // Target lookAt point reacts to cursor for intuitive spatial gaze
      camera.lookAt(
        mousePanX.current * 0.5,
        1.68 + mousePanY.current * 0.25,
        -2.5
      )
    }
  })

  return null
}
