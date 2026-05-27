import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { Contact } from "@/components/sections/Contact"
import { Experience } from "@/components/sections/Experience"
import { Hero } from "@/components/sections/Hero"
import { LogoMarquee } from "@/components/sections/LogoMarquee"
import { ProjectSection } from "@/components/sections/ProjectSection"
import { WorkIntro } from "@/components/sections/WorkIntro"
import { projects } from "@/content/projects"

function Homepage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <section id="work">
          <WorkIntro />
          {projects.map((project) => (
            <ProjectSection key={project.slug} project={project} />
          ))}
        </section>
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export { Homepage }
