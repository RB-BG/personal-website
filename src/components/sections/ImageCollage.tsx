import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { RowsPhotoAlbum, type Photo } from "react-photo-album"
import "react-photo-album/rows.css"
import Lightbox, { type SlideImage } from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/captions.css"

import { type Project } from "@/content/projects"

// ---- placeholders ----
// Gradient tiles shown until real screenshots are uploaded. Landscape-heavy
// ratios (width / height) since most project imagery is landscape.
const PLACEHOLDER_RATIOS = [16 / 9, 3 / 2, 4 / 3, 16 / 9, 3 / 2, 4 / 3, 16 / 9, 3 / 2, 4 / 3]

const PLACEHOLDER_CAPTIONS = [
  "Product strategy overview",
  "Team collaboration session",
  "Design system components",
  "User research insights",
  "Prototype walkthrough",
  "Workshop facilitation",
  "Sprint review highlights",
  "Stakeholder presentation",
  "Launch day moments",
]

// ---- gradient helper ----

function getGradients({ from, via, to }: Project["gradient"]): string[] {
  return [
    `linear-gradient(135deg, ${from} 0%, ${via} 100%)`,
    `linear-gradient(45deg,  ${via} 0%, ${to}  100%)`,
    `linear-gradient(225deg, ${from} 0%, ${to}  100%)`,
    `linear-gradient(315deg, ${via} 0%, ${from} 100%)`,
    `linear-gradient(180deg, ${from} 0%, ${via} 50%, ${to} 100%)`,
    `linear-gradient(90deg,  ${to}  0%, ${from} 100%)`,
    `linear-gradient(160deg, ${via} 0%, ${to}  100%)`,
    `linear-gradient(20deg,  ${from} 0%, ${via} 100%)`,
    `linear-gradient(270deg, ${to}  0%, ${via} 100%)`,
  ]
}

// ---- photo model ----

/** Extends the library Photo with our caption + gradient-placeholder metadata. */
type GalleryPhoto = Photo & {
  caption: string
  /** Set only for placeholder tiles (no real image). */
  gradient?: string
  num?: number
}

type GallerySlide = SlideImage & { gradient?: string }

// ---- inner component ----

type GridProps = { project: Project; onClose: () => void }

function ImageCollageGrid({ project, onClose }: GridProps) {
  const [index, setIndex] = useState(-1)

  const gradients = getGradients(project.gradient)

  // Merge real gallery images into placeholder slots (real images fill from index 0).
  const photos: GalleryPhoto[] = PLACEHOLDER_RATIOS.map((ratio, i) => {
    const real = project.galleryImages?.[i]
    const r = real?.ratio ?? ratio
    const width = Math.round(r * 1200)
    const height = 1200
    const caption = real?.caption ?? PLACEHOLDER_CAPTIONS[i] ?? ""
    return real
      ? { src: real.src, width, height, caption }
      : { src: "", width, height, caption, gradient: gradients[i], num: i + 1 }
  })

  const slides: GallerySlide[] = photos.map((p) => ({
    src: p.src,
    width: p.width,
    height: p.height,
    description: p.caption,
    gradient: p.gradient,
  }))

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center py-12"
      >
        <div
          className="pointer-events-auto flex flex-col"
          style={{ width: "min(calc(100vw - 32px), 900px)" }}
        >
          {/* Back button */}
          <div className="mb-5">
            <button
              autoFocus
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
            >
              <ArrowLeft className="size-4" strokeWidth={2.5} />
              Back
            </button>
          </div>

          {/* Scrollable justified-rows album */}
          <div
            style={{
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <RowsPhotoAlbum
              photos={photos}
              spacing={8}
              targetRowHeight={(w) => (w < 480 ? 150 : w < 700 ? 190 : 230)}
              rowConstraints={{ singleRowMaxHeight: 320 }}
              defaultContainerWidth={860}
              onClick={({ index: i }) => setIndex(i)}
              render={{
                image: (props, { photo }) => (
                  <div
                    className={`group ${props.className ?? ""}`}
                    style={{
                      ...props.style,
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 14,
                      cursor: "pointer",
                    }}
                  >
                    {photo.gradient ? (
                      <div style={{ position: "absolute", inset: 0, background: photo.gradient }}>
                        {/* Grid texture */}
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage:
                              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                            backgroundSize: "32px 32px",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.3)",
                          }}
                        >
                          {photo.num}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={props.src}
                        alt={photo.caption}
                        sizes={props.sizes}
                        srcSet={props.srcSet}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    {/* Hover caption */}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)",
                        padding: "34px 12px 12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.95)",
                          lineHeight: 1.35,
                          letterSpacing: "0.01em",
                        }}
                      >
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Fullscreen lightbox — swipe / arrows / zoom, from yet-another-react-lightbox */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Captions]}
        captions={{ descriptionTextAlign: "center" }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: "rgba(12,10,9,0.94)" } }}
        render={{
          // Placeholder slides have no real image — draw the gradient tile instead.
          slide: ({ slide }) => {
            const g = (slide as GallerySlide).gradient
            if (!g) return undefined
            return (
              <div
                style={{
                  width: "min(90vw, 1000px)",
                  maxHeight: "80vh",
                  aspectRatio: `${slide.width} / ${slide.height}`,
                  background: g,
                  borderRadius: 16,
                }}
              />
            )
          },
        }}
      />
    </>
  )
}

// ---- outer shell ----

type ImageCollageProps = {
  project: Project | null
  onClose: () => void
}

function ImageCollage({ project, onClose }: ImageCollageProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="collage-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] bg-stone-950/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          <ImageCollageGrid key={project.slug} project={project} onClose={onClose} />
        </>
      )}
    </AnimatePresence>
  )
}

export { ImageCollage }
