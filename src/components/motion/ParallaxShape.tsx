import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/utils"

type ParallaxShapeProps = {
  children: ReactNode
  /** How many pixels to translate over a full viewport scroll. Negative = up. */
  offset?: number
  className?: string
}

/**
 * Translates its child on the Y-axis based on scroll position relative to
 * its parent. Used to give decorative blobs/rings subtle parallax depth.
 * No-op when prefers-reduced-motion is set.
 */
function ParallaxShape({
  children,
  offset = -80,
  className,
}: ParallaxShapeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, offset])

  return (
    <motion.div
      ref={ref}
      className={cn("pointer-events-none", className)}
      style={reduced ? undefined : { y }}
    >
      {children}
    </motion.div>
  )
}

export { ParallaxShape }
