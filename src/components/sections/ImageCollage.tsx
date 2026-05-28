import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { type Project } from "@/content/projects"

// ------- constants -------

const COLS = 3

/**
 * Deterministic per-image spring + rotation values — gives each image
 * a different "personality" so the entrance feels bubbly, not uniform.
 */
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

// Elastic easing so grid-track changes feel springy
const TRACK_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)"
const TRACK_TRANSITION = `grid-template-columns 0.5s ${TRACK_EASE}, grid-template-rows 0.5s ${TRACK_EASE}`

// ------- helpers -------

/**
 * Returns a `Xfr Xfr Xfr` string for the col/row grid tracks.
 * Total always sums to 3fr so the container never changes size.
 *   Hover:    active 1.5fr  | others 0.75fr
 *   Selected: active 2.4fr  | others 0.30fr
 */
function getTrack(
  activeIdx: number | null,
  axis: "col" | "row",
  isSelected: boolean,
): string {
  if (activeIdx === null) return "1fr 1fr 1fr"
  const track = axis === "col" ? activeIdx % COLS : Math.floor(activeIdx / COLS)
  const [big, small] = isSelected ? [2.4, 0.3] : [1.5, 0.75]
  return [0, 1, 2].map((i) => (i === track ? `${big}fr` : `${small}fr`)).join(" ")
}

/** Nine gradient variations derived from the project's colour palette. */
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

// ------- inner grid (remounts per project, so state auto-resets) -------

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

  // Keyboard: Escape deselects first, then closes the overlay
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (selectedIdx !== null) setSelectedIdx(null)
      else onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [selectedIdx, onClose])

  const isSelected = selectedIdx !== null
  const activeIdx = isSelected ? selectedIdx : hoveredIdx
  const gradients = getGradients(project.gradient)

  return (
    <motion.div
      key="collage-content"
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

      {/* CSS Grid accordion */}
      <div
        className="pointer-events-auto overflow-hidden rounded-2xl"
        style={{
          display: "grid",
          gridTemplateColumns: getTrack(activeIdx, "col", isSelected),
          gridTemplateRows: getTrack(activeIdx, "row", isSelected),
          gap: "8px",
          width: "min(80vw, 640px)",
          height: "min(68vh, 560px)",
          transition: TRACK_TRANSITION,
        }}
      >
        {gradients.map((bg, i) => {
          const cfg = ENTRANCE[i]
          const isThisSelected = selectedIdx === i

          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => {
                if (!isSelected) setHoveredIdx(i)
              }}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIdx(isThisSelected ? null : i)
                setHoveredIdx(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.55, opacity: 0, rotate: cfg.rotate }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  delay: cfg.delay,
                  type: "spring",
                  stiffness: cfg.stiffness,
                  damping: cfg.damping,
                }}
                className="h-full w-full cursor-pointer overflow-hidden rounded-xl"
                style={{ background: bg }}
              >
                {/* Subtle grid pattern */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* Selected ring */}
                {isThisSelected && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-inset ring-white/60" />
                )}

                {/* Placeholder label */}
                <span className="absolute inset-0 flex items-center justify-center text-[12px] font-medium text-white/30">
                  {i + 1}
                </span>
              </motion.div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ------- outer shell (manages AnimatePresence) -------

type ImageCollageProps = {
  project: Project | null
  onClose: () => void
}

function ImageCollage({ project, onClose }: ImageCollageProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop — click to close */}
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

          {/*
           * key={project.slug} causes React to fully remount ImageCollageGrid
           * whenever the active project changes — state resets for free,
           * no setState-in-effect needed.
           */}
          <ImageCollageGrid
            key={project.slug}
            project={project}
            onClose={onClose}
          />
        </>
      )}
    </AnimatePresence>
  )
}

export { ImageCollage }
