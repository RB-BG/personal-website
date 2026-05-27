import { cn } from "@/lib/utils"

type GhostRingProps = {
  /** Diameter in pixels */
  size: number
  /** Hex color of the ring stroke */
  color: string
  /** Opacity of the ring (0–1) */
  opacity?: number
  className?: string
}

/**
 * Outline-only circle for decorative depth. Pure visual, no interactivity.
 */
function GhostRing({
  size,
  color,
  opacity = 0.1,
  className,
}: GhostRingProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none rounded-full border", className)}
      style={{
        width: size,
        height: size,
        borderColor: withAlpha(color, opacity),
      }}
    />
  )
}

function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export { GhostRing }
