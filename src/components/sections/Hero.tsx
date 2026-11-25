import { ArrowRight } from "lucide-react"
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef } from "react"

import { FadeIn } from "@/components/motion/FadeIn"
import { useReducedMotion } from "@/hooks/useReducedMotion"

/**
 * Interactive warm/cool light field: the orange glow follows the cursor, the
 * ice glow trails at the opposite corner, and the dot-grid lights up as a
 * spotlight underneath. On touch / reduced-motion it drifts on its own (or
 * rests). Positions are published as CSS custom properties the layers read.
 */
function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const magnetRef = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotion()

  const setPos = useCallback((x: number, y: number) => {
    const el = sectionRef.current
    if (!el) return
    el.style.setProperty("--mx", `${x}%`)
    el.style.setProperty("--my", `${y}%`)
    el.style.setProperty("--cx", `${100 - x}%`)
    el.style.setProperty("--cy", `${100 - y}%`)
  }, [])

  useEffect(() => {
    if (reduced) return
    const el = sectionRef.current
    if (!el) return

    const canHover = window.matchMedia("(hover: hover)").matches
    if (canHover) {
      const onMove = (e: PointerEvent) => {
        const b = el.getBoundingClientRect()
        const x = ((e.clientX - b.left) / b.width) * 100
        const y = ((e.clientY - b.top) / b.height) * 100
        setPos(Math.max(-12, Math.min(112, x)), Math.max(-12, Math.min(112, y)))
      }
      window.addEventListener("pointermove", onMove, { passive: true })
      return () => window.removeEventListener("pointermove", onMove)
    }

    // Touch / no-hover: gentle ambient drift.
    let raf = 0
    let t = 0
    const loop = () => {
      t += 0.005
      setPos(50 + 38 * Math.cos(t), 48 + 30 * Math.sin(t * 1.25))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced, setPos])

  // Magnetic primary button — nudges toward the cursor on hover.
  const onMagnet = useCallback(
    (e: ReactPointerEvent<HTMLAnchorElement>) => {
      if (reduced) return
      const el = magnetRef.current
      if (!el) return
      const b = el.getBoundingClientRect()
      const dx = e.clientX - (b.left + b.width / 2)
      const dy = e.clientY - (b.top + b.height / 2)
      el.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.3 - 1).toFixed(1)}px)`
    },
    [reduced],
  )
  const resetMagnet = useCallback(() => {
    if (magnetRef.current) magnetRef.current.style.transform = ""
  }, [])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[92vh] items-center overflow-hidden px-6 pt-48 pb-36 lg:px-18"
      style={{
        background:
          "linear-gradient(150deg, #dfe6ff 0%, #f2f5fb 50%, #dff0f7 100%)",
      }}
    >
      {/* Spotlight dot-grid — masked to a soft circle under the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-brand-500) 1.1px, transparent 1.1px)",
          backgroundSize: "30px 30px",
          WebkitMaskImage:
            "radial-gradient(300px 300px at var(--mx,22%) var(--my,58%), #000 6%, transparent 64%)",
          maskImage:
            "radial-gradient(300px 300px at var(--mx,22%) var(--my,58%), #000 6%, transparent 64%)",
          opacity: 0.22,
        }}
      />
      {/* Warm glow — follows the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: "min(52vw, 640px)",
          aspectRatio: "1",
          left: "var(--mx, 24%)",
          top: "var(--my, 66%)",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(closest-side, var(--color-brand-500), transparent 70%)",
          opacity: 0.24,
          filter: "blur(6px)",
          transition: "left .22s ease-out, top .22s ease-out",
        }}
      />
      {/* Cool glow — trails at the opposite corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: "min(46vw, 560px)",
          aspectRatio: "1",
          left: "var(--cx, 78%)",
          top: "var(--cy, 20%)",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(closest-side, var(--color-ice-500), transparent 70%)",
          opacity: 0.3,
          transition: "left .5s ease-out, top .5s ease-out",
        }}
      />
      {/* Thin static rings for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[16%] -right-[10%] aspect-square rounded-full border-[1.5px] border-ice-500/25"
        style={{ width: "min(52vw, 640px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[3%] right-[3%] aspect-square rounded-full border-[1.5px] border-brand-500/15"
        style={{ width: "min(34vw, 420px)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <Sticker reduced={reduced} />
        <FadeIn immediate delay={0.1} duration={0.9}>
          <span className="mb-14 inline-flex items-center gap-2.5 rounded-full border-2 border-stone-950 bg-white/70 px-4 py-2 text-[13px] font-semibold text-stone-950 backdrop-blur-sm">
            <span className="relative inline-flex size-[7px]">
              <span className="absolute inset-0 rounded-full bg-ice-500" />
              <span className="absolute inset-0 animate-ping rounded-full bg-ice-500 opacity-60" />
            </span>
            Open to collaboration
          </span>
        </FadeIn>

        <FadeIn immediate delay={0.25} duration={0.9}>
          <h1 className="mb-10 max-w-[1100px] font-display text-[clamp(60px,11.5vw,180px)] leading-[0.84] text-stone-950">
            Product manager,
            <br />
            {/* Marker highlight drawn behind the lower half of the word.
                It stays inside the word's own line box, so it never runs
                into the next line at this tight leading. */}
            <span className="relative isolate whitespace-nowrap text-brand-600">
              designer
              <svg
                aria-hidden
                viewBox="0 0 300 40"
                preserveAspectRatio="none"
                className="absolute -left-[0.06em] bottom-[0.13em] -z-10 h-[0.36em] w-[calc(100%+0.12em)] overflow-visible"
              >
                <path
                  d="M8 24 C 70 14, 150 30, 220 20 S 280 16, 292 18"
                  className="fill-none stroke-ice-200"
                  strokeWidth={30}
                  strokeLinecap="round"
                  style={
                    reduced
                      ? undefined
                      : {
                          strokeDasharray: 340,
                          strokeDashoffset: 340,
                          animation: "hero-underline .8s cubic-bezier(.65,0,.35,1) .9s forwards",
                        }
                  }
                />
              </svg>
            </span>{" "}
            &amp; builder.
          </h1>
        </FadeIn>

        <FadeIn immediate delay={0.4} duration={0.9}>
          <p className="mb-16 max-w-[620px] text-[22px] leading-[1.55] text-stone-600">
            I work at the intersection of technology, product strategy and user
            experience &mdash; shaping products from vision to launch. Currently
            leading IT at Brand Boekhouders.
          </p>
        </FadeIn>

        <FadeIn immediate delay={0.55} duration={0.9}>
          <div className="flex flex-wrap items-center gap-4">
            <a
              ref={magnetRef}
              href="#work"
              onPointerMove={onMagnet}
              onPointerLeave={resetMagnet}
              className="inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-9 py-5 text-base font-semibold text-white shadow-[0_12px_30px_-8px_rgba(38,80,255,0.5)] transition-[background,box-shadow,transform] duration-200 hover:bg-brand-700 hover:shadow-[0_16px_36px_-8px_rgba(38,80,255,0.55)]"
            >
              View selected work
              <ArrowRight className="size-[17px]" strokeWidth={2.5} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-stone-950 bg-white/70 px-9 py-5 text-base font-semibold text-stone-950 backdrop-blur-md transition-all hover:rotate-2 hover:bg-white"
            >
              Get in touch
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/**
 * Rotating round sticker (NAR-style playful mark). Text runs on a circular
 * path and spins slowly; the centre arrow jumps to the work list.
 */
function Sticker({ reduced }: { reduced: boolean }) {
  return (
    <a
      href="#work"
      data-cursor="Work"
      aria-label="Jump to selected work"
      className="group absolute top-0 right-0 hidden size-44 -rotate-12 transition-transform duration-500 hover:rotate-0 lg:block xl:size-52"
    >
      <svg
        viewBox="0 0 200 200"
        className="size-full"
        style={reduced ? undefined : { animation: "sticker-spin 18s linear infinite" }}
        aria-hidden
      >
        <circle cx="100" cy="100" r="98" className="fill-brand-600" />
        <defs>
          <path id="sticker-path" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <text className="fill-white font-display text-[21px] tracking-[0.12em]">
          <textPath href="#sticker-path">Product • Design • Build • Product • Design • Build •</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-white text-stone-950 transition-transform duration-300 group-hover:rotate-45">
          <ArrowRight className="size-7 rotate-90" strokeWidth={2.5} />
        </span>
      </span>
      <style>{`@keyframes sticker-spin { to { transform: rotate(360deg); } }`}</style>
    </a>
  )
}

export { Hero }
