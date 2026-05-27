import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { useActiveSection } from "@/hooks/useActiveSection"
import { cn } from "@/lib/utils"

const SECTIONS = ["work", "experience", "contact"] as const

const NAV_ITEMS: ReadonlyArray<{ id: (typeof SECTIONS)[number]; label: string }> = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
]

function Header() {
  const { scrollY } = useScroll()
  // Transparent over the hero, opaque white once we scroll past ~80px.
  const background = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.85)"],
  )
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1])
  const active = useActiveSection(SECTIONS)

  return (
    <motion.header
      style={{ backgroundColor: background }}
      className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md"
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute inset-x-0 bottom-0 h-px bg-stone-200"
      />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-18">
        <a
          href="#top"
          className="text-[17px] font-bold tracking-tight text-stone-950"
        >
          Ruben Baggen
        </a>

        <nav className="hidden items-center gap-11 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "text-[15px] font-medium transition-colors",
                active === item.id
                  ? "text-stone-950"
                  : "text-stone-950/60 hover:text-stone-950",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full bg-brand-800 px-6 py-3 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
        >
          Get in touch
          <ArrowRight className="size-[15px]" strokeWidth={2.5} />
        </a>
      </div>
    </motion.header>
  )
}

export { Header }
