import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { type Project } from "@/content/projects"

// ---- constants ----

const NUM_COLS = 3
const GAP = 8  // px — gap between images

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

/** Placeholder captions — replace with real descriptions per image. */
const IMAGE_CAPTIONS = [
  "Product strategy overview",
  "Team collaboration session",
  "Design system components",
  "User research insights",
  "Prototype walkthrough",
  "Workshop facilitation",
  "Sprint review highlights",
  "Stakeholder presentation",
  "Launch day moments",
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

// ---- masonry layout algorithm ----

interface LayoutItem {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Pinterest-style masonry: fixed-width columns, variable heights.
 * Each image is placed in the currently-shortest column.
 *
 * When `selectedIdx` is set, that image spans 2 adjacent columns
 * (choosing the pair whose taller column is lowest), making it
 * expand prominently while surrounding images continue filling
 * the remaining column without leaving empty gaps.
 */
function computeLayout(
  ratios: number[],
  containerW: number,
  selectedIdx: number | null,
  numCols = NUM_COLS,
): { items: LayoutItem[]; totalH: number } {
  if (containerW === 0) return { items: ratios.map(() => ({ x: 0, y: 0, w: 0, h: 0 })), totalH: 0 }

  const colW = (containerW - GAP * (numCols - 1)) / numCols
  // colH tracks the next available Y in each column (cumulative height + gaps)
  const colH = Array<number>(numCols).fill(0)
  const items: LayoutItem[] = Array(ratios.length)

  for (let i = 0; i < ratios.length; i++) {
    const span = i === selectedIdx ? 2 : 1
    const w = span === 1 ? colW : colW * 2 + GAP
    const h = w / ratios[i]

    let col = 0
    if (span === 1) {
      col = colH.indexOf(Math.min(...colH))
    } else {
      // Pick adjacent pair whose taller column is shortest
      let minH = Infinity
      for (let c = 0; c <= numCols - 2; c++) {
        const pairH = Math.max(colH[c], colH[c + 1])
        if (pairH < minH) { minH = pairH; col = c }
      }
    }

    const y = span === 1 ? colH[col] : Math.max(colH[col], colH[col + 1])
    items[i] = { x: col * (colW + GAP), y, w, h }

    const next = y + h + GAP
    colH[col] = next
    if (span === 2) colH[col + 1] = next
  }

  return { items, totalH: Math.max(...colH) - GAP }
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
      className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center px-8 py-12"
    >
      {/* Back button */}
      <div className="pointer-events-auto mb-5 w-full max-w-[860px]">
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
       * Outer div: scroll only — overflow-y: auto implicitly clips overflow-x
       * too (CSS spec), so we keep this wrapper tight and give the inner
       * content div horizontal padding so edge images can scale outward on
       * hover without being clipped.
       */}
      <div
        className="pointer-events-auto"
        style={{
          width: "100%",
          maxWidth: 860,
          maxHeight: "calc(100vh - 180px)",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/*
         * Inner div: measured for layout width, padded so the 1.10× hover
         * scale on edge images doesn't hit the container boundary.
         */}
        <div ref={containerRef} style={{ padding: "12px 20px" }}>
        <LayoutGroup>
          {/* Absolutely-positioned masonry — height driven by computed layout */}
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
                 * Layout layer — absolute position set by the masonry algorithm.
                 * framer-motion FLIP animates from old → new bounding box on
                 * selectedIdx change (single-col → two-col span and back).
                 */
                <motion.div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  layout
                  className="group"
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

                      {/* Hover info overlay — fades in like Instagram caption */}
                      <div
                        className="absolute inset-x-0 bottom-0 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                        style={{
                          background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)",
                          padding: "36px 12px 12px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.95)",
                            lineHeight: 1.35,
                            letterSpacing: "0.01em",
                          }}
                        >
                          {IMAGE_CAPTIONS[i]}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </LayoutGroup>
        </div>
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
            className="fixed inset-0 z-[55] bg-stone-950/70 backdrop-blur-md"
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
