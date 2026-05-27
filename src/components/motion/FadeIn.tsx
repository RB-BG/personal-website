import { motion, type Variants } from "framer-motion"
import { type ReactNode } from "react"

import { useReducedMotion } from "@/hooks/useReducedMotion"

type FadeInProps = {
  children: ReactNode
  /** Delay before this child animates in (seconds). */
  delay?: number
  /** Pixels to translate up from. Set to 0 for pure fade. */
  y?: number
  /** Duration in seconds. */
  duration?: number
  /**
   * When true, animate as soon as mounted (used in the hero).
   * When false (default), animate when scrolled into view.
   */
  immediate?: boolean
  className?: string
}

/**
 * Reveals its children with a fade + upward slide.
 * Respects prefers-reduced-motion (opacity only, no transform).
 */
function FadeIn({
  children,
  delay = 0,
  y = 12,
  duration = 0.6,
  immediate = false,
  className,
}: FadeInProps) {
  const reduced = useReducedMotion()

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  }

  if (immediate) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export { FadeIn }
