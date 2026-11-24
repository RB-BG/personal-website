import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useState } from "react"

import { useReducedMotion } from "@/hooks/useReducedMotion"

/**
 * Vechtclub-style follower dot. Sits next to the native cursor (never
 * replaces it) and grows into a labelled bubble over any element with a
 * `data-cursor="Label"` attribute. Only on hover-capable pointers, and off
 * when the user prefers reduced motion.
 */
function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 })

  useEffect(() => {
    if (reduced) return
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]")
      setLabel(target?.dataset.cursor ?? null)
    }
    const onLeave = () => setVisible(false)
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const size = label ? 88 : 14

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[80]"
    >
      <motion.div
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-[13px] font-semibold text-white"
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
}

export { Cursor }
