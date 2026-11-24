import { motion } from "framer-motion"

import { FadeIn } from "@/components/motion/FadeIn"
import { Ticker } from "@/components/sections/Ticker"
import { type ExperienceEntry, experience } from "@/content/experience"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/utils"

function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden bg-stone-50 pb-48">
      <Ticker
        items={["Education", "Boards", "Conferences", "Game design"]}
        tone="light"
        size="md"
        reverse
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 lg:px-18">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-12">
          <FadeIn>
            <p className="mb-5 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
              Education &amp; extra-curricular
            </p>
            <h2 className="font-display text-[clamp(52px,8vw,124px)] leading-[0.86] text-stone-950">
              Where I learned
              <br />
              <span className="text-brand-600">the craft.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="max-w-[400px] text-[17px] leading-relaxed text-stone-500">
              MSc Human-Computer Interaction &middot; BSc Information Science
              &middot; Game design minor. Plus the clubs, boards and events that
              shaped how I think.
            </p>
          </FadeIn>
        </div>

        {/* Staggered columns: the middle column drops down (Vechtclub tile grid) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experience.map((entry, i) => (
            <div key={entry.institution + entry.role} className={cn(i % 3 === 1 && "lg:translate-y-16")}>
              <ExperienceCard entry={entry} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const reduced = useReducedMotion()

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduced ? undefined : { rotate: index % 2 ? 1.5 : -1.5, y: -6 }}
      className="group h-full overflow-hidden rounded-2xl border-2 border-stone-950 bg-white"
    >
      <div className="flex h-36 items-center justify-center border-b-2 border-stone-950 bg-white px-8 transition-colors duration-300 group-hover:bg-brand-50">
        <img
          src={entry.logo}
          alt={entry.institution}
          loading="lazy"
          className="max-h-16 max-w-[75%] object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-7">
        <span className="mb-4 inline-block rounded-full border-2 border-stone-950 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-stone-950 uppercase transition-colors duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
          {entry.period}
        </span>
        <p className="mb-1 text-[18px] font-bold tracking-tight text-stone-950">{entry.institution}</p>
        <p className="mb-3.5 text-[15px] font-medium text-brand-600">{entry.role}</p>
        <p className="text-[14px] leading-relaxed text-stone-500">{entry.description}</p>
      </div>
    </motion.article>
  )
}

export { Experience }
