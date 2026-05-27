export type ExperienceEntry = {
  period: string
  institution: string
  role: string
  description: string
  /** Tailwind class for the eyebrow text color. */
  accentClass: string
  /** Two hex colors for the gradient top-bar. */
  bar: [string, string]
  /** Hex for the corner ghost-ring. */
  ringColor: string
}

export const experience: ReadonlyArray<ExperienceEntry> = [
  {
    period: "2022 → 2024",
    institution: "Universiteit Utrecht",
    role: "MSc Human-Computer Interaction",
    description:
      "Research into usability, accessibility and interaction design. Thesis on AI-driven personalised learning.",
    accentClass: "text-brand-600",
    bar: ["#5b21b6", "#a78bfa"],
    ringColor: "#7c3aed",
  },
  {
    period: "2018 → 2022",
    institution: "Universiteit Utrecht",
    role: "BSc Information Science",
    description:
      "Systems thinking, data modelling, software engineering and UX design as a multidisciplinary foundation.",
    accentClass: "text-brand-600",
    bar: ["#5b21b6", "#a78bfa"],
    ringColor: "#7c3aed",
  },
  {
    period: "2021 → 2022",
    institution: "HKU",
    role: "Minor Game Design",
    description:
      "Level design, narrative systems and game mechanics. Sparked my interest in engaging digital experiences.",
    accentClass: "text-amber-600",
    bar: ["#f59e0b", "#fde68a"],
    ringColor: "#f59e0b",
  },
  {
    period: "2020 → 2021",
    institution: "Studievereniging Sticky",
    role: "Commissioner of Internal Affairs",
    description:
      "Board member responsible for inventory management, promotions and inter-association activities.",
    accentClass: "text-sky-500",
    bar: ["#0284c7", "#38bdf8"],
    ringColor: "#0284c7",
  },
  {
    period: "2022 → 2023",
    institution: "exec(ut) Conference",
    role: "Commissioner of Public Relations",
    description:
      "Managing communications, hitting ticket sales targets and maintaining the brand image of Utrecht's biggest tech conference.",
    accentClass: "text-pink-700",
    bar: ["#ec4899", "#f0abfc"],
    ringColor: "#ec4899",
  },
  {
    period: "2023 → 2024",
    institution: "Universiteit Utrecht",
    role: "Student Ambassador HCI",
    description:
      "Sharing experiences and insights with prospective HCI masters students, helping them navigate their academic journey.",
    accentClass: "text-brand-600",
    bar: ["#5b21b6", "#a78bfa"],
    ringColor: "#7c3aed",
  },
]
