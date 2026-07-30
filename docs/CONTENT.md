# Editing content

Most content updates do not require touching JSX. Use this guide.

## Adding or editing a project

Open `src/content/projects.ts`. Each project is an object in the `projects` array. To add a fifth project, append a new object. To edit, change the fields in place.

```ts
{
  slug: "my-new-project",                            // url-safe id, used as the React key
  company: "Company Name",                           // shown in the eyebrow + page
  period: "jan 2025 – heden",                        // shown in the eyebrow
  badge: "Optional badge",                           // pill on the image card, omit for none
  title: "Headline that describes the work.",        // h3 in the section
  body: "One paragraph of context. HTML entities like &mdash; and <strong>...</strong> work here.",
  tags: ["Tag 1", "Tag 2", "Tag 3"],                 // first tag gets the brand gradient, rest are neutral
  gradient: { from: "#hex", via: "#hex", to: "#hex" },  // image placeholder + drawer header gradient
  accentClass: "text-brand-600",                     // eyebrow + link text colour (Tailwind class)
  blobColor: "#7c3aed",                              // hex used for the decorative parallax blob behind the section
  bgClass: "bg-stone-50",                            // section background colour (Tailwind class)
  imgLeft: true,                                     // true = image left, false = image right (also controls drawer slide direction)
  href: "#",                                         // will become "/work/my-new-project" in Phase 3
  caseStudy: {
    intro: "One paragraph that opens the drawer.",
    sections: [
      { heading: "Section heading", body: "One or two paragraphs." },
      // add more sections as needed
    ],
    outcomes: [
      "One concrete result per bullet",
      // aim for 3 to 5 outcomes
    ],
  },
}
```

**Rules of thumb:**

- Alternate `imgLeft` and `bgClass` between projects so the page reads as zebra-striped (`stone-50` and `white` alternate).
- Pick `accentClass` and `blobColor` from the same colour family (e.g. `text-sky-500` with `#0284c7`).
- Keep `body` to two or three sentences. Long copy breaks the rhythm.
- The first tag should be the project's defining role or domain. It gets visual emphasis through the brand-gradient background.

## Editing the image gallery (ImageCollage)

Each project has a gallery overlay built on [`react-photo-album`](https://react-photo-album.com/) (justified rows layout) and [`yet-another-react-lightbox`](https://yet-another-react-lightbox.com/) (fullscreen viewer). Real images come from the `galleryImages` field on each project in `content/projects.ts`; any remaining slots fall back to gradient placeholders defined in `ImageCollage.tsx`.

To add real images to a project, edit its `galleryImages` array in `content/projects.ts`:

```ts
galleryImages: [
  { src: "/images/berp-dashboard.png", ratio: 16 / 9, caption: "BERP Dashboard" },
  { src: "/images/berp-clients.png",   ratio: 16 / 9, caption: "Client overview" },
],
```

- `src` — path relative to `public/` (e.g. `/images/foo.png`).
- `ratio` — aspect ratio as `width / height`. The rows layout sizes tiles from this. Landscape (`16/9`, `3/2`) tiles pack into wide bricks; portrait (`2/3`) tiles stay tall.
- `caption` — shown on hover in the grid and under the image in the lightbox.

Real images fill slots from index 0 upward. Slots beyond the array use the gradient placeholders (`PLACEHOLDER_RATIOS` / `PLACEHOLDER_CAPTIONS` in `ImageCollage.tsx`), so a project with two real images shows those two followed by placeholder tiles.
4. Replace the gradient `<div>` inside the entrance animation layer with an `<img>` element.

The justified-rows layout recalculates from the ratios automatically. Landscape images pack into wider bricks, portrait images stay narrower, and each row is height-balanced to fill the container width.

## Editing an education or extra-curricular card

Open `src/content/experience.ts`. Each entry renders a card in the Experience grid.

```ts
{
  period: "2022 → 2024",                             // top eyebrow
  institution: "Universiteit Utrecht",               // bold institution name
  role: "MSc Human-Computer Interaction",            // role line
  description: "One or two sentence summary.",       // body text
  accentClass: "text-brand-600",                     // eyebrow colour (Tailwind class)
  bar: ["#5b21b6", "#a78bfa"],                       // gradient hex pair for the top bar
  ringColor: "#7c3aed",                              // hex for the corner ghost-ring
},
```

The grid renders three cards per row on desktop, two on tablet, one on mobile, in the order the array defines.

## Editing the company marquee

Open `src/components/sections/LogoMarquee.tsx`. The `COMPANIES` array near the top of the file is the source of truth.

```ts
const COMPANIES = [
  "Brand Boekhouders",
  "Netcompany",
  // add or reorder here
] as const
```

Currently the marquee renders text labels in light grey. When real logo SVGs are ready, replace the `<span>` inside the map with `<img src={...} />` and update the array to point at logo modules.

## Updating the hero copy

Open `src/components/sections/Hero.tsx`. The headline, gradient span, subtitle, badge text and CTA labels are inline in the JSX. Keep the existing structure:

- The badge stays under 30 characters or it wraps.
- The headline is set to scale fluidly via `clamp(56px, 9.5vw, 148px)`. Headlines longer than two lines break the visual balance.
- The subtitle has `max-w-[620px]`. Aim for around 30 to 40 words.

## Updating contact details

Open `src/components/sections/Contact.tsx`.

- Email address: search for `mailto:rubenbaggen@gmail.com` and update both occurrences.
- LinkedIn URL: search for `linkedin.com/in/ruben-baggen`.
- GitHub URL: search for `github.com/RubenBaggen` and update if your handle is different.

## Adding a new section

If a new section is genuinely needed (not just a content tweak), create it under `src/components/sections/`, then import and render it in `src/pages/Homepage.tsx`. Follow the existing section patterns:

1. Wrap everything in `<section id="anchor-id" className="...">`. The id enables anchor scrolling.
2. Use `<ParallaxShape>` around any `<GradientBlob>` or `<GhostRing>` decorations.
3. Wrap content blocks in `<FadeIn>` for scroll reveals.
4. Use `max-w-7xl mx-auto` on the inner content container.
5. Add the section id to the `SECTIONS` array in `Header.tsx` if it should appear in the nav.
