# Ruben Baggen — Personal Website

Personal portfolio for Ruben Baggen (Product Manager & Designer, Brand Boekhouders). Built as a single long-scroll homepage with anchor navigation, scroll-triggered animations, and a clean, playful violet + amber design.

## Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 (`@vitejs/plugin-react` + `@tailwindcss/vite`) |
| Styling | Tailwind CSS 4 (configured via `@theme inline` in `src/index.css`) |
| Component primitives | `@base-ui/react` (headless) + shadcn-style wrappers in `src/components/ui` |
| Variant system | `class-variance-authority` (CVA) |
| Icons | `lucide-react` (brand icons inlined as SVG because Lucide 1.x dropped trademarked icons) |
| Animation | `framer-motion` for scroll-reveals, parallax shapes, overlays and masonry FLIP, CSS keyframes for the logo marquee |
| Font | `@fontsource-variable/geist` (loaded in `src/index.css`) |
| Path alias | `@/*` resolves to `./src/*` |

## Getting started

```bash
# install
npm install

# dev server (http://localhost:5173)
npm run dev

# production build (outputs to dist/)
npm run build

# preview production build
npm run preview

# lint
npm run lint
```

## Project structure

```
src/
├── App.tsx                      # mounts <Homepage />
├── main.tsx                     # React root
├── index.css                    # Tailwind config + brand color tokens + globals
├── pages/
│   └── Homepage.tsx             # composition of all sections
├── components/
│   ├── ui/                      # shadcn-style primitives (Button, Badge)
│   ├── layout/                  # Header, Footer
│   ├── sections/                # Hero, LogoMarquee, WorkIntro, ProjectSection, Experience, Contact,
│   │                            # CaseStudyDrawer, ImageCollage
│   ├── decorative/              # GradientBlob, GhostRing, DotGrid (pure visual)
│   └── motion/                  # FadeIn, ParallaxShape (framer-motion wrappers)
├── content/
│   ├── projects.ts              # data array driving the 4 project sections + case study drawers + galleries
│   └── experience.ts            # data array driving the experience grid cards
├── hooks/
│   ├── useActiveSection.ts      # IntersectionObserver hook for header active state
│   └── useReducedMotion.ts      # respects prefers-reduced-motion
├── lib/
│   └── utils.ts                 # cn() helper (clsx + tailwind-merge)
└── assets/
    └── logos/                   # SVG logos (placeholders, not yet wired into UI)
```

## Documentation

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md): why the codebase is shaped this way (design system, motion strategy, anchor scrolling, overlay patterns, masonry layout algorithm).
- [docs/CONTENT.md](./docs/CONTENT.md): how to add or edit a project, case study, gallery images, education entry, or company name in the marquee without touching JSX.

## Roadmap

**Phase 1 (done):** static HTML preview in `preview/homepage.html`, pushed to Figma as "Homepage v2" for design review.

**Phase 2 (done, current state):** homepage as production React. Smooth anchor scroll, scroll-reveal fade-ins, parallax decorative shapes, hover micro-interactions, reduced-motion fallbacks, full responsive layout. Slide-in case study drawer per project (alternating left/right). Image gallery with masonry layout, wave-hover effect and FLIP click expansion, hover captions. Deployed to Vercel.

**Phase 3 (planned):**
- Case-study subpages at `/work/[slug]` (requires `react-router-dom`). Drawer content migrates to full pages.
- Real project screenshots replacing gradient placeholders. Update `IMAGE_RATIOS` + `IMAGE_CAPTIONS` in `ImageCollage.tsx`.
- Portrait photo in the Contact section.
- SEO meta tags, Open Graph image, favicon redesign.
- Contact form (Formspree or Resend, currently a `mailto:` link).

## Conventions

- Component files use **PascalCase** (`Hero.tsx`), hooks use **camelCase** (`useActiveSection.ts`).
- Components are **function declarations** (`function Hero() {}`), not arrow consts, matching the existing `Button` pattern.
- Use the `@/` path alias for all internal imports. External imports first, then `@/*`, then relative.
- Tailwind classes only for static styles; inline `style={{ ... }}` is reserved for dynamic values from content data (gradient stops per project, blob colors, etc.).
- After any change, run `npm run lint` and address every error before committing.
