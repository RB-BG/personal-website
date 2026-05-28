import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { type Project } from "@/content/projects"

// ---- image config ----

type ImgType = "landscape" | "portrait" | "square"

/**
 * Pre-defined aspect ratios for the placeholder grid.
 * When real images are wired up, swap each ratio for the image's
 * intrinsic width/height ratio.
 */
const IMAGES: ReadonlyArray<{ type: ImgType; ratio: string }> = [
  { type: "landscape", ratio: "16/9" },
  { type: "portrait",  ratio: "2/3"  },
  { type: "square",    ratio: "1/1"  },
  { type: "landscape", ratio: "4/3"  },
  { type: "square",    ratio: "1/1"  },
  { type: "portrait",  ratio: "3/4"  },
  { type: "landscape", ratio: "16/9" },
  { type: "square",    ratio: "1/1"  },
  { type: "portrait",  ratio: "2/3"  },
]

/** Columns each image spans in the 3-col grid when at rest. */
function normalSpan(type: ImgType): number {
  return type === "landscape" ? 2 : 1
}

/**
 * Columns each image spans when selected (clicked).
 *   landscape → full row (3 cols) — pushes neighbours to next row
 *   portrait / square → 2 cols — taller at wider width, extends the grid
 */
function featuredSpan(type: ImgType): number {
  return type === "landscape" ? 3 : 2
}

// ---- entrance animation config ----

const ENTRANCE = [
  { delay: 0.05, stiffness: 340, damping: 14, rotate: -3 },
  { delay: 0.14, stiffness: 280, damping: 12, rotate:  4 },
  { delay: 0.08, stiffness: 380, damping: 16, rotate: -2 },
  { delay: 0.20, stiffness: 300, damping: 13, rotate:  5 },
  { delay: 0.28, stiffness: 260, damping: 14, rotate: -4 },
  { delay: 0.16, stiffness: 350, damping: 12, rotate:  3 },
  { delay: 0.24, stiffness: 290, damping: 15, rotate: -5 },
  { delay: 0.32, stiffness: 320, damping: 13, rotate:  2 },
  { delay: 0.11, stiffness: 360, damping: 11, rotate: -3 },
] as const

// ---- helpers ----

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

// ---- inner component (remounts per project, auto-resets state) ----

type GridProps = { project: Project; onClose: () => void }

function ImageCollageGrid({ project, onClose }: GridProps) {
  const [scales, setScales] = useState<number[]>(() =>
    Array(IMAGES.length).fill(1),
  )
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  /**
   * One ref per image so we can read their bounding boxes for the wave.
   * Stored in a ref-of-array to avoid re-renders on assignment.
   */
  const itemRefs = useRef<Array<HTMLDivElement | null>>(
    Array(IMAGES.length).fill(null),
  )
  const gradients = getGradients(project.gradient)

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (selectedIdx !== null) setSelectedIdx(null)
      else onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [selectedIdx, onClose])

  /**
   * Hover wave.
   * Measures the pixel distance from the hovered image's centre to every
   * other image's centre, then applies an exponential decay:
   *   hovered image  → 1.12  (grows)
   *   close neighbour → ~0.88 (shrinks most)
   *   distant image   → ~0.97 (barely moves)
   */
  const handleMouseEnter = useCallback(
    (i: number) => {
      if (selectedIdx !== null) return

      const el = itemRefs.current[i]
      if (!el) return

      const { left, top, width, height } = el.getBoundingClientRect()
      const cx = left + width / 2
      const cy = top + height / 2

      setScales(
        itemRefs.current.map((ref, j) => {
          if (!ref) return 1
          if (j === i) return 1.12
          const r = ref.getBoundingClientRect()
          const dist = Math.hypot(
            cx - (r.left + r.width / 2),
            cy - (r.top + r.height / 2),
          )
          // Exponential falloff: strong nearby, fades to ~1.0 at 600+ px
          return 1 - 0.16 * Math.exp(-dist / 280)
        }),
      )
    },
    [selectedIdx],
  )

  const handleMouseLeave = useCallback(() => {
    setScales(Array(IMAGES.length).fill(1))
  }, [])

  /**
   * Click to feature / deselect.
   * Resets hover scales first so the wave doesn't linger during reflow.
   */
  const handleClick = useCallback((i: number) => {
    setScales(Array(IMAGES.length).fill(1))
    setSelectedIdx((prev) => (prev === i ? null : i))
  }, [])

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
       * Scrollable wrapper so a tall featured portrait doesn't overflow
       * the viewport after the grid expands.
       */}
      <div
        className="pointer-events-auto"
        style={{
          width: "min(80vw, 680px)",
          maxHeight: "calc(100vh - 180px)",
          overflowY: "auto",
        }}
      >
        <LayoutGroup>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridAutoFlow: "dense",
              alignItems: "start",
              gap: "8px",
            }}
          >
            {IMAGES.map((img, i) => {
              const isSelected = selectedIdx === i
              const span = isSelected ? featuredSpan(img.type) : normalSpan(img.type)
              const cfg = ENTRANCE[i]

              return (
                /*
                 * Layout layer — owns grid positioning and animates reflow
                 * when gridColumn span changes (click to feature/deselect).
                 * framer-motion FLIP: captures bounding box before and after
                 * the DOM update, then plays a spring from old → new.
                 */
                <motion.div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  layout
                  transition={{
                    layout: { type: "spring", stiffness: 260, damping: 28 },
                  }}
                  style={{
                    gridColumn: `span ${span}`,
                    aspectRatio: img.ratio,
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClick(i)
                  }}
                >
                  {/*
                   * Wave scale layer — kept separate from the layout layer so
                   * the two transforms don't compound during simultaneous
                   * layout + scale animations.
                   */}
                  <motion.div
                    animate={{ scale: scales[i] }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "14px",
                      overflow: "hidden",
                      background: gradients[i],
                    }}
                  >
                    {/*
                     * Entrance layer — one-time bubbly spring on mount.
                     * Separated from the wave layer so the entrance delay
                     * never bleeds into hover transitions.
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
                      style={{ position: "absolute", inset: 0, background: gradients[i] }}
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
                      {isSelected && (
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "14px",
                            boxShadow: "inset 0 0 0 2.5px rgba(255,255,255,0.65)",
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
                </motion.div>
              )
            })}
          </div>
        </LayoutGroup>
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
          {/* key={project.slug} remounts the grid per project, auto-resetting all state */}
          <ImageCollageGrid key={project.slug} project={project} onClose={onClose} />
        </>
      )}
    </AnimatePresence>
  )
}

export { ImageCollage }
