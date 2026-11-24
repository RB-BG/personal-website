import { motion } from "framer-motion"
import { ArrowUpRight, Mail } from "lucide-react"
import { type ReactNode } from "react"

import { FadeIn } from "@/components/motion/FadeIn"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const CHANNELS: ReadonlyArray<{
  label: string
  value: string
  href: string
  icon: ReactNode
  external?: boolean
}> = [
  {
    label: "Email",
    value: "rubenbaggen@gmail.com",
    href: "mailto:rubenbaggen@gmail.com",
    icon: <Mail className="size-6" strokeWidth={2} />,
  },
  {
    label: "LinkedIn",
    value: "in/ruben-baggen",
    href: "https://www.linkedin.com/in/ruben-baggen/",
    icon: <LinkedinIcon />,
    external: true,
  },
  {
    label: "GitHub",
    value: "RubenBaggen",
    href: "https://github.com/RubenBaggen",
    icon: <GithubIcon />,
    external: true,
  },
]

function Contact() {
  const reduced = useReducedMotion()

  return (
    <section id="contact" className="relative overflow-hidden bg-white px-6 pt-40 pb-48 lg:px-18">
      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeIn y={20}>
          <span className="mb-10 inline-flex items-center gap-2.5 rounded-full border-2 border-stone-950 px-4 py-2 text-[13px] font-semibold text-stone-950">
            <span className="relative inline-flex size-[7px]">
              <span className="absolute inset-0 rounded-full bg-brand-600" />
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-600 opacity-60" />
            </span>
            Open to opportunities
          </span>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-10">
            <h2 className="font-display text-[clamp(80px,14vw,220px)] leading-[0.82] text-stone-950">
              Let&apos;s <span className="text-brand-600">talk.</span>
            </h2>
            <p className="max-w-[420px] text-[20px] leading-relaxed text-stone-600">
              Open to interesting product and design-engineering challenges,
              collaborations, or just a coffee chat. Feel free to reach out.
            </p>
          </div>
        </FadeIn>

        {/* Black cards with a slanted white tag — Vechtclub's price cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer noopener" : undefined}
              data-cursor="Say hi"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduced ? undefined : { rotate: i % 2 ? 1.5 : -1.5, y: -6 }}
              className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl bg-stone-950 p-7 text-white transition-colors hover:bg-brand-600"
            >
              <span className="flex items-center gap-3 text-[15px] font-semibold text-white/70 group-hover:text-white">
                {c.icon}
                {c.label}
              </span>
              <span className="pr-20 text-[clamp(16px,1.4vw,20px)] leading-tight font-bold tracking-tight [overflow-wrap:anywhere]">
                {c.value}
              </span>
              <span
                aria-hidden
                className="absolute top-1/2 right-7 flex h-24 w-16 -translate-y-1/2 items-center justify-center bg-white text-stone-950 transition-transform duration-300 group-hover:rotate-6"
                style={{ clipPath: "polygon(0 12%, 100% 0, 100% 88%, 0 100%)" }}
              >
                <ArrowUpRight className="size-7 transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.5} />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * LinkedIn and GitHub icons inlined as SVG because lucide-react ^1.x dropped
 * brand icons for trademark reasons.
 */
function LinkedinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export { Contact }
