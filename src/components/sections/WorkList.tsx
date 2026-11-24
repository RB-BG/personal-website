import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { type CSSProperties, useState } from "react"

import { FadeIn } from "@/components/motion/FadeIn"
import { type Discipline, type Project, projects } from "@/content/projects"
import { cn } from "@/lib/utils"

type WorkListProps = {
  onOpenCaseStudy: (slug: string) => void
  onOpenGallery: (slug: string) => void
}

const FILTERS: ReadonlyArray<Discipline | "All"> = ["All", "Product", "Design", "Build", "Research"]

function WorkList({ onOpenCaseStudy, onOpenGallery }: WorkListProps) {
  const [filter, setFilter] = useState<Discipline | "All">("All")
  const items = projects.filter((p) => filter === "All" || p.disciplines.includes(filter))

  return (
    <section id="work" className="bg-stone-50 px-6 pt-32 pb-40 lg:px-18">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
                Work &amp; experience
              </p>
              <h2 className="font-display text-[clamp(56px,9vw,140px)] leading-[0.85] text-stone-950">
                Selected <span className="text-brand-600">work.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter work by discipline">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    "rounded-full border-2 px-5 py-2 text-sm font-semibold transition-all active:scale-95",
                    filter === f
                      ? "border-stone-950 bg-stone-950 text-stone-50"
                      : "border-stone-200 bg-white text-stone-950 hover:-rotate-2 hover:border-stone-950",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <ul className="border-t-2 border-stone-950">
          <AnimatePresence initial={false}>
            {items.map((p, i) => (
              <WorkRow
                key={p.slug}
                project={p}
                index={i}
                onOpenCaseStudy={() => onOpenCaseStudy(p.slug)}
                onOpenGallery={() => onOpenGallery(p.slug)}
              />
            ))}
          </AnimatePresence>
        </ul>
        {items.length === 0 && (
          <p className="py-16 text-xl text-stone-500">Nothing here yet. Try another filter.</p>
        )}
      </div>
    </section>
  )
}

type WorkRowProps = {
  project: Project
  index: number
  onOpenCaseStudy: () => void
  onOpenGallery: () => void
}

function WorkRow({ project: p, index, onOpenCaseStudy, onOpenGallery }: WorkRowProps) {
  const image = p.screenshot ?? p.galleryImages?.[0]?.src
  const shots = new Set([p.screenshot, ...(p.galleryImages ?? []).map((g) => g.src)].filter(Boolean)).size
  // Alternate the slant direction per row, like Vechtclub's stepped frames.
  const slant =
    index % 2
      ? "polygon(0 0, 100% 10%, 100% 100%, 0 90%)"
      : "polygon(0 10%, 100% 0, 100% 90%, 0 100%)"

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group/row relative border-b-2 border-stone-950"
    >
      {/* Cobalt wash sweeps in from the left on hover */}
      <div
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-brand-50 transition-transform duration-500 ease-out group-hover/row:scale-x-100"
      />

      <div className="relative grid items-center gap-x-10 gap-y-6 py-10 md:grid-cols-[150px_1fr] lg:grid-cols-[150px_1fr_300px]">
        <div className="text-sm font-semibold text-stone-500 uppercase">
          <span className="font-display text-5xl text-stone-200 transition-colors group-hover/row:text-brand-600">
            0{index + 1}
          </span>
          <span className="mt-2 block">{p.period}</span>
          <span className="mt-1 block text-brand-600">{p.disciplines.join(" · ")}</span>
        </div>

        <div>
          <div className="mb-4 flex h-8 items-center gap-4">
            {p.logo ? (
              <img src={p.logo} alt={p.company} className="h-7 w-auto max-w-[180px] object-contain object-left" />
            ) : (
              <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-white">{p.company}</span>
            )}
            {p.badge && (
              <span className="rounded-full bg-brand-600 px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                {p.badge}
              </span>
            )}
          </div>

          <button onClick={onOpenCaseStudy} data-cursor="Read" className="block text-left">
            <h3 className="font-display text-[clamp(40px,5.5vw,80px)] leading-[0.88] text-stone-950 transition-transform duration-300 group-hover/row:translate-x-2">
              {p.shortTitle}
              {p.shortTitle !== p.company && (
                <>
                  {" "}
                  <span className="text-brand-600">/</span> {p.company}
                </>
              )}
            </h3>
          </button>
          <p className="mt-4 text-lg text-stone-600">
            {p.tagline}
            <span className="text-stone-400"> — {p.role}</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {p.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                {tag}
              </span>
            ))}
          </div>

          {p.clients && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold tracking-wide text-stone-400 uppercase">Clients</span>
              {p.clients.map((c) => (
                <span key={c.name} className="flex h-10 items-center rounded-lg border border-stone-200 bg-white px-3">
                  <img src={c.logo} alt={c.name} className="h-5 w-auto max-w-[120px] object-contain" />
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCaseStudy}
              className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-stone-50 transition-all hover:-rotate-2 hover:bg-brand-600 active:scale-95"
            >
              Read case study
              <ArrowUpRight className="size-4 transition-transform group-hover/row:rotate-45" />
            </button>
            {shots > 0 && (
              <button
                onClick={onOpenGallery}
                className="rounded-full border-2 border-stone-950 bg-white px-5 py-2.5 text-sm font-semibold text-stone-950 transition-all hover:rotate-2 active:scale-95"
              >
                {shots} screen{shots === 1 ? "" : "s"}
              </button>
            )}
          </div>
        </div>

        {/* Slanted screenshot frame: straightens and zooms on row hover */}
        <button
          onClick={image ? onOpenGallery : onOpenCaseStudy}
          data-cursor={image ? "View" : "Read"}
          aria-label={image ? `Open ${p.company} gallery` : `Read ${p.company} case study`}
          className="relative block aspect-[16/9] w-full overflow-hidden bg-stone-950 transition-[clip-path] duration-500 ease-out [clip-path:var(--slant)] group-hover/row:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] md:col-span-2 lg:col-span-1 lg:aspect-[4/3]"
          style={{ "--slant": slant } as CSSProperties}
        >
          {image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              className="size-full object-cover object-top transition-transform duration-700 group-hover/row:scale-105"
            />
          ) : (
            <span
              className="flex size-full items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${p.gradient.from}, ${p.gradient.via}, ${p.gradient.to})` }}
            >
              {p.logo && (
                <span className="rounded-xl bg-white px-5 py-4">
                  <img src={p.logo} alt="" className="h-10 w-auto" />
                </span>
              )}
            </span>
          )}
        </button>
      </div>
    </motion.li>
  )
}

export { WorkList }
