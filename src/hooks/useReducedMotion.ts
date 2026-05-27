import { useReducedMotion as useFramerReducedMotion } from "framer-motion"

/**
 * Thin wrapper around framer-motion's useReducedMotion so the rest of the
 * codebase imports motion-related logic from a single place.
 * Returns `true` when the user has requested reduced motion.
 */
export function useReducedMotion(): boolean {
  return Boolean(useFramerReducedMotion())
}
