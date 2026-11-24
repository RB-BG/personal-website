import brandBoekhouders from "@/assets/logos/brand-logo-light.svg"
import coTeach from "@/assets/logos/co-teach.svg"
import dubocalc from "@/assets/logos/logo.svg"
import execut from "@/assets/logos/execut.svg"
import frankEnergie from "@/assets/logos/frank-energie.svg"
import hku from "@/assets/logos/hku.svg"
import longCovidToolkit from "@/assets/logos/long-covid-toolkit.svg"
import netcompany from "@/assets/logos/netcompany.svg"
import ranj from "@/assets/logos/ranj.svg"
import sniptech from "@/assets/logos/sniptech.svg"
import studielink from "@/assets/logos/studielink.svg"
import sticky from "@/assets/logos/sv-sticky.svg"
import utrecht from "@/assets/logos/utrecht-universiteit.svg"
import vfpf from "@/assets/logos/vfpf.svg"

/** Every logo file the site uses, by a stable key. Imported as URLs by Vite. */
export const LOGOS = {
  brandBoekhouders,
  coTeach,
  dubocalc,
  execut,
  frankEnergie,
  hku,
  longCovidToolkit,
  netcompany,
  ranj,
  sniptech,
  studielink,
  sticky,
  utrecht,
  vfpf,
} as const

export type Partner = {
  name: string
  /** Logo URL. Omit to render the name as a wordmark instead. */
  logo?: string
  /** Short line shown on hover. Only use facts from the project content. */
  note?: string
}

/** Logo wall, in display order. */
export const partners: ReadonlyArray<Partner> = [
  { name: "Brand Boekhouders", logo: LOGOS.brandBoekhouders, note: "IT Manager · 2025 – now" },
  { name: "Netcompany", logo: LOGOS.netcompany, note: "Interface consultant · 2024 – 2025" },
  { name: "DuboCalc", logo: LOGOS.dubocalc, note: "Rijkswaterstaat · via Netcompany" },
  { name: "Vervangingsfonds Participatiefonds", logo: LOGOS.vfpf, note: "Pension portal · via Netcompany" },
  { name: "Studielink", logo: LOGOS.studielink, note: "Every Dutch university · via Netcompany" },
  { name: "&Ranj", logo: LOGOS.ranj, note: "MSc thesis research · 2023 – 2024" },
  { name: "Sniptech", logo: LOGOS.sniptech, note: "Relationship Support Manager · 2021 – 2023" },
  { name: "Co-Teach", logo: LOGOS.coTeach, note: "Assistant ICT teacher · 2023 – 2024" },
  { name: "Frank Energie", logo: LOGOS.frankEnergie, note: "Client support · via Sniptech" },
  { name: "Long Covid Toolkit", logo: LOGOS.longCovidToolkit, note: "Freelance, then volunteer · 2023" },
]
