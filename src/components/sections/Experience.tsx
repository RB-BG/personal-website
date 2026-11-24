import { DotGrid } from "@/components/decorative/DotGrid"
import { GhostRing } from "@/components/decorative/GhostRing"
import { FadeIn } from "@/components/motion/FadeIn"
import { ParallaxShape } from "@/components/motion/ParallaxShape"
import { type ExperienceEntry, experience } from "@/content/experience"
import { cn } from "@/lib/utils"

function Experience() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden border-t border-stone-200 px-6 py-48 lg:px-18"
      style={{
        background: "linear-gradient(180deg, #eef2ff 0%, #f2f5fb 100%)",
      }}
    >
      <DotGrid color="#2650ff" opacity={0.06} spacing={28} />

      <ParallaxShape offset={-40} className="absolute -top-40 -left-50">
        <GhostRing size={640} color="#2f9fc6" opacity={0.08} />
      </ParallaxShape>
      <ParallaxShape offset={-20} className="absolute -top-15 -left-25">
        <GhostRing size={400} color="#2650ff" opacity={0.06} />
      </ParallaxShape>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-24 flex flex-wrap items-end justify-between gap-12">
          <FadeIn>
            <p className="mb-5 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
              Education &amp; extra-curricular
            </p>
            <h2 className="text-[clamp(40px,6vw,88px)] leading-none font-bold tracking-[-0.04em] text-stone-950">
              Where I learned
              <br />
              the craft.
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experience.map((entry, i) => (
            <FadeIn key={entry.institution + entry.role} delay={i * 0.05}>
              <ExperienceCard entry={entry} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  const [from, to] = entry.bar
  return (
    <article className="relative h-full overflow-hidden rounded-3xl border border-stone-200 bg-white p-8">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${from} 0%, ${to} 100%)`,
        }}
      />
      <div className="absolute -right-7 -bottom-7">
        <GhostRing size={120} color={entry.ringColor} opacity={0.08} />
      </div>

      <p
        className={cn(
          "mb-2.5 text-[11px] font-semibold tracking-[0.1em] uppercase",
          entry.accentClass,
        )}
      >
        {entry.period}
      </p>
      <p className="mb-1.5 text-[17px] font-bold tracking-tight text-stone-950">
        {entry.institution}
      </p>
      <p className="mb-3.5 text-[15px] font-medium text-stone-600">
        {entry.role}
      </p>
      <p className="text-[14px] leading-relaxed text-stone-500">
        {entry.description}
      </p>
    </article>
  )
}

export { Experience }
