import { LOGOS } from "@/content/logos"

export type ExperienceEntry = {
  period: string
  institution: string
  role: string
  description: string
  /** Institution logo URL (from `LOGOS`). */
  logo: string
}

export const experience: ReadonlyArray<ExperienceEntry> = [
  {
    period: "2022 → 2024",
    institution: "Universiteit Utrecht",
    logo: LOGOS.utrecht,
    role: "MSc Human-Computer Interaction",
    description:
      "Research into usability, accessibility and interaction design. Thesis on an AI tutor for personalised learning in games, researched at &Ranj.",
  },
  {
    period: "2018 → 2022",
    institution: "Universiteit Utrecht",
    logo: LOGOS.utrecht,
    role: "BSc Information Science",
    description:
      "Systems thinking, data modelling, software engineering and UX design as a multidisciplinary foundation.",
  },
  {
    period: "2021 → 2022",
    institution: "HKU",
    logo: LOGOS.hku,
    role: "Minor Game Design",
    description:
      "Level design, narrative systems and game mechanics. Sparked my interest in engaging digital experiences.",
  },
  {
    period: "2020 → 2021",
    institution: "Studievereniging Sticky",
    logo: LOGOS.sticky,
    role: "Commissioner of Internal Affairs",
    description:
      "Board member responsible for inventory management, promotions and inter-association activities.",
  },
  {
    period: "2022 → 2023",
    institution: "exec(ut) Conference",
    logo: LOGOS.execut,
    role: "Commissioner of Public Relations",
    description:
      "Managing communications, hitting ticket sales targets and maintaining the brand image of Utrecht's biggest tech conference.",
  },
  {
    period: "2023 → 2024",
    institution: "Universiteit Utrecht",
    logo: LOGOS.utrecht,
    role: "Student Ambassador HCI",
    description:
      "Sharing experiences and insights with prospective HCI masters students, helping them navigate their academic journey.",
  },
]
