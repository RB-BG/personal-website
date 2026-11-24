import { useState } from "react"

import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { CaseStudyDrawer } from "@/components/sections/CaseStudyDrawer"
import { ImageCollage } from "@/components/sections/ImageCollage"
import { Contact } from "@/components/sections/Contact"
import { Experience } from "@/components/sections/Experience"
import { Hero } from "@/components/sections/Hero"
import { Ticker } from "@/components/sections/Ticker"
import { WorkList } from "@/components/sections/WorkList"
import { projects } from "@/content/projects"

function Homepage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const activeProject = projects.find((p) => p.slug === activeSlug) ?? null

  const [gallerySlug, setGallerySlug] = useState<string | null>(null)
  const galleryProject = projects.find((p) => p.slug === gallerySlug) ?? null

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <WorkList
          onOpenCaseStudy={setActiveSlug}
          onOpenGallery={setGallerySlug}
        />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <CaseStudyDrawer
        project={activeProject}
        onClose={() => setActiveSlug(null)}
      />
      <ImageCollage
        project={galleryProject}
        onClose={() => setGallerySlug(null)}
      />
    </>
  )
}

export { Homepage }
