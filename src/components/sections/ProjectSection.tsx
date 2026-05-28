import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { GhostRing } from "@/components/decorative/GhostRing"
import { GradientBlob } from "@/components/decorative/GradientBlob"
import { FadeIn } from "@/components/motion/FadeIn"
import { ParallaxShape } from "@/components/motion/ParallaxShape"
import { type Project } from "@/content/projects"
import { cn } from "@/lib/utils"

type ProjectSectionProps = {
  project: Project
  onOpenCaseStudy: () => void
  onOpenGallery: () => void
}

function ProjectSection({ project, onOpenCaseStudy, onOpenGallery }: ProjectSectionProps) {
  const {
    company,
    period,
    badge,
    title,
    body,
    tags,
    gradient,
    accentClass,
    blobColor,
    bgClass,
    imgLeft,
  } = project

  const eyebrow = `${company.toUpperCase()} · ${period.toUpperCase()}`

  return (
    <section className={cn("relative overflow-hidden px-6 py-40 lg:px-18", bgClass)}>
      <ParallaxShape
        offset={30}
        className={cn(
          "absolute top-15",
          imgLeft ? "-left-30" : "right-0 translate-x-[60%]",
        )}
      >
        <GradientBlob size={360} color={blobColor} opacity={0.12} />
      </ParallaxShape>
      <ParallaxShape
        offset={-20}
        className={cn(
          "absolute top-35",
          imgLeft ? "left-10" : "right-10",
        )}
      >
        <GhostRing size={220} color={blobColor} opacity={0.15} />
      </ParallaxShape>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 lg:grid-cols-[1.1fr_1fr]">
        {imgLeft && <ProjectImage gradient={gradient} badge={badge} imgLeft onOpenGallery={onOpenGallery} />}

        <FadeIn y={20}>
          <p
            className={cn(
              "mb-3.5 text-xs font-semibold tracking-[0.14em] uppercase",
              accentClass,
            )}
          >
            {eyebrow}
          </p>
          <h3
            className="mb-6 text-[clamp(30px,3.2vw,50px)] leading-[1.05] font-bold tracking-[-0.03em] text-stone-950"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p
            className="mb-9 max-w-prose text-[17px] leading-[1.7] text-stone-600"
            dangerouslySetInnerHTML={{ __html: body }}
          />
          <div className="mb-10 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[13px] font-medium",
                  i === 0
                    ? "bg-gradient-to-br from-brand-100 to-brand-200 font-semibold text-brand-800"
                    : "bg-stone-150 text-stone-600",
                )}
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={onOpenCaseStudy}
            className={cn(
              "group inline-flex items-center gap-2.5 text-base font-semibold transition-opacity hover:opacity-75",
              accentClass,
            )}
          >
            Read case study
            <ArrowRight
              className="size-[18px] transition-transform group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </button>
        </FadeIn>

        {!imgLeft && <ProjectImage gradient={gradient} badge={badge} imgLeft={false} onOpenGallery={onOpenGallery} />}
      </div>
    </section>
  )
}

type ProjectImageProps = {
  gradient: Project["gradient"]
  badge?: string
  imgLeft: boolean
  onOpenGallery: () => void
}

function ProjectImage({ gradient, badge, imgLeft, onOpenGallery }: ProjectImageProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[28px]"
      style={{
        background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.via} 55%, ${gradient.to} 100%)`,
      }}
      onClick={onOpenGallery}
    >
      {/* grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* ghost ring inside card */}
      <div
        aria-hidden
        className={cn(
          "absolute -top-15 size-60 rounded-full border border-white/10",
          imgLeft ? "-right-15" : "-left-15",
        )}
      />
      {badge && (
        <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.1em] text-white uppercase backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-brand-400" />
          {badge}
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center text-center text-[15px] font-medium text-white/40">
        Screenshot
        <br />
        placeholder
      </span>

      {/* Gallery hint — fades in on hover */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="rounded-full bg-black/25 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm">
          View gallery
        </span>
      </div>
    </motion.div>
  )
}

export { ProjectSection }
