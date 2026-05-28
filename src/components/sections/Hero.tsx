import { ArrowRight } from "lucide-react"

import { DotGrid } from "@/components/decorative/DotGrid"
import { GhostRing } from "@/components/decorative/GhostRing"
import { GradientBlob } from "@/components/decorative/GradientBlob"
import { FadeIn } from "@/components/motion/FadeIn"
import { ParallaxShape } from "@/components/motion/ParallaxShape"
import { Badge } from "@/components/ui/badge"

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pt-56 pb-44 lg:px-18"
      style={{
        background:
          "linear-gradient(150deg, #ede9fe 0%, #fafaf9 42%, #fef3c7 100%)",
        minHeight: 920,
      }}
    >
      <DotGrid color="#7c3aed" opacity={0.12} spacing={28} />

      <ParallaxShape offset={-60} className="absolute -top-40 -right-40">
        <GhostRing size={720} color="#7c3aed" opacity={0.1} />
      </ParallaxShape>
      <ParallaxShape offset={-40} className="absolute -top-16 -right-16">
        <GhostRing size={460} color="#7c3aed" opacity={0.08} />
      </ParallaxShape>
      <ParallaxShape offset={-80} className="absolute -top-20 right-20">
        <GradientBlob size={500} color="#a78bfa" opacity={0.22} />
      </ParallaxShape>
      <ParallaxShape offset={60} className="absolute -bottom-20 -left-20">
        <GradientBlob size={480} color="#fde68a" opacity={0.35} />
      </ParallaxShape>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <FadeIn immediate delay={0.1} duration={0.9}>
          <Badge variant="amber" className="mb-14">
            <span className="inline-block size-[7px] rounded-full bg-amber-500" />
            Open to collaboration
          </Badge>
        </FadeIn>

        <FadeIn immediate delay={0.25} duration={0.9}>
          <h1 className="mb-10 max-w-[1200px] text-[clamp(56px,9.5vw,148px)] leading-[0.92] font-bold tracking-[-0.05em] text-stone-950">
            Product manager,
            <br />
            <span className="bg-gradient-to-r from-brand-800 via-brand-600 to-brand-400 bg-clip-text text-transparent">
              designer
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
              href="#work"
              className="inline-flex items-center gap-2.5 rounded-full bg-brand-800 px-9 py-5 text-base font-semibold text-white shadow-[0_10px_28px_rgba(91,33,182,0.28)] transition-all hover:bg-brand-700 hover:shadow-[0_12px_32px_rgba(91,33,182,0.36)]"
            >
              View selected work
              <ArrowRight className="size-[17px]" strokeWidth={2.5} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-stone-950/10 bg-white/65 px-9 py-5 text-base font-medium text-stone-950 backdrop-blur-md transition-colors hover:bg-white/80"
            >
              Get in touch
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export { Hero }
