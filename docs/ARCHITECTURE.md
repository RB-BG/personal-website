# Architecture

How this codebase is shaped and why. Read this before adding new sections or refactoring existing ones.

## Design system

### Color tokens

All brand colors live in the `@theme inline` block of `src/index.css` as Tailwind 4 custom properties. They become utility classes automatically (e.g. `bg-brand-800`, `text-amber-700`, `from-pink-500`).

| Token family | Range | Use |
|---|---|---|
| `brand-*` | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 | Primary CTAs, headings accent, the "designer" gradient text, education cards |
| `amber-*` | 50, 100, 400, 500, 600, 700, 900 | "Open to collaboration" badge, &Ranj project, HKU card |
| `sky-*` | 50, 200, 300, 500, 700, 900 | Netcompany project, Sticky card |
| `pink-*` | 100, 300, 500, 700, 900 | Long Covid project, exec(ut) card |
| `stone-*` | 50, 100, 150 | Warm white backgrounds (added on top of Tailwind's defaults so the design matches Figma exactly) |

The pre-existing OKLch neutral tokens (`--background`, `--foreground`, `--primary`, etc.) are left in place but mostly unused by the homepage. They stay so the existing `Button` component keeps working and so dark mode can be added later without rewriting tokens.

### Typography

The site uses Geist Variable, loaded via `@fontsource-variable/geist` and applied as the default `font-sans` family. All headings rely on `font-bold` (700) with tight tracking (`tracking-[-0.04em]` to `tracking-[-0.05em]`). Body copy is 17 to 22px with relaxed line-height (1.55 to 1.7).

### Spacing rhythm

Sections use generous vertical padding to match the volt.io reference:

- Hero: `pt-56 pb-44` (224px top, 176px bottom)
- Standard sections: `py-40` to `py-48` (160 to 192px)
- Section content max width: `max-w-7xl` (1280px), centered with `mx-auto`
- Horizontal padding: `px-6 lg:px-18` (24px mobile, 72px desktop)

## Component layers

The codebase splits components into four layers based on responsibility. Lower layers do not import from higher layers.

```
pages/        Homepage
   ▲
sections/     Hero, LogoMarquee, WorkIntro, ProjectSection, Experience, Contact
   ▲
ui/           Button, Badge        (interactive primitives)
decorative/   GradientBlob, GhostRing, DotGrid    (pure visuals)
motion/       FadeIn, ParallaxShape               (animation wrappers)
   ▲
hooks/        useActiveSection, useReducedMotion
lib/          utils (cn helper)
```

**Why this split:** sections are large and content-heavy, so isolating reusable pieces (blobs, fade wrappers, buttons) keeps section files focused on layout and content. Decorative components are pure visual (no interactivity, no state, no children) so they can be re-used freely.

## Motion strategy

### Why framer-motion

Phase 1 explored CSS-only animations but the design calls for scroll-triggered parallax on decorative shapes and staggered hero reveals. CSS + IntersectionObserver works for fade-ins but parallax becomes janky. Framer-motion's `useScroll` + `useTransform` is the lightest solution that handles both.

Bundle cost: about 30KB gzipped, included in the main JS chunk.

### Two wrappers handle 90% of motion

- **`<FadeIn>`** wraps any element. By default, it fades + slides up 12px when the element enters the viewport (`whileInView` with `viewport={{ once: true, margin: "-100px" }}`). Pass `immediate` on the hero for mount-time staggered reveals. Pass `delay` to stagger siblings.

- **`<ParallaxShape>`** wraps any decorative element. It reads scroll progress against its parent and applies a Y-axis translate (default `-80px` over a full viewport scroll). Always wrap blobs and rings in this so they drift independently of section content.

### Reduced motion is respected everywhere

The `useReducedMotion()` hook is a thin wrapper around framer-motion's built-in detection. When the user has `prefers-reduced-motion: reduce` set:

- `FadeIn` still fades but does not translate (no `y` offset).
- `ParallaxShape` returns its child untouched (no transform applied).
- The marquee animation is disabled via a `@media (prefers-reduced-motion: reduce)` query in `LogoMarquee.tsx`.

Always test new motion with the OS-level setting enabled (Windows: Settings → Accessibility → Visual effects → Animation effects off).

## Anchor scrolling

Three pieces work together:

1. **`html { scroll-behavior: smooth }`** in `@layer base` of `index.css`. Native, no JS.
2. **`section[id] { scroll-margin-top: 96px }`** in the same `@layer base` block. Ensures the sticky header does not cover the anchored section.
3. **`useActiveSection`** hook in `Header.tsx`. Uses `IntersectionObserver` with `rootMargin: "-40% 0px -40% 0px"` so a section becomes "active" when its middle band is in the viewport.

The hook returns the id of the most-visible section. The `Header` uses this to highlight the matching nav link by toggling text opacity.

## Header behaviour

The header is `fixed` and uses `useScroll` to interpolate two motion values:

- `background` interpolates from `rgba(255,255,255,0)` to `rgba(255,255,255,0.85)` over the first 80px of scroll. Backdrop-blur is always on, so once any opacity exists, the blur takes effect.
- `borderOpacity` interpolates 0 to 1 over the same range, fading in the bottom hairline border.

This gives the volt.io-style "lift off the hero, settle into a clear nav" effect without any class-toggling.

## ProjectSection and content-driven sections

`ProjectSection.tsx` is a single component that renders any project from `content/projects.ts`. It handles:

- Alternating layout (image left vs right) via the `imgLeft` boolean.
- Per-project gradient on the image placeholder via the `gradient` object.
- Per-project accent color via Tailwind class strings (`text-brand-600`, `text-sky-500`, etc.).
- Per-project blob color for the parallax decoration via a hex string.

This pattern means all four projects share one component. To add a fifth project, you only edit `content/projects.ts`. See [CONTENT.md](./CONTENT.md).

`Experience.tsx` follows the same pattern with `content/experience.ts` and the `ExperienceCard` internal component.

## CSS-only marquee

The logo marquee uses framer-motion nowhere. A pure CSS keyframe animates a `translateX(0)` to `translateX(-50%)` loop on a row that duplicates the company list. The `.group:hover .marquee-track { animation-play-state: paused }` rule pauses on hover. Reduced motion disables the animation.

We chose this over framer-motion because the marquee runs continuously (no scroll-bound logic) and CSS handles infinite loops more efficiently than a React-driven motion value.

## Decisions worth remembering

- **The Lucide brand-icon problem.** Lucide 1.x dropped `Github`, `Linkedin` (and other trademarked icons). The Contact section inlines those two SVGs locally. Do not try to re-import them from `lucide-react`.
- **`react-refresh/only-export-components` is suppressed on the two `ui/*` files** (`Button` and `Badge`) because they export both the component and its `*Variants` CVA function, which the rule does not allow. This matches the shadcn convention. If you add more `ui/*` components with the same pattern, add the disable comment.
- **No `dangerouslySetInnerHTML` workaround for typography.** Project titles and bodies use it only to allow HTML entities (`&mdash;`, `<strong>`) inside content data without React escaping them. If we later need richer formatting, switch to a markdown parser or compose React children in the content file.
- **No routing yet.** Case-study links are `<a href="#" aria-disabled>` placeholders. Phase 3 adds `react-router-dom` + `/work/[slug]` pages. The `href` field on each project in `projects.ts` is ready to receive the real path.
