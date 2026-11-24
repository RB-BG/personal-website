import { motion } from "framer-motion"
import { ArrowRight, Gamepad2, Lightbulb, TrendingUp } from "lucide-react"

import { FadeIn } from "@/components/motion/FadeIn"
import { type AboutPoint, aboutIntro, aboutOutro, aboutPoints } from "@/content/about"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const ICONS: Record<AboutPoint["icon"], typeof Lightbulb> = {
  expertise: Lightbulb,
  experience: TrendingUp,
  beyond: Gamepad2,
}

/**
 * "About me": a poster-size greeting with the intro as a large lead, then
 * three bordered cards (expertise, approach, beyond work) that tilt on
 * hover like the rest of the site.
 */
function About() {
  const reduced = useReducedMotion()

  return (
    <section id="about" className="bg-stone-50 px-6 py-32 lg:px-18">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid items-end gap-10 lg:grid-cols-[1fr_1.1fr]">
          <FadeIn>
            <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">About me</p>
            <h2 className="font-display text-[clamp(56px,9vw,140px)] leading-[0.85] text-stone-950">
              Hi, I&apos;m <span className="text-brand-600">Ruben.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[clamp(20px,1.8vw,26px)] leading-snug font-medium text-stone-700">{aboutIntro}</p>
          </FadeIn>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {aboutPoints.map((point, i) => {
            const Icon = ICONS[point.icon]
            return (
              <motion.article
                key={point.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduced ? undefined : { rotate: i % 2 ? 1.5 : -1.5, y: -6 }}
                className="group rounded-2xl border-2 border-stone-950 bg-white p-7"
              >
                <span className="mb-6 flex size-12 items-center justify-center rounded-full bg-stone-950 text-white transition-colors duration-300 group-hover:bg-brand-600">
                  <Icon className="size-6" strokeWidth={2} />
                </span>
                <h3 className="mb-3 font-display text-3xl leading-none text-stone-950">{point.title}</h3>
                <p className="text-[15px] leading-relaxed text-stone-600">{point.body}</p>
              </motion.article>
            )
          })}
        </div>

        <FadeIn>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
            <p className="text-xl font-semibold text-stone-950">{aboutOutro}</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-7 py-4 text-sm font-semibold text-white transition-all hover:-rotate-2 hover:bg-brand-600"
            >
              Get in touch <ArrowRight className="size-4" strokeWidth={2.5} />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export { About }
