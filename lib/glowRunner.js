// loads the glow runner game (public/glow-runner) once, on demand
let pending = null
function load(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src; s.async = false; s.onload = resolve; s.onerror = reject
    document.body.appendChild(s)
  })
}
export function loadGlowRunner() {
  if (typeof window !== 'undefined' && window.GlowRunner && window.GLOW_SPRITES) return Promise.resolve(window)
  if (!pending) {
    pending = load('/glow-runner/sprites.js').then(() => load('/glow-runner/game.js')).then(() => window)
    pending.catch(() => { pending = null })
  }
  return pending
}
