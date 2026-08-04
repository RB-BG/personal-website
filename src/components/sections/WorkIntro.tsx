import { DotGrid } from "@/components/decorative/DotGrid"
import { GhostRing } from "@/components/decorative/GhostRing"
import { FadeIn } from "@/components/motion/FadeIn"
import { ParallaxShape } from "@/components/motion/ParallaxShape"

function WorkIntro() {
  return (
    <section className="relative overflow-hidden bg-stone-100 px-6 pt-50 pb-24 lg:px-18">
      <DotGrid color="#000000" opacity={0.05} spacing={32} />

      <ParallaxShape offset={-40} className="absolute -right-50 -bottom-50">
        <GhostRing size={700} color="#000000" opacity={0.05} />
      </ParallaxShape>
      <ParallaxShape offset={-20} className="absolute -right-25 -bottom-25">
        <GhostRing size={400} color="#000000" opacity={0.04} />
      </ParallaxShape>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-12">
          <FadeIn>
            <p className="mb-5 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
              Selected work
            </p>
            <h2 className="max-w-[800px] text-[clamp(40px,6vw,88px)] leading-none font-bold tracking-[-0.04em] text-stone-950">
              Things I&apos;ve built
              <br />
              for real teams.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="max-w-[400px] text-[18px] leading-relaxed text-stone-500">
              Hands-on projects across product management, UX and frontend
              &mdash; each one focused on outcome, not just output.
            </p>
          </FadeIn>
        </div>

        <div className="mt-20 h-px max-w-[600px] bg-gradient-to-r from-brand-500 via-ice-500 to-transparent" />
      </div>
    </section>
  )
}

export { WorkIntro }
