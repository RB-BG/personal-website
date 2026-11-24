import { LOGOS } from "@/content/logos"

export type Discipline = "Product" | "Design" | "Build" | "Research"

export type CaseStudySection = {
  heading: string
  body: string
}

export type CaseStudy = {
  intro: string
  sections: ReadonlyArray<CaseStudySection>
  outcomes: ReadonlyArray<string>
}

export type Project = {
  slug: string
  /** Short name used as the lead of the work-list row (e.g. "BERP"). */
  shortTitle: string
  /** Role held, shown after the tagline. */
  role: string
  /** One-line summary shown in the work-list row. */
  tagline: string
  /** Disciplines this work counts towards; drives the filter. */
  disciplines: ReadonlyArray<Discipline>
  company: string
  /** Company logo URL (from `LOGOS`). Omit to show the company name only. */
  logo?: string
  /** Client logos shown in the work-list row (e.g. projects done via an agency). */
  clients?: ReadonlyArray<{ name: string; logo: string }>
  period: string
  badge?: string
  title: string
  body: string
  tags: ReadonlyArray<string>
  /** Gradient stops for the image placeholder card. */
  gradient: { from: string; via: string; to: string }
  /** Hex used for the parallax blob behind the section. */
  blobColor: string
  /** If true, image is rendered on the left, content on the right. */
  imgLeft: boolean
  /** Optional real screenshot. Path relative to /public (e.g. "/images/berp-dashboard.png"). */
  screenshot?: string
  /** Optional real images for the gallery. Fills slots from index 0 upward; remaining slots use gradient placeholders. */
  galleryImages?: ReadonlyArray<{ src: string; ratio: number; caption: string }>
  /** Expanded case study content shown in the slide-in drawer. */
  caseStudy: CaseStudy
}

export const projects: ReadonlyArray<Project> = [
  {
    slug: "brand-boekhouders",
    shortTitle: "BERP",
    role: "IT Manager & product lead",
    tagline: "A new generation ERP for bookkeepers",
    disciplines: ["Product", "Build"],
    company: "Brand Boekhouders",
    logo: LOGOS.brandBoekhouders,
    period: "maart 2025 – heden",
    badge: "Current role",
    title: "IT Manager & product lead building a new generation ERP.",
    body: "Responsible for Brand Boekhouders' IT and product development. I'm rebuilding a legacy client portal that had no clear direction into BERP: one ERP for both our clients and our own staff.",
    tags: ["Product Strategy", "React 19", "TypeScript", "Django 5", "IT Management"],
    gradient: { from: "#3730a3", via: "#6366f1", to: "#a78bfa" },
    blobColor: "#7c3aed",
    imgLeft: true,
    screenshot: "/images/BrandLogin.png",
    galleryImages: [
      { src: "/images/BrandDashboard.png", ratio: 16 / 9, caption: "BERP Dashboard" },
    ],
    caseStudy: {
      intro:
        "Brand Boekhouders is an accounting and tax firm in Amsterdam with around 35 to 40 people. When I joined in early 2025 there was a client portal, but it was legacy software without a clear product direction. My job: give it that direction, and grow it into a full ERP for clients and staff.",
      sections: [
        {
          heading: "The problem",
          body: "The existing portal had grown without a plan. Features were added when someone needed them, and nobody owned the bigger picture. That made it hard to change safely, and hard to know what clients and colleagues actually needed from it.",
        },
        {
          heading: "Direction first",
          body: "Before building, I mapped how the portal was used and which workflows mattered most, and set up a proper way of working: version control, a staging environment and a deployment pipeline.",
        },
        {
          heading: "Building BERP",
          body: "I defined the architecture for BERP and made the technology choices: React 19 with TypeScript on the frontend, and Django 5 with Django REST Framework on the backend. I lead the product strategy, write the specifications and work with the team to ship it module by module, for clients and for our own staff.",
        },
      ],
      outcomes: [
        "Legacy client portal rebuilt and extended into one ERP for clients and staff",
        "First modules live for internal users in Q3 2025",
        "Version control, staging and a deployment pipeline set up as the way of working",
      ],
    },
  },
  {
    slug: "netcompany",
    shortTitle: "Public platforms",
    role: "Interface consultant",
    tagline: "Three government platforms, designed for accessibility",
    disciplines: ["Design", "Build"],
    company: "Netcompany",
    logo: LOGOS.netcompany,
    clients: [
      { name: "DuboCalc", logo: LOGOS.dubocalc },
      { name: "VFPF", logo: LOGOS.vfpf },
      { name: "Studielink", logo: LOGOS.studielink },
    ],
    period: "okt 2024 – maart 2025",
    title: "Interface consultant on three public-sector platforms.",
    body: "Interface designer and business analyst in agile scrum teams for government clients: DuboCalc (Rijkswaterstaat), the VFPF pension portal, and Studielink, used by every Dutch university.",
    tags: ["UX Design", "React", "WCAG 2.0", "Government", "Prototyping"],
    gradient: { from: "#0c4a6e", via: "#0284c7", to: "#38bdf8" },
    blobColor: "#0284c7",
    imgLeft: false,
    screenshot: "/images/DubocalcMaterials.png",
    galleryImages: [
      { src: "/images/DubocalcMaterials.png", ratio: 1946 / 1206, caption: "DuboCalc — Nationale Milieudatabase" },
      { src: "/images/VfpfDashboard.png", ratio: 1680 / 1057, caption: "VFPF — Uitkeringen dashboard" },
      { src: "/images/DubocalcMki.png", ratio: 1946 / 1580, caption: "DuboCalc — MKI-waardes & levenscyclusanalyse" },
      { src: "/images/VfpfDetail.png", ratio: 1680 / 1370, caption: "VFPF — Uitkering detail & beschikking" },
    ],
    caseStudy: {
      intro:
        "At Netcompany I worked as an interface consultant across three scrum teams, each building a digital platform for a Dutch public-sector client. Every project came with its own stakeholders and constraints, and with WCAG 2.0 AA as the accessibility target.",
      sections: [
        {
          heading: "DuboCalc — Rijkswaterstaat",
          body: "DuboCalc is the sustainability calculation tool used by engineers on Dutch infrastructure projects. I worked on the interface for its complex multi-step forms, designed components with WCAG 2.0 AA in mind, and delivered Figma prototypes that the development team built from.",
        },
        {
          heading: "VFPF pension portal",
          body: "The VFPF portal serves pension fund members across a wide age range. I designed member-facing dashboards and detail screens that had to be both data-rich and easy to read, with attention to contrast, typographic hierarchy and plain-language copy.",
        },
        {
          heading: "Studielink",
          body: "Studielink is the enrolment portal used by every prospective student in the Netherlands. Here I worked as a business analyst rather than a designer, focused on the international student login flow. I reworked the phone-number verification step &mdash; mapping the existing journey, specifying the requirements and edge cases, and aligning the flow with the development team.",
        },
      ],
      outcomes: [
        "Interface designs for DuboCalc and VFPF, with WCAG 2.0 AA as the target",
        "Figma prototypes handed off to the development teams",
        "Specified the reworked phone-number verification flow for international students on Studielink",
      ],
    },
  },
  {
    slug: "ranj",
    shortTitle: "AI tutor",
    role: "AI Game Research Intern",
    tagline: "Personalised learning inside games",
    disciplines: ["Research", "Design"],
    company: "&Ranj",
    logo: LOGOS.ranj,
    period: "nov 2023 – aug 2024",
    badge: "MSc thesis",
    title: "AI-driven tutor for personalised learning in games.",
    body: "My MSc thesis research, done as an intern at &Ranj: designing an AI tutor that gives players personalised feedback, independent of one specific game's mechanics.",
    tags: ["AI Research", "Game design", "Learning science", "UX Research"],
    gradient: { from: "#78350f", via: "#d97706", to: "#fde68a" },
    blobColor: "#d97706",
    imgLeft: true,
    caseStudy: {
      intro:
        "&Ranj is a Dutch serious game studio. For my MSc thesis in Human-Computer Interaction I did my research there, at the intersection of AI, game design and learning science: can a conversational AI tutor support learning in games without being tied to one game's mechanics?",
      sections: [
        {
          heading: "The research question",
          body: "Existing AI tutors in games are typically hard-wired to a single title — they know the game world, its characters, its progression. That makes them expensive to build and impossible to reuse. The question was whether a game-agnostic tutor could be just as effective, by focusing on the learner rather than the game.",
        },
        {
          heading: "Framework design",
          body: "I designed a tutor framework grounded in Socratic dialogue, spaced repetition, and cognitive load theory. The tutor communicates via in-game overlay, asking questions rather than giving answers, and adapts its level of scaffolding based on the player's demonstrated knowledge. The key design constraint: it should not depend on the mechanics of one specific game.",
        },
        {
          heading: "Testing with players",
          body: "I built a prototype and tested it with players in one &Ranj game, as a test build. I ran observational sessions and post-session interviews, and iterated on the dialogue design and feedback timing based on what I found.",
        },
      ],
      outcomes: [
        "MSc thesis on a game-agnostic AI tutor for learning in games",
        "Prototype tested with players in a test build of one &Ranj game",
        "Findings informed some of &Ranj's design choices around AI-assisted learning",
      ],
    },
  },
  {
    slug: "long-covid-toolkit",
    shortTitle: "Long Covid Toolkit",
    role: "Design & project specialist (volunteer)",
    tagline: "Helping people live well with Long Covid",
    disciplines: ["Design", "Product"],
    company: "Long Covid Toolkit",
    logo: LOGOS.longCovidToolkit,
    period: "Volunteer · mei – sep 2023",
    title: "A toolkit empowering people to live well with Long Covid.",
    body: "Pro-bono design and project specialist in the start-up phase of a public health platform that aimed to combine scientific evidence with patient and clinician experience. I worked on the website design and the project requirements.",
    tags: ["Volunteer", "UX Design", "Healthcare", "Project management"],
    gradient: { from: "#831843", via: "#ec4899", to: "#f0abfc" },
    blobColor: "#ec4899",
    imgLeft: false,
    screenshot: "/images/LongCovidMedicine.png",
    galleryImages: [
      { src: "/images/LongCovidMedicine.png", ratio: 1438 / 1234, caption: "Long Covid Toolkit — medicijn-effectiviteit & bewijs" },
      { src: "/images/LongCovidTreatments.png", ratio: 1440 / 1024, caption: "Long Covid Toolkit — behandelingen overzicht" },
    ],
    caseStudy: {
      intro:
        "In 2023 I volunteered as design and project specialist for the Long Covid Toolkit, a pro-bono initiative in its start-up phase. The goal: an evidence-based online resource for people living with Long Covid that is also easy to use. I left before the platform went live.",
      sections: [
        {
          heading: "The challenge",
          body: "Long Covid patients are dealing with dozens of fluctuating symptoms, a medical community still catching up, and an internet full of misinformation. The toolkit needed to be rigorously evidence-based and clinician-approved, while also being accessible, non-overwhelming, and empowering — not clinical and cold.",
        },
        {
          heading: "Design process",
          body: "I tried to ground the design in what patients need rather than in assumptions. What information do you look for on a bad day? What makes you feel more in control? That pointed to short, actionable content over long clinical summaries, which shaped the content structure.",
        },
        {
          heading: "Design and requirements",
          body: "I worked on the website design, from information architecture to UI, and wrote the project requirements for the volunteers building it.",
        },
      ],
      outcomes: [
        "Website design and information architecture for the start-up phase",
        "Project requirements written for the volunteer build team",
      ],
    },
  },
]
