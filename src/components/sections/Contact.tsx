import { Mail } from "lucide-react"

import { DotGrid } from "@/components/decorative/DotGrid"
import { GhostRing } from "@/components/decorative/GhostRing"
import { GradientBlob } from "@/components/decorative/GradientBlob"
import { FadeIn } from "@/components/motion/FadeIn"
import { ParallaxShape } from "@/components/motion/ParallaxShape"

function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-stone-200 bg-white px-6 py-48 lg:px-18"
    >
      <ParallaxShape offset={-30} className="absolute -top-30 -right-30">
        <GradientBlob size={600} color="#2f9fc6" opacity={0.12} />
      </ParallaxShape>
      <ParallaxShape offset={-20} className="absolute top-0 right-0">
        <GhostRing size={380} color="#db5a24" opacity={0.1} />
      </ParallaxShape>
      <ParallaxShape offset={40} className="absolute -bottom-20 -left-20">
        <GradientBlob size={400} color="#db5a24" opacity={0.16} />
      </ParallaxShape>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-28 lg:grid-cols-[1fr_1.2fr]">
        <FadeIn y={20}>
          <div
            className="relative aspect-square overflow-hidden rounded-[28px]"
            style={{
              background:
                "linear-gradient(155deg, #e77f47 0%, #db5a24 46%, #2f9fc6 100%)",
            }}
          >
            <DotGrid color="#ffffff" opacity={0.18} spacing={24} />
            <div className="absolute -top-15 right-12 size-60 rounded-full border border-white/12" />
            <span className="absolute inset-0 flex items-center justify-center text-center text-base font-medium text-brand-800/35">
              Portrait
              <br />
              placeholder
            </span>
            <span className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-md bg-white/25 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-white" />
              Open to opportunities
            </span>
          </div>
        </FadeIn>

        <FadeIn y={20} delay={0.1}>
          <p className="mb-7 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
            Contact
          </p>
          <h2 className="mb-8 text-[clamp(64px,9vw,128px)] leading-[0.9] font-bold tracking-[-0.05em] text-stone-950">
            Let&apos;s
            <br />
            talk.
          </h2>
          <p className="mb-14 max-w-[460px] text-[20px] leading-relaxed text-stone-600">
            Open to interesting product and design-engineering challenges,
            collaborations, or just a coffee chat. Feel free to reach out.
          </p>

          <a
            href="mailto:rubenbaggen@gmail.com"
            className="mb-13 inline-flex items-center gap-3 border-b-2 border-brand-400 pb-1.5 text-[22px] font-bold tracking-tight text-stone-950 transition-colors hover:text-brand-700"
          >
            <Mail className="size-[26px] text-brand-600" strokeWidth={2} />
            rubenbaggen@gmail.com
          </a>

          <div className="mt-4 flex items-center gap-3">
            <SocialLink
              href="https://www.linkedin.com/in/ruben-baggen/"
              label="LinkedIn"
            >
              <LinkedinIcon />
            </SocialLink>
            <SocialLink
              href="https://github.com/RubenBaggen"
              label="GitHub"
            >
              <GithubIcon />
            </SocialLink>
            <span className="ml-1 text-sm text-stone-400">
              LinkedIn &amp; GitHub
            </span>
          </div>
        </FadeIn>
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
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex size-13 items-center justify-center rounded-[14px] border border-stone-200 bg-stone-150 text-stone-950 transition-colors hover:bg-stone-200"
    >
      {children}
    </a>
  )
}

export { Contact }
