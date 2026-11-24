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
  period: "Jan 2025 – now",                          // English, e.g. "Oct 2024 – Mar 2025"; shown in the row + drawer
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
  logo: LOGOS.utrecht,                               // institution logo, see content/logos.ts
},
```

The grid renders three cards per row on desktop (middle column dropped down), two on tablet, one on mobile, in the order the array defines.

## Editing logos and the logo wall

All logos are SVGs in `src/assets/logos/`. Register a new one in the `LOGOS` map in `src/content/logos.ts`, then use it anywhere: a project's `logo` or `clients`, an education card's `logo`, or the logo wall.

The logo wall is the `partners` array in the same file:

```ts
{ name: "Netcompany", logo: LOGOS.netcompany, note: "Interface consultant · 2024 – 2025" },
{ name: "Long Covid Toolkit", note: "Volunteer · 2023" },   // no logo → name is shown as a wordmark
```

`note` slides up on hover. Only write facts that are also in your project content.

`long-covid-toolkit.svg` currently holds only the wordmark (the icon was an embedded PNG). Drop in the full SVG to show the icon as well.

## Editing the tickers

The text bands are `<Ticker items={[...]} />`. The cobalt band is in `src/pages/Homepage.tsx`, the white "Education • Boards" band is at the top of `Experience.tsx`. Props: `tone` (`"brand"` or `"light"`), `size` (`"lg"` or `"md"`), `reverse`, and `tilt` (degrees).

## Updating the hero copy

Open `src/components/sections/Hero.tsx`. The headline, gradient span, subtitle, badge text and CTA labels are inline in the JSX. Keep the existing structure:

- The badge stays under 30 characters or it wraps.
- The headline uses `font-display` and scales via `clamp(60px, 11.5vw, 180px)`. Keep it to four short lines.
- The subtitle has `max-w-[620px]`. Aim for around 30 to 40 words.

## Updating contact details

Open `src/components/sections/Contact.tsx`.

- Email, LinkedIn and GitHub are the `CHANNELS` array at the top of the file.
- LinkedIn URL: search for `linkedin.com/in/ruben-baggen`.
- GitHub URL: search for `github.com/RubenBaggen` and update if your handle is different.

## Adding a new section

If a new section is genuinely needed (not just a content tweak), create it under `src/components/sections/`, then import and render it in `src/pages/Homepage.tsx`. Follow the existing section patterns:

1. Wrap everything in `<section id="anchor-id" className="...">`. The id enables anchor scrolling.
2. Use `font-display` for the big heading, and a 2px `border-stone-950` on cards to match the poster style.
3. Wrap content blocks in `<FadeIn>` for scroll reveals. Add `data-cursor="Label"` to clickable images.
4. Use `max-w-7xl mx-auto` on the inner content container.
5. Add the section id to the `SECTIONS` array in `Header.tsx` if it should appear in the nav.
