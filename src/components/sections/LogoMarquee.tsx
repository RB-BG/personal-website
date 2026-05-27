const COMPANIES = [
  "Brand Boekhouders",
  "Netcompany",
  "&Ranj",
  "Sniptech",
  "Co-Teach",
  "Long Covid Toolkit",
  "Frank Energie",
  "Sticky",
] as const

function LogoMarquee() {
  // Duplicate the list so the CSS animation can loop seamlessly.
  const items = [...COMPANIES, ...COMPANIES]

  return (
    <section className="border-y border-stone-200 bg-white py-16">
      <p className="mb-9 text-center text-[11px] font-semibold tracking-[0.14em] text-stone-400 uppercase">
        Companies I&apos;ve worked with
      </p>
      <div className="group relative overflow-hidden">
        {/* fade edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent"
        />
        <div className="marquee-track flex w-max items-center gap-16">
          {items.map((company, i) => (
            <span
              key={`${company}-${i}`}
              className="flex-shrink-0 text-[20px] font-bold tracking-tight text-stone-300"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 40s linear infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  )
}

export { LogoMarquee }
