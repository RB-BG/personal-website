/**
 * Ink footer with a giant cobalt wordmark that bleeds off the bottom edge —
 * the NAR footer trick. The slanted top edge echoes the screen rail.
 */
function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-stone-950 px-6 pt-28 lg:px-18"
      style={{ clipPath: "polygon(0 48px, 100% 0, 100% 100%, 0 100%)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-white/50">
          &copy; 2026 Ruben Baggen · Utrecht, NL
        </p>
        <nav className="flex gap-6 text-sm font-medium text-white/50">
          <a href="#about" className="hover:text-white">About</a>
          <a href="#work" className="hover:text-white">Work</a>
          <a href="#experience" className="hover:text-white">Experience</a>
          <a href="#contact" className="hover:text-white">Contact</a>
          <a href="#top" className="hover:text-white">Back to top ↑</a>
        </nav>
      </div>
      <p
        aria-hidden
        className="mt-10 -mb-[0.18em] text-center font-display text-[clamp(56px,14.5vw,260px)] leading-[0.8] whitespace-nowrap text-brand-600 select-none"
      >
        Ruben Baggen
      </p>
    </footer>
  )
}

export { Footer }
