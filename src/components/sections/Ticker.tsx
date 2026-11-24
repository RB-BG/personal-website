const TOPICS = [
  "Product",
  "Design",
  "Frontend",
  "AI",
  "UX research",
  "ERP",
  "Accessibility",
] as const

function Ticker() {
  // Repeat the list so the CSS animation (-50%) loops seamlessly.
  const items = [...TOPICS, ...TOPICS, ...TOPICS, ...TOPICS]

  return (
    <div
      aria-hidden
      className="overflow-hidden border-y-2 border-stone-950 bg-brand-600 py-3 text-white"
    >
      <div className="ticker-track flex w-max gap-8 text-[22px] font-semibold tracking-tight whitespace-nowrap uppercase">
        {items.map((topic, i) => (
          <span key={`${topic}-${i}`} className="flex items-center gap-8">
            {topic}
            <span>•</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker-scroll {
          to { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 30s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </div>
  )
}

export { Ticker }
