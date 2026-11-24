import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useState } from "react"

import { FadeIn } from "@/components/motion/FadeIn"
import { type Discipline, projects } from "@/content/projects"
import { cn } from "@/lib/utils"

type WorkListProps = {
  onOpenCaseStudy: (slug: string) => void
  onOpenGallery: (slug: string) => void
}

const FILTERS: ReadonlyArray<Discipline | "All"> = [
  "All",
  "Product",
  "Design",
  "Build",
  "Research",
]

function WorkList({ onOpenCaseStudy, onOpenGallery }: WorkListProps) {
  const [filter, setFilter] = useState<Discipline | "All">("All")
  const items = projects.filter(
    (p) => filter === "All" || p.disciplines.includes(filter),
  )

  return (
    <section id="work" className="bg-stone-50 px-6 pt-32 pb-40 lg:px-18">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
                Work &amp; experience
              </p>
              <h2 className="text-[clamp(40px,6vw,88px)] leading-none font-bold tracking-[-0.04em] text-stone-950">
                Selected work.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter work by discipline">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    "rounded-full border px-5 py-2 text-sm font-semibold transition-colors",
                    filter === f
                      ? "border-stone-950 bg-stone-950 text-stone-50"
                      : "border-stone-200 text-stone-950 hover:border-stone-950",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <ul className="divide-y-2 divide-stone-950 border-y-2 border-stone-950">
          <AnimatePresence initial={false}>
            {items.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid items-center gap-x-8 gap-y-5 py-8 md:grid-cols-[170px_1fr_auto]"
              >
                <p className="text-sm font-semibold text-stone-500 uppercase">
                  {p.period}
                  <span className="mt-1 block text-brand-600">
                    {p.disciplines.join(" · ")}
                  </span>
                </p>
                <div>
                  <h3 className="text-[clamp(28px,4vw,56px)] leading-none font-bold tracking-[-0.03em] text-stone-950 uppercase">
                    {p.shortTitle} <span className="text-brand-600">/</span>{" "}
                    {p.company}
                  </h3>
                  <p className="mt-3 text-lg text-stone-600">
                    {p.tagline}
                    <span className="text-stone-400"> — {p.role}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onOpenGallery(p.slug)}
                    className="text-sm font-semibold text-stone-950 underline decoration-stone-200 decoration-2 underline-offset-4 transition-colors hover:decoration-brand-600"
                  >
                    View screens
                  </button>
                  <button
                    onClick={() => onOpenCaseStudy(p.slug)}
                    className="inline-flex items-center gap-2 rounded-md bg-stone-950 px-6 py-4 text-sm font-semibold text-stone-50 transition-colors hover:bg-brand-600 hover:text-white"
                  >
                    Read case study <ArrowUpRight className="size-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {items.length === 0 && (
          <p className="py-16 text-xl text-stone-500">
            Nothing here yet. Try another filter.
          </p>
        )}
      </div>
    </section>
  )
}

export { WorkList }
