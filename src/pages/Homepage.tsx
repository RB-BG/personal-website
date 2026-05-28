import { useState } from "react"

import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { CaseStudyDrawer } from "@/components/sections/CaseStudyDrawer"
import { ImageCollage } from "@/components/sections/ImageCollage"
import { Contact } from "@/components/sections/Contact"
import { Experience } from "@/components/sections/Experience"
import { Hero } from "@/components/sections/Hero"
import { LogoMarquee } from "@/components/sections/LogoMarquee"
import { ProjectSection } from "@/components/sections/ProjectSection"
import { WorkIntro } from "@/components/sections/WorkIntro"
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
        <LogoMarquee />
        <section id="work">
          <WorkIntro />
          {projects.map((project) => (
            <ProjectSection
              key={project.slug}
              project={project}
              onOpenCaseStudy={() => setActiveSlug(project.slug)}
              onOpenGallery={() => setGallerySlug(project.slug)}
            />
          ))}
        </section>
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
