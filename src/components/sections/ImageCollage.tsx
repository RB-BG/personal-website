import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { type Project } from "@/content/projects"

// ---- per-image config ----

/**
 * Mix of landscape, portrait and square to simulate a real photo upload.
 * When real images are wired up, replace aspect ratios with the image's
 * natural intrinsic ratio.
 */
const IMAGE_RATIOS = [
  "16/9",
  "2/3",
  "1/1",
  "4/3",
  "1/1",
  "3/4",
  "16/9",
  "1/1",
  "2/3",
] as const

const ENTRANCE = [
  { delay: 0.05, stiffness: 340, damping: 14, rotate: -3 },
  { delay: 0.14, stiffness: 280, damping: 12, rotate: 4 },
  { delay: 0.08, stiffness: 380, damping: 16, rotate: -2 },
  { delay: 0.20, stiffness: 300, damping: 13, rotate: 5 },
  { delay: 0.28, stiffness: 260, damping: 14, rotate: -4 },
  { delay: 0.16, stiffness: 350, damping: 12, rotate: 3 },
  { delay: 0.24, stiffness: 290, damping: 15, rotate: -5 },
  { delay: 0.32, stiffness: 320, damping: 13, rotate: 2 },
  { delay: 0.11, stiffness: 360, damping: 11, rotate: -3 },
] as const

// ---- interaction helpers ----

function getScale(
  i: number,
  hoveredIdx: number | null,
  selectedIdx: number | null,
): number {
  if (selectedIdx === i) return 1.08
  if (selectedIdx !== null) return 0.91
  if (hoveredIdx === i) return 1.07
  if (hoveredIdx !== null) return 0.95
  return 1
}

function getOpacity(i: number, selectedIdx: number | null): number {
  if (selectedIdx === null || selectedIdx === i) return 1
  return 0.55
}

function getGradients({ from, via, to }: Project["gradient"]): string[] {
  return [
    `linear-gradient(135deg, ${from} 0%, ${via} 100%)`,
    `linear-gradient(45deg,  ${via} 0%, ${to}  100%)`,
    `linear-gradient(225deg, ${from} 0%, ${to}  100%)`,
    `linear-gradient(315deg, ${via} 0%, ${from} 100%)`,
    `linear-gradient(180deg, ${from} 0%, ${via} 50%, ${to} 100%)`,
    `linear-gradient(90deg,  ${to}  0%, ${from} 100%)`,
    `linear-gradient(160deg, ${via} 0%, ${to}  100%)`,
    `linear-gradient(20deg,  ${from} 0%, ${via} 100%)`,
    `linear-gradient(270deg, ${to}  0%, ${via} 100%)`,
  ]
}

// ---- inner component (remounts per project so state auto-resets) ----

type GridProps = {
  project: Project
  onClose: () => void
}

function ImageCollageGrid({ project, onClose }: GridProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Body scroll lock + initial focus
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Escape: deselect first, then close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (selectedIdx !== null) setSelectedIdx(null)
      else onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [selectedIdx, onClose])

  const gradients = getGradients(project.gradient)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center px-8 py-12"
    >
      {/* Back button */}
      <div className="pointer-events-auto mb-5 w-full max-w-[680px]">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
        >
          <ArrowLeft className="size-4" strokeWidth={2.5} />
          Back
        </button>
      </div>

      {/*
       * CSS columns masonry — images fill columns naturally in their own
       * aspect ratio so landscape/portrait/square all coexist without distortion.
       */}
      <div
        className="pointer-events-auto"
        style={{ columnCount: 3, columnGap: "8px", width: "min(80vw, 680px)" }}
      >
        {gradients.map((bg, i) => {
          const cfg = ENTRANCE[i]
          const isThisSelected = selectedIdx === i
          const scale = getScale(i, hoveredIdx, selectedIdx)
          const opacity = getOpacity(i, selectedIdx)

          return (
            /*
             * Outer motion.div — owns the hover/click scale + opacity.
             * breakInside: avoid keeps each image from splitting across columns.
             */
            <motion.div
              key={i}
              animate={{ scale, opacity }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              style={{
                aspectRatio: IMAGE_RATIOS[i],
                breakInside: "avoid",
                marginBottom: "8px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "14px",
                cursor: "pointer",
                background: bg,
                // Local z-index so hovered/selected image sits on top of neighbours
                zIndex: isThisSelected || hoveredIdx === i ? 2 : 1,
              }}
              onMouseEnter={() => {
                if (selectedIdx === null) setHoveredIdx(i)
              }}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIdx(isThisSelected ? null : i)
                setHoveredIdx(null)
              }}
            >
              {/*
               * Inner motion.div — owns the one-time bubbly entrance animation.
               * Keeping entrance and interaction on separate layers means the
               * hover spring never inherits the entrance delay.
               */}
              <motion.div
                initial={{ scale: 0.55, opacity: 0, rotate: cfg.rotate }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  delay: cfg.delay,
                  type: "spring",
                  stiffness: cfg.stiffness,
                  damping: cfg.damping,
                }}
                style={{ position: "absolute", inset: 0, background: bg }}
              >
                {/* Subtle grid texture */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* Selected ring */}
                {isThisSelected && (
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "14px",
                      boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.65)",
                    }}
                  />
                )}

                {/* Placeholder number */}
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {i + 1}
                </span>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ---- outer shell ----

type ImageCollageProps = {
  project: Project | null
  onClose: () => void
}

function ImageCollage({ project, onClose }: ImageCollageProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="collage-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-stone-950/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />

          {/* key={project.slug} remounts the grid so state auto-resets per project */}
          <ImageCollageGrid key={project.slug} project={project} onClose={onClose} />
        </>
      )}
    </AnimatePresence>
  )
}

export { ImageCollage }
