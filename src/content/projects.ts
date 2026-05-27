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
  /** Placeholder href until case-study pages exist. */
  href: string
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
  },
]
