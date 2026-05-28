import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useEffect, useRef } from "react"

import { type Project } from "@/content/projects"
import { cn } from "@/lib/utils"

type CaseStudyDrawerProps = {
  project: Project | null
  onClose: () => void
}

function CaseStudyDrawer({ project, onClose }: CaseStudyDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keyboard + body-scroll management
  useEffect(() => {
    if (!project) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Move focus into the drawer
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [project, onClose])

  // Reset scroll position when switching between projects
  useEffect(() => {
    if (project && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [project])

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cs-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer panel — slides in from the same side as the project image */}
          <motion.aside
            key="cs-drawer"
            initial={{ x: project.imgLeft ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: project.imgLeft ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 36, mass: 1 }}
            className={cn(
              "fixed top-0 bottom-0 z-50 flex w-full max-w-[680px] flex-col bg-white shadow-2xl",
              project.imgLeft ? "left-0" : "right-0",
            )}
            role="dialog"
            aria-modal="true"
            aria-label={`Case study: ${project.company}`}
          >
            {/* Scrollable content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {/* Gradient hero header */}
              <div
                className="relative h-60 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${project.gradient.from} 0%, ${project.gradient.via} 55%, ${project.gradient.to} 100%)`,
                }}
              >
                {/* Grid overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <ArrowLeft className="size-4" strokeWidth={2.5} />
                  Back
                </button>

                <div className="absolute right-6 bottom-6 left-6">
                  <p className="mb-1.5 text-[11px] font-semibold tracking-[0.14em] text-white/60 uppercase">
                    {project.company} · {project.period}
                  </p>
                  <h2 className="text-[clamp(20px,2.2vw,26px)] leading-snug font-bold tracking-[-0.02em] text-white">
                    {project.title}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-10">
                {/* Intro paragraph */}
                <p className="mb-10 text-[17px] leading-[1.75] text-stone-600">
                  {project.caseStudy.intro}
                </p>

                {/* Sections */}
                <div className="space-y-8">
                  {project.caseStudy.sections.map((section) => (
                    <div key={section.heading}>
                      <h3 className="mb-3 text-[18px] font-bold tracking-[-0.015em] text-stone-900">
                        {section.heading}
                      </h3>
                      <p className="text-[16px] leading-[1.8] text-stone-600">
                        {section.body}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Outcomes */}
                {project.caseStudy.outcomes.length > 0 && (
                  <div className="mt-10 rounded-2xl bg-stone-50 p-6">
                    <h3 className="mb-4 text-[15px] font-bold tracking-[-0.01em] text-stone-900 uppercase tracking-[0.08em]">
                      Outcomes
                    </h3>
                    <ul className="space-y-3">
                      {project.caseStudy.outcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="flex items-start gap-3 text-[15px] leading-[1.6] text-stone-600"
                        >
                          <span
                            aria-hidden
                            className="mt-[7px] size-2 shrink-0 rounded-full"
                            style={{ background: project.blobColor }}
                          />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-10 flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
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
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export { CaseStudyDrawer }
