import { motion } from "framer-motion"

import { FadeIn } from "@/components/motion/FadeIn"
import { partners } from "@/content/logos"
import { useReducedMotion } from "@/hooks/useReducedMotion"

/**
 * Grid of white logo tiles with an ink border. Logos stay in full colour so
 * every brand reads correctly; hover tilts the tile and slides up a cobalt
 * note with what I did there.
 */
function LogoWall() {
  const reduced = useReducedMotion()

  return (
    <section className="bg-white px-6 py-28 lg:px-18">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(44px,6.5vw,96px)] leading-[0.9] text-stone-950">
              Teams I&apos;ve <span className="text-brand-600">built with.</span>
            </h2>
            <p className="max-w-[340px] text-[17px] leading-relaxed text-stone-500">
              Employers, clients and the products I worked on for them.
            </p>
          </div>
        </FadeIn>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((p, i) => (
            <motion.li
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduced ? undefined : { rotate: i % 2 ? 2.5 : -2.5, y: -6 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-stone-950 bg-white"
            >
              <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-300 group-hover:-translate-y-4">
                {p.logo ? (
                  <img src={p.logo} alt={p.name} loading="lazy" className="max-h-[52%] max-w-[82%] object-contain" />
                ) : (
                  <span className="text-center font-display text-2xl leading-none text-stone-950">{p.name}</span>
                )}
              </div>
              {p.note && (
                <p className="absolute inset-x-0 bottom-0 translate-y-full bg-brand-600 px-3 py-2 text-center text-[12px] font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">
                  {p.note}
                </p>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { LogoWall }
