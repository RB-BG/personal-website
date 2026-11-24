import { cn } from "@/lib/utils"

type TickerProps = {
  items: ReadonlyArray<string>
  /** "brand" = cobalt band with white type, "light" = white band with ink type. */
  tone?: "brand" | "light"
  /** "lg" for the poster-size NAR band, "md" for a quieter divider. */
  size?: "lg" | "md"
  /** Scroll right-to-left (default) or left-to-right. */
  reverse?: boolean
  /** Rotate the band a touch for a hand-placed, poster feel. */
  tilt?: number
}

/**
 * Infinite CSS-only text band (NAR / Vechtclub style). The list is repeated
 * four times and the track slides -50%, so the loop is seamless.
 */
function Ticker({ items, tone = "brand", size = "lg", reverse = false, tilt = 0 }: TickerProps) {
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div
      aria-hidden
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
      className={cn(
        "relative z-10 overflow-hidden border-y-2 border-stone-950",
        tone === "brand" ? "bg-brand-600 text-white" : "bg-white text-stone-950",
        size === "lg" ? "py-3" : "py-2",
        tilt && "-mx-4",
      )}
    >
      <div
        className={cn(
          "ticker-track flex w-max items-center whitespace-nowrap font-display leading-none",
          size === "lg" ? "gap-10 text-[clamp(48px,8vw,120px)]" : "gap-8 text-[clamp(32px,4.5vw,64px)]",
          reverse && "ticker-reverse",
        )}
      >
        {repeated.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10">
            {item}
            <span
              className={cn(
                "inline-block size-[0.28em] rounded-full",
                tone === "brand" ? "bg-white" : "bg-brand-600",
              )}
            />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker-scroll { to { transform: translateX(-50%); } }
        .ticker-track { animation: ticker-scroll 40s linear infinite; }
        .ticker-reverse { animation-direction: reverse; }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </div>
  )
}

export { Ticker }
