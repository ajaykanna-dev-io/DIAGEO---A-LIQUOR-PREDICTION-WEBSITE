import { useState, useEffect, Suspense, useCallback, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import FirstPersonCameraRig from './FirstPersonCameraRig'
import TastingRoomChamber from './TastingRoomChamber'
import TastingArtFrame3D from './TastingArtFrame3D'
import GoldenSpiritsDust from './GoldenSpiritsDust'
import RoomEditorialOverlay from './RoomEditorialOverlay'
import { barMusic } from '@/utils/barMusicEngine'
import {
  moodOptions,
  flavourOptions,
  occasionOptions,
  spiritOptions,
  DiscoveryOption,
} from '@/data/discoveryStages'

interface TastingHouseCanvasProps {
  currentStageIndex: number
  totalStages: number
  selectedOptionId?: string
  onSelectOption: (optionId: string) => void
  onWalkComplete: () => void
  onBack?: () => void
}

/**
 * TastingHouseCanvas — AUREL First-Person 3D Tasting House
 * Coordinates the full architectural discovery journey across all 4 chambers:
 * - Chamber 01: The Arrival Chamber (The Mood)
 * - Chamber 02: The Texture & Flavour Chamber (The Flavour)
 * - Chamber 03: The Occasion Chamber (The Occasion)
 * - Chamber 04: The Heritage Sanctuary (The Spirit Category)
 *
 * Features:
 * - Blender-quality interactive 3D camera with mouse parallax, natural sway, and cinematic forward walking
 * - Self-illuminated exhibition art frames mounted symmetrically on Left and Right walnut walls
 * - Dedicated warm brass picture lighting for maximum clarity and radiant luxury aesthetics
 * - Seamless room-to-room threshold doorway transitions
 */
export default function TastingHouseCanvas({
  currentStageIndex,
  totalStages,
  selectedOptionId,
  onSelectOption,
  onWalkComplete,
  onBack,
}: TastingHouseCanvasProps) {
  const [isEntering, setIsEntering] = useState(true)
  const [isWalking, setIsWalking] = useState(false)
  const [thresholdDarkness, setThresholdDarkness] = useState(false)
  const [localSelection, setLocalSelection] = useState<string | undefined>(selectedOptionId)

  // Responsive mobile screen detection
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768 || window.innerWidth / Math.max(window.innerHeight, 1) < 0.85
  })

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768 || window.innerWidth / Math.max(window.innerHeight, 1) < 0.85
      setIsMobile(mobile)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [mobileFocusedIndex, setMobileFocusedIndex] = useState(0)

  // Gentle entrance step-in settling
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [currentStageIndex])

  // Keep local selection in sync
  useEffect(() => {
    setLocalSelection(selectedOptionId)
  }, [selectedOptionId])

  // Dynamically resolve room config for Chambers 01 to 04
  const roomConfig = useMemo(() => {
    switch (currentStageIndex) {
      case 0:
        return {
          roomNumber: 1,
          stageTitle: 'The Arrival Chamber',
          questionPrompt: 'What does your evening feel like?',
          questionSubtitle: 'Choose the mood that opens your private tasting ritual.',
          options: moodOptions.slice(0, 4) as DiscoveryOption[],
        }
      case 1:
        return {
          roomNumber: 2,
          stageTitle: 'The Texture & Flavour Chamber',
          questionPrompt: 'Which notes awaken your palate?',
          questionSubtitle: 'Select the primary sensory dimension of your spirit.',
          options: flavourOptions.slice(0, 4) as DiscoveryOption[],
        }
      case 2:
        return {
          roomNumber: 3,
          stageTitle: 'The Occasion Chamber',
          questionPrompt: 'When do you plan to enjoy it?',
          questionSubtitle: 'Select the atmosphere and company of your moment.',
          options: occasionOptions.slice(0, 4) as DiscoveryOption[],
        }
      case 3:
      default:
        return {
          roomNumber: 4,
          stageTitle: 'The Heritage Sanctuary',
          questionPrompt: 'Which spirit category calls to you?',
          questionSubtitle: 'Select the foundational distillation heritage.',
          options: spiritOptions.slice(0, 4).map((s) => ({
            id: s.id,
            label: s.name,
            subtitle: s.tagline,
            image: s.image,
            weights: { complexity: 20, smoothness: 20, intensity: 20, sweetness: 20, smokiness: 20 },
          })) as DiscoveryOption[],
        }
    }
  }, [currentStageIndex])

  // Keep mobile focused index synchronized with selected option
  useEffect(() => {
    if (localSelection && roomConfig.options.length > 0) {
      const idx = roomConfig.options.findIndex((opt) => opt.id === localSelection)
      if (idx !== -1) {
        setMobileFocusedIndex(idx)
      }
    } else {
      setMobileFocusedIndex(0)
    }
  }, [currentStageIndex, localSelection, roomConfig.options])

  // Handle frame selection in 3D with luxury crystal chime
  const handleFrameSelect = useCallback((id: string) => {
    if (isWalking) return
    barMusic.playCrystalSelectionChime()
    setLocalSelection(id)
    onSelectOption(id)
    const foundIdx = roomConfig.options.findIndex((opt) => opt.id === id)
    if (foundIdx !== -1) {
      setMobileFocusedIndex(foundIdx)
    }
  }, [isWalking, onSelectOption, roomConfig.options])

  // Mobile carousel navigation handlers
  const handlePrevMobileFrame = useCallback(() => {
    setMobileFocusedIndex((prev) => {
      const nextIdx = (prev - 1 + roomConfig.options.length) % roomConfig.options.length
      const targetOpt = roomConfig.options[nextIdx]
      if (targetOpt) {
        handleFrameSelect(targetOpt.id)
      }
      return nextIdx
    })
  }, [roomConfig.options, handleFrameSelect])

  const handleNextMobileFrame = useCallback(() => {
    setMobileFocusedIndex((prev) => {
      const nextIdx = (prev + 1) % roomConfig.options.length
      const targetOpt = roomConfig.options[nextIdx]
      if (targetOpt) {
        handleFrameSelect(targetOpt.id)
      }
      return nextIdx
    })
  }, [roomConfig.options, handleFrameSelect])

  const handleSelectMobileIndex = useCallback((idx: number) => {
    setMobileFocusedIndex(idx)
    const targetOpt = roomConfig.options[idx]
    if (targetOpt) {
      handleFrameSelect(targetOpt.id)
    }
  }, [roomConfig.options, handleFrameSelect])

  // Start walking forward to the next chamber
  const handleStartWalk = useCallback(() => {
    if (!localSelection || isWalking) return
    barMusic.playChamberWalkTransition()
    setIsWalking(true)

    // Trigger brief cinematic doorway blackout as camera reaches portal
    setTimeout(() => {
      setThresholdDarkness(true)
    }, 1100)
  }, [localSelection, isWalking])

  // Complete walking transition
  const handleWalkingFinished = useCallback(() => {
    onWalkComplete()
    setTimeout(() => {
      setIsWalking(false)
      setThresholdDarkness(false)
    }, 350)
  }, [onWalkComplete])

  // Frame transforms (responsive for desktop 4-wall vs mobile 3D carousel)
  const getFrameTransform = (idx: number) => {
    if (!isMobile) {
      // Desktop Wall Placement
      const desktopTransforms: Array<{
        position: [number, number, number]
        rotation: [number, number, number]
        scale: number
      }> = [
        { position: [-1.68, 2.12, 0.48], rotation: [0, (22 * Math.PI) / 180, 0], scale: 1.0 },
        { position: [1.68, 2.12, 0.48], rotation: [0, (-22 * Math.PI) / 180, 0], scale: 1.0 },
        { position: [-1.68, 1.18, 0.48], rotation: [0, (22 * Math.PI) / 180, 0], scale: 1.0 },
        { position: [1.68, 1.18, 0.48], rotation: [0, (-22 * Math.PI) / 180, 0], scale: 1.0 },
      ]
      return desktopTransforms[idx] || desktopTransforms[0]
    }

    // Mobile Dynamic Centerpiece Carousel
    if (isWalking) {
      // Gracefully part frames away during forward walk
      const xPart = idx % 2 === 0 ? -2.2 : 2.2
      return {
        position: [xPart, 1.54, 0.5] as [number, number, number],
        rotation: [0, (idx % 2 === 0 ? 45 : -45) * (Math.PI / 180), 0] as [number, number, number],
        scale: 0.3,
      }
    }

    const offset = (idx - mobileFocusedIndex + 4) % 4

    switch (offset) {
      case 0:
        // Centerpiece — directly in front of camera at human eye height
        return {
          position: [0, 1.54, 1.34] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: 0.70,
        }
      case 1:
        // Right flank peek
        return {
          position: [0.96, 1.54, 1.62] as [number, number, number],
          rotation: [0, (-26 * Math.PI) / 180, 0] as [number, number, number],
          scale: 0.54,
        }
      case 3:
        // Left flank peek
        return {
          position: [-0.96, 1.54, 1.62] as [number, number, number],
          rotation: [0, (26 * Math.PI) / 180, 0] as [number, number, number],
          scale: 0.54,
        }
      case 2:
      default:
        // Back frame opposite
        return {
          position: [0, 1.54, 0.4] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: 0.25,
        }
    }
  }

  return (
    <div className="relative w-full h-[100svh] min-h-[600px] overflow-hidden bg-[#070605] select-none">
      {/* ════════════════════════════════════════════════════════════ */}
      {/* 3D WEBGL ARCHITECTURAL CANVAS (Blender-Quality Visualization)*/}
      {/* ════════════════════════════════════════════════════════════ */}
      <Canvas
        shadows
        camera={{
          position: [0, 1.68, 3.4],
          fov: 50, // Human field of view capturing display walls / mobile centerpiece
          near: 0.1,
          far: 25,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full cursor-default"
      >
        <Suspense fallback={null}>
          {/* Blender-style first-person interactive camera rig with mouse parallax */}
          <FirstPersonCameraRig
            isEntering={isEntering}
            isWalking={isWalking}
            onWalkComplete={handleWalkingFinished}
            currentRoom={roomConfig.roomNumber}
          />

          {/* Floating amber cellar dust photons catching spotlight beams */}
          <GoldenSpiritsDust count={80} />

          {/* Architectural tasting room chamber with interactive 3D archway doorway */}
          <TastingRoomChamber
            roomNumber={roomConfig.roomNumber}
            hasSelection={Boolean(localSelection)}
            onWalkForward={handleStartWalk}
          />

          {/* ════════════════════════════════════════════════════════════ */}
          {/* TASTING ART EXHIBITION FRAMES                              */}
          {/* Desktop: Symmetrical dual-wall gallery                    */}
          {/* Mobile: Centerpiece carousel with smooth 3D interpolation  */}
          {/* ════════════════════════════════════════════════════════════ */}
          {roomConfig.options.map((option, idx) => {
            const transform = getFrameTransform(idx)
            const optionNumber = `0${idx + 1}`
            return (
              <TastingArtFrame3D
                key={`frame-${optionNumber}-${currentStageIndex}-${option.id}`}
                id={option.id}
                optionNumber={optionNumber}
                title={option.label}
                subtitle={option.subtitle}
                imageSrc={option.image}
                position={transform.position}
                rotation={transform.rotation}
                scale={transform.scale}
                isSelected={localSelection === option.id}
                isAnySelected={Boolean(localSelection)}
                onSelect={handleFrameSelect}
              />
            )
          })}
        </Suspense>
      </Canvas>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* CINEMATIC THRESHOLD SHUTTER                                 */}
      {/* ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {thresholdDarkness && (
          <motion.div
            key="cinematic-curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.98 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 z-20 bg-[#070605]"
          />
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* HAUTE EDITORIAL TYPOGRAPHY & INTERACTION OVERLAY            */}
      {/* ════════════════════════════════════════════════════════════ */}
      <RoomEditorialOverlay
        stageNumber={roomConfig.roomNumber}
        totalStages={totalStages}
        stageTitle={roomConfig.stageTitle}
        questionPrompt={roomConfig.questionPrompt}
        questionSubtitle={roomConfig.questionSubtitle}
        options={roomConfig.options}
        selectedOptionId={localSelection}
        onSelectOption={handleFrameSelect}
        isWalking={isWalking}
        isEntering={isEntering}
        onContinue={handleStartWalk}
        onBack={onBack}
        isMobile={isMobile}
        mobileFocusedIndex={mobileFocusedIndex}
        onPrevMobileFrame={handlePrevMobileFrame}
        onNextMobileFrame={handleNextMobileFrame}
        onSelectMobileIndex={handleSelectMobileIndex}
      />
    </div>
  )
}
