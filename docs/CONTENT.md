# Editing content

Most content updates do not require touching JSX. Use this guide.

## Adding or editing a project

Open `src/content/projects.ts`. Each project is an object in the `projects` array and renders one row in the "Selected work" list (`WorkList.tsx`), plus its case study drawer and gallery. To add a project, append a new object. To edit, change the fields in place.

```ts
{
  slug: "my-new-project",                            // url-safe id, used as the React key
  shortTitle: "Short name",                          // lead of the row title, shown before "/ Company"
  role: "Your role",                                 // shown after the tagline
  tagline: "One line about the work.",               // row subtitle
  disciplines: ["Product", "Build"],                 // filter chips: Product | Design | Build | Research
  company: "Company Name",                           // shown in the row title + drawer
  period: "jan 2025 – heden",                        // shown top-left in the row + drawer
  badge: "Optional badge",                           // optional label, omit for none
  title: "Headline that describes the work.",        // drawer heading
  body: "One paragraph of context. HTML entities like &mdash; and <strong>...</strong> work here.",
  tags: ["Tag 1", "Tag 2", "Tag 3"],                 // first four are shown as chips in the row
  gradient: { from: "#hex", via: "#hex", to: "#hex" },  // drawer header + gallery placeholder gradient
  blobColor: "#2650ff",                              // hex used for the drawer accent dot
  imgLeft: true,                                     // controls the drawer slide direction (left or right)
  caseStudy: {
    intro: "One paragraph that opens the drawer.",
    sections: [
      { heading: "Section heading", body: "One or two paragraphs." },
    ],
    outcomes: [
      "One concrete result per bullet",                // aim for 3 to 5 outcomes
    ],
  },
}
```

**Rules of thumb:**

- Keep `tagline` to one short line. The row stays scannable that way.
- Pick `disciplines` carefully: a project appears under every filter chip you list.
- The first four `tags` are shown in the row, so put the most important ones first.
- `role` should say what you actually did, in the words of the case study.

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

## Editing the skills ticker

Open `src/components/sections/Ticker.tsx`. The `TOPICS` array near the top is the source of truth. The words loop in a CSS-only band under the hero.

```ts
const TOPICS = ["Product", "Design", "Frontend" /* add or reorder here */] as const
```

## Updating the hero copy

Open `src/components/sections/Hero.tsx`. The headline, gradient span, subtitle, badge text and CTA labels are inline in the JSX. Keep the existing structure:

- The badge stays under 30 characters or it wraps.
- The headline is set to scale fluidly via `clamp(54px, 9.4vw, 146px)`. Headlines longer than two lines break the visual balance.
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
