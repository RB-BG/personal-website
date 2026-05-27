import { cn } from "@/lib/utils"

type DotGridProps = {
  /** Hex color of each dot */
  color?: string
  /** Opacity of each dot (0–1) */
  opacity?: number
  /** Spacing between dots in pixels */
  spacing?: number
  className?: string
}

/**
 * Subtle dot-grid background pattern.
 * Renders as an absolutely positioned overlay — parent must be `relative`.
 */
function DotGrid({
  color = "#7c3aed",
  opacity = 0.08,
  spacing = 28,
  className,
}: DotGridProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(circle, ${withAlpha(color, opacity)} 1px, transparent 1px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
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

export { DotGrid }
