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
sections/     Hero, LogoMarquee, WorkIntro, ProjectSection, Experience, Contact,
              CaseStudyDrawer, ImageCollage
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

## Overlay pattern: CaseStudyDrawer and ImageCollage

Both overlays follow the same structural pattern:

```
AnimatePresence
  motion.div (backdrop, z-[55]) — dark blurred overlay, closes on click
  <Inner> (panel/grid, z-[60]) — the actual content
```

The z-indices are deliberately above the sticky header (`z-50`) so the header disappears when an overlay opens. The backdrop at `z-[55]` sits between the header and the panel at `z-[60]`.

**State lives in `Homepage.tsx`.** Two independent slugs (`activeSlug` for the drawer, `gallerySlug` for the collage) control which project is open. Passing `null` closes the overlay. `AnimatePresence` handles the enter/exit animation.

**`CaseStudyDrawer`** slides in from the same side as the project image (`imgLeft ? "left-0" : "right-0"`) via `initial={{ x: project.imgLeft ? "-100%" : "100%" }}`. Content is sourced from the `caseStudy` field in `projects.ts`.

**`ImageCollage`** uses `key={project.slug}` on the inner `ImageCollageGrid` so the component fully remounts (resetting all state) each time a different project's gallery is opened.

## Masonry layout algorithm

`ImageCollage.tsx` implements a Pinterest-style masonry layout in `computeLayout()`. It runs in JavaScript rather than CSS because framer-motion needs explicit pixel positions for FLIP animation.

**Normal state:** images fill three equal-width columns. Each image is placed in the currently-shortest column (`colH.indexOf(Math.min(...colH))`). Height is derived from the image's aspect ratio: `h = colWidth / ratio`.

**Selected state:** clicking an image sets `selectedIdx`. That image spans 2 adjacent columns (the pair whose taller column is currently lowest). Width doubles to `colW * 2 + GAP`, height recalculates proportionally. framer-motion's `layout` prop FLIP-animates every image from its old bounding box to its new one.

### Three-layer motion structure per image tile

Each tile uses three nested `motion.div` elements to keep concerns isolated:

```
motion.div  layout (FLIP)        — absolute-positioned by masonry algorithm, animates on selection change
  motion.div  wave scale         — animates scale: [0.9..1.06], overflow: hidden, clips content
    motion.div  entrance         — one-time spring on mount (scale 0.55→1, rotate→0, staggered delay)
      {grid texture, selected ring, placeholder number}
    div  hover caption overlay   — direct child of wave scale, NOT inside entrance layer
```

The caption overlay must be a direct child of the `overflow: hidden` wave scale layer, not nested inside the entrance animation layer. Putting it inside a transformed element breaks `overflow: hidden` clipping in Safari.

### Hover wave effect

`handleMouseEnter` uses `getBoundingClientRect()` to compute pixel distance from the hovered image centre to every other image centre. Scale for each image is: `1 - 0.10 * Math.exp(-dist / 280)`. The hovered image itself gets `1.06`. This gives a subtle ripple that falls off naturally with distance, regardless of masonry column position.

### Edge-clipping prevention

`overflow-y: auto` on the scroll container implicitly clips `overflow-x` too (CSS spec). The inner `containerRef` div therefore has `padding: "12px 20px"`. The `ResizeObserver` reads `contentRect.width` (content box, after padding), so the masonry algorithm computes against the narrower inner width. At `1.06` scale on `~265px` columns, the maximum edge expansion is about 13px. The 20px padding gives a comfortable 7px spare.

## CSS-only marquee

The logo marquee uses framer-motion nowhere. A pure CSS keyframe animates a `translateX(0)` to `translateX(-50%)` loop on a row that duplicates the company list. The `.group:hover .marquee-track { animation-play-state: paused }` rule pauses on hover. Reduced motion disables the animation.

We chose this over framer-motion because the marquee runs continuously (no scroll-bound logic) and CSS handles infinite loops more efficiently than a React-driven motion value.

## Decisions worth remembering

- **The Lucide brand-icon problem.** Lucide 1.x dropped `Github`, `Linkedin` (and other trademarked icons). The Contact section inlines those two SVGs locally. Do not try to re-import them from `lucide-react`.
- **`react-refresh/only-export-components` is suppressed on the two `ui/*` files** (`Button` and `Badge`) because they export both the component and its `*Variants` CVA function, which the rule does not allow. This matches the shadcn convention. If you add more `ui/*` components with the same pattern, add the disable comment.
- **No `dangerouslySetInnerHTML` workaround for typography.** Project titles and bodies use it only to allow HTML entities (`&mdash;`, `<strong>`) inside content data without React escaping them. If we later need richer formatting, switch to a markdown parser or compose React children in the content file.
- **No routing yet.** The case study drawer is a slide-in panel, not a real route. Phase 3 adds `react-router-dom` + `/work/[slug]` pages. The `href` field on each project in `projects.ts` is ready to receive the real path.
- **`IMAGE_RATIOS` and `IMAGE_CAPTIONS` in `ImageCollage.tsx`** are placeholders. When real screenshots are available, update both arrays with the actual aspect ratios (width/height) and captions per image. The masonry layout recalculates automatically.
