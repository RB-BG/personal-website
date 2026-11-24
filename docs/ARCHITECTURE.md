# Architecture

How this codebase is shaped and why. Read this before adding new sections or refactoring existing ones.

## Design system

### Color tokens

All brand colors live in the `@theme inline` block of `src/index.css` as Tailwind 4 custom properties. They become utility classes automatically (e.g. `bg-brand-800`, `text-amber-700`, `from-pink-500`).

| Token family | Range | Use |
|---|---|---|
| `brand-*` | 50 to 950 | **Cobalt** (`brand-600` = `#2650ff`). Primary CTAs, slashes and labels in the work list, the ticker band, links |
| `ice-*` | 50 to 900 | Cool secondary accent: hero glow, "open to collaboration" dot, contact gradient |
| `stone-*` | 50 to 950 | Cool ink neutrals. `stone-50` (`#f2f5fb`) is the page ground, `stone-950` (`#0a1124`) is the ink used for text and rules |
| `amber-*`, `sky-*`, `pink-*` | various | Per-item colours in the experience cards |

The pre-existing OKLch neutral tokens (`--background`, `--foreground`, `--primary`, etc.) are left in place but mostly unused by the homepage. They stay so the existing `Button` component keeps working and so dark mode can be added later without rewriting tokens.

### Typography

The site uses Geist Variable, loaded via `@fontsource-variable/geist` and applied as the default `font-sans` family. All headings rely on `font-bold` (700) with tight tracking (`tracking-[-0.04em]` to `tracking-[-0.05em]`). Body copy is 17 to 22px with relaxed line-height (1.55 to 1.7).

### Spacing rhythm

Sections use generous vertical padding:

- Hero: `pt-56 pb-44` (224px top, 176px bottom)
- Standard sections: `py-40` to `py-48` (160 to 192px)
- Section content max width: `max-w-7xl` (1280px), centered with `mx-auto`
- Horizontal padding: `px-6 lg:px-18` (24px mobile, 72px desktop)

## Component layers

The codebase splits components into four layers based on responsibility. Lower layers do not import from higher layers.

```
pages/        Homepage
   ▲
sections/     Hero, Ticker, WorkList, Experience, Contact,
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
- The marquee animation is disabled via a `@media (prefers-reduced-motion: reduce)` query in `Ticker.tsx`.

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

This gives the "lift off the hero, settle into a clear nav" effect without any class-toggling.

## WorkList and content-driven sections

`WorkList.tsx` renders every project from `content/projects.ts` as a row in an agenda-style list: period and disciplines on the left, `SHORT TITLE / COMPANY` as the headline, a tagline with the role, tag chips, and two actions ("View screens" opens the gallery, "Read case study" opens the drawer). A row of filter chips (All / Product / Design / Build / Research) filters on each project's `disciplines`; framer-motion's `layout` + `AnimatePresence` animate the list when filtering.

Adding a project means editing `content/projects.ts` only. See [CONTENT.md](./CONTENT.md).

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

## Gallery layout: react-photo-album + yet-another-react-lightbox

`ImageCollage.tsx` uses two off-the-shelf libraries instead of a hand-rolled layout:

- **`react-photo-album`** (`RowsPhotoAlbum`) renders a justified-rows layout — horizontal bricks, each row height-balanced to the container width. Ideal for landscape-heavy imagery. Row height is responsive via `targetRowHeight={(w) => ...}`.
- **`yet-another-react-lightbox`** renders the fullscreen viewer (swipe, arrow keys, captions plugin) when a tile is clicked.

Both are driven by one `photos` array built each render: real images come from `project.galleryImages`, and any remaining slots fall back to gradient placeholders (`PLACEHOLDER_RATIOS` / `PLACEHOLDER_CAPTIONS`). Each entry carries `width`/`height` (derived from `ratio`), a `caption`, and an optional `gradient` string that marks it as a placeholder.

### Rendering placeholders through the libraries

Placeholders have no real image, so both libraries are given a custom render function:

- `RowsPhotoAlbum`'s `render.image` returns a gradient `<div>` (with grid texture + number) for placeholder photos, and a plain `<img>` for real ones. The same wrapper adds rounded corners and the hover-caption overlay via a `group` class.
- `Lightbox`'s `render.slide` returns a gradient `<div>` (sized by aspect ratio) when the slide has a `gradient` field, and `undefined` otherwise so the default image slide is used. This prevents the lightbox from trying to load the empty `src` of a placeholder.

### `defaultContainerWidth`

`react-photo-album` measures its container with a `ResizeObserver` and renders nothing until the width is known. `defaultContainerWidth={860}` gives it a sensible first-paint guess (matching the overlay's max width) so tiles appear immediately instead of after a measurement tick.

## CSS-only ticker

The skills ticker under the hero uses framer-motion nowhere. A pure CSS keyframe animates a `translateX(0)` to `translateX(-50%)` loop on a row that repeats the topic list four times. Reduced motion disables the animation. We chose CSS over framer-motion because the ticker runs continuously (no scroll-bound logic).

## Decisions worth remembering

- **The Lucide brand-icon problem.** Lucide 1.x dropped `Github`, `Linkedin` (and other trademarked icons). The Contact section inlines those two SVGs locally. Do not try to re-import them from `lucide-react`.
- **`react-refresh/only-export-components` is suppressed on the two `ui/*` files** (`Button` and `Badge`) because they export both the component and its `*Variants` CVA function, which the rule does not allow. This matches the shadcn convention. If you add more `ui/*` components with the same pattern, add the disable comment.
- **No `dangerouslySetInnerHTML` workaround for typography.** Project titles and bodies use it only to allow HTML entities (`&mdash;`, `<strong>`) inside content data without React escaping them. If we later need richer formatting, switch to a markdown parser or compose React children in the content file.
- **No routing yet.** The case study drawer is a slide-in panel, not a real route. Phase 3 adds `react-router-dom` + `/work/[slug]` pages. The `href` field on each project in `projects.ts` is ready to receive the real path.
- **Gallery images live in `projects.ts`, not `ImageCollage.tsx`.** Add real screenshots to a project's `galleryImages` array (`{ src, ratio, caption }`); the `PLACEHOLDER_RATIOS` / `PLACEHOLDER_CAPTIONS` constants in `ImageCollage.tsx` only fill leftover slots. See [CONTENT.md](./CONTENT.md).
- **The gallery uses `react-photo-album` + `yet-another-react-lightbox`** rather than a custom masonry/lightbox. It was rewritten from a hand-rolled `computeLayout()` implementation for simplicity and standard behaviour.
