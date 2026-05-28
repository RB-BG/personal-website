import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { type Project } from "@/content/projects"

// ---- constants ----

const TARGET_ROW_H = 220  // px — base row height before row-fill scaling
const GAP = 8             // px — gap between images

/**
 * Placeholder images: numeric aspect ratios (width / height).
 * Replace with real image ratios once uploads are wired up.
 */
const IMAGE_RATIOS = [
  16 / 9,  // landscape
   2 / 3,  // portrait
   1 / 1,  // square
   4 / 3,  // landscape
   1 / 1,  // square
   3 / 4,  // portrait
  16 / 9,  // landscape
   1 / 1,  // square
   2 / 3,  // portrait
]

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

// ---- justified layout algorithm ----

interface LayoutItem {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Packs images into rows such that each row fills `containerW` exactly,
 * with every image at the same visual row height.
 *
 * When `selectedIdx` is set, that image gets 2× target height, making it
 * larger and changing which images land in the same row.
 *
 * Last row: scaled to fill only if it's ≥ 60 % full; otherwise left-aligned
 * to avoid grotesquely stretched single images.
 */
function computeLayout(
  ratios: number[],
  containerW: number,
  selectedIdx: number | null,
): { items: LayoutItem[]; totalH: number } {
  if (containerW === 0) return { items: ratios.map(() => ({ x: 0, y: 0, w: 0, h: 0 })), totalH: 0 }

  // Effective target height per image (selected = 2×)
  const effH = ratios.map((_, i) =>
    i === selectedIdx ? TARGET_ROW_H * 2 : TARGET_ROW_H,
  )
  // Preferred width at effective height
  const prefW = ratios.map((r, i) => r * effH[i])

  // Pack indices into rows
  const rows: number[][] = []
  let row: number[] = []
  let rowW = 0

  for (let i = 0; i < ratios.length; i++) {
    const extra = row.length > 0 ? GAP + prefW[i] : prefW[i]
    if (row.length > 0 && rowW + extra > containerW) {
      rows.push([...row])
      row = [i]
      rowW = prefW[i]
    } else {
      row.push(i)
      rowW += extra
    }
  }
  if (row.length > 0) rows.push(row)

  const items: LayoutItem[] = Array(ratios.length)
  let y = 0

  for (let r = 0; r < rows.length; r++) {
    const indices = rows[r]
    const isLast = r === rows.length - 1
    const totalPref = indices.reduce((s, i) => s + prefW[i], 0)
    const gaps = (indices.length - 1) * GAP
    const naturalW = totalPref + gaps

    // Scale to fill container width — unless it's the last row and it's sparse
    const scale =
      isLast && naturalW < containerW * 0.6
        ? 1
        : (containerW - gaps) / totalPref

    // Row height is the tallest scaled image in this row
    const rowH = Math.max(...indices.map((i) => effH[i] * scale))

    let x = 0
    for (const i of indices) {
      const w = prefW[i] * scale
      const h = effH[i] * scale
      // Vertically centre shorter images (e.g. regular next to 2× selected)
      items[i] = { x, y: y + (rowH - h) / 2, w, h }
      x += w + GAP
    }

    y += rowH + GAP
  }

  return { items, totalH: Math.max(0, y - GAP) }
}

// ---- gradient helpers ----

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

// ---- inner component ----

type GridProps = { project: Project; onClose: () => void }

function ImageCollageGrid({ project, onClose }: GridProps) {
  const [containerW, setContainerW] = useState(680)
  const [scales, setScales] = useState<number[]>(() =>
    Array(IMAGE_RATIOS.length).fill(1),
  )
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>(
    Array(IMAGE_RATIOS.length).fill(null),
  )

  const gradients = getGradients(project.gradient)
  const layout = computeLayout(IMAGE_RATIOS, containerW, selectedIdx)

  // Measure container width (responsive)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

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
   * Hover wave — exponential falloff from hovered image centre.
   * Hovered: 1.10 (grows), direct neighbour: ~0.86, far: ~0.98.
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
          if (j === i) return 1.10
          const r = ref.getBoundingClientRect()
          const dist = Math.hypot(
            cx - (r.left + r.width / 2),
            cy - (r.top + r.height / 2),
          )
          return 1 - 0.16 * Math.exp(-dist / 280)
        }),
      )
    },
    [selectedIdx],
  )

  const handleMouseLeave = useCallback(() => {
    setScales(Array(IMAGE_RATIOS.length).fill(1))
  }, [])

  const handleClick = useCallback((i: number) => {
    setScales(Array(IMAGE_RATIOS.length).fill(1))
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
       * Scrollable grid container.
       * scrollbar-width: none hides the scrollbar while keeping it functional.
       */}
      <div
        ref={containerRef}
        className="pointer-events-auto"
        style={{
          width: "min(80vw, 680px)",
          maxHeight: "calc(100vh - 180px)",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <LayoutGroup>
          {/* Absolutely-positioned grid — height driven by computed layout */}
          <motion.div
            layout
            style={{ position: "relative", height: layout.totalH }}
          >
            {IMAGE_RATIOS.map((_, i) => {
              const item = layout.items[i]
              const cfg = ENTRANCE[i]
              const isSelected = selectedIdx === i

              return (
                /*
                 * Layout layer — absolute position set by the justified
                 * algorithm. framer-motion FLIP animates from old → new
                 * bounding box whenever layout recomputes (selectedIdx change).
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
                    position: "absolute",
                    left: item?.x ?? 0,
                    top: item?.y ?? 0,
                    width: item?.w ?? 0,
                    height: item?.h ?? 0,
                    cursor: "pointer",
                    borderRadius: 14,
                  }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClick(i)
                  }}
                >
                  {/* Wave scale layer — isolated so it doesn't compound with FLIP */}
                  <motion.div
                    animate={{ scale: scales[i] }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 14,
                      overflow: "hidden",
                      background: gradients[i],
                    }}
                  >
                    {/* Entrance layer — one-time bubbly spring, delay isolated here */}
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
                      {/* Grid texture */}
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
                            borderRadius: 14,
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
                          fontSize: 12,
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
          </motion.div>
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
          <ImageCollageGrid key={project.slug} project={project} onClose={onClose} />
        </>
      )}
    </AnimatePresence>
  )
}

export { ImageCollage }
