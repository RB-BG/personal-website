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
  company: string
  period: string
  badge?: string
  title: string
  body: string
  tags: ReadonlyArray<string>
  /** Gradient stops for the image placeholder card. */
  gradient: { from: string; via: string; to: string }
  /** Accent text colour for eyebrow + link (Tailwind class). */
  accentClass: string
  /** Hex used for the parallax blob behind the section. */
  blobColor: string
  /** Section background colour (Tailwind class). */
  bgClass: string
  /** If true, image is rendered on the left, content on the right. */
  imgLeft: boolean
  /** Placeholder href — will become a route in Phase 3. */
  href: string
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
    company: "Brand Boekhouders",
    period: "maart 2025 – heden",
    badge: "Current role",
    title: "IT Manager & product lead building a new generation ERP.",
    body: "Responsible for establishing and professionalizing Brand Boekhouders' entire IT infrastructure. Defining strategic vision, shaping product development and ensuring our software is scalable, customer-centric and efficient for bookkeepers across the Netherlands.",
    tags: ["Product Strategy", "React 19", "TypeScript", "Django 5", "IT Management"],
    gradient: { from: "#3730a3", via: "#6366f1", to: "#a78bfa" },
    accentClass: "text-brand-600",
    blobColor: "#7c3aed",
    bgClass: "bg-stone-50",
    imgLeft: true,
    href: "#",
    screenshot: "/images/BrandLogin.png",
    galleryImages: [
      { src: "/images/BrandDashboard.png", ratio: 16 / 9, caption: "BERP Dashboard" },
    ],
    caseStudy: {
      intro:
        "When I joined Brand Boekhouders in early 2025, a 20-person bookkeeping firm had outgrown its tooling. Critical workflows ran across Excel sheets, disconnected SaaS subscriptions, and email threads — with no single source of truth and no audit trail. My mandate was to fix that from the ground up.",
      sections: [
        {
          heading: "The problem",
          body: "Bookkeepers were spending hours each week on manual reconciliation, client onboarding required copying data across three systems, and management had no real-time visibility into firm performance. Every process depended on individual tribal knowledge rather than documented, repeatable systems.",
        },
        {
          heading: "Infrastructure first",
          body: "Before writing a single line of product code I audited every tool in use, mapped all workflows end-to-end, and identified the highest-leverage problems. From that I established a proper development environment: Git-based version control, a CI/CD pipeline, and a staging environment — none of which existed before.",
        },
        {
          heading: "Building BERP",
          body: "I defined the architecture for BERP, a purpose-built ERP for bookkeeping firms, and made the technology decisions: React 19 with TypeScript on the frontend for a fast, type-safe UI, and Django 5 with Django REST Framework on the backend for a clean, maintainable API. I led product strategy, wrote specifications, and delivered the first working modules.",
        },
      ],
      outcomes: [
        "First working module shipped Q2 2025, live for all internal users",
        "Client onboarding time reduced from days to hours",
        "Eliminated reliance on 3 disconnected SaaS tools for core workflows",
        "Full CI/CD pipeline with automated linting, tests and deployment",
      ],
    },
  },
  {
    slug: "netcompany",
    company: "Netcompany",
    period: "okt 2024 – maart 2025",
    title: "Interface consultant on three public-sector platforms.",
    body: "UX specialist and interface designer in agile scrum teams &mdash; delivering WCAG 2.0-compliant prototypes for government clients. DuboCalc (Rijkswaterstaat), VFPF pension portal and Studielink for every Dutch university.",
    tags: ["UX Design", "React", "WCAG 2.0", "Government", "Prototyping"],
    gradient: { from: "#0c4a6e", via: "#0284c7", to: "#38bdf8" },
    accentClass: "text-sky-500",
    blobColor: "#0284c7",
    bgClass: "bg-white",
    imgLeft: false,
    href: "#",
    screenshot: "/images/DubocalcMaterials.png",
    galleryImages: [
      { src: "/images/DubocalcMaterials.png", ratio: 1946 / 1206, caption: "DuboCalc — Nationale Milieudatabase" },
      { src: "/images/VfpfDashboard.png", ratio: 1680 / 1057, caption: "VFPF — Uitkeringen dashboard" },
      { src: "/images/DubocalcMki.png", ratio: 1946 / 1580, caption: "DuboCalc — MKI-waardes & levenscyclusanalyse" },
      { src: "/images/VfpfDetail.png", ratio: 1680 / 1370, caption: "VFPF — Uitkering detail & beschikking" },
    ],
    caseStudy: {
      intro:
        "At Netcompany I worked as an interface consultant embedded in three scrum teams, each building a digital platform for a Dutch government client. Every project came with its own stakeholders, technical constraints, and — critically — strict WCAG 2.0 accessibility requirements.",
      sections: [
        {
          heading: "DuboCalc — Rijkswaterstaat",
          body: "DuboCalc is the sustainability calculation tool used by engineers on Dutch infrastructure projects. I redesigned the core interface to improve usability for complex multi-step forms, audited every component for WCAG 2.0 AA compliance, and delivered high-fidelity Figma prototypes that fed directly into the development sprint.",
        },
        {
          heading: "VFPF pension portal",
          body: "The VFPF portal serves pension fund members across a wide age range. I designed member-facing dashboards that had to be both data-rich and immediately legible, with particular attention to contrast ratios, typographic hierarchy, and clear plain-language copy — working closely with the client's communications team.",
        },
        {
          heading: "Studielink",
          body: "Studielink is the enrolment portal used by every prospective student in the Netherlands. Here I worked as a business analyst rather than a designer, focused on the international student login flow. I reworked the phone-number verification step &mdash; mapping the existing journey, specifying the requirements and edge cases, and aligning the flow with the development team.",
        },
      ],
      outcomes: [
        "All three platforms delivered WCAG 2.0 AA compliant",
        "Prototypes handed off in Figma and React-ready component specs",
        "Reworked Studielink's phone-number verification flow for international students",
        "VFPF portal passed internal accessibility audit on first review",
      ],
    },
  },
  {
    slug: "ranj",
    company: "&Ranj",
    period: "nov 2023 – aug 2024",
    badge: "AI · Game design",
    title: "AI-driven tutor for personalised learning in games.",
    body: "As AI Game Research Intern I designed a personalised AI tutor operating independently of specific game mechanics &mdash; engaging players through tailored feedback and knowledge transfer grounded in didactic principles.",
    tags: ["AI Research", "Game design", "Learning science", "UX Research"],
    gradient: { from: "#78350f", via: "#d97706", to: "#fde68a" },
    accentClass: "text-amber-600",
    blobColor: "#d97706",
    bgClass: "bg-stone-50",
    imgLeft: true,
    href: "#",
    caseStudy: {
      intro:
        "&Ranj is one of Europe's most respected serious game studios. During my internship I worked on a research question at the intersection of AI, game design, and learning science: can a conversational AI tutor improve learning outcomes in games without being tightly coupled to a specific game's mechanics?",
      sections: [
        {
          heading: "The research question",
          body: "Existing AI tutors in games are typically hard-wired to a single title — they know the game world, its characters, its progression. That makes them expensive to build and impossible to reuse. The question was whether a game-agnostic tutor could be just as effective, by focusing on the learner rather than the game.",
        },
        {
          heading: "Framework design",
          body: "I designed a tutor framework grounded in Socratic dialogue, spaced repetition, and cognitive load theory. The tutor communicates via in-game overlay, asking questions rather than giving answers, and adapts its level of scaffolding based on the player's demonstrated knowledge. The key design constraint: it had to work across entirely different game genres without modification.",
        },
        {
          heading: "Testing with players",
          body: "Working with the game design and learning science teams I built and tested prototypes with real players across two game titles. I ran observational sessions, conducted post-session interviews, and iterated on the dialogue design and feedback timing based on findings — working in short research sprints.",
        },
      ],
      outcomes: [
        "Framework adopted as the internal standard for AI-assisted learning features",
        "Applied to two shipped &Ranj game titles",
        "Research findings documented in an internal whitepaper",
        "Tutor design reusable across game genres without re-engineering",
      ],
    },
  },
  {
    slug: "long-covid-toolkit",
    company: "Long Covid Toolkit",
    period: "Volunteer · mei – sep 2023",
    title: "A toolkit empowering people to live well with Long Covid.",
    body: "Pro-bono design and project specialist on a public health platform combining scientific evidence with patient and clinician experience. I led website design, defined project requirements and supported community management.",
    tags: ["Volunteer", "UX Design", "Healthcare", "Project management"],
    gradient: { from: "#831843", via: "#ec4899", to: "#f0abfc" },
    accentClass: "text-pink-700",
    blobColor: "#ec4899",
    bgClass: "bg-white",
    imgLeft: false,
    href: "#",
    screenshot: "/images/LongCovidMedicine.png",
    galleryImages: [
      { src: "/images/LongCovidMedicine.png", ratio: 1438 / 1234, caption: "Long Covid Toolkit — medicijn-effectiviteit & bewijs" },
      { src: "/images/LongCovidTreatments.png", ratio: 1440 / 1024, caption: "Long Covid Toolkit — behandelingen overzicht" },
    ],
    caseStudy: {
      intro:
        "In 2023 I volunteered as design and project specialist for the Long Covid Toolkit, a pro-bono initiative bringing together patients, clinicians, and researchers. The goal: build the most comprehensive, evidence-based online resource for people living with Long Covid — and make it actually usable.",
      sections: [
        {
          heading: "The challenge",
          body: "Long Covid patients are dealing with dozens of fluctuating symptoms, a medical community still catching up, and an internet full of misinformation. The toolkit needed to be rigorously evidence-based and clinician-approved, while also being accessible, non-overwhelming, and empowering — not clinical and cold.",
        },
        {
          heading: "Design process",
          body: "I ran co-design sessions with Long Covid patients to ground every design decision in real needs rather than assumptions. What information do you look for on a bad day? What makes you feel more in control? The sessions surfaced a clear preference for bite-sized, actionable content over long clinical summaries — which shaped the entire content structure.",
        },
        {
          heading: "Building in public",
          body: "I led the full website design, from information architecture through to the final UI, and defined the project requirements that the development team worked from. I also supported community management, helping coordinate the volunteer team of clinicians and patient advocates spread across the Netherlands and UK.",
        },
      ],
      outcomes: [
        "Platform launched on schedule, summer 2023",
        "Thousands of page visits within the first month",
        "Featured and shared by multiple Long Covid patient advocacy groups",
        "Used as a reference resource by healthcare providers in the Netherlands and UK",
      ],
    },
  },
]
