import { type CSSProperties } from "react"

import { projects } from "@/content/projects"

type ScreenRailProps = {
  onOpenGallery: (slug: string) => void
}

type Shot = { src: string; caption: string; slug: string; company: string }

/** Every real screenshot across all projects, de-duplicated, in project order. */
function collectShots(): Shot[] {
  const seen = new Set<string>()
  const shots: Shot[] = []
  for (const p of projects) {
    const imgs = [
      ...(p.screenshot ? [{ src: p.screenshot, caption: p.shortTitle }] : []),
      ...(p.galleryImages ?? []),
    ]
    for (const img of imgs) {
      if (seen.has(img.src)) continue
      seen.add(img.src)
      shots.push({ src: img.src, caption: img.caption, slug: p.slug, company: p.company })
    }
  }
  return shots
}

/**
 * Slanted ink band with an endless strip of framed screenshots. The slant is
 * the Vechtclub clip-path trick; the thick rounded frames come from NAR's
 * event cards. Hover pauses the strip and straightens the hovered frame;
 * click opens that project's gallery.
 */
function ScreenRail({ onOpenGallery }: ScreenRailProps) {
  const shots = collectShots()
  const loop = [...shots, ...shots]

  return (
    <section
      aria-label="Screens from my work"
      className="relative -mt-16 bg-stone-950 pt-28 pb-24"
      style={{ clipPath: "polygon(0 64px, 100% 0, 100% calc(100% - 64px), 0 100%)" }}
    >
      <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-6 px-6 lg:px-18">
        <p className="font-display text-[clamp(36px,5vw,72px)] leading-none text-white">
          Made, shipped, <span className="text-brand-400">in use.</span>
        </p>
        <p className="hidden max-w-[260px] text-sm text-white/60 md:block">
          Real screens from real products. Click any frame to open the gallery.
        </p>
      </div>

      <div className="group/rail overflow-hidden">
        <ul className="rail-track flex w-max gap-6 px-6 group-hover/rail:[animation-play-state:paused]">
          {loop.map((shot, i) => (
            <li key={`${shot.src}-${i}`} className="shrink-0">
              <button
                onClick={() => onOpenGallery(shot.slug)}
                data-cursor="View"
                aria-label={`Open gallery: ${shot.caption}`}
                aria-hidden={i >= shots.length || undefined}
                tabIndex={i >= shots.length ? -1 : 0}
                className="group block w-[min(78vw,420px)] rotate-[var(--tilt)] text-left transition-[rotate,translate] duration-500 ease-out hover:-translate-y-2 hover:rotate-0"
                style={{ "--tilt": `${i % 2 ? 1.6 : -1.6}deg` } as CSSProperties}
              >
                <span className="block overflow-hidden rounded-2xl border-[6px] border-white bg-white">
                  <img
                    src={shot.src}
                    alt=""
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-950">
                    {shot.company}
                  </span>
                  <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-white/80">
                    {shot.caption}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes rail-scroll { to { transform: translateX(-50%); } }
        .rail-track { animation: rail-scroll 60s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rail-track { animation: none; overflow-x: auto; }
        }
      `}</style>
    </section>
  )
}

export { ScreenRail }
