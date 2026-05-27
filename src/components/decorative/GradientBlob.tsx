import { cn } from "@/lib/utils"

type GradientBlobProps = {
  /** Diameter in pixels */
  size: number
  /** Hex color for the centre of the radial gradient */
  color: string
  /** Opacity of the gradient centre (0–1) */
  opacity?: number
  className?: string
}

/**
 * Soft radial-gradient blob used as a decorative background element.
 * Position with utility classes (`absolute top-… left-…`) from the parent.
 */
function GradientBlob({
  size,
  color,
  opacity = 0.25,
  className,
}: GradientBlobProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${withAlpha(color, opacity)} 0%, ${withAlpha(color, 0)} 70%)`,
      }}
    />
  )
}

/** Convert a #RRGGBB hex to rgba() with the given alpha. */
function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export { GradientBlob }
