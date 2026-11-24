/** "About me" copy. Written by Ruben; only lightly edited for flow. */

export const aboutIntro =
  "I'm a product manager, passionate about building efficient and user-centric digital solutions. Currently, I lead IT at Brand Boekhouders, where I oversee the development and professionalization of our IT infrastructure and software products."

export type AboutPoint = {
  icon: "expertise" | "experience" | "beyond"
  title: string
  body: string
}

export const aboutPoints: ReadonlyArray<AboutPoint> = [
  {
    icon: "expertise",
    title: "Where I work best",
    body: "At the intersection of technology, product strategy and user experience. With a background in UX, software design and IT management, I thrive where I can shape products from vision to execution, balancing technical robustness with real user needs.",
  },
  {
    icon: "experience",
    title: "How I work",
    body: "I've worked across industries, from public-sector portals to AI-driven learning, and adapt quickly to new teams, domains and challenges. My approach is hands-on, analytical and focused on creating value. I'm especially keen on bringing AI into workflows in a human-centred way.",
  },
  {
    icon: "beyond",
    title: "Beyond work",
    body: "A creative thinker with a strong interest in visual design. That passion for making things extends to digital and physical games, where I enjoy designing engaging experiences.",
  },
]

export const aboutOutro = "Feel free to reach out. I'd love to connect and discuss ideas or opportunities!"
